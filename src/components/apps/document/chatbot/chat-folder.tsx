import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import DownChevronArrow from '@/icons/DownChevronArrow';
import FolderIcon from '@/icons/FolderIcon';
import { ChatHistoryInterface, ArchivedChatInterface, ArchivedFolderCollectionInterface, ChatInterface, FolderInterface, FolderCollectionInterface } from '@/types/chat';
import ChatHistory from './chat-history';
import NewChat from './new-chat';
import EditIcon from '@/icons/EditIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import CrossIcon from '@/icons/CrossIcon';
import TickIcon from '@/icons/TickIcon';
import ColorPaletteIcon from '@/icons/ColorPaletteIcon';
import RefreshIcon from '@/icons/RefreshIcon';
import { folderColorOptions } from '@/constants/color';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Trash, Undo } from "lucide-react";
import { useGeneralContext } from "@/context/general-context-provider";
import { useFolderManagement } from "@/hooks/use-folder-management";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ArrowUpFromLine, ArrowDownFromLine, MoreHorizontal, Building } from 'lucide-react';

const ChatFolder = ({
  folderChats,
  folderId,
}: {
  folderChats: ChatHistoryInterface[];
  folderId: string;
}) => {
  const isArchived = useStore((state) => state.archivedFolders[folderId]?.isArchived);
  const folderName = isArchived ? useStore((state) => state.archivedFolders[folderId]?.folder.folderName) : useStore((state) => state.folders[folderId]?.folderName);
  const isExpanded = isArchived ? useStore((state) => state.archivedFolders[folderId]?.folder.expanded) : useStore((state) => state.folders[folderId]?.expanded);
  const color = useStore((state) => state.folders[folderId]?.color);
  const setChats = useStore((state) => state.setChats);
  const setArchivedChats = useStore((state) => state.setArchivedChats);
  const setFolders = useStore((state) => state.setFolders);
  const setArchivedFolders = useStore((state) => state.setArchivedFolders);
  const managements = useFolderManagement();

  const inputRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [_folderName, _setFolderName] = useState<string>(folderName);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const { setSelectedFolder } = useGeneralContext();
  const [showPalette, setShowPalette, paletteRef] = useHideOnOutsideClick();
  const updateChat = useMutation(api.chats.updateChat);
  const archiveChat = useMutation(api.chats.archiveChat);
  const removeChat = useMutation(api.chats.removeChat);
  const restoreChat = useMutation(api.chats.restoreChat);
  const archiveFolder = useMutation(api.chats.archiveFolder);
  const restoreFolder = useMutation(api.chats.restoreFolder);
  const updateFolder = useMutation(api.chats.updateFolder);
  const removeFolder = useMutation(api.chats.removeFolder);

  const handleUpdateCloudFolder = async (id: Id<"chats">, folderIndex: number, folderData: FolderInterface) => {
    try {
      await updateFolder({ id: id, folderIndex: folderIndex, folderData: folderData });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleArchiveCloudChat = async (id: Id<"chats">) => {
    try {
      await archiveChat({ id: id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleArchiveCloudFolder = async (id: Id<"chats">) => {
    try {
      await archiveFolder({ id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRestoreCloudFolder = async (id: Id<"chats">) => {
    try {
      await restoreFolder({ id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRemoveCloudFolder = async (id: Id<"chats">) => {
    try {
      await removeFolder({ id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRestoreCloudChat = async (id: Id<"chats">) => {
    try {
      await restoreChat({ id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRemoveCloudChat = async (id: Id<"chats">) => {
    try {
      await removeChat({ id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const editTitle = () => {
    const updatedFolders: FolderCollectionInterface = JSON.parse(
      JSON.stringify(useStore.getState().folders)
    );
    updatedFolders[folderId].folderName = _folderName;
    setFolders(updatedFolders);
    handleUpdateCloudFolder(updatedFolders[folderId].cloudFolderId, updatedFolders[folderId].order, updatedFolders[folderId]);
    setIsEdit(false);
  };

  const handleRemoveFolder = () => {
    const archivedChats = JSON.parse(
      JSON.stringify(useStore.getState().archivedChats)
    );
    const archivedFolders = JSON.parse(
      JSON.stringify(useStore.getState().archivedFolders)
    );
    const archivedFoldersArray = Object.values(archivedFolders);
    const folderIndex = archivedFoldersArray.findIndex((folder) => folder.folderId === folderId);
    if (folderIndex === -1) {
        console.error(`Folder with id ${folderId} not found in archived folders`);
        return;
    }
    const removedFolder = archivedFoldersArray[folderIndex].folder;
    archivedFoldersArray.splice(folderIndex, 1);
    const newArchivedFolders = Object.fromEntries(
        archivedFoldersArray.map((folder) => [folder.folderId, folder])
    );
    setArchivedFolders(newArchivedFolders);
    handleRemoveCloudFolder(removedFolder.cloudFolderId);
    for (let index = archivedChats.length - 1; index >= 0; index--) {
      const chat = archivedChats[index];
      if (chat.folderId === folderId) {
        archivedChats.splice(index, 1);
        handleRemoveCloudChat(chat.cloudChatId);
        delete chat.folderId;
      }
    }
    setArchivedChats(archivedChats);
  };

  const deleteFolder = () => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const archivedChats = JSON.parse(
      JSON.stringify(useStore.getState().archivedChats)
    );
    const archivedFolders = JSON.parse(
      JSON.stringify(useStore.getState().archivedFolders)
    );
    for (let index = updatedChats.length - 1; index >= 0; index--) {
      const chat = updatedChats[index];
      if (chat.folderId === folderId) {
        const _currentArchiveChat: ArchivedChatInterface = {
            chatId: chat.chatId,
            chatTitle: chat.chatTitle,
            folderId: folderId,
            chat,
            isArchived: true
        };
        archivedChats.push(_currentArchiveChat);
        handleArchiveCloudChat(chat.cloudChatId);
        delete chat.folderId;
        updatedChats.splice(index, 1);
      }
    }
    setArchivedChats(archivedChats);
    setChats(updatedChats);
    const updatedFolders: FolderCollectionInterface = JSON.parse(
      JSON.stringify(useStore.getState().folders)
    );
    const _currentArchiveFolder: ArchivedFolderCollectionInterface = {
      folderId,
      folderIndex: updatedFolders[folderId].order,
      folder: updatedFolders[folderId],
      isArchived: true
    };
    setArchivedFolders({ [folderId]: _currentArchiveFolder, ...archivedFolders });
    handleArchiveCloudFolder(updatedFolders[folderId].cloudFolderId);
    delete updatedFolders[folderId];
    setFolders(updatedFolders);
    setIsDelete(false);
  };

  const handleRestoreFolder = () => {
    const updatedChats = JSON.parse(
        JSON.stringify(useStore.getState().chats)
    );
    const updatedFolders = JSON.parse(
        JSON.stringify(useStore.getState().folders)
    );
    const archivedChats = JSON.parse(
        JSON.stringify(useStore.getState().archivedChats)
    );
    const archivedFolders = JSON.parse(
        JSON.stringify(useStore.getState().archivedFolders)
    );
    const archivedFoldersArray = Object.values(archivedFolders);

    const folderIndex = archivedFoldersArray.findIndex((folder) => folder.folderId === folderId);
    if (folderIndex === -1) {
        console.error(`Folder with id ${folderId} not found in archived folders`);
        return;
    }
    const restoredFolder = archivedFoldersArray[folderIndex].folder;
    updatedFolders[restoredFolder.folderId] = restoredFolder;
    setFolders(updatedFolders);
    archivedFoldersArray.splice(folderIndex, 1);
    const newArchivedFolders = Object.fromEntries(
        archivedFoldersArray.map((folder) => [folder.folderId, folder])
    );
    setArchivedFolders(newArchivedFolders);
    handleRestoreCloudFolder(restoredFolder.cloudFolderId);
    for (let index = archivedChats.length - 1; index >= 0; index--) {
      const chat = archivedChats[index];
      if (chat.folderId === folderId) {
        if(!chat.chat.folderId) chat.chat.folderId = folderId;
        updatedChats.push(chat.chat);
        archivedChats.splice(index, 1);
        handleRestoreCloudChat(chat.chat.cloudChatId);
      }
    }
    setChats(updatedChats);
    setArchivedChats(archivedChats);
    setIsDelete(false);
  };

  const updateColor = (_color?: string) => {
    const updatedFolders: FolderCollectionInterface = JSON.parse(
      JSON.stringify(useStore.getState().folders)
    );
    if (_color) updatedFolders[folderId].color = _color;
    else delete updatedFolders[folderId].color;
    setFolders(updatedFolders);
    handleUpdateCloudFolder(updatedFolders[folderId].cloudFolderId, updatedFolders[folderId].order, updatedFolders[folderId]);
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
    else if (isDelete) deleteFolder();
  };

  const handleCross = () => {
    setIsDelete(false);
    setIsEdit(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.stopPropagation();
      setIsHover(false);
      const updatedFolders: FolderCollectionInterface = JSON.parse(
        JSON.stringify(useStore.getState().folders)
      );
      updatedFolders[folderId].expanded = true;
      handleUpdateCloudFolder(updatedFolders[folderId].cloudFolderId, updatedFolders[folderId].order, updatedFolders[folderId]);
      setFolders(updatedFolders);

      const chatIndex = Number(e.dataTransfer.getData('chatIndex'));
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[chatIndex].folderId = folderId;
      const chatId = updatedChats[chatIndex].chatId;
      setChats(updatedChats);
      const newChatIndex = updatedChats.findIndex((chat) => chat.chatId === chatId);
      handleUpdateCloudChat(updatedChats[newChatIndex].cloudChatId, newChatIndex, updatedChats[newChatIndex]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHover(true);
  };

  const handleDragLeave = () => {
    setIsHover(false);
  };

  const toggleExpanded = () => {
    const updatedFolders = JSON.parse(
      JSON.stringify(useStore.getState().folders)
    );
    const archivedFolders = JSON.parse(
      JSON.stringify(useStore.getState().archivedFolders)
    );

    if (updatedFolders[folderId] && !isArchived) {
      updatedFolders[folderId].expanded = !updatedFolders[folderId].expanded;
      setFolders(updatedFolders);
      handleUpdateCloudFolder(updatedFolders[folderId].cloudFolderId, updatedFolders[folderId].order, updatedFolders[folderId]);
    }

    if (archivedFolders[folderId] && isArchived) {
      archivedFolders[folderId].folder.expanded = !archivedFolders[folderId].folder.expanded;
      setArchivedFolders(archivedFolders);
      handleUpdateCloudFolder(archivedFolders[folderId].folder.cloudFolderId, archivedFolders[folderId].folder.order, archivedFolders[folderId].folder);
    }
  };

  const moveFolder = (direction: 'up' | 'down') => {
    const updatedFolders: FolderCollectionInterface = JSON.parse(
        JSON.stringify(useStore.getState().folders)
    );
    const foldersArray = Object.values(updatedFolders);
    let currentIndex = foldersArray.findIndex((folder) => folder.folderId === folderId);
    let newIndex;
    if (direction === 'up' && currentIndex > 0) {
        newIndex = currentIndex - 1; 
    } else if (direction === 'down' && currentIndex < foldersArray.length - 1) {
        newIndex = currentIndex + 1;
    } else {
        return; 
    }
    const temp = foldersArray[currentIndex];
    foldersArray[currentIndex] = foldersArray[newIndex];
    foldersArray[newIndex] = temp;

    foldersArray.forEach((folder, i) => {
      updatedFolders[folder.folderId].order = i;
      handleUpdateCloudFolder(folder.cloudFolderId, folder.order, folder);
    });
    const newUpdatedFolders = Object.fromEntries(foldersArray.map(folder => [folder.folderId, folder]));
    setFolders(newUpdatedFolders);
  };

  useEffect(() => {
    if (inputRef && inputRef.current) inputRef.current.focus();
  }, [isEdit]);

  const handleManagement = () => {
    const updatedFolders: FolderCollectionInterface = JSON.parse(
      JSON.stringify(useStore.getState().folders)
    );
    const cloudFolderId = updatedFolders[folderId].cloudFolderId;
    if (!cloudFolderId) return;
    setSelectedFolder(cloudFolderId);
    managements.onOpen();
  };

  return (
    <div
      className={`w-full transition-colors group/folder ${
        isHover ? 'bg-neutral-400' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        style={{ background: color || '' }}
        className={`${
          color ? '' : 'hover:bg-slate-300'
        } transition-colors flex py-2 pl-2 pr-1 items-center gap-3 text-black dark:text-white relative rounded-md break-all cursor-pointer parent-sibling`}
        onClick={toggleExpanded}
        ref={folderRef}
        onMouseEnter={() => {
          if (color && folderRef.current)
            folderRef.current.style.background = `${color}dd`;
          if (gradientRef.current) gradientRef.current.style.width = '0px';
        }}
        onMouseLeave={() => {
          if (color && folderRef.current)
            folderRef.current.style.background = color;
          if (gradientRef.current) gradientRef.current.style.width = '1rem';
        }}
      >
        <FolderIcon className='h-4 w-4' />
        <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'>
          {isEdit ? (
            <input
              type='text'
              className='focus:outline-blue-600 text-sm border-none bg-transparent p-0 m-0 w-full'
              value={_folderName}
              onChange={(e) => {
                _setFolderName(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            _folderName
          )}
          {isEdit || (
            <div
              ref={gradientRef}
              className='absolute inset-y-0 right-0 w-4 z-10 transition-all'
              style={{
                background:
                  color &&
                  `linear-gradient(to left, ${
                    color || 'var(--color-900)'
                  }, rgb(32 33 35 / 0))`,
              }}
            />
          )}
        </div>
        <div
          className='flex dark:text-slate-100 text-gray-600'
          onClick={(e) => e.stopPropagation()}
        >
          {isDelete || isEdit ? (
            <React.Fragment>
              <button
                className='p-1 dark:hover:text-white hover:text-gray-900'
                onClick={handleTick}
                aria-label='confirm'
              >
                <TickIcon />
              </button>
              <button
                className='p-1 dark:hover:text-white hover:text-gray-900'
                onClick={handleCross}
                aria-label='cancel'
              >
                <CrossIcon />
              </button>
            </React.Fragment>
          ) : (
            !isArchived ? (
              <React.Fragment>
                <div
                  className='relative md:hidden group-hover/folder:md:inline'
                  ref={paletteRef}
                >
                  <button
                    className='p-1 dark:hover:text-white hover:text-gray-900'
                    onClick={() => {
                      setShowPalette((prev) => !prev);
                    }}
                    aria-label='folder color'
                  >
                    <ColorPaletteIcon />
                  </button>
                  {showPalette && (
                    <div className='absolute left-0 bottom-0 translate-y-full p-2 z-20 bg-gray-900 rounded border border-gray-600 flex flex-col gap-2 items-center'>
                      <>
                        {folderColorOptions.map((c) => (
                          <button
                            key={c}
                            style={{ background: c }}
                            className={`hover:scale-90 transition-transform h-4 w-4 rounded-full`}
                            onClick={() => {
                              updateColor(c);
                            }}
                            aria-label={c}
                          />
                        ))}
                        <button
                          onClick={() => {
                            updateColor();
                          }}
                          aria-label='default color'
                        >
                          <RefreshIcon />
                        </button>
                      </>
                    </div>
                  )}
                </div>
                <button
                  className='p-1 dark:hover:text-white hover:text-gray-900 md:hidden group-hover/folder:md:inline'
                  onClick={() => setIsEdit(true)}
                  aria-label='edit folder title'
                >
                  <EditIcon />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                    <div role="button" className="p-1 dark:hover:text-white hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
                    <DropdownMenuItem onClick={handleManagement} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200">
                      <Building className="h-4 w-4 mr-2" />
                        Organization
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  className='p-1 dark:hover:text-white hover:text-gray-900'
                  onClick={() => setIsDelete(true)}
                  aria-label='delete chat'
                >
                  <DeleteIcon />
                </button>
                <button
                  className='p-1 dark:hover:text-white hover:text-gray-900'
                  onClick={() => moveFolder('up')}
                  aria-label='move folder up'
                  disabled={folderId === Object.keys(useStore.getState().folders)[0]}
                >
                  <ArrowUpFromLine size={16} />
                </button>
                <button
                  className='p-1 dark:hover:text-white hover:text-gray-900'
                  onClick={() => moveFolder('down')}
                  aria-label='move folder down'
                  disabled={folderId === Object.keys(useStore.getState().folders)[Object.keys(useStore.getState().folders).length - 1]}
                >
                  <ArrowDownFromLine size={16} />
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="flex items-center">
                  <div
                    onClick={handleRestoreFolder}
                    role="button"
                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  >
                    <Undo className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <ConfirmModal onConfirm={handleRemoveFolder}>
                    <div
                      role="button"
                      className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                      <DeleteIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </ConfirmModal>
                </div>
              </React.Fragment>
            )
          )}
          <button
            className='p-1 dark:hover:text-white hover:text-gray-900'
            onClick={toggleExpanded}
            aria-label='expand folder'
          >
            <DownChevronArrow
              className={`${
                isExpanded ? 'rotate-180' : ''
              } transition-transform`}
            />
          </button>
        </div>
      </div>
      <div className='ml-3 pl-1 border-l-2 border-gray-700 flex flex-col gap-1 parent'>
        {isExpanded && <NewChat folderId={folderId} />}
        {isExpanded &&
          folderChats.map((chat) => (
            <ChatHistory
              chatId={chat.chatId}
              cloudChatId={chat.cloudChatId}
              chatTitle={chat.chatTitle}
              chatIndex={chat.chatIndex}
              folderId={folderId}
              isArchived={chat.isArchived}
              key={`${chat.chatTitle}-${chat.chatIndex}`}
            />
          ))}
      </div>
    </div>
  );
};

export default ChatFolder;

