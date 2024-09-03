import { useMemo, useRef, forwardRef, useEffect } from "react";
import { EditorProvider } from "@tiptap/react";
import { Provider } from "jotai";
import tunnel from "tunnel-rat";
import { useGeneralContext } from "@/context/general-context-provider";
import { simpleExtensions } from "../lib/index";
import { novelStore } from "@/utils/store";
import { EditorCommandTunnelContext } from "./editor-command";
import type { FC, ReactNode } from "react";
import type { EditorProviderProps, JSONContent } from "@tiptap/react";
import type { EditorView } from "@tiptap/pm/view";
import { createAINodeOptions } from "../nodes/create-ai-node-options";
import extensionFactory from '../lib/extension-factory';

export interface EditorProps {
  readonly children: ReactNode;
  readonly className?: string;
}

interface EditorRootProps {
  readonly children: ReactNode;
}

export const EditorRoot: FC<EditorRootProps> = ({ children }) => {
  const tunnelInstance = useRef(tunnel()).current;
  return (
    <Provider store={novelStore}>
      <EditorCommandTunnelContext.Provider value={tunnelInstance}>
        {children}
      </EditorCommandTunnelContext.Provider>
    </Provider>
  );
};

export type EditorContentProps = Omit<EditorProviderProps, "content"> & {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly initialContent?: JSONContent;
};

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  ({ className, children, initialContent, ...rest }, ref) => {
    const { resData } = useGeneralContext();
    const extensions = useMemo(() => {
      const AINodeOptions = createAINodeOptions(resData);
      const AIGraphNodePlugins = AINodeOptions.map(option => extensionFactory(option));
      return [...simpleExtensions, ...AIGraphNodePlugins, ...(rest.extensions ?? [])];
    }, [rest.extensions, resData]);

    return (
      <div ref={ref} className={className}>
        <EditorProvider
          {...rest}
          content={initialContent}
          extensions={extensions}
        >
          {children}
        </EditorProvider>
      </div>
    );
  },
);

EditorContent.displayName = "EditorContent";

