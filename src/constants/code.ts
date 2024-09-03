import { ReactProjectStructure, NextJsProjectStructure, VueProjectStructure, AngularProjectStructure, NodeProjectStructure, FlaskProjectStructure, createFile, createDirectory } from '@/types/code';

export const createNextJsProjectStructure = (): NextJsProjectStructure => ({
  src: createDirectory({
    components: createDirectory({
      Header: createFile('// Header component code'),
      Footer: createFile('// Footer component code'),
    }),
    app: createDirectory({
      api: createDirectory({
        'hello.ts': createFile('// API route code'),
      }),
      '(auth)': createDirectory({
        'login': createDirectory({
          'page.tsx': createFile('// Login page code'),
        }),
        'register': createDirectory({
          'page.tsx': createFile('// Register page code'),
        }),
      }),
      '(route)': createDirectory({
        'dashboard': createDirectory({
          'page.tsx': createFile('// Dashboard page code'),
        }),
        'profile': createDirectory({
          'page.tsx': createFile('// Profile page code'),
        }),
      }),
      layout: createFile('// Root layout code'),
      page: createFile('// Home page code'),
    }),
    lib: createDirectory({
      'db.ts': createFile('// Database connection code'),
    }),
    styles: createDirectory({
      'globals.css': createFile('/* Global styles */'),
    }),
    utils: createDirectory({
      'helpers.ts': createFile('// Helper functions'),
    }),
    hooks: createDirectory({
      'useAuth.ts': createFile('// Custom auth hook'),
    }),
    context: createDirectory({
      'AuthContext.tsx': createFile('// Auth context code'),
    }),
  }),
  public: createDirectory({
    'favicon.ico': createFile('// Favicon file content'),
  }),
  tests: createDirectory({
    'index.test.tsx': createFile('// Test for index page'),
  }),
  'package.json': createFile('{ "name": "next-project", "version": "1.0.0" }'),
  'tsconfig.json': createFile('{ "compilerOptions": { ... } }'),
  'next.config.js': createFile('module.exports = { ... }'),
  '.env.local': createFile('DATABASE_URL=...'),
  '.gitignore': createFile('node_modules\n.next\n.env.local'),
});

export const createReactProjectStructure = (): ReactProjectStructure => ({
  src: createDirectory({
    components: createDirectory({
      'Header.tsx': createFile('// Header component code'),
      'Footer.tsx': createFile('// Footer component code'),
    }),
    pages: createDirectory({
      'Home.tsx': createFile('// Home page component'),
      'About.tsx': createFile('// About page component'),
    }),
    hooks: createDirectory({
      'useAuth.ts': createFile('// Custom auth hook'),
    }),
    context: createDirectory({
      'AuthContext.tsx': createFile('// Auth context code'),
    }),
    utils: createDirectory({
      'api.ts': createFile('// API utility functions'),
    }),
    styles: createDirectory({
      'index.css': createFile('/* Global styles */'),
    }),
    'App.tsx': createFile('// Main App component'),
    'index.tsx': createFile('// Entry point'),
  }),
  public: createDirectory({
    'index.html': createFile('<!DOCTYPE html>...'),
    'favicon.ico': createFile('// Favicon file content'),
  }),
  tests: createDirectory({
    components: createDirectory({
      'Header.test.tsx': createFile('// Header component tests'),
      'Footer.test.tsx': createFile('// Footer component tests'),
    }),
    pages: createDirectory({
      'Home.test.tsx': createFile('// Home page tests'),
      'About.test.tsx': createFile('// About page tests'),
    }),
    hooks: createDirectory({
      'useAuth.test.ts': createFile('// useAuth hook tests'),
    }),
    utils: createDirectory({
      'api.test.ts': createFile('// API utility function tests'),
    }),
  }),
  'package.json': createFile('{ "name": "react-project", "version": "1.0.0" }'),
  'tsconfig.json': createFile('{ "compilerOptions": { ... } }'),
  '.env': createFile('REACT_APP_API_URL=...'),
  '.gitignore': createFile('node_modules\nbuild\n.env'),
});

export const createVueProjectStructure = (): VueProjectStructure => ({
  src: createDirectory({
    components: createDirectory({
      'Header.vue': createFile('<!-- Header component code -->'),
      'Footer.vue': createFile('<!-- Footer component code -->'),
    }),
    views: createDirectory({
      'Home.vue': createFile('<!-- Home view code -->'),
      'About.vue': createFile('<!-- About view code -->'),
    }),
    router: createDirectory({
      'index.ts': createFile('// Vue Router configuration'),
    }),
    store: createDirectory({
      'index.ts': createFile('// Vuex store configuration'),
    }),
    assets: createDirectory({
      'logo.png': createFile('// Logo file content'),
    }),
    'App.vue': createFile('<!-- Main App component -->'),
    'main.ts': createFile('// Entry point'),
  }),
  public: createDirectory({
    'index.html': createFile('<!DOCTYPE html>...'),
    'favicon.ico': createFile('// Favicon file content'),
  }),
  tests: createDirectory({
    unit: createDirectory({
      components: createDirectory({
        'Header.spec.ts': createFile('// Header component unit tests'),
        'Footer.spec.ts': createFile('// Footer component unit tests'),
      }),
      views: createDirectory({
        'Home.spec.ts': createFile('// Home view unit tests'),
        'About.spec.ts': createFile('// About view unit tests'),
      }),
    }),
    e2e: createDirectory({
      'home.spec.ts': createFile('// Home page e2e tests'),
      'about.spec.ts': createFile('// About page e2e tests'),
    }),
  }),
  'package.json': createFile('{ "name": "vue-project", "version": "1.0.0" }'),
  'tsconfig.json': createFile('{ "compilerOptions": { ... } }'),
  'vue.config.js': createFile('module.exports = { ... }'),
  '.env': createFile('VUE_APP_API_URL=...'),
  '.gitignore': createFile('node_modules\ndist\n.env'),
});

export const createAngularProjectStructure = (): AngularProjectStructure => ({
  src: createDirectory({
    app: createDirectory({
      components: createDirectory({
        header: createDirectory({
          'header.component.ts': createFile('// Header component code'),
          'header.component.html': createFile('<!-- Header template -->'),
          'header.component.css': createFile('/* Header styles */'),
          'header.component.spec.ts': createFile('// Header component tests'),
        }),
        footer: createDirectory({
          'footer.component.ts': createFile('// Footer component code'),
          'footer.component.html': createFile('<!-- Footer template -->'),
          'footer.component.css': createFile('/* Footer styles */'),
          'footer.component.spec.ts': createFile('// Footer component tests'),
        }),
      }),
      services: createDirectory({
        'auth.service.ts': createFile('// Auth service code'),
        'auth.service.spec.ts': createFile('// Auth service tests'),
      }),
      models: createDirectory({
        'user.model.ts': createFile('// User model interface'),
      }),
      'app.component.ts': createFile('// Main app component'),
      'app.component.html': createFile('<!-- Main app template -->'),
      'app.component.css': createFile('/* Main app styles */'),
      'app.component.spec.ts': createFile('// Main app component tests'),
      'app.module.ts': createFile('// Main app module'),
      'app-routing.module.ts': createFile('// App routing module'),
    }),
    assets: createDirectory({
      'logo.png': createFile('// Logo file content'),
    }),
    environments: createDirectory({
      'environment.ts': createFile('// Development environment settings'),
      'environment.prod.ts': createFile('// Production environment settings'),
    }),
    'index.html': createFile('<!DOCTYPE html>...'),
    'main.ts': createFile('// Main entry point'),
    'styles.css': createFile('/* Global styles */'),
  }),
  e2e: createDirectory({
    src: createDirectory({
      'app.e2e-spec.ts': createFile('// App e2e tests'),
      'app.po.ts': createFile('// App page object for e2e tests'),
    }),
    'protractor.conf.js': createFile('// Protractor configuration for e2e tests'),
  }),
  'angular.json': createFile('{ "projects": { ... } }'),
  'package.json': createFile('{ "name": "angular-project", "version": "1.0.0" }'),
  'tsconfig.json': createFile('{ "compilerOptions": { ... } }'),
  '.gitignore': createFile('node_modules\ndist\n.env'),
});

export const createNodeProjectStructure = (): NodeProjectStructure => ({
  src: createDirectory({
    routes: createDirectory({
      'auth.ts': createFile('// Auth routes'),
      'users.ts': createFile('// User routes'),
    }),
    controllers: createDirectory({
      'authController.ts': createFile('// Auth controller logic'),
      'userController.ts': createFile('// User controller logic'),
    }),
    models: createDirectory({
      'User.ts': createFile('// User model definition'),
    }),
    middleware: createDirectory({
      'auth.ts': createFile('// Auth middleware'),
    }),
    utils: createDirectory({
      'database.ts': createFile('// Database connection utility'),
    }),
    config: createDirectory({
      'config.ts': createFile('// Configuration settings'),
    }),
    'app.ts': createFile('// Express app setup'),
    'server.ts': createFile('// Server entry point'),
  }),
  tests: createDirectory({
    'auth.test.ts': createFile('// Auth tests'),
    'users.test.ts': createFile('// User tests'),
  }),
  'package.json': createFile('{ "name": "node-project", "version": "1.0.0" }'),
  'tsconfig.json': createFile('{ "compilerOptions": { ... } }'),
  '.env': createFile('DATABASE_URL=...\nJWT_SECRET=...'),
  '.gitignore': createFile('node_modules\ndist\n.env'),
});

export const createFlaskProjectStructure = (): FlaskProjectStructure => ({
  app: createDirectory({
    templates: createDirectory({
      'base.html': createFile('<!-- Base template -->'),
      'index.html': createFile('<!-- Index template -->'),
    }),
    static: createDirectory({
      css: createDirectory({
        'main.css': createFile('/* Main styles */'),
      }),
      js: createDirectory({
        'main.js': createFile('// Main JavaScript'),
      }),
    }),
    'routes.py': createFile('# Route definitions'),
    'models.py': createFile('# Database models'),
    'forms.py': createFile('# Form definitions'),
    '__init__.py': createFile('# App initialization'),
  }),
  tests: createDirectory({
    'test_routes.py': createFile('# Route tests'),
    'test_models.py': createFile('# Model tests'),
  }),
  'config.py': createFile('# Configuration settings'),
  'run.py': createFile('# Application entry point'),
  'requirements.txt': createFile('Flask==2.0.1\n...'),
  '.env': createFile('FLASK_APP=run.py\nFLASK_ENV=development'),
  '.gitignore': createFile('*.pyc\n__pycache__\n.env\nvenv/'),
});

export const PROJECT_CONFIG_OPTIONS = {
  general: {
    projectType: ['web', 'mobile', 'desktop'],
  },
  development: {
    language: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#'],
    framework: ['React', 'Angular', 'Vue', 'Django', 'Spring', 'ASP.NET', 'NextJS'],
    buildTool: ['Webpack', 'Rollup', 'Parcel', 'Maven', 'Gradle'],
    packageManager: ['npm', 'yarn', 'pnpm', 'pip', 'Maven'],
  },
  testing: {
    framework: ['Jest', 'Mocha', 'Jasmine', 'PyTest', 'JUnit'],
    e2eFramework: ['Cypress', 'Selenium', 'Puppeteer', 'TestCafe'],
  },
  database: {
    type: ['SQL', 'NoSQL'],
    name: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra', 'Redis'],
    orm: ['Sequelize', 'TypeORM', 'Mongoose', 'Hibernate'],
  },
  deployment: {
    platform: ['AWS', 'Azure', 'Google Cloud', 'Heroku'],
    cicdTool: ['GitHub Actions', 'Jenkins', 'CircleCI', 'GitLab CI'],
    containerization: ['Docker', 'Kubernetes', 'None'],
  },
  mobile: {
    platform: ['iOS', 'Android'],
    framework: ['React Native', 'Flutter', 'Xamarin', 'Native'],
  },
  desktop: {
    framework: ['Electron', 'Qt', 'WPF', 'JavaFX'],
    targetOS: ['Windows', 'macOS', 'Linux'],
  },
  security: {
    authentication: ['JWT', 'OAuth', 'OpenID Connect'],
    authorization: ['RBAC', 'ABAC', 'Custom'],
  },
  performance: {
    caching: ['Redis', 'Memcached', 'In-Memory'],
    cdn: ['Cloudflare', 'Akamai', 'AWS CloudFront'],
  },
  metadata: {
    developers: [],
    status: ['Planning', 'In Development', 'Testing', 'Deployed', 'Maintenance'],
    license: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'Proprietary'],
  },
};

export const PROJECT_SETTINGS = {
  general: [
    { uid: "projectName", name: "Project Name", editable: "EDITABLE", sortable: true },
    { uid: "version", name: "Version", editable: "EDITABLE" },
    { uid: "description", name: "Description", editable: "EDITABLE" },
    { uid: "actions", name: "Actions", editable: "READONLY" },
  ],
  development: [
    { uid: "language", name: "Language", editable: "READONLY" },
    { uid: "framework", name: "Framework", editable: "READONLY" },
    { uid: "buildTool", name: "Build Tool", editable: "READONLY" },
    { uid: "packageManager", name: "Package Manager", editable: "READONLY" },
  ],
  testing: [
    { uid: "framework", name: "Framework", editable: "READONLY" },
    { uid: "e2eFramework", name: "E2E Framework", editable: "READONLY" },
  ],
  database: [
    { uid: "type", name: "Type", editable: "READONLY" },
    { uid: "name", name: "Name", editable: "READONLY" },
    { uid: "orm", name: "ORM", editable: "READONLY" },
  ],
  deployment: [
    { uid: "platform", name: "Platform", editable: "READONLY" },
    { uid: "cicdTool", name: "CI/CD Tool", editable: "READONLY" },
    { uid: "containerization", name: "Containerization", editable: "READONLY" },
  ],
  security: [
    { uid: "authentication", name: "Authentication", editable: "READONLY" },
    { uid: "authorization", name: "Authorization", editable: "READONLY" },
  ],
  performance: [
    { uid: "caching", name: "Caching", editable: "READONLY" },
    { uid: "cdn", name: "CDN", editable: "READONLY" },
  ],
  metadata: [
    { uid: "developers", name: "Developers", editable: "READONLY" },
    { uid: "status", name: "Status", editable: "READONLY" },
    { uid: "license", name: "License", editable: "READONLY" },
  ],
};
