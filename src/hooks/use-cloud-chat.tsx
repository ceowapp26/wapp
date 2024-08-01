import convex from "@/convex/convexClient";
import { Id } from "@/convex/_generated/dataModel";
import { ChatInterface, FolderInterface } from "@/types/chat";

export async function createCloudChat(chat: ChatInterface) {
  try {
    const createChat = convex.mutation("chats.createChat");
    const result = await createChat(chat);
    return result;
  } catch (error) {
    console.error("Failed to create chat:", error);
    throw error;
  }
}

export async function updateCloudChat(id: Id<"chats">, chatIndex: number, chat: ChatInterface) {
  try {
    const updateChat = convex.mutation("chats.updateChat");
    await updateChat({ id, chatIndex, chat });
  } catch (error) {
    console.error("Failed to update chat:", error);
    throw error;
  }
}

export async function archiveCloudChat(id: Id<"chats">) {
  try {
    const archiveChat = convex.mutation("chats.archiveChat");
    await archiveChat({ id });
  } catch (error) {
    console.error("Failed to archive chat:", error);
    throw error;
  }
}

export async function restoreCloudChat(id: Id<"chats">) {
  try {
    const restoreChat = convex.mutation("chats.restoreChat");
    await restoreChat({ id });
  } catch (error) {
    console.error("Failed to restore chat:", error);
    throw error;
  }
}

export async function removeCloudChat(id: Id<"chats">) {
  try {
    const removeChat = convex.mutation("chats.removeChat");
    await removeChat({ id });
  } catch (error) {
    console.error("Failed to remove chat:", error);
    throw error;
  }
}

export async function createCloudFolder(folderId: string, folderData: FolderInterface, isArchived: boolean) {
  try {
    const createFolder = convex.mutation("chats.createFolder");
    const result = await createFolder({ folderId, folderData, isArchived });
    return result;
  } catch (error) {
    console.error("Failed to create folder:", error);
    throw error;
  }
}

export async function updateCloudFolder(id: Id<"chats">, folderIndex: number, folderData: FolderInterface) {
  try {
    const updateFolder = convex.mutation("chats.updateFolder");
    await updateFolder({ id, folderIndex, folderData });
  } catch (error) {
    console.error("Failed to update folder:", error);
    throw error;
  }
}

export async function archiveCloudFolder(id: Id<"chats">) {
  try {
    const archiveFolder = convex.mutation("chats.archiveFolder");
    await archiveFolder({ id });
  } catch (error) {
    console.error("Failed to archive folder:", error);
    throw error;
  }
}

export async function restoreCloudFolder(id: Id<"chats">) {
  try {
    const restoreFolder = convex.mutation("chats.restoreFolder");
    await restoreFolder({ id });
  } catch (error) {
    console.error("Failed to restore folder:", error);
    throw error;
  }
}

export async function removeCloudFolder(id: Id<"chats">) {
  try {
    const removeFolder = convex.mutation("chats.removeFolder");
    await removeFolder({ id });
  } catch (error) {
    console.error("Failed to remove folder:", error);
    throw error;
  }
}

export async function removeAllCloudChats() {
  try {
    const removeAllChats = convex.mutation("chats.removeAllChats");
    await removeAllChats();
  } catch (error) {
    console.error("Failed to remove all chats:", error);
    throw error;
  }
}
