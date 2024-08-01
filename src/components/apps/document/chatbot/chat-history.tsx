import React, { useEffect, useRef, useState } from 'react';
import { useInitializeNewChat } from '@/hooks/use-initialize-newchat';
import { useStore } from '@/redux/features/apps/document/store';
import ChatIcon from '@/icons/ChatIcon';
import CrossIcon from '@/icons/CrossIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import EditIcon from '@/icons/EditIcon';
import TickIcon from '@/icons/TickIcon';
import { ArchiveRestore } from 'lucide-react';
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useChatMetadatas } from "@/hooks/use-chat-metadatas";
import { useChatManagement } from "@/hooks/use-chat-management";
import { Trash, Plus, ChevronDown, ChevronRight, MoreHorizontal, Undo, Building } from "lucide-react";
import {
  ArchivedChatInterface,
  ChatInterface
} from '@/types/chat';
import { ArrowUpFromLine, ArrowDownFromLine } from 'lucide-react';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useGeneralContext } from "@/context/general-context-provider";

const ChatHistoryClass = {
  normal:
    'flex py-2 px-2 items-center gap-3 relative rounded-md bg-white-900 text-black dark:text-white hover:bg-slate-300 break-all hover:pr-4 group transition-opacity',
  active:
    'flex py-2 px-2 items-center gap-3 relative rounded-md break-all pr-14 text-black dark:text-white bg-neutral-400 hover:bg-gray-300 group transition-opacity',
  normalGradient:
    'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-white-900 group-hover:from-white-850',
  activeGradient:
    'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-white-800',
};

const ChatHistory = React.memo(
  ({ chatId, documentId, userId, orgId, cloudChatId, chatTitle, chatIndex, isArchived }: { chatId: string, documentId: string, userId: string, orgId: string, cloudChatId: string, chatTitle: string, chatIndex: number, isArchived: boolean }) => {
    const initializeNewChat = useInitializeNewChat();
    const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
    const setChats = useStore((state) => state.setChats);
    const setArchivedChats = useStore((state) => state.setArchivedChats);
    const active = useStore((state) => state.currentChatIndex === chatIndex);
    const generating = useStore((state) => state.generating);
    const chats = useStore((state) => state.chats);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [_title, _setTitle] = useState<string>(chatTitle);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setSelectedChat } = useGeneralContext();
    const metadatas = useChatMetadatas();
    const managements = useChatManagement();
    const archiveChat = useMutation(api.chats.archiveChat);
    const removeChat = useMutation(api.chats.removeChat);
    const restoreChat = useMutation(api.chats.restoreChat);
    const updateChat = useMutation(api.chats.updateChat);
    const {
      leftSidebarWidth,
      isRightSidebarOpened,
      setIsRightSidebarOpened,
      rightSidebarType,
      setRightSidebarType,
    } = useMyspaceContext();

    const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex:number, chat: ChatInterface) => {
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

    const handleRestoreCloudChat = async (id: Id<"chats">) => {
      try {
        await restoreChat({ id: id });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const handleRemoveCloudChat = async (id: Id<"chats">) => {
      try {
        await removeChat({ id: id });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const handleRemoveChat = () => {
      const archivedChats = JSON.parse(
        JSON.stringify(useStore.getState().archivedChats)
      );
      const chatIndex = archivedChats.findIndex((chat) => chat.chatId === chatId);
      const removedChat = archivedChats[chatIndex];
      archivedChats.splice(chatIndex, 1);
      setArchivedChats(archivedChats);
      handleRemoveCloudChat(removedChat.chat.cloudChatId);
    };

    const handleRestoreChat = () => {
      const updatedChats = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const archivedChats = JSON.parse(
        JSON.stringify(useStore.getState().archivedChats)
      );
      const chatIndex = archivedChats.findIndex((chat) => chat.chatId === chatId);
      const restoredChat = archivedChats[chatIndex];
      if (restoredChat && restoredChat.folderId) {
        restoredChat.chat.folderId = restoredChat.folderId;
      }
      updatedChats.splice(0, 0, restoredChat.chat);
      setChats(updatedChats);
      archivedChats.splice(chatIndex, 1);
      setArchivedChats(archivedChats);
      handleRestoreCloudChat(restoredChat.chat.cloudChatId);
    };

    const editTitle = () => {
      const updatedChats = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[chatIndex].chatTitle = _title;
      setChats(updatedChats);
      const chatId = updatedChats[chatIndex].chatId;
      const newChatIndex = updatedChats.findIndex((chat) => chat.chatId === chatId);
      handleUpdateCloudChat(updatedChats[chatIndex].cloudChatId, newChatIndex, updatedChats[chatIndex]);
      setIsEdit(false);
    };

    const deleteChat = () => {
      const updatedChats = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const archivedChats = JSON.parse(
        JSON.stringify(useStore.getState().archivedChats)
      );
      const _currentArchiveChat = {
        chatId: chatId,
        chatTitle: chatTitle,
        chat: updatedChats[chatIndex],
        chatIndex: chatIndex,
        isArchived: true
      };
      if (updatedChats[chatIndex].folderId) {
        _currentArchiveChat.folderId = updatedChats[chatIndex].folderId;
      }
      archivedChats.push(_currentArchiveChat);
      setArchivedChats(archivedChats);
      updatedChats.splice(chatIndex, 1);
      if (updatedChats.length > 0) {
        setCurrentChatIndex(0);
        setChats(updatedChats);
        handleArchiveCloudChat(cloudChatId);
      } else {
        initializeNewChat();
      }
      setIsDelete(false);
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
      else if (isDelete) deleteChat();
    };

    const handleCross = () => {
      setIsDelete(false);
      setIsEdit(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData('chatIndex', String(chatIndex));
      }
    };

    const handleMetadata = () => {
      if (!cloudChatId) return;
      setSelectedChat(cloudChatId);
      metadatas.onOpen();
    };

    const handleManagement = () => {
      if (!cloudChatId) return;
      setSelectedChat(cloudChatId);
      managements.onOpen();
    };

    const handleSidebar = () => {
      if (rightSidebarType !== 'right-ai') setRightSidebarType('right-ai');
      if (!isRightSidebarOpened) setIsRightSidebarOpened(true);
    };

    const moveChat = (direction: 'up' | 'down') => {
      const updatedChats: FolderCollectionInterface = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const chatsArray = Object.values(updatedChats);
      let currentIndex = chatsArray.findIndex((chat) => chat.chatId === chatId);
      let newIndex;
      if (direction === 'up' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (direction === 'down' && currentIndex < chatsArray.length - 1) {
        newIndex = currentIndex + 1;
      } else {
        return;
      }
      const temp = chatsArray[currentIndex];
      chatsArray[currentIndex] = chatsArray[newIndex];
      chatsArray[newIndex] = temp;
      chatsArray.forEach((chat, index) => {
        handleUpdateCloudChat(chat.cloudChatId, index, chat);
      });
      const newUpdatedChats = Object.values(chatsArray);
      setChats(newUpdatedChats);
    };

    useEffect(() => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    }, [isEdit]);

    return (
      <a
        className={`${
          active ? ChatHistoryClass.active : ChatHistoryClass.normal
        } ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        onClick={() => {
          if (!generating) setCurrentChatIndex(chatIndex);
          handleSidebar();
        }}
        draggable
        onDragStart={handleDragStart}
      >
        <ChatIcon />
        <div className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative' title={chatTitle}>
          {isEdit ? (
            <input
              type='text'
              className='focus:outline-blue-600 text-sm border-none bg-transparent p-0 m-0 w-full'
              value={_title}
              onChange={(e) => {
                _setTitle(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            _title
          )}
          {isEdit || (
            <div
              className={
                active
                  ? ChatHistoryClass.activeGradient
                  : ChatHistoryClass.normalGradient
              }
            />
          )}
        </div>
        {active && (
          <div className='absolute flex right-1 z-10 text-gray-600 dark:text-slate-100 visible'>
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
              <React.Fragment>
                {!isArchived ? (
                  <React.Fragment>
                    {leftSidebarWidth > 250 && (
                      <React.Fragment>
                        <button
                          className='p-1 dark:hover:text-white hover:text-gray-900'
                          onClick={() => moveChat('up')}
                          aria-label='move folder up'
                        >
                          <ArrowUpFromLine size={16} />
                        </button>
                        <button
                          className='p-1 dark:hover:text-white hover:text-gray-900'
                          onClick={() => moveChat('down')}
                          aria-label='move folder down'
                        >
                          <ArrowDownFromLine size={16} />
                        </button>
                      </React.Fragment>
                    )}
                    <button
                      className='p-1 dark:hover:text-white hover:text-gray-900'
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEdit(true);
                      }}
                      aria-label='edit chat title'
                    >
                      <EditIcon />
                    </button>
                    <button
                      className='p-1 dark:hover:text-white hover:text-gray-900'
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDelete(true);
                      }}                      
                      aria-label='delete chat'
                    >
                      <DeleteIcon />
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
                        <DropdownMenuItem onClick={handleMetadata}>
                          <Plus className="h-4 w-4 mr-2" />
                          More
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="flex items-center">
                      <div
                        onClick={handleRestoreChat}
                        role="button"
                        className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                      >
                        <Undo className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <ConfirmModal onConfirm={handleRemoveChat}>
                        <div
                          role="button"
                          className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                        >
                          <DeleteIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </ConfirmModal>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        )}
      </a>
    );
  }
);

export default ChatHistory;







