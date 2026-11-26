# Nexo · Control de clientes

Aplicación web para clientes, casos y seguimiento, hecha con HTML, CSS, JavaScript y Bootstrap. Incluye Inter y Font Awesome localmente.

**Sitio:** https://kevinMejia6.github.io/Control-Cliente/

## Funciones

- Clientes, casos, prioridades, responsables, fechas y estados.
- Resúmenes globales y por cliente, búsqueda y filtros.
- Historial, notas, referencia del correo, escalamiento y tiempo invertido.
- Revisión y cierre con registro del aprobador.
- Archivos adjuntos, descarga y vista previa de imágenes.
- Recordatorios programados y avisos de entrega con sonido; posponer y atender avisos.
- Modo claro/oscuro y barra lateral que se abre y cierra.
- Exportación CSV para Excel y respaldo/restauración JSON con adjuntos.

## Almacenamiento temporal

Todo se guarda en **localStorage**, sin servidor ni base de datos externa:

- `nexo-v1`: clientes, casos, historial, recordatorios, preferencias de sonido y adjuntos en Base64.
- `nexo-appearance`: tema y preferencia de la barra lateral de escritorio.

Los datos pertenecen al navegador y al dominio donde se abren. No se sincronizan entre equipos ni se envían al repositorio. Borrar los datos del navegador también elimina la información de la aplicación. Usa **Descargar respaldo** para conservar una copia.

Los adjuntos admiten **1 MB por archivo** y **1.5 MB por selección**; el conjunto codificado tiene un límite de 2 millones de caracteres para reservar espacio a los registros. La capacidad real depende del navegador. Si un guardado supera la cuota, se muestra un error y se conserva la versión anterior.

Para traer información del sitio anterior, descarga allí un respaldo y restáuralo en GitHub Pages. Los archivos que superen los nuevos límites deben reducirse antes de restaurarlos. El sitio comienza con ejemplos identificados.

Los recordatorios con sonido requieren mantener la página abierta y pulsar **Activar sonido** en cada sesión. No hay notificaciones con el navegador cerrado. La aprobación registra un nombre manual; no es una firma autenticada ni un sistema multiusuario.

## GitHub Pages

El código del sitio está en `docs/`, con rutas relativas compatibles con `/Control-Cliente/`. Pages se configura desde **Settings → Pages → Deploy from a branch → main → /docs**. `.nojekyll` permite servir los archivos estáticos directamente. No se necesita compilación ni instalación para utilizarlo.

## Desarrollo y verificación

Con Node.js 22 o superior:

```sh
npm test
```

Para una vista previa local:

```sh
python3 -m http.server 4173 --directory docs
```

Abre http://localhost:4173. Las pruebas verifican horarios, archivos, respaldos y conservación de datos cuando localStorage está lleno. No requieren dependencias externas.

Las licencias de Inter y Font Awesome están incluidas junto a sus archivos.

## Flujo sencillo para Esteff

La pantalla inicial muestra clientes y sus cantidades pendientes/finalizadas. La navegación principal tiene dos opciones: **Clientes** y **Pendientes**. Dentro de cada cliente se consultan pendientes, finalizados o todos los casos y se registra una nueva solicitud.

Cada caso muestra su estado, prioridad, responsable y fechas, con un espacio directo para guardar avances. **Finalizar caso** solicita quién dio el visto bueno y conserva el historial. Los correos y datos complementarios del formulario, los archivos, recordatorios y acciones de revisión/escalamiento se despliegan solo cuando se necesitan. Se conservan los registros anteriores y localStorage; no hay migración destructiva.
