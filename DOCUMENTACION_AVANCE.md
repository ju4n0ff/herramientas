# Documentación de Proyecto — Raymi Fotografía

## 1. Portada

| | |
|---|---|
| **Título del proyecto** | Raymi Fotografía — Sitio Web Profesional |
| **Equipo de desarrollo** | Desarrollo individual (Jeffry — @ju4n0ff) |
| **Profesor** | *[Nombre del profesor]* |
| **Fecha** | Junio 2026 |
| **Logo** | `public/images/logo.avif` |

---

## 2. Introducción

### Objetivo del proyecto

Desarrollar un sitio web profesional para **Raymi Fotografía**, un servicio fotográfico en Lima, Perú, que permita mostrar su portafolio por categorías (bautizos, paisajes, sesiones urbanas, fotos dentales, maternales, motos, pedidas de mano), exhibir un mosaico fotográfico dinámico, presentar paquetes y precios, y proporcionar un formulario de contacto funcional con envío de correos mediante EmailJS.

### Justificación de herramientas

| Herramienta | Justificación |
|---|---|
| **React 18 + Vite 5** | Permite una SPA rápida con recarga en caliente, bundle optimizado y una arquitectura basada en componentes reutilizables. |
| **React Router v7** | Proporciona navegación SPA con `Outlet` para layouts anidados, ruta 404 y transiciones fluidas sin recarga de página. |
| **CSS Modules** | Encapsula estilos por componente evitando colisiones de nombres, manteniendo un CSS estándar sin runtime adicional. |
| **EmailJS** | Permite el envío de correos desde el frontend sin necesidad de un backend propio, reduciendo costos de infraestructura. |
| **Sharp (script de conversión)** | Convierte y redimensiona imágenes a AVIF (máx. 1200 px, calidad 80), optimizando el peso y la velocidad de carga. |
| **Vite `import.meta.glob`** | Carga dinámica de imágenes del mosaico sin necesidad de importarlas manualmente. |

### Metodología de trabajo

Se empleó una metodología **iterativa incremental** con ciclos cortos de desarrollo. Cada iteración se enfocó en una funcionalidad completa (Hero, Galería, Mosaico, Packs, Contacto, etc.), con lanzamientos progresivos a producción mediante commits atómicos y ramas de características. No se utilizó un tablero de tareas formal, pero el trabajo se organizó con un enfoque **Lean** priorizando las funcionalidades de mayor valor para el cliente.

---

## 3. Configuración del Repositorio

### Descripción del repositorio

| Atributo | Valor |
|---|---|
| **Nombre** | `raymi` |
| **Descripción** | Sitio web profesional de Raymi Fotografía |
| **Plataforma** | GitHub |
| **URL** | `https://github.com/ju4n0ff/raymi` |
| **Visibilidad** | Privado |

### Estructura de ramas

| Rama | Propósito |
|---|---|
| `main` | Rama de producción. Contiene la versión estable y desplegada del sitio. |
| `develop` | Rama de integración. Las ramas de características se fusionan aquí para pruebas. |
| `feature/*` | Ramas temporales para desarrollo de funcionalidades específicas. |

**Ramas de características utilizadas:**

- `Jeffry_77` — Desarrollo de mejoras de diseño, navegación y estructura.
- `bri-mol` — Integración del formulario de contacto (inicialmente con Supabase).

### Configuración de accesos

Al ser un proyecto de desarrollo individual, el repositorio tiene un único colaborador con permisos de administrador total. No se configuraron equipos ni roles de acceso restringido.

---

## 4. Estrategia de Control de Versiones y Ramificación

### GitFlow

Se implementó una variante simplificada de **GitFlow** adaptada al equipo unipersonal:

```
main (producción)
  └── develop (integración)
        ├── feature/nueva-funcionalidad
        └── feature/otra-funcionalidad
```

**Flujo de trabajo:**

1. Se parte de `main` o `develop` para crear una rama `feature/*`.
2. Se desarrolla la funcionalidad en la rama `feature/*` con commits atómicos.
3. Se abre un **Pull Request** hacia `develop`.
4. Tras revisión, se fusiona con `Merge Pull Request` en GitHub.
5. Periódicamente, `develop` se fusiona a `main` para desplegar a producción.

### Branching Model

| Tipo de rama | Convención | Creada desde | Fusionada hacia | Ejemplo |
|---|---|---|---|---|
| Característica | `feature/<nombre>` o nombre descriptivo | `main` o `develop` | `develop` | `Jeffry_77`, `bri-mol` |
| Producción | `main` | — | — | Rama estable |

**Nota:** No se usaron ramas `hotfix/` formales. Los arreglos urgentes se realizaron directamente sobre `main` o mediante una rama temporal que se fusionó directamente.

### Mezcla de ramas y resolución de conflictos

El procedimiento para merges fue:

1. Se completa el desarrollo en la rama `feature/*`.
2. Se crea un Pull Request en GitHub hacia `develop`.
3. GitHub verifica que no haya conflictos. Si los hay:
   - Se resuelven localmente con `git merge develop` en la rama feature.
   - Se corrigen los conflictos manualmente en los archivos afectados.
   - Se confirman los cambios y se pusha la rama actualizada.
4. Se aprueba y completa el PR con `Merge Pull Request`.
5. Cuando `develop` está lista, se abre un PR hacia `main`.

**Ejemplo de resolución de conflictos** (commit `aa52605`): se resolvieron conflictos al actualizar el nombre del estudio a "RaymiEstudio".

---

## 5. Flujo de Trabajo de Desarrollo

### Integración Continua (CI) y Entrega Continua (CD)

**Estado actual:** El proyecto **no cuenta con un pipeline de CI/CD automatizado** (no existe el directorio `.github/workflows/`). No se configuraron GitHub Actions, Jenkins ni GitLab CI/CD.

**Proceso actual de despliegue:**

1. El desarrollo se realiza localmente con `npm run dev`.
2. Se verifica la compilación con `npm run build`.
3. Se verifica el linting con `npm run lint`.
4. Se formatea el código con `npm run format`.
5. Se confirman los cambios y se pushean a GitHub.
6. El despliegue a producción se realiza manualmente desde el entorno local o directamente desde GitHub.

**Mejora propuesta:** Implementar GitHub Actions para automatizar:
- Ejecución de lint (`npm run lint`) en cada PR y push a `develop`.
- Build de producción (`npm run build`) en cada push a `main`.
- Despliegue automático a servicios como Vercel, Netlify o GitHub Pages.

### Pull Requests y Revisiones de Código

| Aspecto | Práctica |
|---|---|
| **Política de PR** | Toda funcionalidad nueva se integra mediante Pull Request hacia `develop`. No se permiten commits directos a `main` o `develop`. |
| **Revisor** | Al ser un proyecto individual, el mismo desarrollador revisa y aprueba sus PR. |
| **Estándares** | Se verifica que el código pase ESLint sin warnings (`--max-warnings 0`) y que el build sea exitoso. |
| **Formato del PR** | Título descriptivo del cambio realizado. |

**PRs realizados:**

| PR | Rama origen | Rama destino | Descripción |
|---|---|---|---|
| #6 | `Jeffry_77` | `main` | Mejoras de diseño, navegación y estructura |
| #5 | `bri-mol` | `main` | Integración del formulario de contacto |

---

## 6. Automatización y Herramientas Complementarias

### Scripts de automatización

| Script | Propósito |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo Vite con recarga en caliente. |
| `npm run build` | Compila la aplicación para producción en `dist/`. |
| `npm run lint` | Ejecuta ESLint en `src/` con tolerancia cero de warnings. |
| `npm run format` | Formatea el código con Prettier (sin semicolon, single quotes, trailing commas). |
| `node scripts/convertir.mjs` | Convierte imágenes RAW a AVIF optimizadas (máx. 1200 px, calidad 80) y las organiza en `public/images/`. |

**Ejemplo de uso del script de conversión:**

```bash
node scripts/convertir.mjs
# Convierte raw/<categoria>/* → public/images/<categoria>/<categoria>-NN.avif
# Archivos especiales: raw/hero.* → public/images/hero.avif (1600px)
#                      raw/about.* → public/images/about.avif (800px)
#                      raw/logo.* → public/images/logo.avif (800px)
```

### Herramientas de gestión de proyectos

No se utilizaron herramientas formales como Trello, Jira o Asana. La gestión de tareas se realizó de forma ad-hoc mediante:

- **Commits descriptivos** que documentan el trabajo realizado.
- **Pull Requests** para agrupar cambios por funcionalidad.
- **README.md** y **AGENTS.md** como documentación viva del proyecto.

### Herramientas de comunicación

Al ser un proyecto individual, no se requirieron herramientas de comunicación en equipo. Para futuros equipos se recomienda:

- **Slack / Discord** para comunicación diaria.
- **WhatsApp** para comunicación rápida y urgente.

---

## 7. Pruebas y Resultados

### Pruebas unitarias

**Estado actual:** El proyecto **no cuenta con pruebas unitarias automatizadas**. No se configuró Jest, Vitest ni ningún otro framework de pruebas.

La verificación de calidad se realiza mediante:
- **Linting:** `npm run lint` — ESLint con configuración estricta.
- **Build:** `npm run build` — Vite valida que no haya errores de compilación.

### Pruebas de integración

No se implementaron pruebas de integración automatizadas. La validación de la integración entre componentes (Hero, Gallery, Modal, Formulario de contacto, etc.) se realizó mediante pruebas manuales en el navegador.

### Despliegue a producción

**Proceso actual:**

1. Se ejecuta `npm run build` localmente para verificar que no haya errores.
2. Se ejecuta `npm run lint` para verificar la calidad del código.
3. Se confirman los cambios y se pushean a `main`.
4. El sitio se despliega manualmente al servicio de hosting (actualmente en línea y funcionando).

**Controles de calidad previos al despliegue:**

| Control | Comando | Resultado esperado |
|---|---|---|
| Linting | `npm run lint` | 0 warnings, 0 errores |
| Compilación | `npm run build` | Build exitoso en `dist/` |

---

## 8. Conclusiones

### Reflexión sobre el proceso

La implementación de control de versiones con GitFlow simplificado permitió mantener un historial limpio y organizado del proyecto. A pesar de ser un equipo unipersonal, el uso de ramas de características y Pull Requests facilitó la experimentación sin comprometer la rama de producción. La estructura de ramas `main` ↔ `develop` ↔ `feature/*` proporcionó un flujo claro y predecible.

### Lecciones aprendidas

1. **GitFlow unipersonal:** GitFlow es útil incluso para un solo desarrollador, pues aísla el trabajo en curso y permite mantener `main` siempre estable.
2. **PR como documentación:** Los Pull Requests sirven como registro de qué se cambió, por qué y cuándo, funcionando como una bitácora del proyecto.
3. **Importancia del CI/CD:** La falta de automatización hace que el proceso de despliegue sea manual y propenso a errores. Implementar GitHub Actions sería el siguiente paso lógico.
4. **Pruebas automatizadas:** Sin pruebas unitarias ni de integración, la detección de regresiones depende enteramente de pruebas manuales, lo que no escala.
5. **Documentación viva:** Mantener archivos como `AGENTS.md` con las convenciones y "gotchas" del proyecto reduce la fricción al retomar el desarrollo después de pausas.

### Recomendaciones

1. **Implementar CI/CD con GitHub Actions:** Automatizar lint, build y despliegue para cada push a `main` y `develop`.
2. **Agregar pruebas unitarias con Vitest:** Probar componentes clave como `Modal`, `Gallery` y el servicio de contacto.
3. **Configurar ramas `hotfix/`:** Formalizar el flujo de correcciones urgentes desde `main`.
4. **Usar un tablero de tareas (Trello o GitHub Projects):** Para planificar sprints y priorizar el backlog de funcionalidades pendientes.
5. **Agregar revisión de código cruzada:** En equipos de más de una persona, exigir al menos un revisor externo por PR.
6. **Crear un `.env.example`:** Para facilitar la incorporación de nuevos desarrolladores al proyecto.

---

## Anexo: Historial de Commits Relevante

| Hash | Descripción |
|---|---|
| `89f7fa2` | Modificación de descripción de fotos en galería |
| `228bad9` | Modificación de tarifas |
| `329a8ba` | Implementación de mosaico, cambio de tipografía y tamaño de letra |
| `743ed01` | Cambios para vista en celular (responsive) |
| `ec7e0bd` | Modificación de estructura, eliminación de dependencias, mejoras de diseño |
| `2313c57` | Merge PR #6: Mejoras de diseño y navegación |
| `18297d1` | Merge PR #5: Integración de formulario de contacto |
| `d9df00d` | Actualización del estudio a RaymiEstudio |
| `aa52605` | Resolución de conflictos |
| `f93d245` | Navegación por Outlet — React Router |
| `dc0baa8` | Implementación de página de error 404 |

## Anexo: Estructura del Proyecto

```
raymi/
├── public/
│   ├── images/
│   │   ├── bautizo/        (4 fotos AVIF)
│   │   ├── fotos-dentales/ (4 fotos AVIF)
│   │   ├── maternales/     (9 fotos AVIF)
│   │   ├── mosaico/        (19 fotos AVIF)
│   │   ├── motos/          (10 fotos AVIF)
│   │   ├── paisajes/       (8 fotos AVIF)
│   │   ├── pedida-de-mano/ (4 fotos AVIF)
│   │   ├── urbanos/        (12 fotos AVIF)
│   │   ├── hero.avif
│   │   └── logo.avif
│   ├── favicon.png
│   └── favicon.svg
├── scripts/
│   └── convertir.mjs
├── src/
│   ├── components/         (13 componentes)
│   ├── data/
│   │   └── index.js        (SLIDES, CATS, PACKS, CONTACT_INFO, PHOTO_WALL)
│   ├── hooks/              (4 hooks personalizados)
│   ├── pages/              (Home, Error)
│   ├── services/
│   │   └── contactService.js (EmailJS)
│   ├── styles/             (13 CSS Modules + global.css)
│   ├── App.jsx
│   └── main.jsx
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── AGENTS.md
├── README.md
├── index.html
├── package.json
└── vite.config.js
```

---

*Documentación generada para presentación de avance — Junio 2026*
