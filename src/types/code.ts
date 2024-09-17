export interface CodeFile {
  [key: string]: string;
}

export interface FileContent {
  content: string;
  type: 'file';
}

export interface DirectoryContent {
  [key: string]: ProjectStructure;
  type: 'directory';
}

export type ProjectStructure = FileContent | DirectoryContent;

export interface NextJsProjectStructure {
  src: DirectoryContent & {
    components: DirectoryContent;
    app: DirectoryContent & {
      api: DirectoryContent;
      '(auth)': DirectoryContent;
      '(route)': DirectoryContent;
      layout: FileContent;
      page: FileContent;
    };
    lib: DirectoryContent;
    styles: DirectoryContent;
    utils: DirectoryContent;
    hooks: DirectoryContent;
    context: DirectoryContent;
  };
  public: DirectoryContent;
  tests: DirectoryContent;
  'package.json': FileContent;
  'tsconfig.json': FileContent;
  'next.config.js': FileContent;
  '.env.local': FileContent;
  '.gitignore': FileContent;
}

// React Project Structure
export interface ReactProjectStructure {
  src: DirectoryContent & {
    components: DirectoryContent;
    pages: DirectoryContent;
    hooks: DirectoryContent;
    context: DirectoryContent;
    utils: DirectoryContent;
    styles: DirectoryContent;
    assets: DirectoryContent;
  };
  public: DirectoryContent;
  'package.json': FileContent;
  'tsconfig.json': FileContent;
  '.env': FileContent;
  '.gitignore': FileContent;
}

// Vue.js Project Structure
export interface VueProjectStructure {
  src: DirectoryContent & {
    components: DirectoryContent;
    views: DirectoryContent;
    router: DirectoryContent;
    store: DirectoryContent;
    assets: DirectoryContent;
    utils: DirectoryContent;
  };
  public: DirectoryContent;
  'package.json': FileContent;
  'tsconfig.json': FileContent;
  'vue.config.js': FileContent;
  '.env': FileContent;
  '.gitignore': FileContent;
}

// Angular Project Structure
export interface AngularProjectStructure {
  src: DirectoryContent & {
    app: DirectoryContent & {
      components: DirectoryContent;
      services: DirectoryContent;
      models: DirectoryContent;
      directives: DirectoryContent;
      pipes: DirectoryContent;
    };
    assets: DirectoryContent;
    environments: DirectoryContent;
  };
  'angular.json': FileContent;
  'package.json': FileContent;
  'tsconfig.json': FileContent;
  '.gitignore': FileContent;
}

// Node.js Project Structure
export interface NodeProjectStructure {
  src: DirectoryContent & {
    routes: DirectoryContent;
    controllers: DirectoryContent;
    models: DirectoryContent;
    middleware: DirectoryContent;
    utils: DirectoryContent;
    config: DirectoryContent;
  };
  tests: DirectoryContent;
  'package.json': FileContent;
  'tsconfig.json': FileContent;
  '.env': FileContent;
  '.gitignore': FileContent;
}

// Django Project Structure
export interface DjangoProjectStructure {
  projectName: DirectoryContent & {
    settings: DirectoryContent;
    urls: FileContent;
    wsgi: FileContent;
    asgi: FileContent;
  };
  apps: DirectoryContent & {
    [appName: string]: DirectoryContent & {
      migrations: DirectoryContent;
      templates: DirectoryContent;
      static: DirectoryContent;
      'models.py': FileContent;
      'views.py': FileContent;
      'urls.py': FileContent;
      'admin.py': FileContent;
      'apps.py': FileContent;
      'tests.py': FileContent;
    };
  };
  templates: DirectoryContent;
  static: DirectoryContent;
  'manage.py': FileContent;
  'requirements.txt': FileContent;
  '.env': FileContent;
  '.gitignore': FileContent;
}

// Flask Project Structure
export interface FlaskProjectStructure {
  app: DirectoryContent & {
    templates: DirectoryContent;
    static: DirectoryContent;
    'routes.py': FileContent;
    'models.py': FileContent;
    'forms.py': FileContent;
    '__init__.py': FileContent;
  };
  tests: DirectoryContent;
  'config.py': FileContent;
  'run.py': FileContent;
  'requirements.txt': FileContent;
  '.env': FileContent;
  '.gitignore': FileContent;
}

export const createFile = (content: string): FileContent => ({
  content,
  type: 'file',
});

export const createDirectory = (content: Record<string, ProjectStructure>): DirectoryContent => ({
  ...content,
  type: 'directory',
});

interface SettingItem {
  uid: string;
  name: string;
  editable: "EDITABLE" | "READONLY"; 
}

export interface ProjectSettings {
  general: SettingItem[];
  development: SettingItem[];
  testing: SettingItem[];
  database: SettingItem[];
  deployment: SettingItem[];
  security: SettingItem[];
  performance: SettingItem[];
  metadata: SettingItem[];
}

export interface ProjectConfigs {
  general: {
    projectType: string[];
  };
  development: {
    language: string[];
    framework: string[];
    buildTool: string[];
    packageManager: string[];
  };
  testing: {
    framework: string[];
    e2eFramework: string[];
  };
  database: {
    type: string[];
    name: string[];
    orm: string[];
  };
  deployment: {
    platform: string[];
    cicdTool: string[];
    containerization: string[];
  };
  mobile: {
    platform: string[];
    framework: string[];
  };
  desktop: {
    framework: string[];
    targetOS: string[];
  };
  security: {
    authentication: string[];
    authorization: string[];
  };
  performance: {
    caching: string[];
    cdn: string[];
  };
  metadata: {
    developers: string[];
    status: string[];
    license: string[];
  };
}

export interface BasicSetupOptions {
  lineNumbers?: boolean;
  highlightActiveLineGutter?: boolean;
  highlightSpecialChars?: boolean;
  history?: boolean;
  foldGutter?: boolean;
  drawSelection?: boolean;
  dropCursor?: boolean;
  allowMultipleSelections?: boolean;
  indentOnInput?: boolean;
  syntaxHighlighting?: boolean;
  bracketMatching?: boolean;
  closeBrackets?: boolean;
  autocompletion?: boolean;
  rectangularSelection?: boolean;
  crosshairCursor?: boolean;
  highlightActiveLine?: boolean;
  highlightSelectionMatches?: boolean;
  closeBracketsKeymap?: boolean;
  defaultKeymap?: boolean;
  searchKeymap?: boolean;
  historyKeymap?: boolean;
  foldKeymap?: boolean;
  completionKeymap?: boolean;
  lintKeymap?: boolean;
}