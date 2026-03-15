const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

const NEWS_SHEET_NAME = 'Noticias';
const AGENDA_SHEET_NAME = 'Agenda';

const normalizeHeader = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();

  if (['true', '1', 'si', 'sí', 'yes', 'y'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  return false;
};

const toIsoDate = (value) => {
  if (!value && value !== 0) {
    return null;
  }

  if (typeof value === 'number') {
    const utcDays = Math.floor(value - 25569);
    const utcValue = utcDays * 86400;
    return new Date(utcValue * 1000).toISOString();
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const directDate = new Date(raw);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    const fullYear = year.length === 2 ? `20${year}` : year;
    const parsed = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return null;
};

const formatDateLabel = (value) => {
  const isoDate = toIsoDate(value);
  if (!isoDate) {
    return String(value ?? '').trim();
  }

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate));
};

const normalizeUrl = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }

  if (['#', '-', 'n/a', 'na', 'sin link', 'sin enlace', 'none', 'null'].includes(raw.toLowerCase())) {
    return '';
  }

  const driveFileMatch = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (driveFileMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = raw.match(/[?&]id=([^&]+)/i);
  if (/drive\.google\.com/i.test(raw) && driveOpenMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  return raw;
};

const rowsToObjects = (values) => {
  if (!Array.isArray(values) || values.length < 2) {
    return [];
  }

  const [headerRow, ...dataRows] = values;
  const headers = headerRow.map(normalizeHeader);

  return dataRows
    .filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))
    .map((row) =>
      headers.reduce((accumulator, header, index) => {
        if (!header) {
          return accumulator;
        }

        accumulator[header] = row[index] ?? '';
        return accumulator;
      }, {}),
    );
};

const pickFirst = (record, keys) => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }

  return '';
};

const normalizeNewsItem = (record, index) => {
  const title = pickFirst(record, ['titulo', 'title', 'nombre']);
  const summary = pickFirst(record, ['resumen', 'descripcion_corta', 'excerpt', 'descripcion']);
  const category = pickFirst(record, ['categoria', 'tag', 'tipo_contenido']) || 'Comunidad';
  const dateSource = pickFirst(record, ['fecha_publicacion', 'fecha', 'publicado_el', 'created_at']);
  const slugSource = pickFirst(record, ['slug', 'id']) || `noticia-${index + 1}`;

  return {
    id: pickFirst(record, ['id']) || String(index + 1),
    title,
    summary,
    content: pickFirst(record, ['contenido', 'detalle', 'descripcion']),
    category,
    slug: String(slugSource),
    image: normalizeUrl(pickFirst(record, ['imagen', 'image', 'image_url', 'foto'])),
    author: pickFirst(record, ['autor', 'author', 'publicado_por']),
    link: normalizeUrl(pickFirst(record, ['link', 'url', 'enlace'])),
    featured: normalizeBoolean(pickFirst(record, ['destacado', 'featured'])),
    active: normalizeBoolean(pickFirst(record, ['activo', 'active']) || true),
    published: normalizeBoolean(pickFirst(record, ['publicado', 'published']) || true),
    date: toIsoDate(dateSource),
    dateLabel: formatDateLabel(dateSource),
  };
};

const normalizeAgendaItem = (record, index) => {
  const dateSource = pickFirst(record, ['fecha', 'fecha_evento', 'fecha_inicio', 'dia']);
  const isoDate = toIsoDate(dateSource);
  const safeDate = isoDate ? new Date(isoDate) : null;
  const title = pickFirst(record, ['titulo', 'actividad', 'nombre', 'evento']) || `Actividad ${index + 1}`;
  const detailParts = [
    pickFirst(record, ['hora', 'hora_inicio']),
    pickFirst(record, ['lugar', 'ubicacion']),
    pickFirst(record, ['detalle', 'descripcion', 'resumen']),
  ].filter(Boolean);

  return {
    id: pickFirst(record, ['id']) || String(index + 1),
    title,
    description: pickFirst(record, ['detalle', 'descripcion', 'resumen']),
    location: pickFirst(record, ['lugar', 'ubicacion']),
    time: pickFirst(record, ['hora', 'hora_inicio']),
    active: normalizeBoolean(pickFirst(record, ['activo', 'active']) || true),
    published: normalizeBoolean(pickFirst(record, ['publicado', 'published']) || true),
    featured: normalizeBoolean(pickFirst(record, ['destacado', 'featured'])),
    date: isoDate,
    day: safeDate
      ? new Intl.DateTimeFormat('es-CL', { day: '2-digit' }).format(safeDate)
      : '--',
    month: safeDate
      ? new Intl.DateTimeFormat('es-CL', { month: 'short' }).format(safeDate).replace('.', '').toUpperCase()
      : '---',
    details: detailParts.join(' - '),
  };
};

const sortByDateDesc = (items) =>
  [...items].sort((left, right) => {
    const leftValue = left.date ? new Date(left.date).getTime() : 0;
    const rightValue = right.date ? new Date(right.date).getTime() : 0;
    return rightValue - leftValue;
  });

const sortByDateAsc = (items) =>
  [...items].sort((left, right) => {
    const leftValue = left.date ? new Date(left.date).getTime() : Number.MAX_SAFE_INTEGER;
    const rightValue = right.date ? new Date(right.date).getTime() : Number.MAX_SAFE_INTEGER;
    return leftValue - rightValue;
  });

const fetchSheetValues = async ({ spreadsheetId, apiKey, range }) => {
  const endpoint = new URL(`${SHEETS_API_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`);
  endpoint.searchParams.set('key', apiKey);
  endpoint.searchParams.set('majorDimension', 'ROWS');
  endpoint.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
  endpoint.searchParams.set('dateTimeRenderOption', 'FORMATTED_STRING');

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    throw new Error(`Sheets request failed: ${response.status}`);
  }

  const payload = await response.json();
  return payload.values ?? [];
};

export const sheetsConfig = {
  spreadsheetId: '1c5cpVailoc2gJa5vEAQakLih3Y05IGhf081dAUbCU0o',
  newsRange: `${NEWS_SHEET_NAME}!A:Z`,
  agendaRange: `${AGENDA_SHEET_NAME}!A:Z`,
};

export const fetchPortalContent = async (apiKey) => {
  if (!apiKey) {
    throw new Error('Missing VITE_GOOGLE_SHEETS_API_KEY');
  }

  const [newsValues, agendaValues] = await Promise.all([
    fetchSheetValues({
      spreadsheetId: sheetsConfig.spreadsheetId,
      apiKey,
      range: sheetsConfig.newsRange,
    }),
    fetchSheetValues({
      spreadsheetId: sheetsConfig.spreadsheetId,
      apiKey,
      range: sheetsConfig.agendaRange,
    }),
  ]);

  const news = sortByDateDesc(rowsToObjects(newsValues).map(normalizeNewsItem)).filter(
    (item) => item.active && item.published && item.title,
  );

  const agenda = sortByDateAsc(rowsToObjects(agendaValues).map(normalizeAgendaItem)).filter(
    (item) => item.active && item.published && item.title,
  );

  return { news, agenda };
};
