import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/redux/features/apps/document/store';
import NewFolderIcon from '@/icons/NewFolderIcon';
import { FolderInterface, FolderCollectionInterface } from '@/types/chat';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMyspaceContext } from "@/context/myspace-context-provider";

const NewFolder = () => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);
  const setFolders = useStore((state) => state.setFolders);
  const createFolder = useMutation(api.chats.createFolder);
  const { activeOrg, activeDocument } = useMyspaceContext();
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleCreateCloudFolder = async (folderId: string, folderData: FolderInterface, isArchived: boolean) => {
    try {
      const result = await createFolder({ folderId: folderId, folderData: folderData, isArchived: isArchived });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addFolder = async () => {
    let folderIndex = 1;
    let isArchived = false;
    let folderName = `New Folder ${folderIndex}`;
    const folders = useStore.getState().folders;
    const archivedFolders = useStore.getState().archivedFolders;
    const allFolders = [
      ...Object.values(folders).map(folder => folder),
      ...Object.values(archivedFolders).map(folder => folder.folder),
    ];
    while (allFolders.some((folder) => folder.folderName === folderName)) {
      folderIndex += 1;
      folderName = `New Folder ${folderIndex}`;
    }
    const updatedFolders: FolderCollectionInterface = JSON.parse(JSON.stringify(folders));
    const folderId = uuidv4();

    if (!currentUser) {
      toast.error("User is not authenticated");
      return;
    }
    const newFolder: FolderInterface = {
      userId: currentUser._id,
      folderId,
      cloudFolderId: undefined,
      folderName,
      isArchived: isArchived,
      expanded: false,
      order: 0,
      metaData: {
        documents: activeDocument ? [activeDocument] : [],
        orgs: []
      }
    };
    if (activeOrg) {
      newFolder.metaData.orgs = [{
        orgId: activeOrg.orgId,
        roles: [],
        users: [],
        permissions: {
          create: true,
          get: true,
          view: true,
          update: true,
          delete: true,
          archive: true,
          restore: true,
          aiAccess: true
        }
      }];
    }
    Object.values(updatedFolders).forEach((folder) => {
      folder.order += 1;
    });
    updatedFolders[folderId] = newFolder;
    try {
      const newFolderId = await handleCreateCloudFolder(folderId, newFolder, isArchived);
      if (newFolderId) {
        updatedFolders[folderId].cloudFolderId = newFolderId;
        setFolders({ ...updatedFolders });
      } else {
        toast.error("Failed to create folder in the cloud");
      }
    } catch (error) {
      console.error('Error creating folder in the cloud:', error);
      toast.error("Failed to create folder: " + (error as Error).message);
    }
  };

  return (
    <a
      className={`flex flex-1 py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 dark:hover:bg-slate-700 transition-colors duration-200 text-black text-sm mb-2 flex-shrink-0 border dark:hover:text-white dark:text-slate-100 dark:border-white border-black/20 transition-opacity ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      }`}
      onClick={() => {
        if (!generating) addFolder();
      }}
    >
      <NewFolderIcon /> {t('newFolder')}
    </a>
  );
};

export default NewFolder;
