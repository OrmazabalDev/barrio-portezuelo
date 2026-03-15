# Junta de Vecinos Estancia Liray Portezuelo

Portal comunitario estatico construido con React y Vite, preparado para publicarse en GitHub Pages mediante GitHub Actions.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
npm run preview
```

## Que quedo preparado

- Navegacion por hash para evitar problemas de rutas en hosting estatico.
- Asset local para el logo, sin depender de enlaces externos.
- Configuracion de `base` automatica en `vite.config.js` cuando el build corre en GitHub Actions.
- Workflow en `.github/workflows/deploy.yml` para publicar `dist` en GitHub Pages.
- Integracion lista para leer las hojas `Noticias` y `Agenda` desde Google Sheets mediante la API oficial.

## Personalizacion pendiente

- Reemplazar los nombres de la directiva en `src/App.jsx`.
- Publicar URLs reales de formularios en `certificateFormUrl` y `communityDeskFormUrl`.
- Cambiar enlaces definitivos de Facebook e Instagram.
- Asociar descargas reales a la seccion de documentos.
- Crear `VITE_GOOGLE_SHEETS_API_KEY` a partir de `.env.example`.

## Google Sheets

La app ya apunta al spreadsheet:

`1c5cpVailoc2gJa5vEAQakLih3Y05IGhf081dAUbCU0o`

y consume estas hojas:

- `Noticias`
- `Agenda`

Pasos:

1. Copia `.env.example` a `.env`.
2. Pega tu API key en `VITE_GOOGLE_SHEETS_API_KEY`.
3. En GitHub, agrega la misma variable como `Repository secret` o `Actions secret` si quieres que el build publique con la configuracion completa.

Si no existe la API key, la web sigue funcionando con contenido de respaldo local.

## GitHub Pages

1. Subir este proyecto a un repositorio.
2. En GitHub, abrir `Settings -> Pages`.
3. En `Build and deployment`, seleccionar `GitHub Actions`.
4. Hacer push a `main`.

Si mas adelante usas dominio personalizado o un repositorio distinto, revisa la logica de `base` en `vite.config.js`.
