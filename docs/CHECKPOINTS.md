# Checklist de validación

## Checkpoint 1
- [ ] `/dashboard` redirige a login sin sesión.
- [ ] Login real.
- [ ] Recarga restaura sesión con `/auth/me`.
- [ ] Logout limpia sesión.
- [ ] Dashboard tiene loading, error y estado vacío.

## Checkpoint 2
- [ ] Paginación del servidor.
- [ ] Filtros, búsqueda y sort combinables.
- [ ] Estado completo en URL.
- [ ] Recarga restaura la vista.
- [ ] Requests antiguas no reemplazan resultados nuevos.

## Checkpoint 3
- [ ] Infinite scroll automático por cursor.
- [ ] Deduplicación por ID.
- [ ] Una sola carga adicional en vuelo.
- [ ] Cambio de filtros cancela la consulta anterior.
- [ ] Error de página posterior conserva elementos previos.
- [ ] Fin de lista visible.

## Checkpoint 4
- [ ] Detalle real de señal.
- [ ] Posición del feed conservada.
- [ ] PATCH a PROCESANDO o ATENDIDA.
- [ ] Botones deshabilitados durante la request.
- [ ] Éxito actualiza el feed.
- [ ] Error conserva el estado anterior y permite reintentar.

## Checkpoint 5
- [ ] Ocho etapas generadas desde API.
- [ ] Visual sticky cambia con etapa activa.
- [ ] Progreso visible.
- [ ] Scroll-driven animations + fallback.
- [ ] View Transition API + fallback.
- [ ] Desktop y mobile.
- [ ] Reduced motion.
- [ ] Teclado.

## Entrega
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run build` sin errores.
- [ ] No existe `any` en DTOs.
- [ ] Repositorio público.
- [ ] Deploy abre cualquier ruta directamente.
- [ ] README completo.
