import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getRowIdFromRowModel } from '../rows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import * as _utils from "../../../utils/tree/utils";
import { useGridRegisterPipeProcessor } from "../../core/pipeProcessing/useGridRegisterPipeProcessor";
import { GRID_ROOT_GROUP_ID } from "../rows/index";

export function addPinnedRow({
  groupingParams,
  rowModel,
  rowId,
  position,
  apiRef,
  isAutoGenerated
}) {
  const dataRowIdToModelLookup = _extends({}, groupingParams.dataRowIdToModelLookup);
  const dataRowIdToIdLookup = _extends({}, groupingParams.dataRowIdToIdLookup);
  const tree = _extends({}, groupingParams.tree);
  const treeDepths = _extends({}, groupingParams.treeDepths);

  const node = {
    type: 'pinnedRow',
    id: rowId,
    depth: 0,
    parent: GRID_ROOT_GROUP_ID,
    isAutoGenerated
  };
  _utils.insertNodeInTree(node, tree, treeDepths, null);
  if (!isAutoGenerated) {
    dataRowIdToModelLookup[rowId] = rowModel;
    dataRowIdToIdLookup[rowId] = rowId;
  }
  // Do not push it to ids list so that pagination is not affected by pinned rows

  apiRef.current.caches.rows.dataRowIdToModelLookup[rowId] = _extends({}, rowModel);
  apiRef.current.caches.rows.dataRowIdToIdLookup[rowId] = rowId;
  const previousPinnedRows = groupingParams.additionalRowGroups?.pinnedRows || {};
  const newPinnedRow = {
    id: rowId,
    model: rowModel
  };
  if (groupingParams.additionalRowGroups?.pinnedRows?.[position]?.includes(newPinnedRow)) {
    return _extends({}, groupingParams, {
      dataRowIdToModelLookup,
      dataRowIdToIdLookup,
      tree,
      treeDepths
    });
  }
  return _extends({}, groupingParams, {
    dataRowIdToModelLookup,
    dataRowIdToIdLookup,
    tree,
    treeDepths,
    additionalRowGroups: _extends({}, groupingParams.additionalRowGroups, {
      pinnedRows: _extends({}, previousPinnedRows, {
        [position]: [...(previousPinnedRows[position] || []), newPinnedRow]
      })
    })
  });
}
export const useGridRowPinningPreProcessors = apiRef => {
  const addPinnedRows = React.useCallback(groupingParams => {
    const pinnedRowsCache = apiRef.current.caches.pinnedRows || {};
    let newGroupingParams = _extends({}, groupingParams, {
      additionalRowGroups: _extends({}, groupingParams.additionalRowGroups, {
        // reset pinned rows state
        pinnedRows: {}
      })
    });
    pinnedRowsCache.topIds?.forEach(rowId => {
      newGroupingParams = addPinnedRow({
        groupingParams: newGroupingParams,
        rowModel: pinnedRowsCache.idLookup[rowId],
        rowId,
        position: 'top',
        apiRef,
        isAutoGenerated: false
      });
    });
    pinnedRowsCache.bottomIds?.forEach(rowId => {
      newGroupingParams = addPinnedRow({
        groupingParams: newGroupingParams,
        rowModel: pinnedRowsCache.idLookup[rowId],
        rowId,
        position: 'bottom',
        apiRef,
        isAutoGenerated: false
      });
    });

    // If row with the same `id` is present both in `rows` and `pinnedRows` - remove it from the root group children
    if (pinnedRowsCache.bottomIds?.length || pinnedRowsCache.topIds?.length) {
      const shouldKeepRow = rowId => {
        if (newGroupingParams.tree[rowId] && newGroupingParams.tree[rowId].type === 'pinnedRow') {
          return false;
        }
        return true;
      };
      const rootGroupNode = newGroupingParams.tree[GRID_ROOT_GROUP_ID];
      newGroupingParams.tree[GRID_ROOT_GROUP_ID] = _extends({}, rootGroupNode, {
        children: rootGroupNode.children.filter(shouldKeepRow)
      });
      newGroupingParams.dataRowIds = newGroupingParams.dataRowIds.filter(shouldKeepRow);
    }
    return newGroupingParams;
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addPinnedRows);
};
