# PIXIE — Estado del Proyecto, Arquitectura y Manual de Desarrollo
> **Documento Vivo para Desarrolladores y Agentes de IA**  
> **Última Actualización:** 2026-11-13  
> **Versión del Proyecto:** 0.2.0 (Alpha / Core Foundation)  
> **Rama Principal:** `master`

---

## 1. Visión y Propósito del Proyecto

**Pixie** es una aplicación móvil diseñada para resolver la acumulación caótica de fotos y videos (+4,000 archivos de medios), eliminando la dependencia de suscripciones costosas en la nube (iCloud, Google Photos) y ofreciendo un flujo de organización ágil, divertido y automatizado por IA.

### Dolores Principales que Resuelve
1. **Fotos Basura Indetectadas:** Interfaz rápida de **Triage táctil (Swipe Cleaner estilo Tinder)**: izquierda = descartar / papelera, derecha = conservar y clasificar.
2. **Organización Lógica Multidimensional (Cero Duplicación de Espacio):** Una misma foto puede figurar simultáneamente en *"Viaje a Italia 2024"*, *"Fotos con Mamá"* y *"Comida"*, sin duplicar un solo byte de archivo físico (relación relacional N:M).
3. **Atributos y Metadatos Automáticos:** Extracción nativa de metadatos EXIF (fecha, hora, ubicación GPS) combinada con sugerencias de visión artificial (Gemini Flash) para que el usuario solo confirme en 1 toque.
4. **Idempotencia / No Repetición:** Las fotos ya clasificadas quedan registradas en SQLite y **nunca vuelven a aparecer** en la cola de triage. Solo fotos nuevas entran al flujo.
5. **Búsqueda Semántica con IA:** Búsqueda en lenguaje natural (*"pizza con mamá en Roma"*) para encontrar recuerdos cuando no se recuerde el álbum específico.

---

## 2. Patrones Arquitectónicos y Estándares de Ingeniería

El proyecto sigue estrictamente **Clean Architecture (Arquitectura Limpia)** dividida por capas desacopladas y gobernada por los principios **SOLID**:

```
src/
├── domain/                      # CAPA DE DOMINIO (Reglas de negocio puras, sin dependencias de frameworks)
│   ├── entities/                # Entidades centrales (Asset, Metadata, Tag, Album)
│   ├── repositories/            # Contratos de interfaces (ITriageRepository, IAlbumRepository)
│   └── usecases/                # Casos de uso (KeepAssetUseCase, DiscardAssetUseCase, FilterUnprocessedUseCase)
│
├── infrastructure/              # CAPA DE INFRAESTRUCTURA (Detalles técnicos y adaptadores externos)
│   ├── database/                # SQLite (expo-sqlite), esquemas DDL, migraciones, repositorios concretos
│   ├── metadata/                # Parsers de EXIF y reverse-geocoding
│   └── ai/                      # Adaptador para Google Gemini Flash API (Multimodal)
│
└── presentation/                # CAPA DE PRESENTACIÓN (UI, componentes y gestión de estado)
    ├── screens/                 # Vistas completas (TriageScreen, LibraryScreen, SearchScreen, TrashScreen)
    ├── components/              # Componentes atómicos accesibles (SwipeCard, TaggingModal, Chips)
    └── theme/                   # Tokens de diseño (Colores, espaciado, contraste A11y)
```

### Principios Aplicados
* **DIP (Dependency Inversion Principle):** Los casos de uso dependen exclusivamente de interfaces (`ITriageRepository`), nunca de la implementación concreta de SQLite ni de Expo. Esto permite probar el 100% de la lógica con tests unitarios instantáneos en Vitest sin mocks nativos pesados.
* **SRP (Single Responsibility Principle):** Cada caso de uso tiene una única razón para cambiar (`KeepAssetUseCase`, `DiscardAssetUseCase`).
* **Zero-Duplication Data Pattern:** El archivo de imagen se almacena una única vez con un identificador inmutable (`hash` o `id`). Las rutas a álbumes y etiquetas se gestionan en tablas asociativas `album_assets` y `asset_tags`.

---

## 3. Estado Actual de la Implementación (Roadmap Tracker)

| Fase / Módulo | Estado | Tests | Commit / Evidencia |
| :--- | :---: | :---: | :--- |
| **Infraestructura Base & No-Admin Runtime** | ✅ Completado | N/A | Node.js LTS portable en `.tools/nodejs` |
| **Scaffold Expo SDK 58 + TypeScript** | ✅ Completado | N/A | Expo 58, React 19, React Native 0.88 |
| **Esquema Relacional SQLite (Cero Duplicación)** | ✅ Completado | ✅ | `CREATE_TABLES_SQL` con tablas N:M e índices |
| **Lógica de Triage & Filtro de Idempotencia** | ✅ Completado | ✅ 4 tests | `TriageManager.test.ts` pasando |
| **Extractor EXIF y Geocoding de Metadatos** | ✅ Completado | ✅ 3 tests | `exifParser.test.ts` pasando |
| **Servicio de Rutas Virtuales Multidimensionales** | ✅ Completado | ✅ 2 tests | `albumService.test.ts` pasando |
| **Cliente Multimodal Gemini Flash & Búsqueda IA** | ✅ Completado | ✅ 2 tests | `geminiClient.test.ts` pasando |
| **UI Triage (Swipe Cleaner + Tagging Modal)** | ✅ Completado | ✅ Manual | Pantalla de swipe, chips de 1 toque y resumen |
| **UI Biblioteca de Rutas & Buscador IA** | ✅ Completado | ✅ Manual | Navegación entre Triage, Rutas, Buscar y Papelera |
| **Pipeline Automatizado GitHub Actions (CI)** | ✅ Completado | ✅ CI | `.github/workflows/ci.yml` (Lint + Typecheck + Tests) |
| **Conexión Real con Cámara/Carrete (`expo-media-library`)** | 🟡 En Espera de Checkpoint | — | Próximo paso técnico |
| **Sincronización a Cloudflare R2 / Almacenamiento Remoto** | ⚪ Pendiente | — | Fase 4 del Roadmap |

**Métricas de Calidad:**
* **Total de Pruebas Unitarias:** 11 pruebas pasando (100% éxito en ~380ms).
* **Errores de Tipado TypeScript:** 0 (`tsc --noEmit` en modo estricto).

---

## 4. Guía de Ejecución Local (Especial para Equipos Universitarios / Sin Permisos de Administrador)

El entorno fue configurado para funcionar completamente en el espacio de usuario (`c:\Users\adhenaof\Documents\Personal\.tools\nodejs`), sin requerir privilegios de administrador ni modificar el sistema operativo del equipo.

### Comandos de Desarrollo

```powershell
# 1. Configurar la ruta temporal de Node en la terminal de PowerShell:
$env:Path = "C:\Users\adhenaof\Documents\Personal\.tools\nodejs;$env:Path"

# 2. Entrar al proyecto:
cd C:\Users\adhenaof\Documents\Personal\Pixie

# 3. Ejecutar pruebas unitarias automatizadas:
npm test

# 4. Verificar que no existan errores de tipado TypeScript:
npx tsc --noEmit

# 5. Iniciar la aplicación móvil con Expo:
npx expo start
```

---

## 5. Estándares de Trabajo con GitHub y Flujo Git

1. **Convención de Commits Semánticos (Conventional Commits):**
   * `feat(<módulo>):` Nuevas funcionalidades (ej: `feat(triage): connect expo-media-library to native roll`).
   * `fix(<módulo>):` Correcciones de bugs.
   * `test(<módulo>):` Adición o actualización de suites de pruebas.
   * `refactor(<módulo>):` Mejoras de código sin cambiar comportamiento externo.
   * `docs:` Cambios en documentación o guías.
2. **Estrategia de Ramas:**
   * `master` / `main`: Código estable y probado.
   * `feature/<nombre>`: Desarrollo aislado de cada historia de usuario.
3. **Puerta de Calidad (Quality Gate CI):**
   * Todo Pull Request o Push debe superar `.github/workflows/ci.yml` (0 errores de compilación y 100% de tests unitarios aprobados).

---

## 6. Protocolo de Checkpoints y Verificación Continua

> **REGLA DE ORO DE DESARROLLO:**  
> Antes de saltar a la implementación de cualquier nuevo módulo, el asistente de IA y el desarrollador **se detendrán en un Checkpoint de Verificación** para:
> 1. Evaluar si la tecnología o librería elegida sigue siendo la óptima.
> 2. Confirmar que no se rompan los patrones de arquitectura limpia ni se agregue complejidad innecesaria.
> 3. Validar con el usuario el alcance exacto de la siguiente tarea antes de tocar el código.
