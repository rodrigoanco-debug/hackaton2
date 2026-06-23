# TropelCare Control Room — Pizza Protocol

Frontend de la Hackathon 2 construido con React, TypeScript, Vite, React Router y Tailwind CSS.

## Integrantes

- Integrante 1: NOMBRE — CÓDIGO (Checkpoints 1 y 5: auth, dashboard, Sector Story Engine)
- Integrante 2: NOMBRE — CÓDIGO (Checkpoints 2, 3 y 4: Tropeles y Señales)
- Integrante 3: NOMBRE — CÓDIGO

## Instalación

```bash
npm install
cp .env.example .env   # define VITE_API_BASE_URL con la URL real del backend
npm run dev
```

## Variables de entorno

```properties
VITE_API_BASE_URL=https://<backend-url>/api/v1
```

Si `VITE_API_BASE_URL` no está definida, la app no inventa datos: muestra un estado de
configuración faltante con un mensaje accionable. Las credenciales del equipo se ingresan
en la pantalla de login y nunca se suben al repositorio.

## Comandos

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Deploy

- URL: PENDIENTE

El proyecto incluye configuración SPA para Vercel (`vercel.json`) y Netlify
(`public/_redirects`) para permitir acceso directo a cualquier ruta.

## Decisiones técnicas

### Autenticación y sesión (Checkpoint 1)

- El JWT se persiste con un único `tokenStorage` (Single Source of Truth) y se envía como
  `Authorization: Bearer` desde el cliente HTTP compartido.
- `AuthContext` implementa el Provider Pattern y expone `status` (`restoring`,
  `authenticated`, `anonymous`). Al recargar restaura la sesión con `GET /auth/me`,
  manteniendo `restoring` para evitar parpadeos entre login y dashboard.
- La sesión solo se limpia si `/auth/me` responde `401`. Ante fallos transitorios (red,
  5xx, configuración faltante) no se destruye el token: se cae a `anonymous` y una recarga
  vuelve a validar cuando el backend se recupera.
- `ProtectedRoute` bloquea rutas privadas, conserva la ruta original en `location.state` y
  regresa a ella tras el login.
- El login valida campos requeridos con mensajes accionables, bloquea el botón durante la
  petición, evita doble submit y no borra las credenciales si la petición falla.

### Dashboard (Checkpoint 1)

- `GET /dashboard/summary` se valida en runtime (`parseDashboardSummary`): el cliente HTTP
  devuelve `unknown` y el feature solo confía en una forma verificada.
- Estados explícitos de `loading`, `error` (con reintento) y datos. Layout estable con
  alturas mínimas y desglose de severidad accesible.

### Sector Story Engine (Checkpoint 5)

- La etapa activa se detecta con `IntersectionObserver` (Observer Pattern), que funciona
  como base fiable independientemente del soporte de scroll-driven animations.
- El visual persistente se compone localmente con React + CSS, interpretando de forma
  determinista `climate`, `assetKey`, `colorToken`, `dominantEvent` y `metrics`. Hay una
  composición distinta por clima (`PIXEL_FOREST`, `NEON_CAVE`, `CLOUD_AQUARIUM`,
  `RETRO_ARCADE`) y un fallback genérico para climas desconocidos. `assetKey` es un
  identificador (no una URL): alimenta un hash determinista para variar la escena.
- El progreso usa `role="progressbar"` accesible, refleja la etapa activa, está acotado a
  0..1 y nunca retrocede por debajo del avance por índice.
- CSS Scroll-driven Animations se activan con `@supports (animation-timeline: view())`; el
  `IntersectionObserver` es el fallback funcional.
- La transición entre lista de sectores e historia usa la View Transition API cuando existe
  (`startViewTransition`, tipado sin `any`) y navegación normal cuando no.
- Se respeta `prefers-reduced-motion` en CSS y en el comportamiento de scroll por teclado.
- Navegación por teclado: Tab/Shift+Tab más flechas, Re Pág/Av Pág, Inicio y Fin; cada
  etapa es enfocable y actualiza visual, métricas y progreso.
- Si el backend no devuelve exactamente 8 etapas se muestra una advertencia accionable y se
  renderizan las recibidas sin inventar las faltantes.

### Tropeles y Señales (Checkpoints 2-4, otro integrante)

- Las respuestas obsoletas se cancelan con `AbortController` y se descartan por secuencia.
- El feed infinito usa cursor, deduplicación por ID y una sola carga adicional en vuelo.
- Los filtros se mantienen en la URL con `useSearchParams`.

## Pendiente de backend real

La validación funcional definitiva requiere el backend y el Swagger del curso:

```properties
VITE_API_BASE_URL=
TEAM_CODE=
EMAIL=
PASSWORD=
API_DOCUMENTATION_URL=
```
