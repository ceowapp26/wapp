import React from 'react';
import { ButtonGroup, Tooltip, Button } from "@nextui-org/react";
import { BetweenVerticalStart, BetweenVerticalEnd, BetweenHorizontalStart, BetweenHorizontalEnd, Replace, ArrowUp, ArrowDown, ArrowRight, RefreshCw, Copy, Trash2, Edit } from 'lucide-react';
import TickIcon from '@/icons/TickIcon';
import CrossIcon from '@/icons/CrossIcon';
import MagicIcon from "@/icons/MagicIcon";
import { motion, AnimatePresence } from "framer-motion";

interface ActionButtonsProps {
  isDelete: boolean;
  handleDelete: () => void;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleEdit: () => void;
  handleRefresh: () => void;
  handleCopy: () => void;
  handleReplace: () => void;
  handleInsertAbove: () => void;
  handleInsertBelow: () => void;
  handleInsertLeft: () => void;
  handleInsertRight: () => void;
  messageIndex: number;
  isMediumScreen: boolean;
  currentChatIndex: number;
  lastMessageIndex: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isDelete,
  handleDelete,
  setIsDelete,
  handleMoveUp,
  handleMoveDown,
  handleEdit,
  handleRefresh,
  handleCopy,
  handleReplace,
  handleInsertAbove,
  handleInsertBelow,
  handleInsertLeft,
  handleInsertRight,
  messageIndex,
  isMediumScreen,
  currentChatIndex,
  lastMessageIndex
}) => {
  return (
    <div className={`flex mt-4 w-full ${isMediumScreen ? 'flex-col space-y-2 justify-center' : 'justify-between gap-x-4'}`}>
      <ButtonGroup variant="ghost" className="flex items-center">
        <Tooltip content="Insert Above" placement="top">
          <Button isIconOnly variant="bordered" onPress={handleInsertAbove}>
            <BetweenVerticalEnd />
          </Button>
        </Tooltip>
        <Tooltip content="Insert Below" placement="top">
          <Button isIconOnly variant="bordered" onPress={handleInsertBelow}>
            <BetweenVerticalStart />
          </Button>
        </Tooltip>
        <Tooltip content="Insert Left" placement="top">
          <Button isIconOnly variant="bordered" onPress={handleInsertLeft}>
            <BetweenHorizontalEnd />
          </Button>
        </Tooltip>
        <Tooltip content="Insert Right" placement="top">
          <Button isIconOnly variant="bordered" onPress={handleInsertRight}>
            <BetweenHorizontalStart />
          </Button>
        </Tooltip>
        <Tooltip content="Replace AI" placement="top">
          <Button isIconOnly variant="bordered" onPress={handleReplace}>
            <Replace />
          </Button>
        </Tooltip>
      </ButtonGroup>
      <AnimatePresence>
        {isDelete ? (
          <>
          <ButtonGroup variant="ghost" className="flex items-center">
            <Tooltip content="Confirm Delete" placement="top">
              <Button isIconOnly variant="bordered" onPress={handleDelete}>
                <TickIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Cancel" placement="top">
              <Button isIconOnly variant="bordered" onPress={() => setIsDelete(false)}>
                <CrossIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Edit" placement="top">
              <Button isIconOnly variant="bordered" onPress={handleEdit}>
                <Edit />
              </Button>
            </Tooltip>
          </ButtonGroup>
          </>
        ) : (
          <ButtonGroup variant="ghost" className="flex items-center">
            <Tooltip content="Delete" placement="top">
              <Button isIconOnly variant="bordered" onPress={() => setIsDelete(true)}>
                <Trash2 />
              </Button>
            </Tooltip>
            <Tooltip content="Copy" placement="top">
              <Button isIconOnly variant="bordered" onPress={handleCopy}>
                <Copy />
              </Button>
            </Tooltip>
            <Tooltip content="Refresh" placement="top">
              <Button isIconOnly variant="bordered" onPress={handleRefresh}>
                <RefreshCw />
              </Button>
            </Tooltip>
            {messageIndex !== 0 && (
              <Tooltip content="Move Up" placement="top">
                <Button isIconOnly variant="bordered" onPress={handleMoveUp}>
                  <ArrowUp />
                </Button>
              </Tooltip>
            )}
            {messageIndex !== lastMessageIndex && (
              <Tooltip content="Move Down" placement="top">
                <Button isIconOnly variant="bordered" onPress={handleMoveDown}>
                  <ArrowDown />
                </Button>
              </Tooltip>
            )}
            <Tooltip content="Advanced AI" placement="top">
              <Button isIconOnly variant="bordered">
                <MagicIcon />
              </Button>
            </Tooltip>
          </ButtonGroup>
        )}
      </AnimatePresence>
    </div>
  );
};
