import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import { shallow } from 'zustand/shallow';
import ChatFolder from './chat-folder';
import ChatHistory from './chat-history';
import ChatSearch from './chat-search';
import {
  ChatHistoryInterface,
  FolderCollectionInterface,
  ChatInterface,
  ArchivedChatInterface,
  FolderCollectionInterface,
  ArchivedFolderInterface,
  ArchivedFolderCollectionInterface,
} from '@/types/chat';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMediaQuery } from "usehooks-ts";
import { Trash, Undo } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const ChatHistoryList = ({ filterKey, filterValue }: { filterKey?: string, filterValue?: string }) => {
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);
  const chats = useStore((state) => state.chats);
  const archivedChats = useStore((state) => state.archivedChats);
  const folders = useStore((state) => state.folders);
  const archivedFolders = useStore((state) => state.archivedFolders);
  const setArchivedChats = useStore((state) => state.setArchivedChats);
  const setFolders = useStore((state) => state.setFolders);
  const setArchivedFolders = useStore((state) => state.setArchivedFolders);
  const chatTitles = useStore(
    (state) => state.chats?.map((chat) => chat.chatTitle),
    shallow
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isHover, setIsHover] = useState<boolean>(false);
  const [chatFolders, setChatFolders] = useState<FolderCollectionInterface>(
    {}
  );
  const [noChatFolders, setNoChatFolders] = useState<ChatHistoryInterface[]>(
    []
  );
  const [noChatFoldersWithFolderId, setNoChatFoldersWithFolderId] = useState<ChatHistoryInterface[]>(
    []
  );
  const [archivedChatFolders, setArchivedChatFolders] = useState<ArchivedFolderCollectionInterface>(
    {}
  );
  const [noArchivedChatFolders, setNoArchivedChatFolders] = useState<ArchivedChatInterface[]>(
    []
  );
  const [noArchivedChatFoldersWithFolderId, setNoArchivedChatFoldersWithFolderId] = useState<ArchivedChatInterface[]>(
    []
  );
  const [filterChats, setFilterChats] = useState<string>('');
  const [filterArchivedChats, setFilterArchivedChats] = useState<string>('');
  const chatsRef = useRef<ChatInterface[]>(useStore.getState().chats || []);
  const archivedChatsRef = useRef<ArchivedChatInterface[]>(useStore.getState().archivedChats || []);
  const foldersRef = useRef<FolderCollectionInterface>(useStore.getState().folders);
  const archivedFoldersRef = useRef<ArchivedFolderCollectionInterface>(useStore.getState().archivedFolders);
  const filterChatsRef = useRef<string>(filterChats);
  const filterArchivedChatsRef = useRef<string>(filterArchivedChats);
  const updateChat = useMutation(api.chats.updateChat);
  const updateFolder = useMutation(api.chats.updateFolder);

  const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };  

  const handleUpdateCloudFolder = async (id: Id<"chats">, folderIndex: number, folderData: FolderInterface) => {
    try {
      await updateFolder({ id: id, folderIndex: folderIndex, folderData: folderData });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateArchivedFolders = useRef(() => {
    const _folders: ArchivedFolderCollectionInterface = {};
    const _noFoldersWithFolderId: { [key: string]: ArchivedChatInterface[] } = {};
    const _noFolders: ArchivedChatInterface[] = [];
    const _archivedChats = useStore.getState().archivedChats;
    const _archivedFolders = useStore.getState().archivedFolders;
    if (!_archivedChats || !_archivedFolders) return;

    Object.values(_archivedFolders)
      .sort((a, b) => a.folder.order - b.folder.order)
      .forEach((f) => (_folders[f.folderId] = []));

    _archivedChats.forEach((item, index) => {
      const _filterLowerCase = filterArchivedChatsRef.current.toLowerCase();
      const _chatFolderName = item.folderId && _archivedFolders[item.folderId]
        ? _archivedFolders[item.folderId].folder.folderName.toLowerCase()
        : '';

      if (!item.folderId) {
        _noFolders.push({
          chatId: item.chat.chatId,
          userId: item.chat.userId,
          cloudChatId: item.chat.cloudChatId,
          chatTitle: item.chat.chatTitle,
          chatIndex: index,
          metaData: item.chat.metaData, 
          isArchived: item.isArchived,
          chat: item.chat,
        });
      } else if (item.folderId && !_archivedFolders[item.folderId]) {
        if (!_noFoldersWithFolderId[item.folderId]) _noFoldersWithFolderId[item.folderId] = [];
        _noFoldersWithFolderId[item.folderId].push({
          chatId: item.chat.chatId,
          userId: item.chat.userId,
          cloudChatId: item.chat.cloudChatId,
          folderId: item.folderId,
          chatTitle: item.chat.chatTitle,
          chatIndex: index,
          metaData: item.metaData,
          isArchived: item.isArchived,
          chat: item.chat,
        });
      } else {
        if (!_folders[item.folderId]) _folders[item.folderId] = [];
        _folders[item.folderId].push({
          chatId: item.chat.chatId,
          userId: item.chat.userId,
          cloudChatId: item.chat.cloudChatId,
          chatTitle: item.chat.chatTitle,
          folderId: item.folderId,
          isArchived: item.isArchived,
          metaData: item.metaData,
          chatIndex: index,
          chat: item.chat,
        });
      }
    });

    Object.keys(_noFoldersWithFolderId).forEach((folderId) => {
      if (_folders[folderId] && _folders[folderId].length === 0) {
        _noFoldersWithFolderId[folderId].forEach((chat) => {
          const chatExistsInFolder = _folders[folderId].some(existingChat => existingChat.chatId === chat.chatId);
          if (!chatExistsInFolder) {
            _folders[folderId].push(chat);
          }
        });
        _noFoldersWithFolderId[folderId].length = 0;
      }
    });
    const updatednoFoldersWithFolderId = Object.values(_noFoldersWithFolderId);
    const [_noFoldersWithFolderIdArray] = updatednoFoldersWithFolderId.length > 0 ? updatednoFoldersWithFolderId : [[]];
    setArchivedChatFolders(_folders);
    setNoArchivedChatFoldersWithFolderId(_noFoldersWithFolderIdArray);
    setNoArchivedChatFolders(_noFolders);
  }).current;

  const updateFolders = useRef(() => {
    const _folders: FolderCollectionInterface = {};
    const _noFoldersWithFolderId: { [key: string]: ChatHistoryInterface[] } = {};
    const _noFolders: ChatHistoryInterface[] = [];
    const _activeChats = useStore.getState().chats;
    const _activeFolders = useStore.getState().folders;

    Object.values(_activeFolders)
      .sort((a, b) => a.order - b.order)
      .forEach((f) => (_folders[f.folderId] = []));

    if (_activeChats) {
      _activeChats.forEach((chat, index) => {
        const _filterLowerCase = filterChatsRef.current.toLowerCase();
        const _chatTitle = chat.chatTitle.toLowerCase();
        const _chatFolderName = chat.folderId && _activeFolders[chat.folderId]
          ? _activeFolders[chat.folderId].folderName.toLowerCase()
          : '';

        if (
          !_chatTitle.includes(_filterLowerCase) &&
          !_chatFolderName.includes(_filterLowerCase) &&
          index !== useStore.getState().currentChatIndex
        )
          return;

        if (!chat.folderId) {
          _noFolders.push({
            chatId: chat.chatId,
            userId: chat.userId,
            cloudChatId: chat.cloudChatId,
            chatTitle: chat.chatTitle,
            chatIndex: index,
            metaData: chat.metaData,
            isArchived: chat.isArchived,
          });
        } else if (chat.folderId && !_activeFolders[chat.folderId]) {
          if (!_noFoldersWithFolderId[chat.folderId]) _noFoldersWithFolderId[chat.folderId] = [];
          _noFoldersWithFolderId[chat.folderId].push({
            chatId: chat.chatId,
            userId: chat.userId,
            cloudChatId: chat.cloudChatId,
            folderId: chat.folderId,
            chatTitle: chat.chatTitle,
            chatIndex: index,
            metaData: chat.metaData,
            isArchived: chat.isArchived,
          });
        } else {
          if (!_folders[chat.folderId]) _folders[chat.folderId] = [];
          _folders[chat.folderId].push({
            chatId: chat.chatId,
            userId: chat.userId,
            cloudChatId: chat.cloudChatId,
            chatTitle: chat.chatTitle,
            folderId: chat.folderId,
            isArchived: chat.isArchived,
            chatIndex: index,
            metaData: chat.metaData,
          });
        }
      });
    }
    Object.keys(_noFoldersWithFolderId).forEach((folderId) => {
      if (_folders[folderId] && _folders[folderId].length === 0) {
        _noFoldersWithFolderId[folderId].forEach((chat) => {
          const chatExistsInFolder = _folders[folderId].some(existingChat => existingChat.chatId === chat.chatId);
          if (!chatExistsInFolder) {
            _folders[folderId].push(chat);
          }
        });
        _noFoldersWithFolderId[folderId].length = 0;
      }
    });

    const updatednoFoldersWithFolderId = Object.values(_noFoldersWithFolderId);
    const [_noFoldersWithFolderIdArray] = updatednoFoldersWithFolderId.length > 0 ? updatednoFoldersWithFolderId : [[]];
    setChatFolders(_folders);
    setNoChatFoldersWithFolderId(_noFoldersWithFolderIdArray);
    setNoChatFolders(_noFolders);
  }).current;

  useEffect(() => {
    updateFolders();
    updateArchivedFolders();
    useStore.subscribe((state) => {
      if (
        !state.generating &&
        state.chats &&
        state.chats !== chatsRef.current
      ) {
        updateFolders();
        chatsRef.current = state.chats;
      } else if (state.folders !== foldersRef.current) {
        updateFolders();
        foldersRef.current = state.folders;
      }
      if (
        !state.generating &&
        state.archivedChats &&
        state.archivedChats !== archivedChatsRef.current
      ) {
        updateArchivedFolders();
        archivedChatsRef.current = state.archivedChats;
      } else if (state.archivedFolders !== archivedFoldersRef.current) {
        updateArchivedFolders();
        archivedFoldersRef.current = state.archivedFolders;
      }
    });
  }, []);

  useEffect(() => {
    if (
      chatTitles &&
      currentChatIndex >= 0 &&
      currentChatIndex < chatTitles.length
    ) {
      document.title = chatTitles[currentChatIndex];
      const chats = useStore.getState().chats;
      if (chats) {
        const folderId = chats[currentChatIndex].folderId;
        const updatedFolders: FolderCollectionInterface = JSON.parse(
            JSON.stringify(useStore.getState().folders)
        );
        if (folderId && updatedFolders[folderId]) {
          updatedFolders[folderId].expanded = true;
          setFolders(updatedFolders);
          handleUpdateCloudFolder(updatedFolders[folderId].cloudFolderId, updatedFolders[folderId].order, updatedFolders[folderId]);
        }
      }
    }

  }, [currentChatIndex, chatTitles]);

  useEffect(() => {
    filterChatsRef.current = filterChats;
    filterArchivedChatsRef.current = filterArchivedChats;
    updateFolders();
    updateArchivedFolders();
  }, [chats, archivedChats, folders, archivedFolders, filterChats, filterArchivedChats]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer) {
      e.stopPropagation();
      setIsHover(false);
      const chatIndex = Number(e.dataTransfer.getData('chatIndex'));
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      delete updatedChats[chatIndex].folderId;
      setChats(updatedChats);
      const chatId = updatedChats[chatIndex].chatId;
      const newChatIndex = updatedChats.findIndex((chat) => chat.chatId === chatId);
      handleUpdateCloudChat(updatedChats[chatIndex].cloudChatId, newChatIndex, updatedChats[chatIndex]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHover(true);
  };

  const handleDragLeave = () => {
    setIsHover(false);
  };

  const handleDragEnd = () => {
    setIsHover(false);
  };

  const filterByCriteria = (criteria, filterKey, filterValue) => {
    switch (filterKey) {
      case "org":
        return criteria.metaData.orgs?.includes(filterValue);
      case "user":
        return criteria.userId === filterValue;
      case "doc":
        return criteria.metaData.documents?.includes(filterValue);
      default:
        return false;
    }
  };

  const ActiveHistoryList = ({ filterKey, filterValue, chatFolders, noChatFolders, noChatFoldersWithFolderId }) => {
    const filteredChatFolders = useMemo(() => {
      if (filterKey && filterValue && chatFolders && Object.keys(chatFolders).length > 0) {
        const _filteredFolderKeys = Object.keys(folders).filter(folderId =>
          filterByCriteria(folders[folderId], filterKey, filterValue)
        );
      const filteredFolders = Object.keys(chatFolders)
        .filter(folderId => _filteredFolderKeys.includes(folderId))
        .reduce((filtered, folderId) => {
          filtered[folderId] = chatFolders[folderId];
          return filtered;
        }, {});

        return filteredFolders; 
      } else {
        return chatFolders;
      }
    }, [filterKey, filterValue, chatFolders]);

    const filteredNoChatFolders = useMemo(() => {
      if (filterKey && filterValue && noChatFolders && noChatFolders.length > 0) {
        return noChatFolders.filter((chat) => filterByCriteria(chat, filterKey, filterValue));
      }
      return noChatFolders;
    }, [filterKey, filterValue, noChatFolders]);

    const filteredNoChatFoldersWithFolderId = useMemo(() => {
      if (filterKey && filterValue && noChatFoldersWithFolderId && noChatFoldersWithFolderId.length > 0) {
        return noChatFoldersWithFolderId.filter((chat) => filterByCriteria(chat, filterKey, filterValue));
      }
      return noChatFoldersWithFolderId;
    }, [filterKey, filterValue, noChatFoldersWithFolderId]);

    return (
      <React.Fragment>
        <React.Fragment>
          {Object.keys(filteredChatFolders).map((folderId) => (
            <ChatFolder
              folderChats={filteredChatFolders[folderId]}
              folderId={folderId}
              key={folderId}
            />
          ))}
          {filteredNoChatFolders.map(({ chatId, documentId, userId, orgId, cloudChatId, chatTitle, chatIndex, isArchived }) => (
            <ChatHistory
              chatId={chatId}
              cloudChatId={cloudChatId}
              chatTitle={chatTitle}
              chatIndex={chatIndex}
              isArchived={isArchived}
              key={`${chatTitle}-${chatId}`}
            />
          ))}
          {filteredNoChatFoldersWithFolderId.map(({ chatId, documentId, userId, orgId, cloudChatId, chatTitle, chatIndex, isArchived }) => (
            <ChatHistory
              chatId={chatId}
              cloudChatId={cloudChatId}
              chatTitle={chatTitle}
              chatIndex={chatIndex}
              isArchived={isArchived}
              key={`${chatTitle}-${chatId}`}
            />
          ))}
        </React.Fragment>
      </React.Fragment>
    );
  };

  const ArchivedHistoryList = ({ filterKey, filterValue, archivedChatFolders, noArchivedChatFolders, noArchivedChatFoldersWithFolderId }) => {
    const filteredArchivedChatFolders = useMemo(() => {
      if (filterKey && filterValue && archivedFolders && Object.keys(archivedFolders).length > 0) {
        const _filteredArchivedFolderKeys = Object.keys(archivedFolders).filter(folderId =>
          filterByCriteria(archivedFolders[folderId].metaData, filterKey, filterValue)
        );
      const filteredArchivedFolders = Object.keys(archivedChatFolders)
        .filter(folderId => _filteredArchivedFolderKeys.includes(folderId))
        .reduce((filtered, folderId) => {
          filtered[folderId] = archivedChatFolders[folderId];
          return filtered;
        }, {});
        return filteredArchivedFolders; 
      } else {
        return archivedChatFolders
      }
    }, [filterKey, filterValue, chatFolders]);

    const filteredNoArchivedChatFolders = useMemo(() => {
      if (filterKey && filterValue && noArchivedChatFolders && noArchivedChatFolders.length > 0) {
        return noArchivedChatFolders.filter((chat) => filterByCriteria(chat, filterKey, filterValue));
      }
      return noArchivedChatFolders;
    }, [filterKey, filterValue, noArchivedChatFolders]);

    const filteredNoArchivedChatFoldersWithFolderId = useMemo(() => {
      if (filterKey && filterValue && noArchivedChatFoldersWithFolderId && noChatFoldersWithFolderId.length > 0) {
        return noArchivedChatFoldersWithFolderId.filter((chat) => filterByCriteria(chat, filterKey, filterValue));
      }
      return noArchivedChatFoldersWithFolderId;
    }, [filterKey, filterValue, noArchivedChatFoldersWithFolderId]);
    return (
      <React.Fragment>
        <React.Fragment>
          {Object.keys(filteredArchivedChatFolders).map((folderId) => (
            <ChatFolder
              folderChats={filteredArchivedChatFolders[folderId]}
              folderId={folderId}
              key={folderId}
            />
          ))}
          {filteredNoArchivedChatFolders.map(({ chatId, documentId, userId, orgId, cloudChatId, chatTitle, chatIndex, isArchived }) => (
            <ChatHistory
              chatId={chatId}
              cloudChatId={cloudChatId}
              chatTitle={chatTitle}
              chatIndex={chatIndex}
              isArchived={isArchived}
              key={`${chatTitle}-${chatId}`}
            />
          ))}
          {filteredNoArchivedChatFoldersWithFolderId.map(({ chatId, documentId, userId, orgId, cloudChatId, chatTitle, chatIndex, isArchived }) => (
            <ChatHistory
              chatId={chatId}
              cloudChatId={cloudChatId}
              chatTitle={chatTitle}
              chatIndex={chatIndex}
              isArchived={isArchived}
              key={`${chatTitle}-${chatId}`}
            />
          ))}
        </React.Fragment>
      </React.Fragment>
    );
  };

  return (
    <div
      className={`flex-col flex-1 hide-scroll-bar border-b border-white/20 ${isHover ? 'bg-gray-800/40' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
    >
      <ChatSearch filter={filterChats} setFilter={setFilterChats} />
      <div className='flex flex-col gap-2 text-gray-100 text-sm'>
       {Object.keys(chatFolders).length === 0 && noChatFolders.length === 0 && noChatFoldersWithFolderId.length === 0 ? (
          <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
            No items found.
          </p>
        ) : (
        <ActiveHistoryList filterKey={filterKey} filterValue={filterValue} chatFolders={chatFolders} noChatFolders={noChatFolders} noChatFoldersWithFolderId={noChatFoldersWithFolderId} />
      )}
      </div>
      <div className='w-full h-10' />
      <Popover>
        <PopoverTrigger className="w-full mt-4">
         <div className="flex py-2 px-2 items-center gap-3 relative rounded-md break-all pr-14 text-black dark:text-white bg-neutral-400 hover:bg-gray-300 group transition-opacity cursor-pointer opacity-100">
          <Trash className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
          <span className="text-sm font-medium">Trash Box</span>
        </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-72" side={isMobile ? "bottom" : "right"}>
          <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2 text-gray-600 dark:text-slate-100 visible">
              <ChatSearch filter={filterArchivedChats} setFilter={setFilterArchivedChats} />
            </div>
            <div className="mt-2 px-1 pb-1 max-h-64 flex flex-col overflow-y-auto  ">
              {Object.keys(archivedChatFolders).length === 0 && noArchivedChatFolders.length === 0 && noArchivedChatFoldersWithFolderId.length === 0 ? (
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                  No items found.
                </p>
              ) : (
                <ArchivedHistoryList filterKey={filterKey} filterValue={filterValue} archivedChatFolders={archivedChatFolders} noArchivedChatFolders={noArchivedChatFolders} noArchivedChatFoldersWithFolderId={noArchivedChatFoldersWithFolderId} />
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatHistoryList;



