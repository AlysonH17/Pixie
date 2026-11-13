# Pixie 📸✨
> **Organizador y Limpiador Inteligente de Fotos Móviles (Tinder-Style + Cero Duplicación + Asistente IA)**

Pixie es una aplicación móvil desarrollada con **React Native (Expo SDK 58)** y **Clean Architecture** para gestionar grandes volúmenes de fotos y videos (+4,000 archivos), eliminando la dependencia de servicios de suscripción en la nube.

---

## 🚀 Inicio Rápido

Consulta el documento maestro de arquitectura, estado del proyecto y guía de desarrollo:
👉 **[PROJECT_STATE.md](./PROJECT_STATE.md)**

### Ejecución en Entorno Local (Windows / PowerShell)

```powershell
# Cargar Node.js portátil (en caso de no estar en el PATH global)
$env:Path = "C:\Users\adhenaof\Documents\Personal\.tools\nodejs;$env:Path"

# Instalar dependencias (si es primera vez)
npm install

# Correr suite de pruebas unitarias
npm test

# Iniciar el servidor móvil de Expo
npx expo start
```

---

## 🏛️ Arquitectura y Patrones

* **Clean Architecture:** Separación estricta entre `domain/` (casos de uso, interfaces), `infrastructure/` (SQLite, EXIF, IA) y `presentation/` (UI, gestos).
* **Zero-Duplication Relational Model:** Una misma foto puede asignarse a múltiples álbumes y etiquetas sin duplicar archivos físicos en disco.
* **Triage Inteligente (Swipe):** Deslizar a la izquierda para descartar, deslizar a la derecha para clasificar con metadatos EXIF automáticos y sugerencias de IA.
* **Idempotencia:** Las fotos ya procesadas quedan registradas y nunca vuelven a aparecer en la cola de triage.

---

## 🧪 Pruebas y Calidad

El proyecto incluye pruebas unitarias con **Vitest** y un pipeline de **GitHub Actions** (`.github/workflows/ci.yml`).

```bash
npm test          # Ejecuta las 11 pruebas unitarias
npx tsc --noEmit  # Verificación estricta de tipos TypeScript
```
