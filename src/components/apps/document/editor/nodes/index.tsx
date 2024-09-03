import extensionFactory from '../lib/extension-factory';
import { VideoRecorderNode, VideoRecorderOptions } from "./videoRecorder";
import { AIDashboardNode } from "./ai-dashboard-node";
import { AdvancedTableNode, AdvancedTableNodeOptions } from "./advanced-table-node";
import { FileNode, FileNodeOptions } from "./file-node";
import { AIGraphNode } from "./ai-graph-node";
import AIImageNode from "./ai-image-node";
import { AIIconNode } from "./ai-icon-node";
import { AIKeywordTreeNode } from "./ai-keyword-tree-node";
import { AITreeNode } from "./ai-tree-node";
import { AudioRecorderNode, AudioRecorderNodeOptions } from "./audio-recorder-node";
import { SpeechToTextNode, SpeechToTextNodeOptions } from "./speech-to-text-node";
import { GiphyNode, GiphyNodeOptions } from "./giphy/giphy-node";
import { CodeEditorNode, CodeEditorNodeOptions } from "./code-editor-node";
import { KeywordDetail } from "./keyword-detail";
import { AINodeOptions } from "./ai-node-options";

const AudioRecorderNodePlugin = extensionFactory(AudioRecorderNodeOptions);
const VideoRecorderNodePlugin = extensionFactory(VideoRecorderOptions);
const AdvancedTableNodePlugin = extensionFactory(AdvancedTableNodeOptions);
const SpeechToTextNodePlugin = extensionFactory(SpeechToTextNodeOptions);
const GiphyNodePlugin = extensionFactory(GiphyNodeOptions);
const FileNodePlugin = extensionFactory(FileNodeOptions);
const CodeEditorNodePlugin = extensionFactory(CodeEditorNodeOptions);

export {
  VideoRecorderNode,
  AIDashboardNode,
  AdvancedTableNode,
  AIGraphNode,
  AIImageNode,
  AIIconNode,
  AIKeywordTreeNode,
  AITreeNode,
  AudioRecorderNode,
  SpeechToTextNode,
  KeywordDetail,
  AudioRecorderNodePlugin,
  VideoRecorderNodePlugin,
  AdvancedTableNodePlugin,
  SpeechToTextNodePlugin,
  GiphyNodePlugin,
  FileNodePlugin,
  CodeEditorNodePlugin
};





