import { FileText, SquareTerminal, FileImage, FileAudio, FileVideo, FolderSync, BrainCog } from "lucide-react";

export const portalOptions = [
  { context: "TEXT", url: "/myspace/apps/portal/document", icon: FileText, title: "AI TEXT PORTAL", text: "AI for TEXT" },
  { context: "CODE", url: "/myspace/apps/portal/code", icon: SquareTerminal, title: "AI CODE PORTAL", text: "AI for CODE" },
  { context: "IMAGE", url: "/myspace/apps/portal/image", icon: FileImage, title: "AI IMAGE PORTAL", text: "AI for IMAGE" },
  { context: "AUDIO", url: "/myspace/apps/portal/audio", icon: FileAudio, title: "AI AUDIO PORTAL", text: "AI for AUDIO" },
  { context: "VIDEO", url: "/myspace/apps/portal/video", icon: FileVideo, title: "AI VIDEO PORTAL", text: "AI for VIDEO" },
  { context: "CENTRAL", url: "/myspace/apps/portal/central", icon: FolderSync, title: "AI CENTRAL PORTAL", text: "PORTAL CENTRAL HUB" },
  { context: "TRAINING", url: "/myspace/apps/portal/training", icon: BrainCog, title: "AI TRAINING PORTAL", text: "AI TRAINING" },
];

