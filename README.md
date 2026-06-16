# 🗺️ Mapa de Oportunidades con IA

> Plataforma colaborativa y pública para compartir oportunidades de negocio detectadas con Inteligencia Artificial en ciudades de todo el mundo.

---

## 📋 Descripción

**Mapa de Oportunidades con IA** es una aplicación web simple, bonita y funcional que permite a cualquier persona:

- **Publicar** oportunidades de negocio detectadas en una ciudad
- **Ver** todas las oportunidades publicadas por otros usuarios
- **Filtrar** por ciudad, país y categoría
- **Dar like** a las oportunidades que más les interesan

Toda la información se guarda y lee desde **Supabase** (base de datos en la nube), por lo que es completamente pública y compartida entre todos los usuarios.

---

## 🚀 Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de la aplicación |
| **CSS3 (Vanilla)** | Estilos, animaciones y diseño responsivo |
| **JavaScript (Vanilla)** | Lógica de la aplicación |
| **Supabase** | Base de datos en la nube (PostgreSQL) |
| **Supabase Realtime** | Actualización automática en tiempo real |
| **Google Fonts (Inter)** | Tipografía |

---

## 📁 Estructura del proyecto

```
mapa-oportunidades-ia/
│
├── index.html      # App completa (HTML + CSS + JavaScript)
└── README.md       # Este archivo
```

El proyecto es un **archivo único** `index.html` que contiene:
- La estructura HTML del layout
- Los estilos CSS con diseño dark mode, animaciones y responsividad
- La lógica JavaScript conectada a Supabase

---

## 🗄️ Base de datos en Supabase

### Tabla: `opportunities`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único (autogenerado) |
| `name` | TEXT | Nombre de la oportunidad |
| `city` | TEXT | Ciudad donde se detectó |
| `country` | TEXT | País |
| `problem` | TEXT | Problema detectado |
| `ai_solution` | TEXT | Cómo la IA puede resolverlo |
| `category` | TEXT | Categoría (Tecnología, Salud, etc.) |
| `potential` | TEXT | Potencial (Alto, Medio, Bajo) |
| `likes` | INTEGER | Número de likes |
| `created_at` | TIMESTAMP | Fecha de publicación |

### Políticas de seguridad (RLS)

La tabla tiene **Row Level Security (RLS)** activado con políticas públicas:
- ✅ **SELECT**: Cualquier persona puede leer todas las oportunidades
- ✅ **INSERT**: Cualquier persona puede publicar sin necesidad de login
- ✅ **UPDATE**: Cualquier persona puede dar like (actualizar el contador)

---

## ⚙️ Configuración

Las credenciales de Supabase están en el archivo `index.html` (líneas ~418-420):

```javascript
const SUPABASE_URL = 'https://knsipibqjvrlkanmyjes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

> ⚠️ La `anon key` es segura para uso público ya que las políticas RLS controlan qué operaciones están permitidas.

---

## 🧪 Cómo probar que es realmente público

1. Abre `index.html` en tu navegador
2. Publica una nueva oportunidad usando el botón **"Publicar Oportunidad"**
3. Abre el mismo archivo en **otro navegador o en modo incógnito**
4. Verás la oportunidad que publicaste, porque los datos vienen de Supabase (nube), no del navegador local
5. Comparte el archivo con otra persona y verán exactamente las mismas oportunidades

---

## 🌐 Publicar online (compartir con el mundo)

Para que cualquier persona pueda acceder desde un enlace público:

### Opción 1: GitHub Pages (gratis)
```bash
# 1. Sube el proyecto a GitHub
git add .
git commit -m "Publicar Mapa de Oportunidades con IA"
git push

# 2. Ve a Settings > Pages en tu repositorio
# 3. Selecciona la rama main y la carpeta raíz /
# 4. GitHub te dará un enlace público
```

### Opción 2: Netlify (gratis, más fácil)
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra y suelta la carpeta del proyecto
3. En segundos tendrás un enlace público

---

## ✨ Funcionalidades

### Ver oportunidades
- Se cargan automáticamente desde Supabase al abrir la app
- Se actualizan en **tiempo real** cuando otro usuario publica (Supabase Realtime)
- Estadísticas animadas: total de oportunidades, ciudades, países y likes

### Publicar una oportunidad
1. Haz clic en **"✦ Publicar Oportunidad"**
2. Rellena el formulario (nombre, ciudad, país, problema, solución con IA, categoría, potencial)
3. Haz clic en **"🚀 Publicar"**
4. La oportunidad aparece en la lista inmediatamente para todos

### Filtrar
- **Por ciudad**: Muestra solo las oportunidades de una ciudad
- **Por país**: Filtra por país
- **Por categoría**: Tecnología, Salud, Educación, Comercio, Transporte, Alimentación, Sostenibilidad, Otro

### Dar like
- Haz clic en el botón **"♥"** de cualquier tarjeta
- El contador se actualiza en Supabase y es visible para todos

---

## 📱 Diseño

- **Dark mode** por defecto con paleta de colores premium
- **Totalmente responsivo** (funciona en móvil, tablet y escritorio)
- **Animaciones suaves** en hover, cards y orbes de fondo
- **Código de colores** por categoría para identificar oportunidades rápidamente

---

## 🤝 Cómo contribuir

Este es un proyecto educativo. Si quieres mejorarlo:

1. Añade autenticación con Supabase Auth
2. Implementa un mapa interactivo con Leaflet.js
3. Añade comentarios en cada oportunidad
4. Crea un sistema de etiquetas personalizadas
5. Añade imágenes o capturas de pantalla a cada oportunidad

---

## 📄 Licencia

Proyecto de uso libre y educativo.

---

*Creado con ❤️ usando HTML, CSS, JavaScript y Supabase*