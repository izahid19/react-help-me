# react-help-me

A CLI tool that lets you instantly create a Vite + React app with your choice of language, CSS framework, routing setup, optional packages, and pre-configured project structure.

## Features

- **Interactive Setup** - prompts for project name, language, CSS framework, routing, and optional packages
- **Language Support** - JavaScript or TypeScript with proper file extensions and configurations  
- **CSS Framework Support** - Tailwind CSS, Bootstrap (CDN), or React Bootstrap
- **Routing Setup** - optional React Router DOM with pre-built navigation and example pages
- **Optional Packages** - easily add Axios, React Icons, React Hook Form, Yup, Formik, and Moment.js
- **PWA Ready** - optional Progressive Web App configuration with Vite PWA plugin
- **Automatic Folder Structure** - creates components, pages, hooks, utils, assets folders
- **Boilerplate Ready** - replaces default Vite boilerplate with clean welcome page or routing setup
- **Axios Setup** - pre-configured Axios instance with environment variables if selected
- **CSS Integration** - automatically configures your chosen CSS framework with Vite

## Installation

Run instantly with npx:

```bash
npx react-help-me
```

## Usage

When you run `npx react-help-me`, you will be prompted to:

1. **Enter Project Name** - e.g., `my-awesome-app`
2. **Choose Language** - JavaScript or TypeScript
3. **Choose CSS Framework** - Tailwind CSS, Bootstrap (CDN), or React Bootstrap
4. **Setup Routing** - Yes/No for React Router DOM with navigation
5. **Select Optional Packages** - choose from commonly used React libraries
6. **Enable PWA Support** - Yes/No for Progressive Web App features

## Example Walkthrough

```bash
npx react-help-me@latest
```

```
⚡ React Help Me - Skip the Setup, Start Building!
🔥 Your React project, configured perfectly, in under 60 seconds

? Enter project name: my-portfolio
? Which language do you want to use? TypeScript
? Choose a CSS framework: Tailwind CSS
? Do you want to setup routing? Yes
? Select optional packages: Axios, React Icons, React Hook Form
? Do you want to enable PWA support? Yes
```

This will:
- Create a new Vite + React + TypeScript project in `my-portfolio/`
- Install and configure Tailwind CSS with Vite
- Setup React Router DOM with Home and About pages
- Install Axios, React Icons, and React Hook Form
- Configure PWA support with Vite PWA plugin
- Create organized project folders
- Add a clean routing-enabled navigation structure
- Set up an Axios instance at `src/utils/axios.ts`

## Folder Structure

```
my-app/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Route pages (Home, About if routing enabled)
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   │   └── axios.ts   # Pre-configured Axios instance (if selected)
│   ├── assets/        # Static assets
│   ├── App.tsx        # Main App component with or without routing
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles and CSS framework imports
├── public/            # Public assets
├── vite.config.ts     # Vite configuration with plugins
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

## CSS Framework Integration

### Tailwind CSS
- Installs `tailwindcss` & `@tailwindcss/vite`
- Updates `vite.config.js/ts` to use Tailwind plugin
- Sets up `index.css` with Tailwind imports
- Creates responsive, utility-first components and pages

### Bootstrap (CDN)
- Adds Bootstrap CSS via CDN link in `index.html`
- Creates Bootstrap-styled components and navigation
- No additional dependencies required

### React Bootstrap
- Installs `react-bootstrap` and `bootstrap`
- Imports Bootstrap CSS in components
- Provides React-specific Bootstrap components

## Routing Integration

When routing is enabled, react-help-me creates:
- **React Router DOM setup** with BrowserRouter
- **Navigation bar** with responsive design matching your CSS framework
- **Home and About pages** with framework-consistent styling
- **Route configuration** in App component
- **Link components** for navigation between pages

## Optional Packages

You can add these during setup:
- **Axios** - with a ready-to-use configured instance
- **React Icons** - comprehensive icon library
- **React Hook Form** - performant form management with easy validation
- **Yup** - schema validation library perfect for forms
- **Formik** - alternative form management solution
- **Moment.js** - date/time manipulation utilities

## PWA Support

When PWA is enabled:
- Installs and configures `vite-plugin-pwa`
- Sets up service worker with auto-update
- Creates web app manifest with your project name
- Configures offline functionality
- Ready for app store deployment

## Quick Start Examples

### Simple TypeScript + Tailwind project:
```bash
npx react-help-me my-dashboard
# Choose: TypeScript → Tailwind CSS → No routing → No packages → No PWA
```

### Full-featured project with everything:
```bash
npx react-help-me my-saas-app
# Choose: TypeScript → Tailwind CSS → Yes routing → All packages → Yes PWA
```

### Minimal JavaScript project:
```bash
npx react-help-me my-landing-page  
# Choose: JavaScript → Bootstrap (CDN) → No routing → No packages → No PWA
```

## Why react-help-me?

- **Save Time** - Skip the repetitive setup and configuration
- **Framework Agnostic** - Works with your preferred CSS solution
- **Modern Stack** - Vite, React 18, latest packages, and PWA ready
- **Flexible** - Choose only what you need, skip what you don't
- **Production Ready** - Comes with best practices and organized structure

## Contributing

We welcome contributions! 

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to your branch: `git push origin feature-name`
5. Open a Pull Request

## License

MIT © [Zahid Mushtaq](https://github.com/izahid19)

## Acknowledgments

Built with:
- [Vite](https://vitejs.dev/) - Lightning fast build tool
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - Interactive command line prompts
- [React](https://reactjs.org/) - The library we all love

---

**Happy Coding! Get your React project up and running in seconds with react-help-me**