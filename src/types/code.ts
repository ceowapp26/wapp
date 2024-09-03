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
