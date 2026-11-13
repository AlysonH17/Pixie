# GitHub Issues Backlog — Pixie

Este documento contiene la definición formal de los **Issues** para cargar en el **GitHub Project** del repositorio.

---

### Issue #1: `feat(core): Setup Clean Architecture, SQLite Schema & CI Pipeline`
* **Tipo:** Task / Core
* **Labels:** `core`, `architecture`, `database`
* **Estado:** ✅ Completado (Commit `67d1e68`)
* **Descripción:**
  Configurar la arquitectura base del proyecto en React Native (Expo SDK 58) con TypeScript estricto, esquema relacional SQLite para soporte de relaciones muchos a muchos (cero duplicación de archivos), motor de pruebas unitarias Vitest y pipeline de CI en GitHub Actions.
* **Criterios de Aceptación:**
  - [x] Estructura Clean Architecture (`domain/`, `infrastructure/`, `presentation/`).
  - [x] Esquema DDL en SQLite con tablas `assets`, `tags`, `asset_tags`, `albums`, `album_assets`.
  - [x] Tests unitarios iniciales pasando con Vitest.
  - [x] Pipeline de CI (`.github/workflows/ci.yml`).

---

### Issue #2: `feat(triage): Implement Swipe Cleaner UI & Gestures Engine`
* **Tipo:** Feature
* **Labels:** `triage`, `ui`, `gestures`
* **Estado:** 🟡 En Integración / Refinamiento
* **Descripción:**
  Implementar la tarjeta interactiva de gestos tipo Tinder para la pantalla de Triage:
  - Deslizar izquierda: Enviar a cola de descarte (papelera).
  - Deslizar derecha: Abrir modal de confirmación rápida de atributos.
  - Botones táctiles accesibles inferiores como alternativa al gesto.
  - Indicador de progreso: fotos pendientes y espacio potencial liberado.
* **Criterios de Aceptación:**
  - [ ] Animaciones fluidas a 60 FPS en dispositivo móvil.
  - [ ] Soporte de botón "Deshacer" (Undo) de la última acción.
  - [ ] Pantalla de estado vacío ("¡Todo al día!") cuando la cola quede en 0.

---

### Issue #3: `feat(metadata): EXIF Extraction & 1-Tap Quick Tagging Modal`
* **Tipo:** Feature
* **Labels:** `metadata`, `exif`, `ux`
* **Estado:** 🟡 Especificado
* **Descripción:**
  Al deslizar una foto a la derecha para guardarla, desplegar un modal ultra rápido que:
  - Extraiga y muestre por defecto fecha y hora EXIF.
  - Traduzca coordenadas GPS a ciudad/país.
  - Ofrezca chips de 1 toque para personas frecuentes (`Mamá`, `Amigos`, `Yo`) y categorías (`Comida`, `Paisaje`, `Atardecer`, `Documento`).
  - Permita crear nuevas etiquetas personalizadas al vuelo.
* **Criterios de Aceptación:**
  - [ ] El guardado no toma más de 2 toques por foto.
  - [ ] Los metadatos se persisten en la tabla `asset_metadata`.

---

### Issue #4: `feat(albums): Virtual Routes & Zero-Duplication Engine`
* **Tipo:** Feature
* **Labels:** `albums`, `database`, `zero-duplication`
* **Estado:** 🟡 Especificado
* **Descripción:**
  Garantizar que una misma fotografía pueda ser consultada en múltiples rutas lógicas (por ejemplo, en el álbum *Viaje a Italia 2024* y en el álbum *Fotos con Mamá*), verificando que el archivo físico exista una sola vez en el sistema de almacenamiento.
* **Criterios de Aceptación:**
  - [ ] Vista de explorador por rutas/álbumes y por etiquetas de personas/categorías.
  - [ ] Verificación en SQLite de que no se duplica la URI ni los bytes del archivo.

---

### Issue #5: `feat(scanner): Native Camera Roll Scanner & Pagination Batch Loader`
* **Tipo:** Feature / Infra
* **Labels:** `scanner`, `performance`, `native`
* **Estado:** ⚪ Pendiente
* **Descripción:**
  Conectar `expo-media-library` al carrete real del dispositivo con estrategia de alto rendimiento para bibliotecas de +4,000 fotos:
  - Paginación por cursor (cargar en memoria solo lotes de 50 fotos a la vez).
  - Cruce instantáneo con SQLite para omitir fotos que ya fueron marcadas como `kept` o `discarded`.
  - Manejo amigable de permisos de lectura y eliminación del sistema operativo.
* **Criterios de Aceptación:**
  - [ ] Uso de memoria RAM estable (<150 MB) sin importar el tamaño total de la biblioteca.
  - [ ] Cero fotos repetidas en sesiones posteriores.

---

### Issue #6: `feat(ai): Gemini Flash Multimodal Pre-Tagging & Semantic Search`
* **Tipo:** Feature / AI
* **Labels:** `ai`, `gemini`, `multimodal`, `search`
* **Estado:** ⚪ Pendiente
* **Descripción:**
  Integrar inferencia visual con Gemini 2.5 Flash:
  - Generar miniaturas ultraligeras (256x256 px) para enviar al modelo con esquema JSON estructurado.
  - Pre-marcar chips de etiquetas sugeridas por la IA con un icono ✨ para que el usuario solo dé "Guardar".
  - Barra de búsqueda semántica en lenguaje natural (*"recuerdo que estábamos comiendo pasta al aire libre"*).
* **Criterios de Aceptación:**
  - [ ] Tiempo de inferencia inferior a 800 ms.
  - [ ] Modo offline/fallback funcional cuando no hay conexión a internet.

---

### Issue #7: `feat(trash): Retention Policy, Space Reclamation & Batch Delete`
* **Tipo:** Feature
* **Labels:** `trash`, `storage`, `cleanup`
* **Estado:** ⚪ Pendiente
* **Descripción:**
  Pantalla de papelera donde el usuario pueda revisar las fotos descartadas, ver el total de Megabytes/Gigabytes que se van a liberar, y ejecutar el borrado permanente seguro del carrete nativo.
* **Criterios de Aceptación:**
  - [ ] Diálogo de confirmación antes del borrado destructivo.
  - [ ] Opción de restaurar fotos de la papelera a la cola de pendientes.

---

### Issue #8: `feat(cloud): Cloudflare R2 Remote Backup Adapter (Zero-Egress)`
* **Tipo:** Feature / Cloud
* **Labels:** `cloud`, `backup`, `cloudflare-r2`
* **Estado:** ⚪ Pendiente
* **Descripción:**
  Módulo desacoplado de sincronización a almacenamiento remoto económico (Cloudflare R2 con costo cero por salida de datos) o a servidor local casero vía Tailscale.
* **Criterios de Aceptación:**
  - [ ] Subida en segundo plano con reintentos exponenciales.
  - [ ] Verificación de integridad por checksum SHA-256.
