# APP-IO2

Aplicación móvil desarrollada con Expo, React Native y NativeWind (Tailwind CSS para React Native). Este proyecto está diseñado para ser modular, escalable y fácil de mantener, con navegación por pestañas y componentes reutilizables.

## 📱 Características principales

- Navegación por pestañas usando expo-router.
- Estilos rápidos y responsivos con NativeWind (Tailwind CSS).
- Componentes reutilizables en la carpeta `components/`.
- Configuración lista para desarrollo en Android, iOS y Web.
- Linting y formateo con ESLint.

## 📂 Estructura del Proyecto

```
├── App.js                  # Entrada principal de la app
├── app/                    # Rutas y pantallas (expo-router)
│   ├── _layout.js
│   └── (tabs)/
│       ├── _layout.js
│       ├── index.js        # Home Tab
│       ├── cart.js         # Carrito Tab
│       ├── login.js        # Login Tab
│       └── settings.js     # Settings Tab
├── components/             # Componentes reutilizables
│   ├── Icons.jsx
│   ├── Main.jsx
│   └── Screen.jsx
├── assets/                 # Imágenes y recursos
├── global.css              # Estilos globales (Tailwind)
├── tailwind.config.js      # Configuración de Tailwind/NativeWind
├── metro.config.js         # Configuración de Metro bundler
├── package.json            # Dependencias y scripts
└── ...
```

## 🚀 Inicialización y ejecución del proyecto

Sigue estos pasos para clonar, instalar y ejecutar la aplicación en tu entorno local:

### 1. Clona el repositorio

Abre una terminal y ejecuta:

```sh
git clone https://github.com/poko233/APP-IO2.git
cd APP-IO2
```

### 2. Instala las dependencias

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/). Luego ejecuta:

```sh
npm install
```

Esto instalará todas las dependencias necesarias para el proyecto, incluyendo Expo, React Native, NativeWind y otras.

### 3. Instala Expo CLI (si no lo tienes)

Si aún no tienes Expo CLI instalado globalmente, ejecuta:

```sh
npm install -g expo-cli
```

### 4. Inicia el servidor de desarrollo

Para iniciar el proyecto y abrir el panel de Expo, ejecuta:

```sh
npm start
```

Esto abrirá Metro Bundler en tu navegador. Desde aquí puedes:
- Presionar `a` para abrir en un emulador/dispositivo Android.
- Presionar `i` para abrir en un simulador/dispositivo iOS (solo Mac).
- Presionar `w` para abrir en el navegador web.

También puedes usar los siguientes scripts:

- `npm run android` — Ejecuta la app en un emulador/dispositivo Android.
- `npm run ios` — Ejecuta la app en un simulador/dispositivo iOS.
- `npm run web` — Ejecuta la app en el navegador.
- `npm run lint` — Ejecuta ESLint para análisis de código.

### 5. Configura NativeWind (Tailwind CSS)

La configuración de Tailwind ya está incluida en `tailwind.config.js` y los estilos globales en `global.css`. Puedes personalizar los estilos según tus necesidades.

### 6. Estructura recomendada para desarrollo

- Agrega nuevos componentes en la carpeta `components/`.
- Crea nuevas pantallas o rutas en la carpeta `app/` siguiendo la convención de expo-router.
- Los recursos gráficos deben ir en la carpeta `assets/`.

## 🛠️ Tecnologías principales

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [expo-router](https://expo.github.io/router/docs/)
- [ESLint](https://eslint.org/)

## 📋 Notas adicionales

- Los estilos se definen en `global.css` y se aplican usando clases Tailwind en los componentes.
- La carpeta `.expo/` y `node_modules/` están ignoradas en el control de versiones.
- Puedes personalizar los iconos en `components/Icons.jsx`.

---

Desarrollado por LosYucas.