"use client";
import './styles.scss';
import React, { useEffect, useState, useRef } from "react";
import { defaultEditorContent } from "@/constants/editor";
import { useDebouncedCallback } from "use-debounce";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "@/components/spinner";
import dynamic from 'next/dynamic';
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorInstance,
  EditorCommandList,
} from "./core/index";
import { useStore } from '@/redux/features/apps/document/store';
import { ImageResizer } from "./lib/image-resizer";
import { handleCommandNavigation } from "./lib/slash-command";
import { defaultExtensions } from "./extensions";
import { expandExtensions } from "./expand-extensions";
import { Separator } from "./ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";
import { ImageSelector } from "./selectors/image-selector";
import { TextButtons } from "./selectors/text-buttons";
import { FontFamilySelector } from "./selectors/font-family-selector";
import { FontSizeSelector } from "./selectors/font-size-selector";
import { TextAlignSelector } from "./selectors/text-align-selector";
import { AIBasicCommand } from "./generative/ai-basic-command";
import { SnippetSelector } from "./selectors/snippet-selector";
import { DispatchEventEditor } from "./events/dispatch-event-editor";
import { HorizontalRuleButton } from "./selectors/horizontal-rule-button";
import { InlineFormatRemovalButton } from "./selectors/inlineformat-removal-button";
import { SubscriptButton } from "./selectors/subscript-button";
import { SuperscriptButton } from "./selectors/superscript-button";
import { UndoButton } from "./selectors/undo-button";
import { RedoButton } from "./selectors/redo-button";
import { slashCommand, textSuggestionItems, displaySuggestionItems, nodeSuggestionItems, exportSuggestionItems } from "./slash-command";
import GenerativeMenuSwitch from "./generative-menu-switch";
import ImageMenuSwitch from "./image-menu-switch";
import $ from 'jquery';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { handleImageDrop, handleImagePaste, handleFileDrop, handleFilePaste } from "./plugins/index";
import { uploadFn } from "./image-upload";
import { uploadFile } from "./plugins/upload-files";
import Warning from "@/components/apps/document/modals/warning-modal";
import TableBubbleMenu from "./tables/table-bubble-menu";
import { exportToWord } from "./export";
import { useUploadFile } from "@/hooks/use-upload-file";
import { UploadFileModal } from "@/components/apps/document/modals/upload-file-modal";
import "./styles.css";
const hljs = require('highlight.js');
const extensions = [...defaultExtensions, slashCommand];

const AIBasicSelector = dynamic(() => import("./generative/ai-basic-selector"), {
  ssr: false,
});

const AIAdvancedSelector = dynamic(() => import("./generative/ai-advanced-selector"), {
  ssr: false,
});

const AIImageSelector = dynamic(() => import("./generative/ai-image-selector"), {
  ssr: false,
});

interface EditorProps {
  onChange: (value: string) => void;
  id?: string;
  documentTitle?: string;
  initialContent?: string;
}

const WappEditor = ({ onChange, id, documentTitle, initialContent }: EditorProps) => {
  const [data, setData] = useState<JSONContent | string>('');
  const [cloudData, setCloudData] = useState<JSONContent | string>('');
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openSnippet, setOpenSnippet] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [openTextFont, setOpenTextFont] = useState(false);
  const [openTextSize, setOpenTextSize] = useState(false);
  const [openTextAlign, setOpenTextAlign] = useState(false);
  const [openBasicAI, setOpenBasicAI] = useState(false);
  const [openAdvancedAI, setOpenAdvancedAI] = useState(false);
  const [openImageAI, setOpenImageAI] = useState(false);
  const [openAIImage, setOpenAIImage] = useState(false);
  const [editorWidth, setEditorWidth] = useState(0);
  const [status, setStatus] = useState(true);
  const [charsCount, setCharsCount] = useState(true);
  const [updatedExportSuggestionItems, setUpdatedExportSuggestionItems] = useState([]);
  const [syncWithCloudWarning, setSyncWithCloudWarning] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { rightSidebarWidth, isRightSidebarOpened, setRightSidebarWidth } = useMyspaceContext();
  const ref = useRef();
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setCharsCount(editor.storage.characterCount.words());
      window.localStorage.setItem("html-content", highlightCodeblocks(editor.getHTML()));
      window.localStorage.setItem(id, JSON.stringify(json));
      window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown());
      onChange(JSON.stringify(json));
      setSaveStatus("Saved");
      setSyncWithCloudWarning(false);
    },
    500,
  );

  useEffect(() => {
    const cloudContent = initialContent ? JSON.parse(initialContent) : defaultEditorContent;
    if (cloudContent) {
      setCloudData(cloudContent);
      const localContent = window.localStorage.getItem(id);
      if (localContent) {
        const parsedLocalContent = JSON.parse(localContent);
        setData(parsedLocalContent);
        if (JSON.stringify(parsedLocalContent) !== JSON.stringify(cloudContent)) {
          setSyncWithCloudWarning(true);
        }
      } else {
        setData(cloudContent);
        window.localStorage.setItem(id, JSON.stringify(cloudContent));
      }
    } 
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
      if (!isRightSidebarOpened) setRightSidebarWidth(0);
        const width = ref.current.clientWidth;
        setEditorWidth(width);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [ref?.current?.clientWidth, isRightSidebarOpened]);

   /*useEffect(() => {
    const newExportSuggestionItems = exportSuggestionItems.map((item) => ({
      ...item,
      command: ({ editor, range }) => {
        exportToWord(editor, documentTitle)
      },
    }));
    setUpdatedExportSuggestionItems(newExportSuggestionItems);
  }, [documentTitle, exportSuggestionItems]);*/

  const handleKeepLocalStorage = () => {
    setSyncWithCloudWarning(false);
  };

  const handleKeepCloudStorage = () => {
    window.localStorage.setItem(id, JSON.stringify(cloudData));
    setData(cloudData);
    setSyncWithCloudWarning(false);
  };

  return (
    <React.Fragment>
      {syncWithCloudWarning && (
        <Warning
          handleKeepLocalStorage={handleKeepLocalStorage}
          handleKeepCloudStorage={handleKeepCloudStorage}
        />
      )}
      <div ref={ref} className={`relative`} style={{ width: `${isMobile ? '100%' : `calc(100% - ${rightSidebarWidth}px)`}` }}>
        <div className={`absolute flex right-2 items-center top-4 z-10 space-x-2`}>
          <div className={charsCount ? "rounded-lg bg-accent p-2 text-sm text-muted-foreground" : "hidden"}>
            {charsCount} Words
          </div>
          <div className={status ? "rounded-lg bg-accent p-2 text-sm text-muted-foreground" : "hidden"}>
            {saveStatus}
          </div>
        </div>
        <EditorRoot>
          <EditorContent
            initialContent={data}
            key={JSON.stringify(data)}
            storageKey={id}
            extensions={extensions}
            className="relative min-h-[800px] px-6 py-10 w-full border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) => {
                handleImagePaste(view, event, uploadFn);
                handleFilePaste(view, event, uploadFile);
              },
              handleDrop: (view, event, _slice, moved) => {
                handleImageDrop(view, event, moved, uploadFn);
                handleFileDrop(view, event, moved, uploadFile);
              },
              attributes: {
                class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            onEditor={(editor) => (editorRef.current = editor)}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("Unsaved");
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                <span className="flex font-semibold text-indigo-800 p-2">Display</span>
                {displaySuggestionItems.map((item) => (
                  <EditorCommandItem 
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className={`flex w-full items-center space-x-4 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {item.status && (
                      <span
                        className="flex rounded-full text-white text-xs p-4 py-1"
                        style={{ backgroundColor: item.color }}
                      >
                       {item.status}
                      </span>
                    )}
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
              <EditorCommandList>
                <span className="flex font-semibold text-indigo-800 p-2">Text & Layout</span>
                {textSuggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className={`flex w-full items-center space-x-4 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
              <EditorCommandList>
                <span className="flex font-semibold text-indigo-800 p-2">Nodes</span>
                {nodeSuggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className={`flex w-full items-center space-x-4 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {item.status && (
                      <span
                        className="flex rounded-full text-white text-xs p-4 py-1 left-1"
                        style={{ backgroundColor: item.color }}
                      >
                       {item.status}
                      </span>
                    )}
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
              {/*<EditorCommandList>
                <span className="flex font-semibold text-indigo-800 p-2">Export</span>
                {updatedExportSuggestionItems.map((item) => (
                  <EditorCommandItem 
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className={`flex w-full items-center space-x-4 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>*/}
            </EditorCommand>
            <AIBasicCommand />
            <UploadFileModal />
            <GenerativeMenuSwitch>
              <AIBasicSelector open={openBasicAI} onOpenChange={setOpenBasicAI} />
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <FontFamilySelector open={openTextFont} onOpenChange={setOpenTextFont} />
              <Separator orientation="vertical" />
              <FontSizeSelector open={openTextSize} onOpenChange={setOpenTextSize} />
              <Separator orientation="vertical" />
              <TextAlignSelector open={openTextAlign} onOpenChange={setOpenTextAlign} />
              <Separator orientation="vertical" />
              <InlineFormatRemovalButton />
              <Separator orientation="vertical" />
              <SubscriptButton />
              <Separator orientation="vertical" />
              <SuperscriptButton />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
              <Separator orientation="vertical" />
              <ImageSelector open={openImage} onOpenChange={setOpenImage} />
              <Separator orientation="vertical" />
              <SnippetSelector open={openSnippet} onOpenChange={setOpenSnippet} />
              <Separator orientation="vertical" />
              <AIAdvancedSelector open={openAdvancedAI} onOpenChange={setOpenAdvancedAI} />
              <Separator orientation="vertical" />
              <AIImageSelector open={openImageAI} onOpenChange={setOpenImageAI} isGemini={false} />
              <Separator orientation="vertical" />
              <UndoButton />
              <Separator orientation="vertical" />
              <RedoButton />
            </GenerativeMenuSwitch>
            <ImageMenuSwitch open={openAIImage} onOpenChange={setOpenAIImage} />
            <TableBubbleMenu />
          </EditorContent>
        </EditorRoot>
      </div>
    </React.Fragment>
  );
};

export default WappEditor;

