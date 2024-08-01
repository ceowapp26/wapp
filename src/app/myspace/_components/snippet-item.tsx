import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import DownChevronArrow from '@/icons/DownChevronArrow';
import EditIcon from '@/icons/EditIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import CrossIcon from '@/icons/CrossIcon';
import TickIcon from '@/icons/TickIcon';
import ColorPaletteIcon from '@/icons/ColorPaletteIcon';
import RefreshIcon from '@/icons/RefreshIcon';
import { folderColorOptions } from '@/constants/color';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@mui/material';
import { ClipboardList, GripVertical, Edit, Trash2, X, Check, Palette, RefreshCw, ChevronDown } from 'lucide-react';

const SnippetItem = React.memo(
  ({ snippetId, cloudSnippetId, content, snippetIndex }: { snippetId: string, cloudSnippetId: string, content: string, snippetIndex: number }) => {
  const snippets = useStore((state) => state.snippets);
  const isExpanded = useStore((state) => state.snippets[snippetIndex]?.expanded);
  const color = useStore((state) => state.snippets[snippetIndex]?.color);
  const setSnippets = useStore((state) => state.setSnippets);
  const inputRef = useRef<HTMLInputElement>(null);
  const snippetRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [snippetName, setSnippetName] = useState<string>(snippets[snippetIndex]?.snippetName || '');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [showPalette, setShowPalette, paletteRef] = useHideOnOutsideClick();
  const [draggedSnippetId, setDraggedSnippetId] = useState<string | null>(null);
  const updateSnippet = useMutation(api.snippets.updateSnippet);
  const removeSnippet = useMutation(api.snippets.removeSnippet);

  const handleUpdateCloudSnippet = async (id: Id<"snippets">, snippetIndex:number, snippet: SnippetInterface) => {
    try {
      await updateSnippet({ id: id, snippetIndex: snippetIndex, snippet: snippet });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRemoveCloudSnippet = async (id: Id<"snippets">) => {
    try {
      await removeSnippet({ id: id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const editTitle = () => {
    const updatedSnippets = JSON.parse(
      JSON.stringify(useStore.getState().snippets)
    );
    updatedSnippets[snippetIndex].snippetName = snippetName;
    setSnippets(updatedSnippets);
    handleUpdateCloudSnippet(cloudSnippetId, updatedSnippets[snippetIndex].order, updatedSnippets[snippetIndex]);
    setIsEdit(false);
  };

  const handleDeleteSnippet = () => {
    const updatedSnippets = JSON.parse(
      JSON.stringify(useStore.getState().snippets)
    );
    handleRemoveCloudSnippet(cloudSnippetId);
    delete updatedSnippets[snippetIndex];
    setSnippets(updatedSnippets);
    setIsDelete(false);
  };

  const updateColor = (_color?: string) => {
    const updatedSnippets = JSON.parse(
      JSON.stringify(useStore.getState().snippets)
    );
    if (_color) updatedSnippets[snippetIndex].color = _color;
    else delete updatedSnippets[snippetIndex].color;
    setSnippets(updatedSnippets);
    handleUpdateCloudSnippet(cloudSnippetId, updatedSnippets[snippetIndex].order, updatedSnippets[snippetIndex]);
    setShowPalette(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editTitle();
    }
  };

  const handleTick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isEdit) editTitle();
    else if (isDelete) handleDeleteSnippet();
  };

  const handleCross = () => {
    setIsDelete(false);
    setIsEdit(false);
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, snippetId: string, content: string) => {
    event.dataTransfer.setData('text/plain', content);
    setDraggedSnippetId(snippetId);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    if (draggedSnippetId) {
      const updatedSnippets = JSON.parse(
        JSON.stringify(useStore.getState().snippets)
      );
      const draggedSnippetIndex = updatedSnippets.findIndex((snippet) => snippet.snippetId === draggedSnippetId);
      const draggedSnippet = updatedSnippets[draggedSnippetIndex];
      const targetIndex = Object.keys(updatedSnippets).indexOf(targetId);
      const targetSnippet = updatedSnippets[targetIndex];
      const reorderedSnippets = Object.entries(updatedSnippets);
      reorderedSnippets.splice(targetIndex, 0, [draggedSnippetId, draggedSnippet]);
      const newSnippets = Object.fromEntries(reorderedSnippets);
      setSnippets(newSnippets);
      handleUpdateCloudSnippet(draggedSnippet.cloudSnippetId, draggedSnippetIndex, draggedSnippet);
      handleUpdateCloudSnippet(targetSnippet.cloudSnippetId, targetIndex, targetSnippet);
      setDraggedSnippetId(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHover(true);
  };

  const handleDragLeave = () => {
    setIsHover(false);
  };

  const toggleExpanded = () => {
    const updatedSnippets = JSON.parse(
      JSON.stringify(useStore.getState().snippets)
    );
    if (updatedSnippets[snippetIndex]) {
      updatedSnippets[snippetIndex].expanded = !updatedSnippets[snippetIndex].expanded;
      setSnippets(updatedSnippets);
      handleUpdateCloudSnippet(cloudSnippetId, updatedSnippets[snippetIndex].order, updatedSnippets[snippetIndex]);
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [isEdit]);

  const snippetVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <div
      className={`w-full transition-colors rounded-md mb-4 group/folder ${isHover ? 'bg-neutral-400' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, snippetId, content)}
      onDrop={(e) => onDrop(e, snippetId)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        style={{ background: color || '' }}
        className={`${color ? '' : 'hover:bg-slate-300'} transition-colors flex py-2 pl-2 pr-1 items-center gap-3 text-black rounded-md dark:text-white relative break-all cursor-pointer`}
        onClick={toggleExpanded}
        ref={snippetRef}
        onMouseEnter={() => {
          if (color && snippetRef.current) snippetRef.current.style.background = `${color}dd`;
          if (gradientRef.current) gradientRef.current.style.width = '0px';
        }}
        onMouseLeave={() => {
          if (color && snippetRef.current) snippetRef.current.style.background = color;
          if (gradientRef.current) gradientRef.current.style.width = '1rem';
        }}
      >
        <motion.div className="flex items-center" whileHover={{ x: 5 }} whileTap={{ x: -5 }}>
          <GripVertical className='h-4 w-4 mr-2 text-gray-500' />
          <div className="h-4 border-l border-gray-300 mx-2"></div>
          <ClipboardList className='h-4 w-4 ml-2 text-blue-500' /> 
        </motion.div>
        <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
          {isEdit ? (
            <input
              type='text'
              className='focus:outline-blue-600 text-sm border-none bg-transparent p-0 m-0 w-full'
              value={snippetName}
              onChange={(e) => setSnippetName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            snippetName
          )}
          {isEdit || (
            <div
              ref={gradientRef}
              className='absolute inset-y-0 right-0 w-4 z-10 transition-all'
              style={{
                background: color && `linear-gradient(to left, ${color || 'var(--color-900)'}, rgb(32 33 35 / 0))`,
              }}
            />
          )}
        </div>
        <div className='flex dark:text-slate-100 text-gray-600' onClick={(e) => e.stopPropagation()}>
          {isDelete || isEdit ? (
            <React.Fragment>
              <Tooltip title="Confirm">
                <motion.button 
                  className='p-1 text-green-500 hover:text-green-600' 
                  onClick={handleTick}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
              </Tooltip>
              <Tooltip title="Cancel">
                <motion.button 
                  className='p-1 text-red-500 hover:text-red-600' 
                  onClick={handleCross}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </Tooltip>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className='relative md:hidden group-hover/folder:md:inline' ref={paletteRef}>
                <Tooltip title="Change Color">
                  <motion.button
                    className='p-1 mt-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPalette((prev) => !prev);
                    }}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Palette className="w-4 h-4" />
                  </motion.button>
                </Tooltip>
                {showPalette && (
                  <div className='absolute left-0 bottom-0 translate-y-full p-2 z-20 bg-gray-900 rounded border border-gray-600 flex flex-col gap-2 items-center'>
                    {folderColorOptions.map((c) => (
                      <button
                        key={c}
                        style={{ background: c }}
                        className={`hover:scale-90 transition-transform h-4 w-4 rounded-full`}
                        onClick={(e) => updateColor(e, c)}
                        aria-label={c}
                      />
                    ))}
                    <button 
                      onClick={(e) => updateColor(e)} 
                      className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <Tooltip title="Edit">
                <motion.button 
                  className='p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden group-hover/folder:md:inline' 
                  onClick={() => setIsEdit(true)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              </Tooltip>
              <Tooltip title="Delete">
                <motion.button 
                  className='p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' 
                  onClick={() => setIsDelete(true)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </Tooltip>
              <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
                <motion.button 
                  className='p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' 
                  onClick={toggleExpanded}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ChevronDown className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </motion.button>
              </Tooltip>
            </React.Fragment>
          )}
          <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
            <motion.button 
              className='p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' 
              onClick={toggleExpanded}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ChevronDown className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </motion.button>
          </Tooltip>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='ml-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600 text-slate-600 dark:text-slate-300'
          >
            <div 
              dangerouslySetInnerHTML={{ __html: content }} 
              className="py-4 px-2 text-sm leading-relaxed overflow-auto max-h-60"
              style={{
                textAlign: 'start',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word', 
                overflowWrap: 'break-word',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SnippetItem;
