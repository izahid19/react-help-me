#!/usr/bin/env node
import inquirer from "inquirer";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const run = (cmd, cwd = process.cwd()) => {
  console.log(`\n📦 Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit", cwd });
  } catch (error) {
    console.error(`❌ Command failed: ${cmd}`);
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

(async () => {
  try {
    console.log("⚡ React Help Me - Skip the Setup, Start Building!");
    console.log("🔥 Your React project, configured perfectly, in under 60 seconds\n");

    // Step 1: Project name
    const { projectName } = await inquirer.prompt([
      { 
        type: "input", 
        name: "projectName", 
        message: "Enter project name:",

        
        validate: (input) => {
          if (!input) return "Project name is required!";
          if (input.match(/[^a-zA-Z0-9-_]/)) return "Project name should only contain letters, numbers, hyphens, and underscores";
          return true;
        }
      },
    ]);

    // Check if directory already exists
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      console.error(`❌ Directory '${projectName}' already exists!`);
      process.exit(1);
    }

    // Step 2: Language choice
    const { language } = await inquirer.prompt([
      {
        type: "list",
        name: "language",
        message: "Which language do you want to use?",
        choices: ["JavaScript", "TypeScript"],
      },
    ]);

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

    console.log("\n🚀 Creating your React project...\n");

    // Create project directory manually instead of using npm create vite
    console.log("📁 Creating project structure...");
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'public'), { recursive: true });

    // Create package.json
    const packageJson = {
      name: projectName,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        preview: "vite preview"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@vitejs/plugin-react": "^4.2.1",
        "eslint": "^8.55.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.5",
        "typescript": "^5.2.2",
        "vite": "^5.0.8"
      }
    };

    // Remove TypeScript dependencies if not using TypeScript
    if (language === "JavaScript") {
      delete packageJson.devDependencies["@types/react"];
      delete packageJson.devDependencies["@types/react-dom"];
      delete packageJson.devDependencies["typescript"];
    }

    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create index.html
    const indexHtmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    ${cssFramework === "Bootstrap (CDN)" ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">' : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${configExtension}x"></script>
  </body>
</html>`;

    fs.writeFileSync(path.join(projectPath, 'index.html'), indexHtmlContent);

    // Create Vite config
    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

    fs.writeFileSync(
      path.join(projectPath, `vite.config.${configExtension}`),
      viteConfigContent
    );

    // Create main file
    const mainContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${fileExtension}'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    fs.writeFileSync(
      path.join(projectPath, `src/main.${configExtension}x`),
      mainContent
    );

    // Create TypeScript config if using TypeScript
    if (language === "TypeScript") {
      const tsConfigContent = {
        "compilerOptions": {
          "target": "ES2020",
          "useDefineForClassFields": true,
          "lib": ["ES2020", "DOM", "DOM.Iterable"],
          "module": "ESNext",
          "skipLibCheck": true,
          "moduleResolution": "bundler",
          "allowImportingTsExtensions": true,
          "resolveJsonModule": true,
          "isolatedModules": true,
          "noEmit": true,
          "jsx": "react-jsx",
          "strict": true,
          "noUnusedLocals": true,
          "noUnusedParameters": true,
          "noFallthroughCasesInSwitch": true
        },
        "include": ["src"],
        "references": [{ "path": "./tsconfig.node.json" }]
      };

      fs.writeFileSync(
        path.join(projectPath, 'tsconfig.json'),
        JSON.stringify(tsConfigContent, null, 2)
      );

      const tsConfigNodeContent = {
        "compilerOptions": {
          "composite": true,
          "skipLibCheck": true,
          "module": "ESNext",
          "moduleResolution": "bundler",
          "allowSyntheticDefaultImports": true
        },
        "include": ["vite.config.ts"]
      };

      fs.writeFileSync(
        path.join(projectPath, 'tsconfig.node.json'),
        JSON.stringify(tsConfigNodeContent, null, 2)
      );
    }

    console.log("✅ Base project created successfully!");

    // Minimal index.css if not using Tailwind
    if (cssFramework !== "Tailwind CSS") {
      fs.writeFileSync(
        path.join(projectPath, "src/index.css"),
        `body { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}`
      );
    }

    // Step 7: CSS framework installs/configs
    if (cssFramework === "Tailwind CSS") {
      console.log("📦 Installing Tailwind CSS...");
      run(`npm install tailwindcss @tailwindcss/vite`, projectPath);

      let viteConfig = fs.readFileSync(path.join(projectPath, `vite.config.${configExtension}`), "utf-8");
      viteConfig = `import tailwindcss from '@tailwindcss/vite'\n` + viteConfig;
      viteConfig = viteConfig.replace(
        /plugins:\s*\[([^\]]*)\]/,
        "plugins: [$1, tailwindcss()]"
      );
      fs.writeFileSync(path.join(projectPath, `vite.config.${configExtension}`), viteConfig);

      fs.writeFileSync(
        path.join(projectPath, "src", "index.css"),
        `@import "tailwindcss";\n`
      );
      console.log("✅ Tailwind CSS configured!");
    }

    if (cssFramework === "React Bootstrap") {
      console.log("📦 Installing React Bootstrap...");
      run("npm install react-bootstrap bootstrap", projectPath);
      console.log("✅ React Bootstrap installed!");
    }

    // Step 8: Routing
    if (useRouting) {
      console.log("📦 Installing React Router...");
      run("npm install react-router-dom", projectPath);
      console.log("✅ React Router installed!");
    }

    // Step 9: Optional packages
    if (packages.length > 0) {
      console.log(`📦 Installing optional packages: ${packages.join(", ")}...`);
      run(`npm install ${packages.join(" ")}`, projectPath);
      console.log("✅ Optional packages installed!");
    }

    // Step 10: Axios setup
    if (packages.includes("axios")) {
      const axiosExt = language === "TypeScript" ? "ts" : "js";
      const utilsPath = path.join(projectPath, "src/utils");
      fs.mkdirSync(utilsPath, { recursive: true });
      const axiosContent = language === "TypeScript" 
        ? `import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);`
        : `import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});`;
      fs.writeFileSync(path.join(utilsPath, `axios.${axiosExt}`), axiosContent);
      console.log("✅ Axios configuration created!");
    }

    // Step 11: Folder structure
    const folders = ["src/components", "src/hooks", "src/utils", "src/assets"];
    if (useRouting) folders.push("src/pages");
    folders.forEach((folder) => {
      fs.mkdirSync(path.join(projectPath, folder), { recursive: true });
      console.log(`📁 Created ${folder}/`);
    });

    // Step 12: Example pages (routing only)
    if (useRouting) {
      const homeContent = `export default function Home() {
  return (
    <div className="${cssFramework === "Tailwind CSS"
      ? "min-h-screen flex flex-col items-center justify-center bg-gray-100"
      : cssFramework.includes("Bootstrap")
      ? "min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light"
      : ""}">
      <h1>Home Page</h1>
      <p>Welcome to ${projectName}</p>
    </div>
  );
}`;
      const aboutContent = `export default function About() {
  return (
    <div className="${cssFramework === "Tailwind CSS"
      ? "min-h-screen flex flex-col items-center justify-center bg-gray-100"
      : cssFramework.includes("Bootstrap")
      ? "min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light"
      : ""}">
      <h1>About Page</h1>
      <p>This is the about page for ${projectName}</p>
    </div>
  );
}`;
      fs.writeFileSync(path.join(projectPath, `src/pages/Home.${fileExtension}`), homeContent);
      fs.writeFileSync(path.join(projectPath, `src/pages/About.${fileExtension}`), aboutContent);
      console.log("✅ Route components created!");
    }

    // Step 13: Create new App component
    console.log("📝 Creating App component...");

    const appContent = language === "TypeScript" 
      ? `import React from 'react'${useRouting ? '\nimport { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"' : ''}${cssFramework === "React Bootstrap" ? '\nimport "bootstrap/dist/css/bootstrap.min.css";' : ''}${useRouting ? `\nimport Home from "./pages/Home"\nimport About from "./pages/About"` : ''}

function App() {
  return (
    <div className="${cssFramework === "Tailwind CSS" ? "min-h-screen bg-gray-100" : cssFramework.includes("Bootstrap") ? "min-vh-100 bg-light" : ""}">
      ${useRouting ? `<Router>
        <nav className="${cssFramework === "Tailwind CSS" ? "bg-white shadow-sm py-4" : cssFramework.includes("Bootstrap") ? "navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3" : ""}">
          <div className="${cssFramework === "Tailwind CSS" ? "container mx-auto flex gap-4" : cssFramework.includes("Bootstrap") ? "container" : ""}">
            <Link to="/" className="${cssFramework === "Tailwind CSS" ? "text-blue-600 hover:text-blue-800 font-medium" : cssFramework.includes("Bootstrap") ? "navbar-brand text-primary fw-bold" : ""}">Home</Link>
            <Link to="/about" className="${cssFramework === "Tailwind CSS" ? "text-blue-600 hover:text-blue-800 font-medium" : cssFramework.includes("Bootstrap") ? "nav-link text-primary" : ""}">About</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>` : `<div className="${cssFramework === "Tailwind CSS" ? "min-h-screen flex items-center justify-center" : cssFramework.includes("Bootstrap") ? "min-vh-100 d-flex align-items-center justify-content-center" : ""}">
        <h1 className="${cssFramework === "Tailwind CSS" ? "text-4xl font-bold text-gray-800" : cssFramework.includes("Bootstrap") ? "display-4 text-dark" : ""}">Welcome to ${projectName}</h1>
      </div>`}
    </div>
  );
}

export default App;`
      : `import React from 'react'${useRouting ? '\nimport { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"' : ''}${cssFramework === "React Bootstrap" ? '\nimport "bootstrap/dist/css/bootstrap.min.css";' : ''}${useRouting ? `\nimport Home from "./pages/Home"\nimport About from "./pages/About"` : ''}

function App() {
  return (
    <div className="${cssFramework === "Tailwind CSS" ? "min-h-screen bg-gray-100" : cssFramework.includes("Bootstrap") ? "min-vh-100 bg-light" : ""}">
      ${useRouting ? `<Router>
        <nav className="${cssFramework === "Tailwind CSS" ? "bg-white shadow-sm py-4" : cssFramework.includes("Bootstrap") ? "navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3" : ""}">
          <div className="${cssFramework === "Tailwind CSS" ? "container mx-auto flex gap-4" : cssFramework.includes("Bootstrap") ? "container" : ""}">
            <Link to="/" className="${cssFramework === "Tailwind CSS" ? "text-blue-600 hover:text-blue-800 font-medium" : cssFramework.includes("Bootstrap") ? "navbar-brand text-primary fw-bold" : ""}">Home</Link>
            <Link to="/about" className="${cssFramework === "Tailwind CSS" ? "text-blue-600 hover:text-blue-800 font-medium" : cssFramework.includes("Bootstrap") ? "nav-link text-primary" : ""}">About</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>` : `<div className="${cssFramework === "Tailwind CSS" ? "min-h-screen flex items-center justify-center" : cssFramework.includes("Bootstrap") ? "min-vh-100 d-flex align-items-center justify-content-center" : ""}">
        <h1 className="${cssFramework === "Tailwind CSS" ? "text-4xl font-bold text-gray-800" : cssFramework.includes("Bootstrap") ? "display-4 text-dark" : ""}">Welcome to ${projectName}</h1>
      </div>`}
    </div>
  );
}

export default App;`;

    fs.writeFileSync(path.join(projectPath, `src/App.${fileExtension}`), appContent);
    console.log("✅ App component created!");

    console.log(`\n🎉 Project ${projectName} created successfully!`);

    // Final npm install
    console.log("\n📦 Installing dependencies...");
    run("npm install", projectPath);

    // Ask to start dev server
    const { startNow } = await inquirer.prompt([
      {
        type: "confirm",
        name: "startNow",
        message: "Do you want to start the dev server now?",
        default: false,
      },
    ]);

    if (startNow) {
      console.log("\n🚀 Starting dev server...");
      run("npm run dev", projectPath);
    } else {
      console.log(`\n👉 Next steps:`);
      console.log(`   cd ${projectName}`);
      console.log(`   npm run dev`);
      console.log(`\n🚀 Happy coding!`);
    }

  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    process.exit(1);
  }
})();