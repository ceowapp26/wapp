import * as React from 'react';
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as _utils from "./utils";
import clsx from 'clsx';
import _extends from "@babel/runtime/helpers/esm/extends";
import { gridClasses, getDataGridUtilityClass } from "../../constants/gridClasses";
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridRenderContextSelector } from '../../hooks/features/virtualization';
import { GRID_ROOT_GROUP_ID } from "../../hooks/features/rows/index";
import { insertDataRowInTree } from "./insertDataRowInTree";
import { removeDataRowFromTree } from "./removeDataRowFromTree";
import { isDeepEqual } from "../utils";
import { getTreeNodeDescendants } from "../../hooks/features/rows/gridRowsUtils";

export const updateRowTree = params => {
  const tree = _extends({}, params.previousTree);
  const treeDepths = _extends({}, params.previousTreeDepth);
  const updatedGroupsManager = _utils.createUpdatedGroupsManager();
  for (let i = 0; i < params.nodes.inserted.length; i += 1) {
    const {
      id,
      path
    } = params.nodes.inserted[i];
    insertDataRowInTree({
      previousTree: params.previousTree,
      tree,
      treeDepths,
      updatedGroupsManager,
      id,
      path,
      onDuplicatePath: params.onDuplicatePath,
      isGroupExpandedByDefault: params.isGroupExpandedByDefault,
      defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth
    });
  }
  for (let i = 0; i < params.nodes.removed.length; i += 1) {
    const nodeId = params.nodes.removed[i];
    removeDataRowFromTree({
      tree,
      treeDepths,
      updatedGroupsManager,
      id: nodeId
    });
  }
  for (let i = 0; i < params.nodes.modified.length; i += 1) {
    const {
      id,
      path
    } = params.nodes.modified[i];
    const pathInPreviousTree = (0, _utils.getNodePathInTree)({
      tree,
      id
    });
    const isInSameGroup = isDeepEqual(pathInPreviousTree, path);
    if (!isInSameGroup) {
      removeDataRowFromTree({
        tree,
        treeDepths,
        updatedGroupsManager,
        id
      });
      insertDataRowInTree({
        previousTree: params.previousTree,
        tree,
        treeDepths,
        updatedGroupsManager,
        id,
        path,
        onDuplicatePath: params.onDuplicatePath,
        isGroupExpandedByDefault: params.isGroupExpandedByDefault,
        defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth
      });
    } else {
      updatedGroupsManager?.addAction(tree[id].parent, 'modifyChildren');
    }
  }

  // TODO rows v6: Avoid walking the whole tree, we should be able to generate the new list only using slices.
  const dataRowIds = getTreeNodeDescendants(tree, GRID_ROOT_GROUP_ID, true);
  return {
    tree,
    treeDepths,
    groupingName: params.groupingName,
    dataRowIds,
    updatedGroupsManager
  };
};
