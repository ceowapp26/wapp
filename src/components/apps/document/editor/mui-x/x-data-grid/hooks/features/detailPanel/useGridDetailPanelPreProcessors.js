import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { gridClasses } from '../../../constants/gridClasses';
import * as _utils from "@mui/utils";
import { useGridSelector } from "../../utils/useGridSelector";
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridDataRowIdsSelector } from '../rows/gridRowsSelector';
import { useGridRegisterPipeProcessor } from '../../core/pipeProcessing/useGridRegisterPipeProcessor';
import * as _gridDetailPanelToggleColDef from './gridDetailPanelToggleColDef';
import * as _gridDetailPanelSelector from './gridDetailPanelSelector';

export const useGridDetailPanelPreProcessors = (privateApiRef, props) => {
  const addToggleColumn = React.useCallback(columnsState => {
    if (props.getDetailPanelContent == null) {
      // Remove the toggle column, when it exists
      if (columnsState.lookup[_gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
        delete columnsState.lookup[_gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD];
        columnsState.orderedFields = columnsState.orderedFields.filter(field => field !== _gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD);
      }
      return columnsState;
    }

    // Don't add the toggle column if there's already one
    // The user might have manually added it to have it in a custom position
    if (columnsState.lookup[_gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
      return columnsState;
    }

    // Otherwise, add the toggle column at the beginning
    columnsState.orderedFields = [_gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD, ...columnsState.orderedFields];
    columnsState.lookup[_gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_FIELD] = _extends({}, _gridDetailPanelToggleColDef.GRID_DETAIL_PANEL_TOGGLE_COL_DEF, {
      headerName: privateApiRef.current.getLocaleText('detailPanelToggle')
    });
    return columnsState;
  }, [privateApiRef, props.getDetailPanelContent]);
  const addExpandedClassToRow = React.useCallback((classes, id) => {
    if (props.getDetailPanelContent == null) {
      return classes;
    }
    const expandedRowIds = _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector(privateApiRef.current.state);
    if (!expandedRowIds.includes(id)) {
      return classes;
    }
    return [...classes, gridClasses['row--detailPanelExpanded']];
  }, [privateApiRef, props.getDetailPanelContent]);
  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', addToggleColumn);
  useGridRegisterPipeProcessor(privateApiRef, 'rowClassName', addExpandedClassToRow);
};
