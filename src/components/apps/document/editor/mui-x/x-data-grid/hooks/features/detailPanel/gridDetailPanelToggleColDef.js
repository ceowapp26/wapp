import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import * as _utils from "@mui/utils";
import { useGridSelector } from "../../utils/useGridSelector";
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import * as _gridDetailPanelSelector from './gridDetailPanelSelector';
import { GRID_STRING_COL_DEF } from '../../../colDef/gridStringColDef';
import { GridDetailPanelToggleCell } from "../../../components/GridDetailPanelToggleCell";
import { jsx as _jsx } from "react/jsx-runtime";

export const GRID_DETAIL_PANEL_TOGGLE_FIELD = '__detail_panel_toggle__';
export const GRID_DETAIL_PANEL_TOGGLE_COL_DEF = _extends({}, GRID_STRING_COL_DEF, {
  type: 'custom',
  field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
  editable: false,
  sortable: false,
  filterable: false,
  resizable: false,
  // @ts-ignore
  aggregable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  align: 'left',
  width: 40,
  valueGetter: (value, row, column, apiRef) => {
    const rowId = apiRef.current.getRowId(row);
    const expandedRowIds = _gridDetailPanelSelector.gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);
    return expandedRowIds.includes(rowId);
  },
  renderCell: params => /*#__PURE__*/_jsx(GridDetailPanelToggleCell.GridDetailPanelToggleCell, _extends({}, params)),
  renderHeader: () => null
});
