# Plan B Jobs

Buscador propio de ofertas para David (Product Design, UX/UI y Media Buying).
Consulta directamente las APIs de los portales, guarda **todas** las ofertas con historial por día
(nada se sobrescribe ni se borra) y las muestra en una web con filtros, favoritos y selector **Español / Deutsch**.

## Qué hay dentro

| Carpeta | Qué hace |
|---|---|
| `collector/` | El recopilador. `sources.mjs` tiene un conector por portal; `collect.mjs` deduplica y guarda. |
| `public/data/jobs.json` | La "base de datos": todas las ofertas, con `firstSeen` (día en que apareció) y `lastSeen`. |
| `src/` | La web (React + Tailwind, componentes estilo shadcn/ui), con textos en `src/i18n.js`. |
| `.github/workflows/collect.yml` | Automatización diaria gratis en GitHub: recopila, guarda y publica la web. |

### Portales conectados

| Portal | Clave | Estado |
|---|---|---|
| Bundesagentur für Arbeit | no (clave pública compartida) | activo, solo ofertas con teletrabajo, fijas y freelance |
| Arbeitnow | no | activo |
| Himalayas | no | activo (hay que citar la fuente; los links van a Himalayas) |
| Remotive | no | activo (máx. ~4 consultas al día, ofertas con 24 h de retraso) |
| RemoteOK | no | activo (hay que enlazar a la fuente) |
| Jobicy | no | activo (solo últimos 7 días) |
| Adzuna | **sí** | preparado, se activa solo al poner la clave |
| Jooble | **sí** | preparado, se activa solo al poner la clave |

## Usarlo en tu ordenador

Necesitas [Node.js](https://nodejs.org) 20 o más reciente.

```bash
npm install          # una sola vez
npm run collect      # recopila las ofertas de hoy y las añade al historial
npm run dev          # abre la web en http://localhost:5173
```

Repite `npm run collect` cuando quieras ofertas nuevas. Para un solo portal: `npm run collect -- remotive`.

## Ponerlo en GitHub con link fijo (gratis)

1. Crea un repositorio vacío en GitHub y sube esta carpeta.
2. En el repo: **Settings → Pages → Source: GitHub Actions**.
3. En **Actions → "Recopilar ofertas y publicar" → Run workflow** para el primer lanzamiento.
4. A partir de ahí se ejecuta solo cada mañana y la web queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Si el repositorio es público, cualquiera con el link puede ver las ofertas. Tus favoritos se guardan en tu navegador.

## Dónde poner las claves de Adzuna y Jooble

- Pide las claves: Adzuna en <https://developer.adzuna.com/>, Jooble en <https://jooble.org/api/about>.
- **En tu ordenador:** copia `collector/config.example.json` como `collector/config.local.json` y rellena las claves.
  Ese archivo nunca se sube a GitHub.
- **En GitHub:** Settings → Secrets and variables → Actions → New repository secret, con los nombres
  `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` y `JOOBLE_API_KEY`.

## Vista previa en un solo archivo

`npm run preview:file` genera `preview/plan-b-jobs.html` con la web y los datos actuales dentro.
