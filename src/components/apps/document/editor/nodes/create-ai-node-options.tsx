import React from 'react';
import { AIGraphNode } from './ai-graph-node';
import { AIDashboardNode } from "./ai-dashboard-node";
import { AIIconNode } from "./ai-icon-node";
import { AIKeywordTreeNode } from "./ai-keyword-tree-node";
import { AITreeNode } from "./ai-tree-node";

const AINodeElements = [
  AIGraphNode,
  AIDashboardNode,
  AIIconNode,
  AIKeywordTreeNode,
  AITreeNode
];

const generateOptions = (nodeType, resData) => {
  const nodeName = nodeType.displayName;
  const nodeTag = nodeName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  const AINodeOptions = {
    name: nodeName,
    tag: nodeTag,
    component: nodeType,
    atom: true,
    draggable: true,
    attributes: {
      data: { default: resData },
      width: { default: "" },
      height: { default: "" },
      loading: { default: false },
      loading_progress: { default: 0 },
      aspect_ratio: {
        default: {
          width: 200,
          height: 200,
          ratio: 100,
        },
      },
    },
    widget_options: {
      displayOnInlineTooltip: true,
      insertion: 'insertion',
      insert_block: nodeName,
    },
  };

  return AINodeOptions;
};

export const createAINodeOptions = (resData) => {
  const data = resData ? resData : null;
  const NodeOptions = AINodeElements.map(AINodeEl => generateOptions(AINodeEl, data)); 
  return NodeOptions;
};


