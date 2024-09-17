import React from 'react';
import { ButtonGroup, Tooltip, Button } from "@nextui-org/react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Replace, RefreshCw, Copy, Trash2, Edit, FileCode, FileText } from 'lucide-react';

interface ActionButtonGroupProps {
  content: string;
  isMarkdownMode: boolean;
  onMarkdownModeToggle: () => void;
  onReplace: () => void;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  onInsertLeft: () => void;
  onInsertRight: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy: () => void;
  onRegenerate: () => void;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  content,
  isMarkdownMode,
  onMarkdownModeToggle,
  onReplace,
  onInsertAbove,
  onInsertBelow,
  onInsertLeft,
  onInsertRight,
  onEdit,
  onDelete,
  onCopy,
  onRegenerate,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <ButtonGroup variant="flat" size="sm">
        <Tooltip content="Insert Above">
          <Button isIconOnly onClick={onInsertAbove} aria-label="Insert Above">
            <ArrowUp size={16} />
          </Button>
        </Tooltip>
        <Tooltip content="Insert Below">
          <Button isIconOnly onClick={onInsertBelow} aria-label="Insert Below">
            <ArrowDown size={16} />
          </Button>
        </Tooltip>
        <Tooltip content="Insert Left">
          <Button isIconOnly onClick={onInsertLeft} aria-label="Insert Left">
            <ArrowLeft size={16} />
          </Button>
        </Tooltip>
        <Tooltip content="Insert Right">
          <Button isIconOnly onClick={onInsertRight} aria-label="Insert Right">
            <ArrowRight size={16} />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="flat" size="sm">
        <Tooltip content="Replace">
          <Button isIconOnly onClick={onReplace} aria-label="Replace">
            <Replace size={16} />
          </Button>
        </Tooltip>
        {onEdit && (
          <Tooltip content="Edit">
            <Button isIconOnly onClick={onEdit} aria-label="Edit">
              <Edit size={16} />
            </Button>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip content="Delete">
            <Button isIconOnly onClick={onDelete} aria-label="Delete">
              <Trash2 size={16} />
            </Button>
          </Tooltip>
        )}
      </ButtonGroup>

      <ButtonGroup variant="flat" size="sm">
        <Tooltip content="Copy">
          <Button isIconOnly onClick={onCopy} aria-label="Copy">
            <Copy size={16} />
          </Button>
        </Tooltip>
        {onRegenerate && (
          <Tooltip content="Regenerate">
            <Button isIconOnly onClick={onRegenerate} aria-label="Regenerate">
              <RefreshCw size={16} />
            </Button>
          </Tooltip>
        )}
        <Tooltip content={isMarkdownMode ? "Switch to Plain Text" : "Switch to Markdown"}>
          <Button isIconOnly onClick={onMarkdownModeToggle} aria-label="Toggle Markdown Mode">
            {isMarkdownMode ? <FileText size={16} /> : <FileCode size={16} />}
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default ActionButtonGroup;