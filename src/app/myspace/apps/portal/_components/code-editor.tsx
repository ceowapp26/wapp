"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { X, Play, Trash2, Code, Download, Copy, Zap, HelpCircle, ChevronDown, Minimize2, Maximize2, Palette, Type, List, RotateCcw, SpellCheck } from 'lucide-react';
import { Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CodePopoverMenu } from "./code-popover-menu";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { motion, AnimatePresence } from "framer-motion";
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { abcdef, abyss, androidstudio, andromeda, atomone, aura, bbedit, bespin, darcula, dracula, eclipse, kimbie, material, monokai, noctisLilac, nord, okaidia, quietlight, solarizedDark, solarizedLight, sublime, tokyoNight, tokyoNightDay, tokyoNightStorm, tomorrowNightBlue, vscodeDark, vscodeLight, xcodeDark, xcodeLight } from '@uiw/codemirror-themes-all';
import { beforeChangeExtension } from './extensions';

// Import highlight.js languages
import hljs from 'highlight.js/lib/core';
import hljsJavascript from 'highlight.js/lib/languages/javascript';
import hljsTypescript from 'highlight.js/lib/languages/typescript';
import hljsHtml from 'highlight.js/lib/languages/xml';
import hljsCss from 'highlight.js/lib/languages/css';
import hljsPython from 'highlight.js/lib/languages/python';
import hljsPhp from 'highlight.js/lib/languages/php';
import hljsR from 'highlight.js/lib/languages/r';
import hljsCpp from 'highlight.js/lib/languages/cpp';
import hljsJava from 'highlight.js/lib/languages/java';

// Register languages for highlight.js
hljs.registerLanguage('javascript', hljsJavascript);
hljs.registerLanguage('typescript', hljsTypescript);
hljs.registerLanguage('html', hljsHtml);
hljs.registerLanguage('css', hljsCss);
hljs.registerLanguage('python', hljsPython);
hljs.registerLanguage('php', hljsPhp);
hljs.registerLanguage('r', hljsR);
hljs.registerLanguage('cpp', hljsCpp);
hljs.registerLanguage('java', hljsJava);

const codeLanguages = [
  { name: "HTML/CSS/JS", mode: "htmlmixed", extension: html(), icon: "🌐" },
  { name: "JavaScript", mode: "javascript", extension: javascript(), icon: "🟨" },
  { name: "TypeScript", mode: "typescript", extension: javascript({ typescript: true }), icon: "🔷" },
  { name: "Python", mode: "python", extension: python(), icon: "🐍" },
  { name: "PHP", mode: "php", extension: php(), icon: "🐘" },
  { name: "C++", mode: "text/x-c++src", extension: cpp(), icon: "🔧" },
  { name: "Java", mode: "text/x-java", extension: java(), icon: "☕" },
];

const themes = {
  abcdef, abyss, androidstudio, andromeda, atomone, aura, bbedit, bespin, 
  darcula, dracula, eclipse, kimbie, material, monokai, 
  'noctis-lilac': noctisLilac, nord, okaidia, quietlight, 
  'solarized-dark': solarizedDark, 'solarized-light': solarizedLight, 
  sublime, 'tokyo-night': tokyoNight, 'tokyo-night-day': tokyoNightDay, 
  'tokyo-night-storm': tokyoNightStorm, 'tomorrow-night-blue': tomorrowNightBlue, 
  'vscode-dark': vscodeDark, 'vscode-light': vscodeLight, 
  'xcode-dark': xcodeDark, 'xcode-light': xcodeLight
};

const detectLanguage = (code) => {
  if (!code) {
    return "htmlmixed";
  }
  const detected = hljs.highlightAuto(code, codeLanguages.map(lang => lang.hljs));
  const matchedLang = codeLanguages.find(lang => lang.hljs === detected.language);
  return matchedLang ? matchedLang.mode : "htmlmixed";
};

const CodeEditor = ({ content, setContent }) => {
  const [editorHeight, setEditorHeight] = useState("400px");
  const [language, setLanguage] = useState(codeLanguages[0]);
  const [selectedTheme, setSelectedTheme] = useState("dracula");
  const [theme, setTheme] = useState(themes.dracula);
  const [fontSize, setFontSize] = useState("Medium");
  const [isCodeSelected, setIsCodeSelected] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [direction, setDirection] = useState("ltr");
  const [spellcheck, setSpellcheck] = useState(false);
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const detectedLang = detectLanguage(content);
    const matchedLang = codeLanguages.find(lang => lang.mode === detectedLang) || codeLanguages[0];
    setLanguage(matchedLang);
    setContent(content);
  }, [content]);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([selectedCode || content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language.mode === 'htmlmixed' ? 'html' : language.mode}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showAlert("Code downloaded successfully!");
  }, [selectedCode, content, language]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(selectedCode || content).then(() => {
      showAlert("Code copied to clipboard!");
    });
  }, [selectedCode, content]);

  const handleImproveCode = useCallback(() => {
    showAlert("Code improvement feature coming soon!");
  }, [selectedCode]);

  const handleExplainCode = useCallback(() => {
    showAlert("Code explanation feature coming soon!");
  }, [selectedCode]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
    setTimeout(() => setIsAlertVisible(false), 3000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.style.position = 'fixed';
        containerRef.current.style.top = '0';
        containerRef.current.style.left = '0';
        containerRef.current.style.width = '100vw';
        containerRef.current.style.height = '100vh';
        containerRef.current.style.zIndex = '9999';
        setEditorHeight("100vw");
      } else {
        containerRef.current.style.position = 'relative';
        containerRef.current.style.width = '100%';
        containerRef.current.style.height = 'auto';
        containerRef.current.style.zIndex = '1';
        setEditorHeight("400px")
      }
    }
  };

  const toggleDirection = () => {
    setDirection(prevDirection => prevDirection === "ltr" ? "rtl" : "ltr");
  };

  const toggleSpellcheck = () => {
    setSpellcheck(prevSpellcheck => !prevSpellcheck);
  };

  const handleChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setContent(value);
  }, [setContent]);

  const handleBeforeChange = useCallback((changeObj, view) => {
    const selectedText = changeObj.text;
    setSelectedCode(selectedText);
    setIsCodeSelected(!!selectedText);
    if (selectedText && editorContainerRef.current) {
      const editorRect = editorContainerRef.current.getBoundingClientRect();
      const start = view.coordsAtPos(changeObj.from);
      const end = view.coordsAtPos(changeObj.to);
      if (start && end) {
        setPopoverPosition({
          top: end.bottom - editorRect.top + window.scrollY,
          left: (start.left + end.right) / 2 - editorRect.left + window.scrollX,
        });
      }
    } else {
      setIsCodeSelected(false);
    }
  }, []);

  const beforeChangeExt = useMemo(() => beforeChangeExtension(handleBeforeChange), [handleBeforeChange]);

  const handleLanguageChange = (keys) => {
    const selectedLangName = Array.from(keys)[0];
    const selectedLang = codeLanguages.find(lang => lang.name === selectedLangName);
    if (selectedLang) {
      setLanguage(selectedLang);
    }
  };

  const handleThemeChange = (keys) => {
    const selectedThemeName = Array.from(keys)[0];
    setSelectedTheme(selectedThemeName);
    setTheme(themes[selectedThemeName]);
  };

  const handleFontSizeChange = (keys) => {
    const selectedSize = Array.from(keys)[0];
    setFontSize(selectedSize);
    const sizeMap = { "Small": 12, "Medium": 14, "Large": 16 };
    const newSize = sizeMap[selectedSize];
    if (newSize && editorRef.current) {
      editorRef.current.style.fontSize = `${newSize}px`;
    }
  };

  const popoverOptions = [
    { label: 'Improve', action: handleImproveCode, icon: <Zap size={18} /> },
    { label: 'Explain', action: handleExplainCode, icon: <HelpCircle size={18} /> },
  ];

  return (
    <div ref={containerRef} className={`bg-gray-900 rounded-lg overflow-hidden shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between bg-gray-800 p-4">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="text-white">
              {language.icon} {language.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Language selection"
            selectedKeys={new Set([language.name])}
            selectionMode="single"
            onSelectionChange={handleLanguageChange}
          >
            {codeLanguages.map((lang) => (
              <DropdownItem key={lang.name}>
                {lang.icon} {lang.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <div className="flex space-x-2">
          <Tooltip content="Toggle Fullscreen">
            <Button className="text-white" variant="ghost" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
          </Tooltip>
          <Tooltip content="Change Theme">
            <Dropdown>
              <DropdownTrigger>
                <Button className="text-white" variant="bordered">
                  <Palette size={18} />
                  {selectedTheme}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Theme selection"
                selectedKeys={new Set([selectedTheme])}
                selectionMode="single"
                onSelectionChange={handleThemeChange}
              >
                {Object.keys(themes).map((themeName) => (
                  <DropdownItem key={themeName}>
                    {themeName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Tooltip>
          <Tooltip content="Change Font Size">
            <Dropdown>
              <DropdownTrigger>
                <Button className="text-white" variant="bordered">
                  <Type size={18} />
                  {fontSize}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Font size selection"
                selectedKeys={new Set([fontSize])}
                selectionMode="single"
                onSelectionChange={handleFontSizeChange}
              >
                <DropdownItem key="Small">Small</DropdownItem>
                <DropdownItem key="Medium">Medium</DropdownItem>
                <DropdownItem key="Large">Large</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Tooltip>
          <Tooltip content="Toggle Line Numbers">
            <Button className="text-white" variant="ghost" onClick={() => setShowLineNumbers(!showLineNumbers)}>
              <List size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Toggle Direction">
            <Button className="text-white" variant="ghost" onClick={toggleDirection}>
              <RotateCcw size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Toggle Spellcheck">
            <Button className="text-white" variant="ghost" onClick={toggleSpellcheck}>
              <SpellCheck size={18} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div ref={editorContainerRef} className="relative">
        <CodeMirror
          ref={editorRef}
          value={content}
          height={editorHeight}
           extensions={[
            language.extension,
            beforeChangeExt,
          ]}
          onChange={handleChange}
          theme={theme}
          basicSetup={{
            lineNumbers: showLineNumbers,
            foldGutter: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            closeBrackets: true,
            matchBrackets: true,
          }}
          direction={direction}
        />
        {isCodeSelected && (
          <CodePopoverMenu 
            isCodeSelected={isCodeSelected} 
            popoverPosition={popoverPosition} 
            options={popoverOptions} 
          />
        )}
      </div>
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Tooltip content="Download Code">
            <Button variant="primary" onClick={handleDownloadCode}>
              <Download size={18} className="mr-2" />
              Download
            </Button>
          </Tooltip>
          <Tooltip content="Copy Code">
            <Button variant="secondary" onClick={handleCopyCode}>
              <Copy size={18} className="mr-2" />
              Copy
            </Button>
          </Tooltip>
        </div>
      </div>
      <AnimatePresence>
        {isAlertVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="m-4">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodeEditor;

