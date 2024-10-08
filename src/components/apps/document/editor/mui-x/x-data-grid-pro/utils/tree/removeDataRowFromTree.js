"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeDataRowFromTree = void 0;
var _xDataGrid = require("@mui/x-data-grid");
var _utils = require("./utils");
const removeNodeAndCleanParent = ({
  node,
  tree,
  treeDepths,
  updatedGroupsManager
}) => {
  (0, _utils.removeNodeFromTree)({
    node,
    tree,
    treeDepths
  });
  if (node.type === 'group' && node.footerId != null) {
    (0, _utils.removeNodeFromTree)({
      node: tree[node.footerId],
      tree,
      treeDepths
    });
  }
  const parentNode = tree[node.parent];
  updatedGroupsManager?.addAction(parentNode.id, 'removeChildren');
  const shouldDeleteGroup = parentNode.id !== _xDataGrid.GRID_ROOT_GROUP_ID && parentNode.children.length === 0;
  if (shouldDeleteGroup) {
    if (parentNode.isAutoGenerated) {
      removeNodeAndCleanParent({
        node: parentNode,
        tree,
        treeDepths
      });
    } else {
      tree[parentNode.id] = {
        type: 'leaf',
        id: parentNode.id,
        depth: parentNode.depth,
        parent: parentNode.parent,
        groupingKey: parentNode.groupingKey
      };
    }
  }
};
const replaceDataGroupWithAutoGeneratedGroup = ({
  node,
  tree,
  treeDepths,
  updatedGroupsManager
}) => {
  updatedGroupsManager?.addAction(node.parent, 'removeChildren');
  updatedGroupsManager?.addAction(node.parent, 'insertChildren');
  (0, _utils.updateGroupNodeIdAndAutoGenerated)({
    previousTree: null,
    tree,
    treeDepths,
    node,
    updatedNode: {
      id: (0, _utils.getGroupRowIdFromPath)((0, _utils.getNodePathInTree)({
        id: node.id,
        tree
      })),
      isAutoGenerated: true
    }
  });
};

/**
 * Removed a data row from the tree.
 * If the node is a non-empty group, replace it with an auto-generated group to be able to keep displaying its children.
 * If not, remove it and recursively clean its parent with the following rules:
 * - An empty auto-generated should be removed from the tree
 * - An empty non-auto-generated should be turned into a leaf
 */
const removeDataRowFromTree = ({
  id,
  tree,
  treeDepths,
  updatedGroupsManager
}) => {
  const node = tree[id];
  if (node.type === 'group' && node.children.length > 0) {
    replaceDataGroupWithAutoGeneratedGroup({
      node,
      tree,
      treeDepths,
      updatedGroupsManager
    });
  } else {
    removeNodeAndCleanParent({
      node,
      tree,
      treeDepths,
      updatedGroupsManager
    });
  }
};
exports.removeDataRowFromTree = removeDataRowFromTree;