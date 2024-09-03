import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import * as _utils from "@mui/utils";
import { getDataGridUtilityClass } from "../../../constants/gridClasses";
import { useGridLogger } from "../../utils/useGridLogger";
import { useGridSelector } from "../../utils/useGridSelector";
import { gridSortModelSelector } from "../sorting/gridSortingSelector";
import { gridRowMaximumTreeDepthSelector } from "../rows/gridRowsSelector";
import { gridEditRowsStateSelector } from "../editing/gridEditingSelectors";
import * as _gridRowGroupingSelector from "./gridRowGroupingSelector";
import * as _createGroupingColDef from "./createGroupingColDef";
import * as _gridRowGroupingUtils from "./gridRowGroupingUtils";
import { useGridRegisterPipeProcessor } from "../../core/pipeProcessing/useGridRegisterPipeProcessor";
import { useGridRegisterStrategyProcessor } from "../../core/strategyProcessing/useGridRegisterStrategyProcessor";
import { useFirstRender } from "../../utils/useFirstRender";
import { getVisibleRowsLookup } from "../../../utils/tree/utils";
import { sortRowTree } from "../../../utils/tree/sortRowTree";
import { updateRowTree } from "../../../utils/tree/updateRowTree";
import { createRowTree } from "../../../utils/tree/createRowTree";
import { gridRowTreeSelector } from "../rows/gridRowsSelector";
import { gridColumnLookupSelector } from "../columns/gridColumnsSelector";
import { GRID_CHECKBOX_SELECTION_FIELD } from "../../../colDef/gridCheckboxSelectionColDef";

export const useGridRowGroupingPreProcessors = (apiRef, props) => {
  const getGroupingColDefs = React.useCallback(columnsState => {
    if (props.disableRowGrouping) {
      return [];
    }
    const groupingColDefProp = props.groupingColDef;

    // We can't use `gridGroupingRowsSanitizedModelSelector` here because the new columns are not in the state yet
    const rowGroupingModel = _gridRowGroupingSelector.gridRowGroupingModelSelector(apiRef).filter(field => !!columnsState.lookup[field]);
    if (rowGroupingModel.length === 0) {
      return [];
    }
    switch (props.rowGroupingColumnMode) {
      case 'single':
        {
          return [_createGroupingColDef.createGroupingColDefForAllGroupingCriteria({
            apiRef,
            rowGroupingModel,
            colDefOverride: _gridRowGroupingUtils.getColDefOverrides(groupingColDefProp, rowGroupingModel),
            columnsLookup: columnsState.lookup
          })];
        }
      case 'multiple':
        {
          return rowGroupingModel.map(groupingCriteria => createGroupingColDef.createGroupingColDefForOneGroupingCriteria({
            groupingCriteria,
            colDefOverride: _gridRowGroupingUtils.getColDefOverrides(groupingColDefProp, [groupingCriteria]),
            groupedByColDef: columnsState.lookup[groupingCriteria],
            columnsLookup: columnsState.lookup
          }));
        }
      default:
        {
          return [];
        }
    }
  }, [apiRef, props.groupingColDef, props.rowGroupingColumnMode, props.disableRowGrouping]);
  const updateGroupingColumn = React.useCallback(columnsState => {
    const groupingColDefs = getGroupingColDefs(columnsState);
    let newColumnFields = [];
    const newColumnsLookup = {};

    // We only keep the non-grouping columns
    columnsState.orderedFields.forEach(field => {
      if (!_gridRowGroupingUtils.isGroupingColumn(field)) {
        newColumnFields.push(field);
        newColumnsLookup[field] = columnsState.lookup[field];
      }
    });

    // We add the grouping column
    groupingColDefs.forEach(groupingColDef => {
      const matchingGroupingColDef = columnsState.lookup[groupingColDef.field];
      if (matchingGroupingColDef) {
        groupingColDef.width = matchingGroupingColDef.width;
        groupingColDef.flex = matchingGroupingColDef.flex;
      }
      newColumnsLookup[groupingColDef.field] = groupingColDef;
    });
    const startIndex = newColumnFields[0] === GRID_CHECKBOX_SELECTION_FIELD ? 1 : 0;
    newColumnFields = [...newColumnFields.slice(0, startIndex), ...groupingColDefs.map(colDef => colDef.field), ...newColumnFields.slice(startIndex)];
    columnsState.orderedFields = newColumnFields;
    columnsState.lookup = newColumnsLookup;
    return columnsState;
  }, [getGroupingColDefs]);
  const createRowTreeForRowGrouping = React.useCallback(params => {
    const sanitizedRowGroupingModel = _gridRowGroupingSelector.gridRowGroupingSanitizedModelSelector(apiRef);
    const columnsLookup = gridColumnLookupSelector(apiRef);
    const groupingRules = _gridRowGroupingUtils.getGroupingRules({
      sanitizedRowGroupingModel,
      columnsLookup
    });
    apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
    const getRowTreeBuilderNode = rowId => {
      const row = params.dataRowIdToModelLookup[rowId];
      const parentPath = groupingRules.map(groupingRule => _gridRowGroupingUtils.getCellGroupingCriteria({
        row,
        groupingRule,
        colDef: columnsLookup[groupingRule.field],
        apiRef
      })).filter(cell => cell.key != null);
      const leafGroupingCriteria = {
        key: rowId.toString(),
        field: null
      };
      return {
        path: [...parentPath, leafGroupingCriteria],
        id: rowId
      };
    };
    if (params.updates.type === 'full') {
      return createRowTree({
        previousTree: params.previousTree,
        nodes: params.updates.rows.map(getRowTreeBuilderNode),
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: _gridRowGroupingUtils.ROW_GROUPING_STRATEGY
      });
    }
    return updateRowTree({
      nodes: {
        inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
        modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
        removed: params.updates.actions.remove
      },
      previousTree: params.previousTree,
      previousTreeDepth: params.previousTreeDepths,
      defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
      isGroupExpandedByDefault: props.isGroupExpandedByDefault,
      groupingName: _gridRowGroupingUtils.ROW_GROUPING_STRATEGY
    });
  }, [apiRef, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
  const filterRows = React.useCallback(params => {
    const rowTree = gridRowTreeSelector(apiRef);
    return _gridRowGroupingUtils.filterRowTreeFromGroupingColumns({
      rowTree,
      isRowMatchingFilters: params.isRowMatchingFilters,
      filterModel: params.filterModel,
      apiRef
    });
  }, [apiRef]);
  const sortRows = React.useCallback(params => {
    const rowTree = gridRowTreeSelector(apiRef);
    return sortRowTree({
      rowTree,
      sortRowList: params.sortRowList,
      disableChildrenSorting: false,
      shouldRenderGroupBelowLeaves: true
    });
  }, [apiRef]);
  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(apiRef, _gridRowGroupingUtils.ROW_GROUPING_STRATEGY, 'rowTreeCreation', createRowTreeForRowGrouping);
  useGridRegisterStrategyProcessor(apiRef, _gridRowGroupingUtils.ROW_GROUPING_STRATEGY, 'filtering', filterRows);
  useGridRegisterStrategyProcessor(apiRef, _gridRowGroupingUtils.ROW_GROUPING_STRATEGY, 'sorting', sortRows);
  useGridRegisterStrategyProcessor(apiRef, _gridRowGroupingUtils.ROW_GROUPING_STRATEGY, 'visibleRowsLookupCreation', getVisibleRowsLookup);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    _gridRowGroupingUtils.setStrategyAvailability(apiRef, props.disableRowGrouping);
  });

  /**
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (!isFirstRender.current) {
      _gridRowGroupingUtils.setStrategyAvailability(apiRef, props.disableRowGrouping);
    } else {
      isFirstRender.current = false;
    }
  }, [apiRef, props.disableRowGrouping]);
};
