import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import * as _gridRowGroupingSelector from "./gridRowGroupingSelector";
import * as _gridRowGroupingUtils from "./gridRowGroupingUtils";
import { gridRowTreeSelector } from "../rows/gridRowsSelector";
import { gridColumnLookupSelector } from "../columns/gridColumnsSelector";
import { useGridRegisterPipeProcessor } from "../../core/pipeProcessing/useGridRegisterPipeProcessor";

export const rowGroupingStateInitializer = (state, props, apiRef) => {
  apiRef.current.caches.rowGrouping = {
    rulesOnLastRowTreeCreation: []
  };
  return _extends({}, state, {
    rowGrouping: {
      model: props.rowGroupingModel ?? props.initialState?.rowGrouping?.model ?? []
    }
  });
};

/**
 * @requires useGridColumns (state, method) - can be after, async only
 * @requires useGridRows (state, method) - can be after, async only
 * @requires useGridParamsApi (method) - can be after, async only
 */
export const useGridRowGrouping = (apiRef, props) => {
  apiRef.current.registerControlState({
    stateId: 'rowGrouping',
    propModel: props.rowGroupingModel,
    propOnChange: props.onRowGroupingModelChange,
    stateSelector: _gridRowGroupingSelector.gridRowGroupingModelSelector,
    changeEvent: 'rowGroupingModelChange'
  });

  /**
   * API METHODS
   */
  const setRowGroupingModel = React.useCallback(model => {
    const currentModel = _gridRowGroupingSelector.gridRowGroupingModelSelector(apiRef);
    if (currentModel !== model) {
      apiRef.current.setState(_gridRowGroupingUtils.mergeStateWithRowGroupingModel(model));
      _gridRowGroupingUtils.setStrategyAvailability(apiRef, props.disableRowGrouping);
      apiRef.current.forceUpdate();
    }
  }, [apiRef, props.disableRowGrouping]);
  const addRowGroupingCriteria = React.useCallback((field, groupingIndex) => {
    const currentModel = _gridRowGroupingSelector.gridRowGroupingModelSelector(apiRef);
    if (currentModel.includes(field)) {
      return;
    }
    const cleanGroupingIndex = groupingIndex ?? currentModel.length;
    const updatedModel = [...currentModel.slice(0, cleanGroupingIndex), field, ...currentModel.slice(cleanGroupingIndex)];
    apiRef.current.setRowGroupingModel(updatedModel);
  }, [apiRef]);
  const removeRowGroupingCriteria = React.useCallback(field => {
    const currentModel = _gridRowGroupingSelector.gridRowGroupingModelSelector(apiRef);
    if (!currentModel.includes(field)) {
      return;
    }
    apiRef.current.setRowGroupingModel(currentModel.filter(el => el !== field));
  }, [apiRef]);
  const setRowGroupingCriteriaIndex = React.useCallback((field, targetIndex) => {
    const currentModel = _gridRowGroupingSelector.gridRowGroupingModelSelector(apiRef);
    const currentTargetIndex = currentModel.indexOf(field);
    if (currentTargetIndex === -1) {
      return;
    }
    const updatedModel = [...currentModel];
    updatedModel.splice(targetIndex, 0, updatedModel.splice(currentTargetIndex, 1)[0]);
    apiRef.current.setRowGroupingModel(updatedModel);
  }, [apiRef]);
  const rowGroupingApi = {
    setRowGroupingModel,
    addRowGroupingCriteria,
    removeRowGroupingCriteria,
    setRowGroupingCriteriaIndex
  };
  useGridApiMethod(apiRef, rowGroupingApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addColumnMenuButtons = React.useCallback((columnMenuItems, colDef) => {
    if (props.disableRowGrouping) {
      return columnMenuItems;
    }
    if (_gridRowGroupingUtils.isGroupingColumn(colDef.field) || colDef.groupable) {
      return [...columnMenuItems, 'columnMenuGroupingItem'];
    }
    return columnMenuItems;
  }, [props.disableRowGrouping]);
  const stateExportPreProcessing = React.useCallback((prevState, context) => {
    const rowGroupingModelToExport = _gridRowGroupingSelector.gridRowGroupingModelSelector(apiRef);
    const shouldExportRowGroupingModel =
    // Always export if the `exportOnlyDirtyModels` property is not activated
    !context.exportOnlyDirtyModels ||
    // Always export if the model is controlled
    props.rowGroupingModel != null ||
    // Always export if the model has been initialized
    props.initialState?.rowGrouping?.model != null ||
    // Export if the model is not empty
    Object.keys(rowGroupingModelToExport).length > 0;
    if (!shouldExportRowGroupingModel) {
      return prevState;
    }
    return _extends({}, prevState, {
      rowGrouping: {
        model: rowGroupingModelToExport
      }
    });
  }, [apiRef, props.rowGroupingModel, props.initialState?.rowGrouping?.model]);
  const stateRestorePreProcessing = React.useCallback((params, context) => {
    if (props.disableRowGrouping) {
      return params;
    }
    const rowGroupingModel = context.stateToRestore.rowGrouping?.model;
    if (rowGroupingModel != null) {
      apiRef.current.setState(_gridRowGroupingUtils.mergeStateWithRowGroupingModel(rowGroupingModel));
    }
    return params;
  }, [apiRef, props.disableRowGrouping]);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback((params, event) => {
    const cellParams = apiRef.current.getCellParams(params.id, params.field);
    if (_gridRowGroupingUtils.isGroupingColumn(cellParams.field) && event.key === ' ' && !event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();
      if (params.rowNode.type !== 'group') {
        return;
      }
      const isOnGroupingCell = props.rowGroupingColumnMode === 'single' || _gridRowGroupingUtils.getRowGroupingFieldFromGroupingCriteria(params.rowNode.groupingField) === params.field;
      if (!isOnGroupingCell) {
        return;
      }
      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef, props.rowGroupingColumnMode]);
  const checkGroupingColumnsModelDiff = React.useCallback(() => {
    const sanitizedRowGroupingModel = _gridRowGroupingSelector.gridRowGroupingSanitizedModelSelector(apiRef);
    const rulesOnLastRowTreeCreation = apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation || [];
    const groupingRules = _gridRowGroupingUtils.getGroupingRules({
      sanitizedRowGroupingModel,
      columnsLookup: gridColumnLookupSelector(apiRef)
    });
    if (!_gridRowGroupingUtils.areGroupingRulesEqual(rulesOnLastRowTreeCreation, groupingRules)) {
      apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
      _gridRowGroupingUtils.setStrategyAvailability(apiRef, props.disableRowGrouping);

      // Refresh the row tree creation strategy processing
      // TODO: Add a clean way to re-run a strategy processing without publishing a private event
      if (apiRef.current.getActiveStrategy('rowTree') === _gridRowGroupingUtils.ROW_GROUPING_STRATEGY) {
        apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
      }
    }
  }, [apiRef, props.disableRowGrouping]);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridApiEventHandler(apiRef, 'columnsChange', checkGroupingColumnsModelDiff);
  useGridApiEventHandler(apiRef, 'rowGroupingModelChange', checkGroupingColumnsModelDiff);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.rowGroupingModel !== undefined) {
      apiRef.current.setRowGroupingModel(props.rowGroupingModel);
    }
  }, [apiRef, props.rowGroupingModel]);
};

