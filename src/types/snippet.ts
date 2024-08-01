export interface SnippetInterface {
  snippetId: string;
  cloudSnippetId?: string;
  snippetName: string;
  expanded: boolean;
  content: string;
  order?: number;
  color?: string;
  isArchived?: boolean;
  isPublish?: boolean;
}

