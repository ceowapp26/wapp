import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Switch, Tooltip } from "@nextui-org/react";
import { Settings, Check } from 'lucide-react';
import { BasicSetupOptions } from "@/types/code";

interface EditorBasicOptionsMenuProps {
  options: BasicSetupOptions;
  onChange: (newOptions: BasicSetupOptions) => void;
}

const EditorBasicOptionsMenu: React.FC<EditorBasicOptionsMenuProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionChange = (key: keyof BasicSetupOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  const optionGroups = [
    {
      title: "Display",
      options: [
        { key: "lineNumbers", label: "Line Numbers" },
        { key: "highlightActiveLineGutter", label: "Highlight Active Line Gutter" },
        { key: "highlightSpecialChars", label: "Highlight Special Characters" },
        { key: "foldGutter", label: "Fold Gutter" },
        { key: "drawSelection", label: "Draw Selection" },
        { key: "dropCursor", label: "Drop Cursor" },
        { key: "highlightActiveLine", label: "Highlight Active Line" },
        { key: "highlightSelectionMatches", label: "Highlight Selection Matches" },
      ],
    },
    {
      title: "Editing",
      options: [
        { key: "history", label: "History" },
        { key: "allowMultipleSelections", label: "Allow Multiple Selections" },
        { key: "indentOnInput", label: "Indent on Input" },
        { key: "syntaxHighlighting", label: "Syntax Highlighting" },
        { key: "bracketMatching", label: "Bracket Matching" },
        { key: "closeBrackets", label: "Close Brackets" },
        { key: "autocompletion", label: "Autocompletion" },
        { key: "rectangularSelection", label: "Rectangular Selection" },
        { key: "crosshairCursor", label: "Crosshair Cursor" },
        { key: "editable", label: "Editable" },
      ],
    },
    {
      title: "Keymaps",
      options: [
        { key: "closeBracketsKeymap", label: "Close Brackets Keymap" },
        { key: "defaultKeymap", label: "Default Keymap" },
        { key: "searchKeymap", label: "Search Keymap" },
        { key: "historyKeymap", label: "History Keymap" },
        { key: "foldKeymap", label: "Fold Keymap" },
        { key: "completionKeymap", label: "Completion Keymap" },
        { key: "lintKeymap", label: "Lint Keymap" },
      ],
    },
  ];

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
      <PopoverTrigger>
        <Button
          auto
          light
          icon={<Settings size={20} />}
          css={{ backgroundColor: '$accents0', '&:hover': { backgroundColor: '$accents1' } }}
        >
          Editor Options
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4 w-80 max-h-[70vh] overflow-y-auto bg-gray-900 rounded-lg shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Editor Options</h3>
          {optionGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h4 className="text-md font-medium text-gray-300 mb-2">{group.title}</h4>
              <div className="space-y-2">
                {group.options.map(({ key, label }) => (
                  <Tooltip key={key} content={label} placement="left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{label}</span>
                      <Switch
                        checked={options[key as keyof BasicSetupOptions]}
                        onChange={() => handleOptionChange(key as keyof BasicSetupOptions)}
                        size="sm"
                        color="primary"
                      />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
          <Button
            auto
            color="success"
            icon={<Check size={16} />}
            onPress={() => setIsOpen(false)}
            className="mt-4 w-full"
          >
            Apply Changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EditorBasicOptionsMenu;