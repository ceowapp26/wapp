import React, { useEffect, useRef, useState } from 'react';
import CodeMirrorMerge from 'react-codemirror-merge';
import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { Transition } from '@headlessui/react';
import { abcdef, abyss, androidstudio, andromeda, atomone, aura, bbedit, bespin, darcula, dracula, eclipse, kimbie, material, monokai, noctisLilac, nord, okaidia, quietlight, solarizedDark, solarizedLight, sublime, tokyoNight, tokyoNightDay, tokyoNightStorm, tomorrowNightBlue, vscodeDark, vscodeLight, xcodeDark, xcodeLight } from '@uiw/codemirror-themes-all';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Original = CodeMirrorMerge.Original;
const Modified = CodeMirrorMerge.Modified;

interface CodeEditorMergeProps {
  originalContent: string;
  modifiedContent: string;
}

const themes = {
  darcula, dracula, material, monokai, nord, solarizedDark, solarizedLight, vscodeDark, vscodeLight
};

const CodeEditorMerge: React.FC<CodeEditorMergeProps> = ({ originalContent, modifiedContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('dracula');

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        containerRef.current.style.height = isFullScreen ? '100vh' : `${window.innerHeight * 0.8}px`;
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <motion.div
        ref={containerRef}
        className={`w-full mx-auto rounded-lg shadow-2xl overflow-hidden bg-gray-900 ${isFullScreen ? 'fixed inset-0 z-50' : 'max-w-6xl'}`}
        layout
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Code Comparison</h2>
          <div className="flex items-center space-x-4">
            <select
              className="bg-gray-700 text-white rounded px-2 py-1"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as keyof typeof themes)}
            >
              {Object.keys(themes).map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
            <button
              onClick={toggleFullScreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isFullScreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
            </button>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
        <CodeMirrorMerge className="h-full">
          <Original
            theme={themes[selectedTheme]}
            value={originalContent}
            extensions={[javascript()]}
          />
          <Modified
            theme={themes[selectedTheme]}
            value={modifiedContent}
            extensions={[javascript()]}
          />
        </CodeMirrorMerge>
      </motion.div>
    </Transition>
  );
};

export default CodeEditorMerge;