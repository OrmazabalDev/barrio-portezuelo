import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldAlert,
  MessageSquare,
  Users,
  Calendar,
  Phone,
  Mail,
  Facebook,
  Instagram,
  ChevronRight,
  Info,
  CheckCircle2,
  BookOpen,
  Landmark,
  Scale,
  ExternalLink,
  MapPin,
  AlertTriangle,
  Menu,
  X,
  FileDown,
  Megaphone,
  Briefcase,
  Clock,
} from 'lucide-react';
import barrioLogo from '../img/logo.png';
import { fetchPortalContent } from './lib/googleSheets';

const colors = {
  primary: '#203c66',
  secondary: '#436aa5',
  bg: '#f8fafc',
  white: '#ffffff',
  text: '#1e293b',
  gray: '#64748b',
};

const validTabs = ['inicio', 'nosotros', 'certificados', 'ventanilla', 'noticias', 'seguridad'];

const noticeToneByCategory = {
  seguridad: {
    container: 'border-blue-500 bg-blue-50',
    tag: 'text-blue-600',
  },
  proyectos: {
    container: 'border-amber-500 bg-amber-50',
    tag: 'text-amber-600',
  },
  comunidad: {
    container: 'border-emerald-500 bg-emerald-50',
    tag: 'text-emerald-700',
  },
};

const getInitialTab = () => {
  if (typeof window === 'undefined') {
    return 'inicio';
  }

  const hash = window.location.hash.replace('#', '');
  return validTabs.includes(hash) ? hash : 'inicio';
};

const App = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  useEffect(() => {
    const handleHashChange = () => setActiveTab(getInitialTab());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    if (!apiKey) {
      return;
    }

    let isMounted = true;

    const loadPortalContent = async () => {
      try {
        const content = await fetchPortalContent(apiKey);
        if (!isMounted) {
          return;
        }

        if (content.news.length > 0) {
          setNewsItems(content.news);
        }

        if (content.agenda.length > 0) {
          setAgendaItems(content.agenda);
        }

      } catch (error) {
        console.error('No se pudo cargar el contenido:', error);
      }
    };

    loadPortalContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const nextHash = activeTab === 'inicio' ? '' : `#${activeTab}`;
    if (window.location.hash !== nextHash) {
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.replaceState(null, '', nextUrl);
    }

    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (!selectedNewsItem) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedNewsItem(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedNewsItem]);

  const homeHighlights = (newsItems.filter((item) => item.featured).length > 0
    ? newsItems.filter((item) => item.featured)
    : newsItems).slice(0, 2);

  const SectionHeader = ({ title, subtitle, icon: Icon }) => (
    <div className="mb-12 px-4 text-center">
      <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-[#203c66]/10 p-4 text-[#203c66]">
        {Icon && <Icon size={40} strokeWidth={1.5} />}
      </div>
      <h2 className="mb-4 text-4xl font-black tracking-tight md:text-5xl" style={{ color: colors.primary }}>
        {title}
      </h2>
      <div className="mx-auto mb-6 h-1.5 w-20 rounded-full" style={{ backgroundColor: colors.secondary }} />
      <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-gray-600">{subtitle}</p>
    </div>
  );

  const HomeView = () => (
    <div className="animate-in fade-in space-y-20 duration-500">
      <section className="mx-auto max-w-7xl px-4">
        <div className="relative flex min-h-[500px] items-center overflow-hidden rounded-[2rem] bg-[#203c66] shadow-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#203c66] via-[#203c66]/90 to-[#436aa5]/80" />

          <div className="relative z-20 max-w-4xl px-8 py-16 md:px-16">
            <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <Landmark size={16} className="text-blue-200" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Ley N. 19.418</span>
            </div>
            <h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-7xl">
              Portal Oficial
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Barrio Portezuelo</span>
            </h1>
            <p className="mb-10 max-w-2xl text-xl font-medium leading-relaxed text-white/90">
              Organizacion comunitaria territorial que representa a los vecinos de Estancia Liray.
              Tu espacio para informacion oficial, tramites y participacion.
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <button onClick={() => setActiveTab('certificados')} className="group flex flex-col items-center justify-center rounded-xl bg-white p-4 text-center font-bold text-[#203c66] shadow-lg transition hover:bg-blue-50" type="button">
                <FileText className="mb-2 transition group-hover:scale-110" />
                <span className="text-xs uppercase tracking-wider">Certificado Residencia</span>
              </button>
              <button onClick={() => setActiveTab('ventanilla')} className="group flex flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 p-4 text-center font-bold text-white backdrop-blur-sm transition hover:bg-white/20" type="button">
                <MessageSquare className="mb-2 transition group-hover:scale-110" />
                <span className="text-xs uppercase tracking-wider">Denuncias y Quejas</span>
              </button>
              <button onClick={() => setActiveTab('noticias')} className="group flex flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 p-4 text-center font-bold text-white backdrop-blur-sm transition hover:bg-white/20" type="button">
                <Megaphone className="mb-2 transition group-hover:scale-110" />
                <span className="text-xs uppercase tracking-wider">Noticias Oficiales</span>
              </button>
              <button onClick={() => setActiveTab('nosotros')} className="group flex flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 p-4 text-center font-bold text-white backdrop-blur-sm transition hover:bg-white/20" type="button">
                <Users className="mb-2 transition group-hover:scale-110" />
                <span className="text-xs uppercase tracking-wider">La Directiva</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black" style={{ color: colors.primary }}>Avisos Destacados</h2>
          <button onClick={() => setActiveTab('noticias')} className="flex items-center text-sm font-bold text-[#436aa5] hover:underline" type="button">
            Ver todo <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {homeHighlights.length > 0 ? (
            homeHighlights.map((item) => {
              const tone = noticeToneByCategory[item.category?.toLowerCase()] ?? noticeToneByCategory.proyectos;

              return (
                <div key={item.id} className={`rounded-r-xl border-l-4 p-6 shadow-sm ${tone.container}`}>
                  <span className={`text-xs font-black uppercase tracking-wider ${tone.tag}`}>{item.category}</span>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
                </div>
              );
            })
          ) : (
            <div className="rounded-r-xl border-l-4 border-slate-300 bg-slate-50 p-6 shadow-sm md:col-span-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Avisos</span>
              <h3 className="mt-1 text-lg font-bold text-gray-900">No hay avisos destacados publicados</h3>
              <p className="mt-2 text-sm text-gray-600">Los avisos destacados apareceran aqui cuando exista informacion oficial vigente para publicar.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const NosotrosView = () => (
    <div className="animate-in slide-in-from-bottom mx-auto max-w-7xl space-y-16 px-4 duration-500">
      <SectionHeader
        title="Nuestra Organizacion"
        subtitle="Conoce el marco legal, la mision y quienes conforman la directiva actual de tu barrio."
        icon={Landmark}
      />

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-2xl font-black" style={{ color: colors.primary }}>Que es una Junta de Vecinos?</h3>
            <p className="font-medium leading-relaxed text-gray-600">
              Somos una organizacion comunitaria territorial, sin fines de lucro, representativa de las personas que residen en Estancia Liray Portezuelo. Nuestro objetivo es promover el desarrollo de la comunidad, defender los intereses de los vecinos y colaborar con las autoridades del Estado y las municipalidades.
            </p>
            <div className="mt-6 flex gap-4">
              <div className="flex items-center rounded-lg bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700">
                <MapPin size={16} className="mr-2 text-blue-500" /> Sector Estancia Liray
              </div>
              <div className="flex items-center rounded-lg bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700">
                <Scale size={16} className="mr-2 text-blue-500" /> Ley 19.418
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#203c66] p-8 text-white shadow-lg">
            <h3 className="mb-6 flex items-center text-xl font-black"><Briefcase className="mr-3" /> Directiva Vigente (2024-2026)</h3>
            <ul className="space-y-4">
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-blue-200">Presidente</span>
                <span className="font-medium">[Nombre del Presidente]</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-blue-200">Secretario</span>
                <span className="font-medium">[Nombre del Secretario]</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-blue-200">Tesorero</span>
                <span className="font-medium">[Nombre del Tesorero]</span>
              </li>
            </ul>
            <div className="mt-6 flex items-start rounded-lg bg-black/20 p-4 text-sm text-blue-200">
              <Clock size={16} className="mr-2 mt-0.5 shrink-0" />
              <p>Atencion directiva: Martes y Jueves de 18:00 a 20:00 hrs. (Previa coordinacion al correo oficial).</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center space-x-3">
            <BookOpen size={28} style={{ color: colors.secondary }} />
            <h3 className="text-2xl font-black" style={{ color: colors.primary }}>Transparencia y Documentos</h3>
          </div>
          <p className="mb-8 font-medium text-gray-600">Descarga los documentos oficiales y actas publicas de nuestra organizacion comunitaria.</p>

          <div className="space-y-3">
            {[
              { name: 'Estatutos Oficiales JJVV', date: 'Actualizado 2023', size: '1.2 MB' },
              { name: 'Reglamento Interno de Convivencia', date: 'Vigente', size: '0.8 MB' },
              { name: 'Acta Asamblea Ordinaria', date: 'Marzo 2026', size: '2.1 MB' },
              { name: 'Formulario Inscripcion de Socios', date: 'Formato PDF', size: '0.5 MB' },
            ].map((doc, i) => (
              <div key={i} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-blue-50">
                <div>
                  <h4 className="font-bold text-gray-800 transition group-hover:text-[#203c66]">{doc.name}</h4>
                  <p className="mt-1 text-xs text-gray-600">{doc.date} | {doc.size}</p>
                </div>
                <button
                  className="rounded-lg bg-white p-2 text-[#436aa5] shadow-sm transition group-hover:bg-[#436aa5] group-hover:text-white"
                  type="button"
                  aria-label={`Descargar ${doc.name}`}
                >
                  <FileDown size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CertificadosView = () => (
    <div className="animate-in slide-in-from-bottom mx-auto max-w-5xl px-4 duration-500">
      <SectionHeader
        title="Certificado de Residencia"
        subtitle="Servicio vecinal para la acreditacion de domicilio ante instituciones publicas y privadas."
        icon={FileText}
      />

      <div className="mb-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
        <div className="flex items-center space-x-3 bg-[#436aa5] p-6 text-white">
          <Info size={24} />
          <h3 className="text-xl font-black uppercase tracking-widest">Guia del Tramite</h3>
        </div>
        <div className="grid gap-8 p-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h4 className="mb-2 font-black text-gray-900">Para que sirve?</h4>
              <p className="text-sm leading-relaxed text-gray-600">Acredita que una persona vive en una direccion determinada. Es valido para tramites bancarios, licencia de conducir, colegios y municipalidad.</p>
            </div>
            <div>
              <h4 className="mb-2 font-black text-gray-900">Requisitos de Emision</h4>
              <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600">
                <li>Cedula de Identidad vigente del solicitante.</li>
                <li>Comprobante de domicilio (boleta luz, agua, o contrato) a nombre del solicitante, o estar inscrito en el libro de socios.</li>
                <li>Pertenecer al sector de Estancia Liray Portezuelo.</li>
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h4 className="mb-4 border-b pb-2 font-black text-gray-900">Condiciones de Entrega</h4>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start"><Clock className="mr-3 shrink-0 text-blue-500" size={18} /> <p><strong>Plazo estimado:</strong> 48 a 72 horas habiles.</p></div>
              <div className="flex items-start"><FileText className="mr-3 shrink-0 text-blue-500" size={18} /> <p><strong>Forma de entrega:</strong> Emision manual en PDF (con firma de Presidente y Secretario) enviado al correo, o retiro presencial impreso.</p></div>
              <div className="flex items-start"><CheckCircle2 className="mr-3 shrink-0 text-blue-500" size={18} /> <p><strong>Vigencia:</strong> Habitualmente 30 a 60 dias segun la institucion que lo solicite.</p></div>
            </div>
            <div className="mt-4 flex rounded-lg bg-blue-100/50 p-3 text-xs font-bold text-blue-800">
              <AlertTriangle size={16} className="mr-2 shrink-0 text-blue-600" />
              La emision esta sujeta a validacion de antecedentes por parte de la directiva. No es un proceso automatico.
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <span className="flex items-center text-xs font-black uppercase tracking-widest text-gray-500"><ExternalLink size={14} className="mr-2" /> Formulario Oficial de Solicitud</span>
        </div>
        <div className="relative h-[700px] w-full">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdvCj2VvjA7O4m9A7_8N6J1Y-Z7xW8W5W5W5W5W5W5W5W5/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Certificado Residencia Form"
          >
            Cargando formulario...
          </iframe>
        </div>
      </div>
    </div>
  );

  const VentanillaView = () => (
    <div className="animate-in slide-in-from-bottom mx-auto max-w-5xl px-4 duration-500">
      <SectionHeader
        title="Ventanilla Vecinal"
        subtitle="Canal formal para centralizar las problematicas, ideas y reclamos de nuestro sector."
        icon={MessageSquare}
      />

      <div className="mb-8 flex flex-col items-center rounded-2xl border-l-8 border-red-500 bg-red-50 p-6 shadow-sm sm:flex-row sm:space-x-4">
        <AlertTriangle size={32} className="mb-2 shrink-0 text-red-500 sm:mb-0" />
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-red-900">Aviso de Utilidad Publica</h3>
          <p className="font-medium text-red-900">Este formulario <strong>NO es para emergencias en curso</strong>. Los delitos flagrantes, incendios o emergencias medicas deben informarse directamente a los canales oficiales (133, 1468, 132 y 131).</p>
        </div>
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <ShieldAlert size={32} className="mx-auto mb-3 text-[#436aa5]" />
          <h3 className="mb-2 font-black text-gray-900">Denuncias</h3>
          <p className="text-xs font-medium text-gray-600">Seguridad comunitaria, focos de basura, luminarias apagadas, mascotas sueltas.</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <MessageSquare size={32} className="mx-auto mb-3 text-amber-500" />
          <h3 className="mb-2 font-black text-gray-900">Sugerencias</h3>
          <p className="text-xs font-medium text-gray-600">Mejoras en infraestructura, ideas para plazas, propuestas de talleres.</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <Users size={32} className="mx-auto mb-3 text-red-400" />
          <h3 className="mb-2 font-black text-gray-900">Quejas</h3>
          <p className="text-xs font-medium text-gray-600">Ruidos molestos recurrentes, problemas de convivencia, estacionamientos irregulares.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
        <div className="relative h-[800px] w-full">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdUvCj2VvjA7O4m9A7_8N6J1Y-Z7xW8W5W5W5W5W5W5W5W5/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Ventanilla Form"
          >
            Cargando formulario...
          </iframe>
        </div>
      </div>
    </div>
  );

  const NoticiasView = () => (
    <div className="animate-in slide-in-from-bottom mx-auto max-w-7xl px-4 duration-500">
      <SectionHeader title="Noticias y Agenda" subtitle="Mantente informado de las actividades comunitarias, operativos municipales y proyectos." icon={Calendar} />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <h3 className="mb-6 border-b pb-2 text-2xl font-black" style={{ color: colors.primary }}>Ultimos Comunicados</h3>
          {newsItems.length > 0 ? (
            newsItems.map((item) => (
              <button
                key={item.id}
                className="w-full cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
                onClick={() => setSelectedNewsItem(item)}
                type="button"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs font-black uppercase tracking-wider text-blue-700">{item.category}</span>
                  <span className="text-xs font-bold text-gray-600">{item.dateLabel}</span>
                </div>
                <h4 className="mt-2 mb-2 text-xl font-black text-gray-900">{item.title}</h4>
                <p className="font-medium leading-relaxed text-gray-600">{item.summary}</p>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
              No hay noticias publicadas por el momento.
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-6 border-b pb-2 text-2xl font-black" style={{ color: colors.primary }}>Agenda Vecinal</h3>
          <div className="rounded-2xl bg-[#203c66] p-6 text-white shadow-lg">
            <div className="space-y-6">
              {agendaItems.length > 0 ? (
                agendaItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex min-w-[60px] flex-col items-center rounded-xl bg-white/10 p-2">
                      <span className="text-[10px] font-black uppercase text-blue-100">{item.month}</span>
                      <span className="text-2xl font-black">{item.day}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-sm text-blue-100">{item.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/85">
                  No hay actividades publicadas por el momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NewsModal = () => {
    if (!selectedNewsItem) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
        onClick={() => setSelectedNewsItem(null)}
        role="presentation"
      >
        <div
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
        >
          <button
            onClick={() => setSelectedNewsItem(null)}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2 text-white transition hover:bg-slate-900"
            type="button"
            aria-label="Cerrar noticia"
          >
            <X size={20} />
          </button>

          <div className="max-h-[90vh] overflow-y-auto">
            {selectedNewsItem.image ? (
              <div className="h-72 w-full bg-slate-200 md:h-96">
                <img
                  src={selectedNewsItem.image}
                  alt={selectedNewsItem.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 w-full items-end bg-gradient-to-br from-[#203c66] via-[#2f527f] to-[#436aa5] p-8 md:h-64">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-100">
                  {selectedNewsItem.category}
                </span>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-black uppercase tracking-wider text-blue-700">
                  {selectedNewsItem.category}
                </span>
                <span className="text-sm font-bold text-gray-600">{selectedNewsItem.dateLabel}</span>
                {selectedNewsItem.author ? (
                  <span className="text-sm font-medium text-gray-700">Por {selectedNewsItem.author}</span>
                ) : null}
              </div>

              <h3 id="news-modal-title" className="mb-4 text-3xl font-black leading-tight text-gray-900">
                {selectedNewsItem.title}
              </h3>

              {selectedNewsItem.summary ? (
                <p className="mb-6 text-lg font-medium leading-relaxed text-slate-600">
                  {selectedNewsItem.summary}
                </p>
              ) : null}

              <div className="space-y-4 text-base leading-relaxed text-slate-700">
                {(selectedNewsItem.content || selectedNewsItem.summary)
                  .split('\n')
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${selectedNewsItem.id}-${index}`}>{paragraph}</p>
                  ))}
              </div>

              {selectedNewsItem.link ? (
                <div className="mt-8">
                  <a
                    href={selectedNewsItem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl bg-[#203c66] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1a3152]"
                  >
                    Ver enlace relacionado
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SeguridadContactoView = () => (
    <div className="animate-in zoom-in mx-auto max-w-5xl space-y-10 px-4 duration-500 md:space-y-16">
      <SectionHeader title="Seguridad y Contacto" subtitle="Red de emergencia y canales oficiales de comunicacion con la directiva." icon={ShieldAlert} />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <h3 className="mb-6 border-b border-red-100 pb-2 text-2xl font-black text-red-600">Numeros de Utilidad Publica</h3>
          <div className="space-y-4">
            {[
              { name: 'Carabineros de Chile', tel: '(22) 922 4010', color: '#166534' },
              { name: 'Denuncias Seguridad Colina', tel: '1468', color: colors.secondary },
              { name: 'PDI', tel: '(22) 708 3272', color: '#1d4ed8' },
              { name: 'Federal Seguridad (Barrio Portezuelo)', tel: '600 726 2000', color: '#b01234' },
              { name: 'Bomberos Colina', tel: '(22) 844 1573', color: '#b91c1c' },
              { name: 'Ambulancia SUA Colina', tel: '(22) 844 5026', color: '#ea580c' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-gray-300 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-xs font-black uppercase tracking-widest leading-snug text-gray-600">{item.name}</h4>
                  <p className="text-xl font-black sm:text-2xl" style={{ color: item.color }}>{item.tel}</p>
                </div>
                <a
                  href={`tel:${item.tel.replace(/[()\s]+/g, '')}`}
                  className="inline-flex w-fit items-center justify-center self-start rounded-xl p-3 text-white shadow-md transition hover:scale-105 sm:self-auto"
                  style={{ backgroundColor: item.color }}
                  aria-label={`Llamar a ${item.name}: ${item.tel}`}
                >
                  <Phone size={24} />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <span className="mb-3 block text-xs font-black uppercase tracking-widest text-amber-700">
              Canales Municipales
            </span>
            <p className="mb-4 text-sm font-medium leading-relaxed text-amber-900">
              Para denuncias y seguimiento digital del sector, la Municipalidad de Colina tambien dispone de la app SOSAFE y un video explicativo de uso.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href="https://play.google.com/store/apps/details?id=cl.sosafe.panicbuttonandroid.app&hl=es_CL&gl=US"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-lg bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-800 transition hover:bg-emerald-200"
              >
                Android
              </a>
              <a
                href="https://apps.apple.com/cl/app/sosafe-city-social-network/id854686449"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-lg bg-slate-100 px-4 py-3 text-center font-bold text-slate-800 transition hover:bg-slate-200"
              >
                iPhone
              </a>
              <a
                href="https://www.youtube.com/watch?v=MaTRJx3KSt4"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-lg bg-red-100 px-4 py-3 text-center font-bold text-red-800 transition hover:bg-red-200"
              >
                <ExternalLink className="mr-2" size={16} /> Video app
              </a>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-600">
            Fuente oficial: Municipalidad de Colina, seccion de seguridad publica.
            {' '}
            <a
              href="https://www.colina.cl/seguridad/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#203c66] underline underline-offset-2 hover:text-[#172d4c]"
            >
              www.colina.cl/seguridad
            </a>
          </p>
        </div>

        <div>
          <h3 className="mb-6 border-b pb-2 text-2xl font-black" style={{ color: colors.primary }}>Informacion de Contacto</h3>
          <div className="rounded-2xl border-t-4 bg-white p-6 shadow-lg md:p-8" style={{ borderColor: colors.primary }}>
            <div className="space-y-6">
              <div>
                <span className="mb-1 block text-xs font-black uppercase tracking-widest text-gray-600">Correo Oficial (Directiva)</span>
                <a href="mailto:barrioestanciaportezuelo@gmail.com" className="flex flex-col gap-2 text-base font-bold text-blue-600 hover:underline sm:flex-row sm:items-center sm:text-lg">
                  <span className="flex items-center">
                    <Mail className="mr-3" size={24} />
                  </span>
                  <span className="break-all">barrioestanciaportezuelo@gmail.com</span>
                </a>
              </div>

              <div>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-600">Redes Sociales Oficiales</span>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=61581173977939"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center rounded-lg bg-blue-50 px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                  >
                    <Facebook className="mr-2" size={20} /> Facebook
                  </a>
                  <a href="https://www.instagram.com/barrioestanciaportezuelo/" target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-lg bg-pink-50 px-4 py-3 font-bold text-pink-700 transition hover:bg-pink-600 hover:text-white">
                    <Instagram className="mr-2" size={20} /> Instagram
                  </a>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">
                  <strong>Nota:</strong> Las redes sociales son informativas. Toda solicitud formal (certificados, denuncias) debe realizarse por los formularios de la web o el correo oficial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-[#436aa5] selection:text-white" style={{ backgroundColor: colors.bg }}>
      <nav className="sticky top-0 z-[100] border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between">
            <button className="group flex items-center space-x-3" onClick={() => setActiveTab('inicio')} type="button" aria-label="Ir al inicio">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white p-1.5 shadow-sm">
                <img
                  src={barrioLogo}
                  alt="Logo JJVV"
                  className="h-full w-full scale-110 object-contain"
                  onError={(e) => {
                    e.currentTarget.classList.add('hidden');
                    e.currentTarget.parentElement?.querySelector('[data-logo-fallback]')?.classList.remove('hidden');
                  }}
                />
                <span data-logo-fallback className="hidden text-xl font-black text-[#203c66]">JP</span>
              </div>
              <div>
                <div className="text-lg font-black uppercase leading-none tracking-tight" style={{ color: colors.primary }}>Junta de Vecinos</div>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#436aa5]">Estancia Liray Portezuelo</p>
              </div>
            </button>

            <div className="hidden items-center space-x-1 lg:flex">
              {[
                { id: 'inicio', label: 'Inicio' },
                { id: 'nosotros', label: 'La Junta' },
                { id: 'certificados', label: 'Certificado Res.' },
                { id: 'ventanilla', label: 'Ventanilla' },
                { id: 'noticias', label: 'Noticias' },
                { id: 'seguridad', label: 'Seguridad' },
              ].map((link) => (
                <button key={link.id} onClick={() => setActiveTab(link.id)} className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${activeTab === link.id ? 'bg-[#203c66] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-[#203c66]'}`} type="button">
                  {link.label}
                </button>
              ))}
            </div>

            <button
              className="rounded-lg bg-gray-50 p-2 text-gray-600 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              aria-label={isMenuOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="absolute left-0 w-full border-t bg-white p-4 shadow-lg lg:hidden">
            <div className="space-y-2">
              {validTabs.map((id) => (
                <button key={id} onClick={() => setActiveTab(id)} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-bold uppercase tracking-wide ${activeTab === id ? 'bg-[#203c66] text-white' : 'bg-gray-50 text-gray-600'}`} type="button">
                  {id.replace('nosotros', 'La Junta').replace('ventanilla', 'Ventanilla Vecinal')}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="py-12 md:py-20">
        {activeTab === 'inicio' && <HomeView />}
        {activeTab === 'nosotros' && <NosotrosView />}
        {activeTab === 'certificados' && <CertificadosView />}
        {activeTab === 'ventanilla' && <VentanillaView />}
        {activeTab === 'noticias' && <NoticiasView />}
        {activeTab === 'seguridad' && <SeguridadContactoView />}
      </main>

      <NewsModal />

      <footer className="border-t-8 border-[#436aa5] bg-[#1a2e4d] px-4 pt-16 pb-8 text-white">
        <div className="mx-auto mb-12 grid max-w-7xl gap-12 md:grid-cols-4">
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-2xl font-black uppercase tracking-widest">Junta de Vecinos<br /><span className="text-[#436aa5]">Estancia Liray Portezuelo</span></h2>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-gray-300">
              Portal comunitario oficial. Trabajamos para el desarrollo local, la seguridad y la representacion de nuestros vecinos bajo los estatutos de la Ley 19.418.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-blue-200">Navegacion Rapida</h3>
            <ul className="space-y-2 text-sm font-bold text-gray-200">
              <li><button onClick={() => setActiveTab('nosotros')} className="hover:text-white" type="button">Transparencia</button></li>
              <li><button onClick={() => setActiveTab('certificados')} className="hover:text-white" type="button">Solicitar Certificado</button></li>
              <li><button onClick={() => setActiveTab('ventanilla')} className="hover:text-white" type="button">Canal de Denuncias</button></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-blue-200">Contacto Oficial</h3>
            <a href="mailto:barrioestanciaportezuelo@gmail.com" className="mb-4 flex items-center text-sm font-bold text-gray-200 hover:text-white">
              <Mail size={16} className="mr-2" /> Escribir a Directiva
            </a>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61581173977939" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white" aria-label="Facebook"><Facebook size={24} /></a>
              <a href="https://www.instagram.com/barrioestanciaportezuelo/" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white" aria-label="Instagram"><Instagram size={24} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            (c) {new Date().getFullYear()} Junta de Vecinos Estancia Liray Portezuelo | Comuna de Colina
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
