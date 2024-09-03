import { GRID_ROOT_GROUP_ID } from "../../hooks/features/rows/index";
import { insertDataRowInTree } from "./insertDataRowInTree";
import { buildRootGroup } from "../../hooks/features/rows/gridRowsUtils";
/**
 * Transform a list of rows into a tree structure where each row references its parent and children.
 */
export const createRowTree = params => {
  const dataRowIds = [];
  const tree = {
    [GRID_ROOT_GROUP_ID]: buildRootGroup()
  };
  const treeDepths = {};
  for (let i = 0; i < params.nodes.length; i += 1) {
    const node = params.nodes[i];
    dataRowIds.push(node.id);
    insertDataRowInTree({
      tree,
      previousTree: params.previousTree,
      id: node.id,
      path: node.path,
      onDuplicatePath: params.onDuplicatePath,
      treeDepths,
      isGroupExpandedByDefault: params.isGroupExpandedByDefault,
      defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth
    });
  }
  return {
    tree,
    treeDepths,
    groupingName: params.groupingName,
    dataRowIds
  };
};
