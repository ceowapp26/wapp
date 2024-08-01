import React from 'react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SnippetInterface } from '@/types/snippet';

export async function useCreateCloudSnippet(snippet: SnippetInterface) {
  const createSnippet = useMutation(api.snippets.createSnippet);
  try {
    const result = await createSnippet({ snippet });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function useUpdateCloudSnippet(id: Id<"snippets">, snippetIndex: number, snippet: SnippetInterface) {
  const updateSnippet = useMutation(api.snippets.updateSnippet);
  try {
    await updateSnippet({ id: id, snippetIndex: snippetIndex, snippet: snippet });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function useArchiveCloudSnippet(id: Id<"snippets">) {
  const archiveSnippet = useMutation(api.snippets.archiveSnippet);
  try {
    await archiveSnippet({ id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function useRestoreCloudSnippet(id: Id<"snippets">) {
  const restoreSnippet = useMutation(api.snippets.restoreSnippet);
  try {
    await restoreSnippet({ id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function useRemoveCloudSnippet(id: Id<"snippets">) {
  const removeSnippet = useMutation(api.snippets.removeSnippet);
  try {
    await removeSnippet({ id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function useGetCloudSnippets() {
  const snippets = useQuery(api.snippets.getSnippets);
  return snippets;
};
