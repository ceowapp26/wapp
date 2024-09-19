import { ProjectStructure } from '@/types/code';
import { createFlaskProjectStructure, createNodeProjectStructure, createAngularProjectStructure, createReactProjectStructure, createNextJsProjectStructure } from "@/constants/code";

export const generateStructurePrompt = (
  input: string,
  output: ProjectStructure,
  projectConfigs: any,
  existingStructure: ProjectStructure | null
) => {
  const structurePrompt = `
    Based on the provided input, generate a detailed project structure for a ${projectConfigs.development.framework} application. 
    The structure should include functional, production-ready code for each file and have corresponding test files in the appropriate 'tests' folders. 
    Ensure that the code provided is not just placeholders but actual, working code that adheres to best practices. 
    The goal is to provide a complete and functional project setup, including components, pages, utilities, hooks, context, and their respective tests. 
    This code is intended for production use and deployment.

    **Input:** ${input}
    **Existing Structure (if any):** ${JSON.stringify(existingStructure)}
    **Project Configs:** ${JSON.stringify(projectConfigs)}
    **Output Format:** Please ensure the output is a valid JSON object formatted as follows: ${JSON.stringify(output)}

    **Notes:**
    - Ensure the project structure aligns with best practices for ${projectConfigs.development.framework} applications.
    - Each component, page, and utility should have a corresponding test file in the 'tests' folder.
    - Generate actual, functional code for all files, not just placeholders or comments, ensuring to meet user requirements and follow best practices.
    - The output should be a valid JSON object without any syntax errors.
  `;
  return structurePrompt;
};

const getStructure = (environment, codeframework) => {
  const option = codingOptions.find(
    (codeOption) =>
      codeOption.environment === environment &&
      codeOption.codeframework === codeframework
  );
  return option ? option.structure : undefined;
};

function detectFramework(code: string): string | null {
  const frameworkIndicators = [
    {
      name: 'React',
      score: 0,
      indicators: [
        { pattern: /import\s+.*?React.*?from\s+['"]react['"]/, weight: 3 },
        { pattern: /import\s+.*?{.*?(useState|useEffect|useContext).*?}.*?from\s+['"]react['"]/, weight: 2 },
        { pattern: /extends\s+React\.Component/, weight: 3 },
        { pattern: /<.*?React\.Fragment>/, weight: 1 },
        { pattern: /ReactDOM\.render\(/, weight: 2 },
        { pattern: /jsx|tsx/, weight: 1 }
      ]
    },
    {
      name: 'Angular',
      score: 0,
      indicators: [
        { pattern: /@Component\(\s*\{/, weight: 3 },
        { pattern: /import\s+.*?@angular\/core/, weight: 3 },
        { pattern: /@Injectable\(\)/, weight: 2 },
        { pattern: /implements\s+(OnInit|AfterViewInit|OnDestroy)/, weight: 2 },
        { pattern: /constructor\(.*?private.*?:\s*.*?Service\)/, weight: 2 }
      ]
    },
    {
      name: 'Vue',
      score: 0,
      indicators: [
        { pattern: /import\s+.*?Vue.*?from\s+['"]vue['"]/, weight: 3 },
        { pattern: /new\s+Vue\(/, weight: 3 },
        { pattern: /createApp\(/, weight: 3 },
        { pattern: /@Component/, weight: 2 },
        { pattern: /export\s+default\s+{(\s|\n)*name:/, weight: 2 },
        { pattern: /<template>/, weight: 2 }
      ]
    },
    {
      name: 'Django',
      score: 0,
      indicators: [
        { pattern: /from\s+django\s+import/, weight: 3 },
        { pattern: /from\s+django\..*?\s+import/, weight: 2 },
        { pattern: /class\s+.*?\(models\.Model\)/, weight: 3 },
        { pattern: /@login_required/, weight: 2 },
        { pattern: /render\(request,/, weight: 2 }
      ]
    },
    {
      name: 'Spring',
      score: 0,
      indicators: [
        { pattern: /import\s+org\.springframework/, weight: 3 },
        { pattern: /@RestController/, weight: 3 },
        { pattern: /@Autowired/, weight: 2 },
        { pattern: /@Service/, weight: 2 },
        { pattern: /@Repository/, weight: 2 }
      ]
    },
    {
      name: 'ASP.NET',
      score: 0,
      indicators: [
        { pattern: /using\s+Microsoft\.AspNetCore/, weight: 3 },
        { pattern: /public\s+class\s+.*?\s*:\s*Controller/, weight: 3 },
        { pattern: /\[HttpGet\]/, weight: 2 },
        { pattern: /IActionResult/, weight: 2 },
        { pattern: /services\.AddControllers\(\)/, weight: 2 }
      ]
    },
    {
      name: 'NextJS',
      score: 0,
      indicators: [
        { pattern: /import\s+.*?next\//, weight: 3 },
        { pattern: /getStaticProps/, weight: 3 },
        { pattern: /getServerSideProps/, weight: 3 },
        { pattern: /useRouter\(\)/, weight: 2 },
        { pattern: /next\/link/, weight: 2 }
      ]
    }
  ];

  for (const framework of frameworkIndicators) {
    framework.score = framework.indicators.reduce((score, indicator) => {
      return score + (indicator.pattern.test(code) ? indicator.weight : 0);
    }, 0);
  }

  const detectedFramework = frameworkIndicators.reduce((max, framework) => 
    framework.score > max.score ? framework : max
  );

  return detectedFramework.score > 0 ? detectedFramework.name : null;
}

const processReactCode = (
  code: string,
  mappedRenderScopes: Record<string, string>
): { code: string; unsupportedLibraries: string[] } => {
  const importRegex = /import\s+(\w+|\{[^}]+\}|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let importMatch;
  const extractedLibraries: string[] = [];
  
  while ((importMatch = importRegex.exec(code)) !== null) {
    const [, importPart, library] = importMatch;
    if (!['React', 'react'].includes(importPart)) {
      extractedLibraries.push(library);
    }
  }

  // Check for unsupported libraries using mappedRenderScopes
  const unsupportedLibraries = extractedLibraries.filter(lib => !Object.keys(mappedRenderScopes).includes(lib));

  // Remove import statements
  code = code.replace(/^import.*$/gm, '');

  // Convert hooks to React.useHook
  const reactHooks = [
    'useState', 'useEffect', 'useContext', 'useReducer',
    'useCallback', 'useMemo', 'useRef', 'useImperativeHandle',
    'useLayoutEffect', 'useDebugValue', 'useDeferredValue',
    'useTransition', 'useId'
  ];
  const hookRegex = new RegExp(`\\b(${reactHooks.join('|')})\\b`, 'g');
  code = code.replace(hookRegex, 'React.$1');

  // Remove export statements (including export default at the end)
  code = code.replace(/^export\s+(default\s+)?/gm, '');
  code = code.replace(/;\s*\n*\s*export default \w+;?\s*$/, '');

  // Find the component name
  const componentRegex = /(?:^|\n)(?:export\s+(?:default\s+)?)?(?:const|class|function)\s+(\w+)/;
  const componentMatch = code.match(componentRegex);
  const componentName = componentMatch ? componentMatch[1] : 'Component';

  // Extract prop types from the component definition
  const propTypesRegex = new RegExp(`${componentName}\\s*=\\s*\\(\\s*\\{([^}]*)\\}`);
  const propTypesMatch = code.match(propTypesRegex);
  let propTypes = {};
  if (propTypesMatch) {
    const [, propsString] = propTypesMatch;
    propsString.split(',').forEach(prop => {
      const trimmedProp = prop.trim();
      if (trimmedProp) {
        propTypes[trimmedProp] = 'any'; // Default to 'any' type
      }
    });
  }

  // Generate prop values based on type definitions
  const propValues = Object.keys(propTypes).reduce((acc, prop) => {
    acc[prop] = `"${prop}Value"`;
    return acc;
  }, {});

  // Remove the last line if it's just the component name
  code = code.replace(/\n\s*\w+;\s*$/, '');

  // Add render line with dynamic props
  const propsString = Object.entries(propValues)
    .map(([key, value]) => `${key}={${value}}`)
    .join(' ');
  code += `\n\nrender(<${componentName} ${propsString} />)`;

  return { code, unsupportedLibraries };
};

const processVueCode = (code: string): string => {
  // Vue-specific processing logic
  return code;
};

const processPythonCode = (code: string): string => {
  // Python-specific processing logic
  return code;
};

const processGoCode = (code: string): string => {
  // Go-specific processing logic
  return code;
};

const getFileName = (fileName: string): string => {
  const extension = fileName.slice(fileName.lastIndexOf('.'));
  switch (extension) {
    case '.tsx':
    case '.ts':
      return fileName.replace(/\.tsx?$/, '');
    case '.jsx':
    case '.js':
      return fileName.replace(/\.jsx?$/, '');
    case '.vue':
      return fileName.replace(/\.vue$/, '');
    case '.py':
      return fileName.replace(/\.py$/, '');
    case '.go':
      return fileName.replace(/\.go$/, '');
    default:
      return `test_${fileName}`;
  }
};

const getTestFileName = (fileName: string): string => {
  const extension = fileName.slice(fileName.lastIndexOf('.'));
  switch (extension) {
    case '.tsx':
    case '.ts':
      return fileName.replace(/\.tsx?$/, '.test$&');
    case '.jsx':
    case '.js':
      return fileName.replace(/\.jsx?$/, '.test$&');
    case '.vue':
      return fileName.replace(/\.vue$/, '.spec.js');
    case '.py':
      return fileName.replace(/\.py$/, '_test.py');
    case '.go':
      return fileName.replace(/\.go$/, '_test.go');
    default:
      return `test_${fileName}`;
  }
};

const validateProjectStructure = (response: ProjectStructure, expectedStructure: ProjectStructure): ProjectStructure => {
  const validate = (res: any, exp: any): any => {
    if (typeof exp === 'object' && exp !== null) {
      if (exp.type === 'file') {
        return {
          content: res?.content || exp.content,
          type: 'file',
        };
      } else if (exp.type === 'directory') {
        const validatedDir: any = { type: 'directory' };
        for (const key in exp) {
          if (key !== 'type') {
            validatedDir[key] = validate(res?.[key], exp[key]);
          }
        }
        return validatedDir;
      }
    }
    return exp;
  };
  return validate(response, expectedStructure);
};

const generateProjectSchema = (framework: string) => {
  switch (framework.toLowerCase()) {
    case "react":
      return createReactProjectStructure();
    case "nextjs":
      return createNextJsProjectStructure();
    case "angular":
      return createAngularProjectStructure();
    case "node":
      return createNodeProjectStructure();
    case "flask":
      return createFlaskProjectStructure();
    default:
      throw new Error("Unsupported framework selected");
  }
};

export { 
  getStructure, 
  getFileName,
  getTestFileName,
  detectFramework, 
  processReactCode, 
  processVueCode, 
  processGoCode, 
  processPythonCode,
  validateProjectStructure, 
  generateProjectSchema,
};

