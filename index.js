#!/usr/bin/env node
import inquirer from "inquirer";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";


const run = (cmd, cwd = process.cwd()) => {
  console.log(`\n📦 Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
};


(async () => {
  try {
    console.log("⚡ React Help Me - Skip the Setup, Start Building!");
    console.log("🔥 Your React project, configured perfectly, in under 60 seconds\n");


    // Step 1: Project name
    const { projectName } = await inquirer.prompt([
      { type: "input", name: "projectName", message: "Enter project name:" },
    ]);


    // Step 2: Language choice
    const { language } = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: "Which language do you want to use?",
        choices: ["JavaScript", "TypeScript"],
      },
    ]);


    // Define file extensions
    const fileExtension = language === "TypeScript" ? "tsx" : "jsx";
    const configExtension = language === "TypeScript" ? "ts" : "js";


    // Step 3: CSS framework
    const { cssFramework } = await inquirer.prompt([
      {
        type: "list",
        name: "cssFramework",
        message: "Choose a CSS framework:",
        choices: ["Tailwind CSS", "Bootstrap (CDN)", "React Bootstrap"],
      },
    ]);


    // Step 4: Routing setup
    const { useRouting } = await inquirer.prompt([
      {
        type: "confirm",
        name: "useRouting",
        message: "Do you want to setup routing?",
        default: false,
      },
    ]);


    // Step 5: Optional packages
    const { packages } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "packages",
        message: "Select optional packages:",
        choices: [
          { name: "Axios", value: "axios" },
          { name: "React Icons", value: "react-icons" },
          { name: "React Hook Form", value: "react-hook-form" },
          { name: "Yup", value: "yup" },
          { name: "Formik", value: "formik" },
          { name: "Moment.js", value: "moment" },
        ],
      },
    ]);


    // Step 6: PWA setup
    const { usePWA } = await inquirer.prompt([
      {
        type: "confirm",
        name: "usePWA",
        message: "Do you want to enable PWA support?",
        default: false,
      },
    ]);


    // Step 7: Create project
    const projectPath = path.join(process.cwd(), projectName);
    const template = language === "TypeScript" ? "react-ts" : "react";
    run(`npm create vite@latest ${projectName} -- --template ${template}`);


    // Remove default boilerplate files (if they exist)
    const filesToRemove = [
      `src/App.${fileExtension}`,
      "src/index.css",
      "public/vite.svg",
      "src/assets/react.svg",
    ];


    filesToRemove.forEach((file) => {
      const filePath = path.join(projectPath, file);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          // ignore
        }
      }
    });


    // Create minimal index.css for non-Tailwind setups
    if (cssFramework !== "Tailwind CSS") {
      fs.writeFileSync(
        path.join(projectPath, "src/index.css"),
        `body { margin: 0; padding: 0; box-sizing: border-box; }`
      );
    }


    // Step 8: Install CSS framework & write configs
    if (cssFramework === "Tailwind CSS") {
      run(`npm install tailwindcss @tailwindcss/vite`, projectPath);


      // Use the correct config file extension
      const viteConfigPath = path.join(projectPath, `vite.config.${configExtension}`);
      
      // Check if the config file exists before trying to read it
      if (!fs.existsSync(viteConfigPath)) {
        // If it doesn't exist, create it with basic configuration
        fs.writeFileSync(
          viteConfigPath,
          `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
})`
        );
      }


      let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
      
      // Add import for tailwindcss
      viteConfig = `import tailwindcss from '@tailwindcss/vite'\n` + viteConfig;
      
      // Add tailwindcss to plugins array
      viteConfig = viteConfig.replace(
        /plugins:\s*\[/,
        "plugins: [\n    tailwindcss(),"
      );
      
      fs.writeFileSync(viteConfigPath, viteConfig);


      // Update index.css with Tailwind import
      fs.writeFileSync(
        path.join(projectPath, "src", "index.css"),
        `@import "tailwindcss";\n`
      );


      // Ensure main file imports index.css
      const mainFile = path.join(projectPath, `src/main.${fileExtension}`);
      let mainContent = fs.readFileSync(mainFile, "utf-8");
      
      // Remove any existing import of index.css
      mainContent = mainContent.replace(/import\s+['"]\.\/index\.css['"];?/g, "");
      
      // Add import for index.css if not already present
      if (!mainContent.includes(`import './index.css'`)) {
        mainContent = `import './index.css';\n` + mainContent;
      }
      
      fs.writeFileSync(mainFile, mainContent);
    }


    if (cssFramework === "Bootstrap (CDN)") {
      // Overwrite the root index.html to add CDN bootstrap and ensure title matches projectName
      fs.writeFileSync(
        path.join(projectPath, "index.html"),
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${fileExtension}"></script>
  </body>
</html>`
      );
    }


    if (cssFramework === "React Bootstrap") {
      run("npm install react-bootstrap bootstrap", projectPath);
    }


    // Step 9: Install routing if selected
    if (useRouting) {
      run("npm install react-router-dom", projectPath);
    }


    // Step 10: Install optional packages
    if (packages.length > 0) {
      run(`npm install ${packages.join(" ")}`, projectPath);
    }


    // Step 11: Axios setup
    if (packages.includes("axios")) {
      const axiosExt = language === "TypeScript" ? "ts" : "js";
      const utilsPath = path.join(projectPath, "src/utils");
      fs.mkdirSync(utilsPath, { recursive: true });


      // Basic axios file; TypeScript users may want to expand types later
      const axiosContent =
        `import axios from "axios";


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});`;


      fs.writeFileSync(
        path.join(utilsPath, `axios.${axiosExt}`),
        axiosContent
      );
    }


    // Step 12: Create minimal folder structure
    const folders = ["src/components", "src/hooks", "src/utils", "src/assets"];
    if (useRouting) {
      folders.push("src/pages");
    }
    folders.forEach((folder) =>
      fs.mkdirSync(path.join(projectPath, folder), { recursive: true })
    );


    // Step 13: Create routing components if routing is enabled
    if (useRouting) {
      // Create Home page
      const homeContent = `${cssFramework === "Tailwind CSS" ? `export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Home Page
      </h1>
      <p className="text-lg text-gray-700">
        Welcome to ${projectName}
      </p>
    </div>
  );
}` : cssFramework === "Bootstrap (CDN)" || cssFramework === "React Bootstrap" ? `export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <h1 className="display-4 text-primary mb-4">
        Home Page
      </h1>
      <p className="lead text-secondary">
        Welcome to ${projectName}
      </p>
    </div>
  );
}` : `export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '2rem'
    }}>
      <h1 style={{ color: 'blue', marginBottom: '1rem' }}>
        Home Page
      </h1>
      <p>Welcome to ${projectName}</p>
    </div>
  );
}`}`;

      // Create About page
      const aboutContent = `${cssFramework === "Tailwind CSS" ? `export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        About Page
      </h1>
      <p className="text-lg text-gray-700">
        This is the about page for ${projectName}
      </p>
    </div>
  );
}` : cssFramework === "Bootstrap (CDN)" || cssFramework === "React Bootstrap" ? `export default function About() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <h1 className="display-4 text-success mb-4">
        About Page
      </h1>
      <p className="lead text-secondary">
        This is the about page for ${projectName}
      </p>
    </div>
  );
}` : `export default function About() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '2rem'
    }}>
      <h1 style={{ color: 'green', marginBottom: '1rem' }}>
        About Page
      </h1>
      <p>This is the about page for ${projectName}</p>
    </div>
  );
}`}`;

      fs.writeFileSync(
        path.join(projectPath, `src/pages/Home.${fileExtension}`),
        homeContent
      );

      fs.writeFileSync(
        path.join(projectPath, `src/pages/About.${fileExtension}`),
        aboutContent
      );
    }


    // Step 14: Create App component (depending on CSS framework and routing)
    const getAppContent = () => {
      if (useRouting) {
        // App with routing
        const routingImports = `import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';`;

        switch (cssFramework) {
          case "Tailwind CSS":
            return `${routingImports}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <div>
                  <Link to="/" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-500 text-lg">${projectName}</span>
                  </Link>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <Link to="/" className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300">Home</Link>
                  <Link to="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300">About</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}`;
          case "Bootstrap (CDN)":
          case "React Bootstrap":
            return `${cssFramework === "React Bootstrap" ? "import 'bootstrap/dist/css/bootstrap.min.css';\n" : ""}${routingImports}

export default function App() {
  return (
    <Router>
      <div className="min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">${projectName}</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/about">About</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}`;
          default:
            return `${routingImports}

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <nav style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: '#495057'
          }}>${projectName}</Link>
          <div>
            <Link to="/" style={{ 
              marginRight: '1rem', 
              textDecoration: 'none',
              color: '#6c757d'
            }}>Home</Link>
            <Link to="/about" style={{ 
              textDecoration: 'none',
              color: '#6c757d'
            }}>About</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}`;
        }
      } else {
        // App without routing (original)
        switch (cssFramework) {
          case "Tailwind CSS":
            return `export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to React Boilerplate
      </h1>
      <p className="text-lg text-gray-700">
        Project: ${projectName}
      </p>
      <p className="text-lg text-gray-700">
        CSS Framework: ${cssFramework}
      </p>
    </div>
  );
}`;
          case "Bootstrap (CDN)":
            return `export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <h1 className="display-4 text-primary mb-4">
        Welcome to React Boilerplate
      </h1>
      <p className="lead text-secondary">
        Project: ${projectName}
      </p>
      <p className="lead text-secondary">
        CSS Framework: ${cssFramework}
      </p>
    </div>
  );
}`;
          case "React Bootstrap":
            return `import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <h1 className="display-4 text-primary mb-4">
        Welcome to React Boilerplate
      </h1>
      <p className="lead text-secondary">
        Project: ${projectName}
      </p>
      <p className="lead text-secondary">
        CSS Framework: ${cssFramework}
      </p>
    </div>
  );
}`;
          default:
            return `export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '2rem'
    }}>
      <h1 style={{ color: 'blue', marginBottom: '1rem' }}>
        Welcome to React Boilerplate
      </h1>
      <p>Project: ${projectName}</p>
      <p>CSS Framework: ${cssFramework}</p>
    </div>
  );
}`;
        }
      }
    };


    // Create App component
    fs.writeFileSync(
      path.join(projectPath, `src/App.${fileExtension}`),
      getAppContent()
    );


    // Create main entry file
    fs.writeFileSync(
      path.join(projectPath, `src/main.${fileExtension}`),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}`
    );


    // Step 15: Setup PWA (optional)
    if (usePWA) {
      run("npm install vite-plugin-pwa", projectPath);


      // Read the existing vite config
      const viteConfigPath = path.join(projectPath, `vite.config.${configExtension}`);
      let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
      
      // Add import for VitePWA
      viteConfig = `import { VitePWA } from 'vite-plugin-pwa'\n` + viteConfig;
      
      // Add VitePWA to plugins array
      if (viteConfig.includes('tailwindcss()')) {
        // If tailwind is already in plugins
        viteConfig = viteConfig.replace(
          /plugins:\s*\[\s*tailwindcss\(\)/,
          `plugins: [\n    tailwindcss(),\n    VitePWA({ \n      registerType: 'autoUpdate',\n      manifest: {\n        name: '${projectName}',\n        short_name: '${projectName}',\n        theme_color: '#ffffff',\n        icons: [\n          {\n            src: '/icon-192x192.png',\n            sizes: '192x192',\n            type: 'image/png'\n          },\n          {\n            src: '/icon-512x512.png',\n            sizes: '512x512',\n            type: 'image/png'\n          }\n        ]\n      }\n    })`
        );
      } else {
        // If no tailwind
        viteConfig = viteConfig.replace(
          /plugins:\s*\[/,
          `plugins: [\n    VitePWA({ \n      registerType: 'autoUpdate',\n      manifest: {\n        name: '${projectName}',\n        short_name: '${projectName}',\n        theme_color: '#ffffff',\n        icons: [\n          {\n            src: '/icon-192x192.png',\n            sizes: '192x192',\n            type: 'image/png'\n          },\n          {\n            src: '/icon-512x512.png',\n            sizes: '512x512',\n            type: 'image/png'\n          }\n        ]\n      }\n    })`
        );
      }
      
      fs.writeFileSync(viteConfigPath, viteConfig);
    }


    console.log(`\n✅ Project ${projectName} created successfully!`);
    if (useRouting) {
      console.log(`🔄 Routing has been set up with Home and About pages`);
    }
    console.log(`\n👉 cd ${projectName} && npm install && npm run dev`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();