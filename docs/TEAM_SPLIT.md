# División del trabajo sin conflictos

La estructura ya contiene las rutas y contratos compartidos. Eviten editar archivos fuera del módulo asignado.

## Integrante A — Autenticación, layout, dashboard y deploy

Carpetas principales:

- `src/features/auth/`
- `src/features/dashboard/`
- `src/app/layouts/`
- configuración de deploy

No debe modificar los módulos `tropels`, `signals` ni `sectors`.

## Integrante B — Tropeles y señales

Carpetas principales:

- `src/features/tropels/`
- `src/features/signals/`

No debe modificar `src/app/router.tsx`; las rutas ya están declaradas.

## Integrante C — Sector Story Engine

Carpeta principal:

- `src/features/sectors/`
- estilos de story dentro de `src/styles/index.css`, únicamente en la sección marcada.

## Archivos compartidos

Modificar solo mediante una rama de integración:

- `src/app/router.tsx`
- `src/styles/index.css`
- `package.json`
- `README.md`

## Ramas sugeridas

```txt
feature/auth-dashboard
feature/tropels-signals
feature/sector-story
integration/final
```

## Si solo trabajan dos personas

- Persona 1: Integrante A + Sector Story Engine.
- Persona 2: Integrante B.
- Los últimos 25 minutos: ambos integran y prueban desde `integration/final`.
