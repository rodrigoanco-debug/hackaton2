# TropelCare Control Room — Pizza Protocol

Frontend de la Hackathon 2 construido con React, TypeScript, Vite, React Router y Tailwind CSS.

## Integrantes

- Integrante 1: NOMBRE — CÓDIGO
- Integrante 2: NOMBRE — CÓDIGO
- Integrante 3: NOMBRE — CÓDIGO

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

```properties
VITE_API_BASE_URL=https://<backend-url>/api/v1
```

Las credenciales del equipo se ingresan en la pantalla de login. No deben subirse al repositorio.

## Comandos

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Deploy

- URL: PENDIENTE

El proyecto incluye configuración SPA para Vercel (`vercel.json`) y Netlify (`public/_redirects`) para permitir acceso directo a cualquier ruta.

## Decisiones técnicas

- La sesión se restaura llamando a `/auth/me` con el JWT persistido.
- Las respuestas obsoletas en Atlas de Tropeles se cancelan con `AbortController` y se descartan mediante una secuencia de requests.
- El feed infinito usa cursor, deduplicación por ID, una sola carga adicional en vuelo y conserva el componente montado al abrir el detalle.
- Los filtros se mantienen en la URL con `useSearchParams`.
- El Sector Story Engine usa `IntersectionObserver` como fallback y CSS scroll-driven animations cuando el navegador las soporta.
- La interfaz respeta `prefers-reduced-motion`.
