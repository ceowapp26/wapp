import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Play, RefreshCw, Code, TestTube } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileInterface } from '@/types/chat';

const CodeEditor = dynamic(() => import('./code-editor'), { ssr: false });

interface TestResult {
  passed: boolean;
  output: string;
}

interface ComponentEditorProps {
  componentName: string;
  code: string;
  test: string;
  isGenerating: boolean;
  isShowEditor?: boolean;
  isShowChatbot?: boolean;
  updateCode?: (path?: string, newCode: string) => void;
  onRunTests: () => void;
  onRegenerate: () => void;
  testResults: TestResult | null;
  onRunIntegrationTests: () => void;
  integrationTestResults: TestResult | null;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  currentComponent?: string;
  setCurrentComponent?: Dispatch<SetStateAction<string>>;
  handleReplaceCode?: (content: string) => void;
  handleInsertAboveCode?: (content: string) => void;
  handleInsertBelowCode?: (content: string) => void;
  handleInsertLeftCode?: (content: string) => void;
  handleInsertRightCode?: (content: string) => void;
  handleOnInsert?: (content: string) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  componentName,
  code,
  test,
  isShowEditor,
  isShowChatbot,
  isGenerating,
  onRunTests,
  onRegenerate,
  testResults,
  currentComponent,
  updateCode,
  onRunIntegrationTests,
  integrationTestResults,
  setCurrentCodeFile,
  setCurrentEmbeddedFile,
  setCurrentComponent,
  handleReplaceCode,
  handleInsertLeftCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertRightCode,
  handleOnInsert,
}) => {
  const [activeTab, setActiveTab] = useState('component');

  return (
    <Card className="mt-6 w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold truncate flex items-center">
          <Code className="mr-2" />
          {componentName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="component">Component Code</TabsTrigger>
            <TabsTrigger value="test">Test Code</TabsTrigger>
            <TabsTrigger value="integration">Integration Tests</TabsTrigger>
          </TabsList>
          <TabsContent value="component">
            <CodeEditor
              content={code}
              setContent={updateCode}
              currentComponent={currentComponent}
              setCurrentComponent={setCurrentComponent}
              setCurrentEmbeddedFile={setCurrentEmbeddedFile}
              setCurrentCodeFile={setCurrentCodeFile}
              handleReplaceCode={handleReplaceCode}
              handleInsertAboveCode={handleInsertAboveCode}
              handleInsertBelowCode={handleInsertBelowCode}
              handleInsertLeftCode={handleInsertLeftCode}
              handleInsertRightCode={handleInsertRightCode}
              handleOnInsert={handleOnInsert}
              isShowEditor={isShowEditor}
              isShowChatbot={isShowChatbot}
              className="min-h-[300px] border rounded-md"
            />
          </TabsContent>
          <TabsContent value="test">
            <CodeEditor
              content={test}
              currentComponent={currentComponent}
              setContent={updateCode}
              setCurrentComponent={setCurrentComponent}
              setCurrentEmbeddedFile={setCurrentEmbeddedFile}
              setCurrentCodeFile={setCurrentCodeFile}
              handleReplaceCode={handleReplaceCode}
              handleInsertAboveCode={handleInsertAboveCode}
              handleInsertBelowCode={handleInsertBelowCode}
              handleInsertLeftCode={handleInsertLeftCode}
              handleInsertRightCode={handleInsertRightCode}
              handleOnInsert={handleOnInsert}
              isShowEditor={isShowEditor}
              isShowChatbot={isShowChatbot}
              className="min-h-[300px] border rounded-md"
            />
          </TabsContent>
          <TabsContent value="integration">
            <Card className="mt-4">
              <CardContent>
                <h3 className="font-bold mb-2">Integration Tests</h3>
                <Button 
                  onClick={onRunIntegrationTests}
                  disabled={isGenerating}
                  className="mb-4"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Run Integration Tests
                </Button>
                {integrationTestResults && (
                  <Alert className={`mt-4 ${integrationTestResults.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                    <TestTube className={`h-4 w-4 ${integrationTestResults.passed ? 'text-green-500' : 'text-red-500'}`} />
                    <AlertTitle className={integrationTestResults.passed ? 'text-green-700' : 'text-red-700'}>
                      {integrationTestResults.passed ? 'Integration Tests Passed' : 'Integration Tests Failed'}
                    </AlertTitle>
                    <AlertDescription>
                      <pre className="mt-2 whitespace-pre-wrap text-sm">
                        {integrationTestResults.output}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button
            onClick={onRunTests}
            disabled={isGenerating}
            className="bg-green-500 hover:bg-green-600"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run Tests
          </Button>
          <Button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Regenerate Component
          </Button>
        </div>

        {testResults && (
          <Alert className={`mt-4 ${testResults.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <TestTube className={`h-4 w-4 ${testResults.passed ? 'text-green-500' : 'text-red-500'}`} />
            <AlertTitle className={testResults.passed ? 'text-green-700' : 'text-red-700'}>
              {testResults.passed ? 'Tests Passed' : 'Tests Failed'}
            </AlertTitle>
            <AlertDescription>
              <pre className="mt-2 whitespace-pre-wrap text-sm">
                {testResults.output}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentEditor;


