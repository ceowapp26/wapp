import React from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateCloudDocument() {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);

  const handleCreateDocument = async () => {
    const promise = createDocument({ title: "Untitled" })
      .then((documentId) => router.push(`/myspace/apps/documents/${documentId}`));

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  return handleCreateDocument;
}

export function useCreateCloudDocumentWithParent(id: Id<"documents">, expanded: boolean, onExpand?: () => void) {
  const router = useRouter();
  const createDocument = useMutation(api.documents.createDocument);

  const handleCreateDocumentWithParent = async () => {
    const promise = createDocument({ title: "Untitled", parentDocument: id })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/myspace/apps/documents/${documentId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  return handleCreateDocumentWithParent;
}

export function useUpdateCloudDocumentContent() {
  const updateDocument = useMutation(api.documents.updateDocument);

  const handleUpdateDocumentContent = async (id: Id<"documents">, content: string) => {
    try {
      await updateDocument({ id, content });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return handleUpdateDocumentContent;
}

export function useUpdateCloudDocumentPublish(id: Id<"documents">, isPublished: boolean, setIsSubmitting: (value: boolean) => void) {
  const updateDocument = useMutation(api.documents.updateDocument);

  const handleUpdateDocumentPublish = async () => {
    const promise = updateDocument({
      id,
      isPublished,
    }).finally(() => setIsSubmitting(!isPublished));

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published",
      error: "Failed to publish note.",
    });
  };

  return handleUpdateDocumentPublish;
}

export function useUpdateCloudDocumentTitle() {
  const updateDocument = useMutation(api.documents.updateDocument);

  const handleUpdateDocumentTitle = async (id: Id<"documents">, title: string) => {
    try {
      await updateDocument({ id, title });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return handleUpdateDocumentTitle;
}

export function useArchiveCloudDocument(id: Id<"documents">) {
  const router = useRouter();
  const archiveDocument = useMutation(api.documents.archiveDocument);

  const handleArchiveDocument = async () => {
    const promise = archiveDocument({ id }).then(() => router.push("/myspace/apps/documents"));

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note."
    });
  };

  return handleArchiveDocument;
}

export function useRestoreCloudDocument(id: Id<"documents">) {
  const restoreDocument = useMutation(api.documents.restoreDocument);

  const handleRestoreDocument = async () => {
    const promise = restoreDocument({ id });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note."
    });
  };

  return handleRestoreDocument;
}

export function useRemoveCloudDocument(id: Id<"documents">) {
  const router = useRouter();
  const removeDocument = useMutation(api.documents.removeDocument);

  const handleRemoveDocument = async () => {
    const promise = removeDocument({ id }).then(() => router.push("/myspace/apps/documents"));

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note."
    });
  };

  return handleRemoveDocument;
}

export function useUpdateCloudParentDocument() {
  const updateParentDocument = useMutation(api.documents.updateParentDocument);

  const handleUpdateParentDocument = async (id: Id<"documents">, parentDocument: Id<"documents">) => {
    try {
      await updateParentDocument({ id, parentDocument });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return handleUpdateParentDocument;
}

export function useRemoveCloudParentDocument() {
  const updateParentDocument = useMutation(api.documents.updateParentDocument);

  const handleRemoveParentDocument = async (id: Id<"documents">) => {
    try {
      await updateParentDocument({ id, parentDocument: null });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return handleRemoveParentDocument;
}

export function useUpdateDocumentPosition() {
  const updateDocumentPosition = useMutation(api.documents.updateDocumentPosition);

  const handleUpdateDocumentPosition = async (id: Id<"documents">, position: number) => {
    try {
      await updateDocumentPosition({ id, position });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return handleUpdateDocumentPosition;
}

export function useGetCloudDocumentById(id: Id<"documents">) {
  const document = useQuery(api.documents.getDocumentById, { id });
  return document;
}

export function useGetCloudDocumentTrash() {
  const documents = useQuery(api.documents.getDocumentTrash);
  return documents;
}
