import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { X, Code, Play, Trash2 } from 'lucide-react';
import * as Babel from "@babel/standalone";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/python/python";
import "codemirror/mode/php/php";
import "codemirror/mode/r/r";
import "codemirror/mode/clike/clike";
import "codemirror/theme/dracula.css";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import r from 'highlight.js/lib/languages/r';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import styled from "@emotion/styled";
import { NodeViewWrapper } from "@tiptap/react";

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);
hljs.registerLanguage('php', php);
hljs.registerLanguage('r', r);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('java', java);

const codeLanguages = [
  { name: "HTML/CSS/JS", mode: "htmlmixed", hljs: "html" },
  { name: "JavaScript", mode: "javascript", hljs: "javascript" },
  { name: "TypeScript", mode: "typescript", hljs: "typescript" },
  { name: "Python", mode: "python", hljs: "python" },
  { name: "PHP", mode: "php", hljs: "php" },
  { name: "R", mode: "r", hljs: "r" },
  { name: "C++", mode: "text/x-c++src", hljs: "cpp" },
  { name: "Java", mode: "text/x-java", hljs: "java" },
];

const StyleWrapper = styled(NodeViewWrapper)`
  margin: 2rem 0;
  background-color: #282a36;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
  background-color: ${props => props.primary ? '#50fa7b' : '#ff5555'};
  color: #282a36;

  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? '#5af78e' : '#ff6e6e'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditorContainer = styled.div`
  background-color: #282a36;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const EditorHeader = styled.div`
  background-color: #44475a;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LanguageSelect = styled.select`
  background-color: #6272a4;
  color: #f8f8f2;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 14px;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(98, 114, 164, 0.5);
  }
`;

const RunButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #50fa7b;
  color: #282a36;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5af78e;
  }
`;

const OutputContainer = styled.div`
  background-color: #44475a;
  padding: 1rem;
  border-top: 1px solid #6272a4;
`;

const OutputHeader = styled.h3`
  color: #f8f8f2;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ClearButton = styled.button`
  background-color: #ff5555;
  color: #f8f8f2;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff6e6e;
  }
`;

const OutputItem = styled.div`
  background-color: #282a36;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  position: relative;
  color: #f8f8f2;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: transparent;
  border: none;
  color: #6272a4;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ff5555;
  }
`;

const detectLanguage = (code) => {
  if (!code) {
    return "htmlmixed";
  }
  const detected = hljs.highlightAuto(code, codeLanguages.map(lang => lang.hljs));
  const matchedLang = codeLanguages.find(lang => lang.hljs === detected.language);
  return matchedLang ? matchedLang.mode : "htmlmixed";
};

const CodeEditorNode = () => {
  const initialContent = `console.log("Hello world")`;
  const [language, setLanguage] = useState("htmlmixed");
  const [content, setContent] = useState(initialContent);
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    const detectedLang = detectLanguage(initialContent);
    setLanguage(detectedLang);
    setContent(initialContent);
  }, [initialContent]);

  const handleRunCode = () => {
    runCode(content, language);
  };

  const runCode = (code, lang) => {
    const consoleLog = [];

    if (lang === "htmlmixed") {
      const newOutput = `<div>${code}</div>`;
      setOutputs(prevOutputs => [...prevOutputs, newOutput]);
    } else if (lang === "javascript") {
      try {
        const transformedCode = Babel.transform(code, { presets: ["react", "es2015"] }).code;
        const newOutput = `<div>${transformedCode}</div>`;
        setOutputs(prevOutputs => [...prevOutputs, newOutput]);
      } catch (error) {
        console.error('Error compiling JavaScript:', error);
        setOutputs(prevOutputs => [...prevOutputs, `Error compiling JavaScript: ${error.message}`]);
      }
    } else if (lang === "typescript") {
      try {
        const transformedCode = Babel.transform(code, {
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }).code;
        const newOutput = `<div>${transformedCode}</div>`;
        setOutputs(prevOutputs => [...prevOutputs, newOutput]);
      } catch (error) {
        console.error('Error compiling TypeScript code:', error);
        setOutputs(prevOutputs => [...prevOutputs, `Error compiling TypeScript code: ${error.message}`]);
      } 
    } else {
      const newOutput = `
        <pre>${code}</pre>
        <div>Output for ${lang} would appear here if executed on a server.</div>
      `;
      setOutputs(prevOutputs => [...prevOutputs, newOutput]);
    }
  };

  const handleRemoveOutput = (index) => {
    setOutputs(prevOutputs => prevOutputs.filter((_, i) => i !== index));
  };

  const handleClearAllOutputs = () => {
    setOutputs([]);
  };

  return (
      <StyleWrapper as="figure" data-drag-handle="true">
       <EditorContainer>
        <EditorHeader>
          <LanguageSelect 
            onChange={(e) => setLanguage(e.target.value)} 
            value={language}
          >
            {codeLanguages.map((lang) => (
              <option key={lang.mode} value={lang.mode}>
                {lang.name}
              </option>
            ))}
          </LanguageSelect>
        </EditorHeader>
        <CodeMirror
          value={content}
          onBeforeChange={(editor, data, value) => {
            setContent(value);
          }}
          options={{
            lineNumbers: true,
            mode: language,
            theme: "dracula",
            scrollbarStyle: null,
          }}
        />
        <OutputContainer>
          <OutputHeader>
            <div className="flex items-center ml-2">
              <Code size={24} className="mr-2 font-bold" />
              Console Outputs
            </div>
            <div className="flex items-center gap-x-6">
              <Button primary onClick={handleRunCode}>
                <Play size={18} className="mr-2" />
                Run Code
              </Button>
              <Button onClick={handleClearAllOutputs}>
                <Trash2 size={18} className="mr-2" />
                Clear All
              </Button>
            </div>
          </OutputHeader>
          {outputs.map((output, index) => (
            <OutputItem key={index}>
              <RemoveButton onClick={() => handleRemoveOutput(index)}>
                <X size={16} />
              </RemoveButton>
              <div dangerouslySetInnerHTML={{ __html: output }} />
            </OutputItem>
          ))}
        </OutputContainer>
      </EditorContainer>
    </StyleWrapper>
  );
};

const CodeEditorNodeOptions = {
  name: "CodeEditorNode",
  tag: "code-editor-node",
  component: CodeEditorNode,
  atom: false,
  draggable: true,
  attributes: {
    content: {
      default: "// Your code here\n",
    },
  },
};
export { CodeEditorNode, CodeEditorNodeOptions };


