import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  MessageSquarePlus,
  Text,
  TextQuote,
  Table,
  Youtube, 
  FileText,
  Mic,
  Video, 
  Sheet,
  FileUp,
  AudioLines,
  SquareCode,
} from "lucide-react";
import { createSuggestionItems } from "./lib/slash-command";
import { Command, renderItems } from "./lib/slash-command";
import { uploadFn } from "./image-upload";
import { APP_STATUS } from "@/constants/app";

export const displaySuggestionItems = createSuggestionItems([
  {
    title: "Basic Table",
    description: "Create basic table.",
    icon: <Table size={18} />,
    command: ({ editor, range }) => {
      editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    },
  },
  {
    title: "Advanced Table",
    status: APP_STATUS.beta.text,
    color: APP_STATUS.beta.color,
    description: "Create advanced table.",
    icon: <Sheet size={18} />,
    command: ({ editor, range }) => {
      editor
      .chain()
      .focus()
      .insertAdvancedTableNode()
      .run();
    },
  },
]);

export const textSuggestionItems = createSuggestionItems([
  {
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    icon: <MessageSquarePlus size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.open("/feedback", "_blank");
    },
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <TextQuote size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
]);

export const nodeSuggestionItems = createSuggestionItems([
  {
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const pos = editor.view.state.selection.from;
          uploadFn(file, editor.view, pos);
        }
      };
      input.click();
    },
  },
  {
    title: "Youtube",
    description: "Embed a Youtube video.",
    searchTerms: ["video", "youtube", "embed"],
    icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      const videoLink = prompt("Please enter Youtube Video Link");
      const ytregex = new RegExp(
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
      );

      if (ytregex.test(videoLink)) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setYoutubeVideo({
            src: videoLink,
          })
          .run();
      } else {
        if (videoLink !== null) {
          alert("Please enter a correct Youtube Video Link");
        }
      }
    },
  },
  {
    title: "Audio",
    description: "Record an audio.",
    icon: <Mic size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().insertAudioRecorderNode().run();
    },
  },
  {
    title: "Video",
    description: "Record a video.",
    icon: <Video size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().insertVideoRecorderNode().run();
    },
  },
  {
    title: "Speech",
    description: "Speech to text.",
    icon: <AudioLines size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().insertSpeechToTextNode().run();
    },
  },
  {
    title: "File",
    description: "Upload a file.",
    icon: <FileText size={18} />,
    command: ({ editor, range }) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "*";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const objectUrl = URL.createObjectURL(file);
          editor.chain().focus().deleteRange(range).setNode('FileNode', {
            file: file,
            src: objectUrl,
            url: objectUrl,
            forceUpload: true,
          }).run();
        }
      };
      input.click();
    },
  },
  {
    title: "Giphy",
    description: "Insert giphy.",
    icon: <Mic size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().insertGiphyNode().run();
    },
  },
  {
    title: "Code Editor",
    description: "Compile code",
    status: APP_STATUS.experiment.text,
    color: APP_STATUS.experiment.color,
    icon: <SquareCode size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().insertCodeEditorNode().run();
    },
  },
]);

export const exportSuggestionItems = createSuggestionItems([
  {
    title: "Export",
    description: "Export to Word",
    documentTitle: '',
    icon: <FileUp size={18} />,
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => ({
      "Table Commands": displaySuggestionItems,
      "Text Commands": textSuggestionItems,
      "Node Commands": nodeSuggestionItems,
    }),
    render: renderItems,
  }
});




