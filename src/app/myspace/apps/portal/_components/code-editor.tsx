import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useTheme } from 'next-themes';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { EditorState, Extension, StateField, StateEffect } from '@codemirror/state';
import { keymap, EditorView, ViewPlugin, ViewUpdate, Decoration, DecorationSet } from '@codemirror/view';
import { X, Play, Trash2, Columns2, Bug, Code, Download, Copy, Zap, HelpCircle, ChevronDown, Minimize2, Maximize2, Palette, Type, List as ListIcon, RotateCcw, SpellCheck, Wrench, FolderTree, FileCode, Check, MessageSquarePlus, BotMessageSquare, HandHelping } from 'lucide-react';
import { Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Popover, PopoverTrigger, PopoverContent, Modal, ModalContent, ModalBody, ModalHeader, Tabs, Tab, Listbox, ListboxItem } from "@nextui-org/react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import CodePopoverMenu from "./code-popover-menu";
import EditorOptionsMenu from "./editor-options-menu";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from 'next/navigation';
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
import { useModelStore } from "@/stores/features/models/store";
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { CodeFile } from "@/types/code";
import { FileInterface } from "@/types/chat";
import SystemFile from "./system-file";
import EditorChatbot from "./editor-chatbot";
import ContentView from "./content-view";
import EditorBasicOptionsMenu from "./editor-basic-options-menu";
import { usePortalContext } from "@/context/portal-context-provider";
import { useGeneralContext } from "@/context/general-context-provider";
import KeyboardShortcutManager from "@/utils/keyboardUtils";
import { useEditorAI } from "@/hooks/use-editor-ai";
import { useDebugAI } from "@/hooks/use-debug-ai";
import { BasicSetupOptions } from "@/types/code";
import { gettingStarted } from "@/constants/code";
import CodeEditorMerge from './code-editor-merge';
import DebugControlButtons from './debug-control-buttons';
import ScrollButton from "./scroll-button";
import { debounce } from 'lodash';

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
  { name: "Markdown", mode: "markdown", extension: markdown(), icon: "📝" }, // Add Markdown
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

/*const customTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    backgroundImage: '',
    foreground: '#75baff',
    caret: '#5d00ff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#8a91991a',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    { tag: t.comment, color: '#787b8099' },
    { tag: t.variableName, color: '#0080ff' },
    { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
    { tag: t.number, color: '#5c6166' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: t.keyword, color: '#5c6166' },
    { tag: t.operator, color: '#5c6166' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#5c6166' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
  ],
});*/

const detectLanguage = (code) => {
  if (!code) {
    return "htmlmixed";
  }
  const detected = hljs.highlightAuto(code, codeLanguages.map(lang => lang.hljs));
  const matchedLang = codeLanguages.find(lang => lang.hljs === detected.language);
  return matchedLang ? matchedLang.mode : "htmlmixed";
};

const FileSystemModal = ({ isOpen, onClose, content, setCurrentCodeFile, setCurrentEmbeddedFile, setCurrentComponent, setIsModalOpen }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      classNames={{
        wrapper: 'z-[99999]',
      }}
    >
      <ModalContent>
        <ModalHeader>File System</ModalHeader>
        <ModalBody>
          <SystemFile 
            content={content} 
            setCurrentCodeFile={setCurrentCodeFile} 
            setCurrentEmbeddedFile={setCurrentEmbeddedFile} 
            setCurrentComponent={setCurrentComponent} 
            setIsModalOpen={setIsModalOpen} 
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface CodeEditorProps {
  content: string;
  setContent?: (path?: string, newCode: string) => void;
  currentCodeFile?: CodeFile;
  currentComponent?: string;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  currentEmbeddedFile?: FileInterface;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: Dispatch<SetStateAction<string>>;
  handleReplaceCode?: (content: string) => void;
  handleInsertAboveCode?: (content: string) => void;
  handleInsertBelowCode?: (content: string) => void;
  handleInsertLeftCode?: (content: string) => void;
  handleInsertRightCode?: (content: string) => void;
  handleOnInsert?: (content: string) => void;
  isShowEditor?: boolean;
  isShowChatbot?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  content, 
  setContent,
  currentCodeFile,
  currentEmbeddedFile, 
  currentComponent,
  setCurrentCodeFile, 
  setCurrentEmbeddedFile,
  setCurrentComponent,
  handleReplaceCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertLeftCode,
  handleInsertRightCode,
  handleOnInsert, 
  isShowChatbot,
  isShowEditor,
}) => {  
  const { theme: nextTheme } = useTheme(); 
  const inputContext = useModelStore((state) => state.inputContext);
  const inputModel = useModelStore((state) => state.inputModel);
  const setInputModel = useModelStore((state) => state.setInputModel);
  const setInputContext = useModelStore((state) => state.setInputContext);
  const { chatConversation, setChatConversation } = usePortalContext();
  const { setAiContext, setInputType, setOutputType, setIsSystemModel } = useGeneralContext();
  const [editorHeight, setEditorHeight] = useState<string>("400px");
  const [language, setLanguage] = useState(codeLanguages[0]);
  const [selectedTheme, setSelectedTheme] = useState("dracula");
  const [theme, setTheme] = useState(themes.dracula);
  const [fontSize, setFontSize] = useState("Medium");
  const [isCodeSelected, setIsCodeSelected] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [direction, setDirection] = useState("ltr");
  const [spellcheck, setSpellcheck] = useState(false);
  const [isEditorChatbotOpen, setIsEditorChatbotOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isCommandPopoverOpen, setIsCommandPopoverOpen] = useState(false);
  const [editorChatbotPosition, setEditorChatbotPosition] = useState({ top: 0, left: 0 });
  const editorContainerRef = useRef(null);
  const editorRef = useRef<CodeEditor.Editor | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const containerRef = useRef(null);
  const shortcutManagerRef = useRef<KeyboardShortcutManager | null>(null);
  const [keyboardShortcutManager, setKeyboardShortcutManager] = useState<KeyboardShortcutManager | null>(null);
  const [showChanges, setShowChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState(content);
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
  const [isDebugging, setIsDebugging] = useState(false);
  const [debuggingErrors, setDebuggingErrors] = useState<{ [line: string]: string }>({});
  const [isDebuggingMode, setIsDebuggingMode] = useState(false);
  const [currentLine, setCurrentLine] = useState<number>(-1);
  const { handleSubmit, handleStop } = useEditorAI({ generating: generating, setGenerating: setGenerating, error: error, setError: setError });
  const [basicSetupOptions, setBasicSetupOptions] = useState<BasicSetupOptions>({
    lineNumbers: true,
    highlightActiveLineGutter: true,
    highlightSpecialChars: true,
    history: true,
    foldGutter: true,
    drawSelection: true,
    dropCursor: true,
    allowMultipleSelections: true,
    indentOnInput: true,
    syntaxHighlighting: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: true,
    rectangularSelection: true,
    crosshairCursor: true,
    highlightActiveLine: true,
    highlightSelectionMatches: true,
    closeBracketsKeymap: true,
    defaultKeymap: true,
    searchKeymap: true,
    historyKeymap: true,
    foldKeymap: true,
    completionKeymap: true,
    lintKeymap: true,
    editable: true,
    indentWithTab: false,
  });

  const errorLineEffect = StateEffect.define<{from: number, to: number, error: string}>();
  const debugLineEffect = StateEffect.define<{from: number, to: number}>();

  const handleEditorMount = useCallback((view) => {
    editorViewRef.current = view;
  }, []);

  const filteredBasicSetupOptions = useMemo(() => {
    const { editable, indentWithTab, ...rest } = basicSetupOptions;
    return rest;
  }, [basicSetupOptions]);

  const handleBasicSetupOptionsChange = useCallback((newOptions: BasicSetupOptions) => {
    setBasicSetupOptions(newOptions);
  }, []);

  const toggleShowChanges = useCallback(() => {
    setShowChanges(prev => !prev);
    if (!showChanges) {
      setOriginalContent(content);
    }
  }, [showChanges, content]);

  const handleEditorChatbotOpenChange = () => {
    if (editorRef.current) {
      const view = editorRef.current.view as EditorView;
      const cursor = view.state.selection.main.head;
      const coords = view.coordsAtPos(cursor);
      if (coords && editorContainerRef.current) {
        const editorRect = editorContainerRef.current.getBoundingClientRect();
        setEditorChatbotPosition({
          top: coords.bottom - editorRect.top,
          left: coords.left - editorRect.left,
        });
      }
    }
    setIsEditorChatbotOpen(prev => !prev);
  };

  const handleSystemModalOpenChange = () => {
    setIsSystemModalOpen(prev => !prev);
  };

  const onCommandPopoverOpenChange = () => {
    setIsCommandPopoverOpen(prev => !prev);
  };

  useEffect(() => {
    const detectedLang = detectLanguage(content);
    const matchedLang = codeLanguages.find(lang => lang.mode === detectedLang) || codeLanguages[0];
    setLanguage(matchedLang);
  }, [content]);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
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

  const handleSetup = useCallback(() => {
    setChatConversation([]);
    setIsSystemModel(true);
    setAiContext("basic");
    setInputContext("general");
    setInputType("text-only");
    setOutputType("text");
  }, [setIsSystemModel, setAiContext, setInputContext, setInputType, setOutputType, setChatConversation, inputModel]);

  const handleGenerate = useCallback(async (command) => {
    setIsCommandPopoverOpen(true);
    handleSetup();
    if (selectedCode === '' && selectedCode.trim() === '' || generating) return;   
    const newUserMessage = {
      role: "user",
      content: selectedCode,
      embeddedContent: [],
      command: command,
      context: inputContext,
      model: inputModel,
    };
    setChatConversation(prev => [...prev, newUserMessage]);
    await handleSubmit();
  }, [selectedCode, generating, inputModel, inputContext, handleSetup, handleSubmit, setChatConversation]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(selectedCode || content).then(() => {
      showAlert("Code copied to clipboard!");
    });
  }, [selectedCode, content]);

  const handleImproveCode = useCallback(() => {
    if (content || selectedCode || selectedCode !== '' || selectedCode.trim() !== '') {
      setSelectedCommand("improve-code");
      handleGenerate("improve-code");
    } else {
      showAlert("No code selected to improve!");
    }
  }, [selectedCode, handleGenerate]);

  const handleExplainCode = useCallback(() => {
    if (content || selectedCode || selectedCode !== '' || selectedCode.trim() !== '') {
      setSelectedCommand("explain-code");
      handleGenerate("explain-code");
    } else {
      showAlert("No code selected to improve!");
    }
  }, [selectedCode, handleGenerate]);

  const handleSuggestCode = useCallback(() => {
    if (content || selectedCode || selectedCode !== '' || selectedCode.trim() !== '') {
      setSelectedCommand("suggest-code");
      handleGenerate("suggest-code");
    } else {
      showAlert("No code selected to improve!");
    }
  }, [selectedCode, handleGenerate]);

  const handleInsertCode = useCallback(() => {
    handleOnInsert(isCodeSelected ? selectedCode : content);
  }, [handleOnInsert, isCodeSelected, selectedCode, content]);

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
        containerRef.current.style.top = '11rem';
        containerRef.current.style.left = '0';
        containerRef.current.style.width = '100vw';
        containerRef.current.style.height = '420px';
        containerRef.current.style.zIndex = '99999';
        setEditorHeight("420px");
      } else {
        containerRef.current.style.position = 'relative';
        containerRef.current.style.top = '0';
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
    const path = currentComponent ? currentComponent : undefined;
    setContent(path, value);
  }, [currentComponent, setContent]);

  const handleBeforeChange = useCallback((changeObj, view, stats) => {
    if (stats.selectedText && changeObj.from !== changeObj.to) {
      setSelectedCode(stats.selectionCode); 
      setIsCodeSelected(true); 
      if (editorContainerRef.current) {
        const editorRect = editorContainerRef.current.getBoundingClientRect();
        const start = view.coordsAtPos(changeObj.from);
        const end = view.coordsAtPos(changeObj.to);
        if (start && end) {
          setPopoverPosition({
            top: end.bottom - editorRect.top + window.scrollY,
            left: (start.left + end.right) / 2 - editorRect.left + window.scrollX,
          });
        }
      }
  } else {
      setIsCodeSelected(false);
    }
  }, [editorContainerRef]);

  useEffect(() => {
    const handlers = {
      save: () => {
        console.log("Save shortcut triggered");
      },
      find: () => {
        console.log("Find shortcut triggered");
      },
      replace: () => {
        console.log("Replace shortcut triggered");
      },
      undo: () => {
        if (editorViewRef.current) {
          editorViewRef.current.dispatch({ effects: EditorView.undo.of(null) });
        }
      },
      redo: () => {
        if (editorViewRef.current) {
          editorViewRef.current.dispatch({ effects: EditorView.redo.of(null) });
        }
      },
      toggleChatbot: () => {
        handleEditorChatbotOpenChange();
      },
      improveCode: () => {
        handleImproveCode();
      },
      explainCode: () => {
        handleExplainCode();
      },
      suggestCode: () => {
        handleSuggestCode();
      },
      insertCode: () => {
        handleInsertCode();
      },
    };
    const manager = new KeyboardShortcutManager(handlers);
    setKeyboardShortcutManager(manager);
  }, []);

  const languageExtensions = useMemo(() => {
    const baseExtensions = [
      language.extension,
      keyboardShortcutManager ? keymap.of(keyboardShortcutManager.getKeymap()) : [],
    ];

    if (language.mode === "markdown") {
      baseExtensions.push(markdown());
    }

    return baseExtensions;
  }, [language.extension, keyboardShortcutManager]);

  const beforeChangeExt = useMemo(() => beforeChangeExtension(handleBeforeChange), [handleBeforeChange]);

  const findLineNumber = useCallback((lineContent: string): number => {
    const lines = content.split('\n');
    const normalizedLineContent = lineContent.trim();
    const lineNum = lines.findIndex(line => line.includes(normalizedLineContent));
    return lineNum !== -1 ? lineNum + 1 : -1;
  }, [content]);

  const combinedDecorationField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(decorations, tr) {
      decorations = decorations.map(tr.changes);
      for (let e of tr.effects) {
        if (e.is(errorLineEffect)) {
          const deco = Decoration.mark({
            attributes: { class: "error-line" },
            spec: { error: e.value.error }
          }).range(e.value.from, e.value.to);
          decorations = decorations.update({ add: [deco] });
        } else if (e.is(debugLineEffect)) {
          decorations = decorations.update({
            filter: (from, to, deco) => !deco.spec.isDebugLine
          });
          const deco = Decoration.mark({
            attributes: { class: "debug-current-line" },
            spec: { isDebugLine: true }
          }).range(e.value.from, e.value.to);
          decorations = decorations.update({ add: [deco] });
        }
      }
      return decorations;
    },
    provide: f => EditorView.decorations.from(f),
  });

  // Function to update error lines
  const updateErrorLines = (view: EditorView, debuggingErrors: Record<string, string>, findLineNumber: (content: string) => number) => {
    const effects: StateEffect<unknown>[] = [];
    for (let [lineContent, error] of Object.entries(debuggingErrors)) {
      const lineNum = findLineNumber(lineContent);
      if (lineNum !== -1) {
        try {
          const line = view.state.doc.line(lineNum);
          effects.push(errorLineEffect.of({ from: line.from, to: line.to, error }));
        } catch (e) {
          console.warn(`Line ${lineNum} not found in document`);
        }
      }
    }
    if (effects.length > 0) {
      view.dispatch({ effects });
    }
  };

  // Function to update debug line
  const updateDebugLine = (view: EditorView, lineNumber: number) => {
    const line = view.state.doc.line(lineNumber);
    view.dispatch({
      effects: debugLineEffect.of({ from: line.from, to: line.to })
    });
  };

  const scrollToLine = useCallback((line: number) => {
    if (editorViewRef.current) {
      const linePos = editorViewRef.current.state.doc.line(line).from;      
      editorViewRef.current.dispatch({
        selection: { anchor: linePos, head: linePos }, 
        scrollIntoView: true
      });
      updateDebugLine(editorViewRef.current, line);
    }
  }, []);

  const handleStepOver = useCallback(() => {
    const errorLines = Object.keys(debuggingErrors).map(findLineNumber).filter(line => line !== -1).sort((a, b) => a - b);
    const currentIndex = errorLines.indexOf(currentLine);
    let nextLine: number;
    if (currentIndex < errorLines.length - 1) {
      nextLine = errorLines[currentIndex + 1];
    } else {
      nextLine = errorLines[0];
    }
    setCurrentLine(nextLine);
    scrollToLine(nextLine);
  }, [currentLine, debuggingErrors, findLineNumber, scrollToLine]);

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

  const errorLineField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(errorLines, tr) {
      errorLines = errorLines.map(tr.changes);
      for (let e of tr.effects) {
        if (e.is(errorLineEffect)) {
          const deco = Decoration.mark({
            attributes: { class: "error-line" },
          }).range(e.value.from, e.value.to);
          errorLines = errorLines.update({ add: [deco] });
        }
      }
      return errorLines;
    },
    provide: f => EditorView.decorations.from(f),
  });

  const errorTooltipBaseTheme = EditorView.baseTheme({
    ".error-line": {
      backgroundColor: "rgba(255, 0, 0, 0.1)",
      position: "relative",
    },
    ".error-tooltip": {
      position: "absolute",
      zIndex: "99999",
      backgroundColor: "#2D3748",
      color: "#FFFFFF",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "14px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "300px",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
      opacity: 0,
      transform: "translateY(-10px)",
      pointerEvents: "none",
    },
    ".error-tooltip.visible": {
      opacity: 1,
      transform: "translateY(0)",
    }
  });

  const errorTooltipPlugin = ViewPlugin.fromClass(
    class {
      tooltip: HTMLElement | null = null;
      lastTooltipLine: number | null = null;
      tooltipTimeout: NodeJS.Timeout | null = null;
      lastErrorContent: string | null = null;
      errorLines: Map<number, string> = new Map();
      debouncedCheckForErrorAndShowTooltip: Function;
      view: EditorView;

      constructor(view: EditorView) {
        this.view = view;
        this.tooltip = this.createTooltip(view);
        this.debouncedCheckForErrorAndShowTooltip = debounce(this.checkForErrorAndShowTooltip.bind(this), 100);
        this.updateErrorLines();
      }

      createTooltip(view: EditorView) {
        const tooltip = document.createElement("div");
        tooltip.className = "error-tooltip";
        view.dom.appendChild(tooltip);
        return tooltip;
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.updateErrorLines();
        }

        const pos = update.state.selection.main.head;
        const line = update.state.doc.lineAt(pos);
        this.debouncedCheckForErrorAndShowTooltip(line);
      }

      updateErrorLines() {
        this.errorLines.clear();
        for (let [errorContent, error] of Object.entries(debuggingErrors)) {
          const lineNum = this.findLineNumber(this.view.state.doc, errorContent);
          if (lineNum !== -1) {
            this.errorLines.set(lineNum, error);
          }
        }
      }

      findLineNumber(doc: Text, content: string): number {
        const lines = doc.toString().split('\n');
        return lines.findIndex(line => line.includes(content.trim())) + 1;
      }

      checkForErrorAndShowTooltip(line: { from: number, to: number, number: number }) {
        const error = this.errorLines.get(line.number);

        if (error) {
          const coords = this.view.coordsAtPos(line.from);
          if (coords) {
            if (error !== this.lastErrorContent || line.number !== this.lastTooltipLine) {
              this.showTooltip(error, coords, line.number);
              this.lastErrorContent = error;
              this.lastTooltipLine = line.number;
            }
          }
        } else {
          if (line.number !== this.lastTooltipLine) {
            this.hideTooltip();
          }
        }
      }

      showTooltip(content: string, coords: { top: number, left: number }, lineNumber: number) {
        if (this.tooltip && this.view.dom.parentElement) {
          const editorRect = this.view.dom.parentElement.getBoundingClientRect();
          const top = coords.bottom - editorRect.top;
          const left = coords.left - editorRect.left;
          this.tooltip.style.top = `${top}px`;
          this.tooltip.style.left = `${left}px`;
          this.tooltip.textContent = content;
          this.tooltip.classList.add('visible');
          if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
          }
          this.tooltipTimeout = setTimeout(() => {
            this.hideTooltip();
          }, 10000); // 10 seconds
        }
      }

      hideTooltip() {
        if (this.tooltip) {
          this.tooltip.classList.remove('visible');
        }
        if (this.tooltipTimeout) {
          clearTimeout(this.tooltipTimeout);
          this.tooltipTimeout = null;
        }
        this.lastTooltipLine = null;
        this.lastErrorContent = null;
      }

      destroy() {
        if (this.tooltip) {
          this.tooltip.classList.remove('visible'); 
          setTimeout(() => {
              this.tooltip?.remove();
          }, 10000);
        }
        if (this.tooltipTimeout) {
          clearTimeout(this.tooltipTimeout);
          this.tooltipTimeout = null;
        }
      }
    }
  );

  const extensions = useMemo(() => [
    EditorView.theme({
      "&": {
        height: "100%",
        maxHeight: "100%",
        overflow: "auto"
      },
      ".cm-scroller": {
        overflow: "auto"
      },
      ".debug-current-line": {
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        zIndex: 2 
      },
      ".error-line": {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        zIndex: 1
      },
    }),
    language.extension,
    beforeChangeExt,
    combinedDecorationField,
    errorTooltipBaseTheme,
    errorTooltipPlugin,
    languageExtensions,
    EditorView.updateListener.of((update) => {
      if (update.docChanged || update.selectionSet) {
        const effects: StateEffect<unknown>[] = [];
        for (let [lineContent, error] of Object.entries(debuggingErrors)) {
          const lineNum = findLineNumber(lineContent);
          if (lineNum !== -1) {
            try {
              const line = update.state.doc.line(lineNum);
              effects.push(errorLineEffect.of({ from: line.from, to: line.to, error }));
            } catch (e) {
              console.warn(`Line ${lineNum} not found in document`);
            }
          }
        }
        if (effects.length > 0) {
          update.view.dispatch({ effects });
        }
      }
    }),
    EditorView.domEventHandlers({
      keydown: (event, view) => {
        handleKeyDown(event as unknown as React.KeyboardEvent);
      }
    }),
  ], [language.extension, beforeChangeExt, debuggingErrors, findLineNumber, languageExtensions, combinedDecorationField]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'i':
          event.preventDefault();
          handleImproveCode();
          break;
        case 'l':
          event.preventDefault();
          handleEditorChatbotOpenChange();
          break;
        case 'e':
          event.preventDefault();
          handleExplainCode();
          break;
        case 'd':
          event.preventDefault();
          if (isDebugging) {
            handleStepOver();
          }
          break;
        case 's':
          if (!event.shiftKey) { 
            event.preventDefault();
            handleSuggestCode();
          }
          break;
      }
    }
  }, [handleImproveCode, handleExplainCode, handleSuggestCode, handleStepOver, handleEditorChatbotOpenChange, isDebugging]);

  const popoverOptions = [
    { label: 'Improve(Ctrl+I)', action: handleImproveCode, icon: <Zap size={18} /> },
    { label: 'Explain(Ctrl+E)', action: handleExplainCode, icon: <HelpCircle size={18} /> },
    { label: 'Suggest(Ctrl+S) ', action: handleSuggestCode, icon: <HandHelping size={18} /> },
    { label: 'Add To Chat(Ctrl+K)', action: handleInsertCode, icon: <MessageSquarePlus size={18} /> },
    { label: 'Open Chat(Ctrl+L) ', action: handleEditorChatbotOpenChange, icon: <BotMessageSquare size={18} /> },
  ];

  const editorMenuOptions = [
    { 
      id: 'apply',
      label: 'Apply System Files', 
      icon: FolderTree, 
      color: 'primary',
      action: handleSystemModalOpenChange
    },
    { 
      id: 'suggest',
      label: 'Generate Suggestions', 
      icon: HandHelping, 
      color: 'success',
      action: handleSuggestCode
    }
  ];

  const memoizedFileSystemModal = useMemo(() => (
    <FileSystemModal 
      isOpen={isSystemModalOpen}
      onClose={() => setIsSystemModalOpen(false)}
      content={content}
      setCurrentCodeFile={setCurrentCodeFile}
      setCurrentEmbeddedFile={setCurrentEmbeddedFile}
      setCurrentComponent={setCurrentComponent}
      setIsModalOpen={setIsSystemModalOpen}
    />
  ), [isSystemModalOpen, content, setCurrentCodeFile, setCurrentEmbeddedFile, setCurrentComponent]);

  const _height = useMemo(() => {
    return isShowEditor && !isShowChatbot ? "100vh" : editorHeight;
  }, [isShowEditor, isShowChatbot, editorHeight]);

  const { handleDebug, handleStopDebug } = useDebugAI({ generating: generating, setGenerating: setGenerating, error: error, setError: setError, setDebuggingErrors: setDebuggingErrors, findLineNumber: findLineNumber, setCurrentLine: setCurrentLine, scrollToLine: scrollToLine });

  const handleDebugSetup = useCallback(() => {
    setIsDebugging(true);
    setIsDebuggingMode(true);
    setIsSystemModel(true);
    setAiContext("basic");
    setInputContext("general");
    setInputType("text-only");
    setOutputType("text");
  }, [setIsSystemModel, setAiContext, setInputContext, setInputType, setOutputType, inputModel, setIsDebugging, setIsDebuggingMode]);

  const handleDebugCode = useCallback(async (content: string, command: string) => {
    handleDebugSetup();
    if (content === '' && content.trim() === '' || generating) return;   
    await handleDebug(content, command);
  }, [content, generating, inputModel, inputContext, handleSetup, handleSubmit]);

  const handleStartDebugging = useCallback(() => {
    handleDebugCode(content, "DEBUG")
  }, [content]);

  const handleStopDebugging = useCallback(() => {
    setIsDebugging(false);
    setIsDebuggingMode(false);
    setCurrentLine(-1);
    setDebuggingErrors({});
  }, []);

  return (
    <div ref={containerRef} className={`bg-gray-900 rounded-lg shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between bg-gray-800 p-4 overflow-x-auto">
        <div className="flex space-x-2">
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
          {isShowEditor && isShowChatbot && 
            <Tooltip content="Toggle Fullscreen">
              <Button className="text-white" variant="ghost" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
            </Tooltip>
          }
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
           <EditorBasicOptionsMenu
            options={basicSetupOptions}
            onChange={handleBasicSetupOptionsChange}
          />
          <Tooltip content={isDebuggingMode ? "Debugging Mode On" : "Debugging Mode Off"}>
            <Button
              isIconOnly
              color={isDebuggingMode ? "warning" : "default"}
              variant="ghost"
              onClick={() => setIsDebuggingMode(!isDebuggingMode)}
            >
              <Bug size={18} />
            </Button>
          </Tooltip>
          <DebugControlButtons
            handleStartDebugging={handleStartDebugging}
            isDebugging={isDebugging}
            handleStopDebugging={handleStopDebugging}
            handleStepOver={handleStepOver}
          />
          <Tooltip content="Toggle Direction">
            <Button className="text-white" variant="ghost" onClick={toggleDirection}>
              <RotateCcw size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Show Changes">
            <Button className="text-white" variant="ghost" onClick={toggleShowChanges}>
              <Columns2 size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Toggle Spellcheck">
            <Button className="text-white" variant="ghost" onClick={toggleSpellcheck}>
              <SpellCheck size={18} />
            </Button>
          </Tooltip>
          <Popover
            placement="bottom"
            offset={30} 
            showArrow
            classNames={{
              body: 'py-6',
              content: 'flex items-center justify-center space-y-4',
              backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
              base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
            }}
          >
            <PopoverTrigger>
              <Button>
                <Wrench size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex items-center">
              <EditorOptionsMenu 
                options={editorMenuOptions}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div ref={editorContainerRef} className="relative overflow-y-auto" style={{ maxHeight: '100vh' }}>
      <ScrollButton editorRef={editorRef} theme={nextTheme} />
        {showChanges ? (
          <CodeEditorMerge
            originalContent={originalContent}
            modifiedContent={content}
          />
        ) : (
          <CodeMirror
            ref={editorRef}
            value={content}
            height={editorHeight}
            extensions={extensions}
            onChange={handleChange}
            theme={theme}
            basicSetup={filteredBasicSetupOptions}
            onCreateEditor={handleEditorMount}
            direction={direction}
          />
        )}
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
      <EditorChatbot 
        content={content} 
        isOpen={isEditorChatbotOpen} 
        onOpenChange={handleEditorChatbotOpenChange} 
        setCurrentComponent={setCurrentComponent} 
        setCurrentEmbeddedFile={setCurrentEmbeddedFile} 
        setCurrentCodeFile={setCurrentCodeFile} 
        handleReplaceCode={handleReplaceCode}
        handleInsertAboveCode={handleInsertAboveCode}
        handleInsertBelowCode={handleInsertBelowCode}
        handleInsertLeftCode={handleInsertLeftCode}
        handleInsertRightCode={handleInsertRightCode}
        position={editorChatbotPosition}
      />
      <ContentView
        generating={generating}
        isOpen={isCommandPopoverOpen}
        onOpenChange={onCommandPopoverOpenChange}
        generating={generating}
        error={error}
        setError={setError}
        handleRegenerate={() => handleGenerate(selectedCommand)}
        currentCodeFile={currentCodeFile}
        currentEmbeddedFile={currentEmbeddedFile}
        setCurrentCodeFile={setCurrentCodeFile}
        setCurrentEmbeddedFile={setCurrentEmbeddedFile}
        setCurrentComponent={setCurrentComponent}
        handleReplaceCode={handleReplaceCode}
        handleInsertAboveCode={handleInsertAboveCode}
        handleInsertBelowCode={handleInsertBelowCode}
        handleInsertLeftCode={handleInsertLeftCode}
        handleInsertRightCode={handleInsertRightCode}
      />
      {memoizedFileSystemModal}
    </div>
  );
};

export default memo(CodeEditor);




