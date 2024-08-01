import * as React from 'react';
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as _utils from "@mui/utils";
import clsx from 'clsx';
import _extends from "@babel/runtime/helpers/esm/extends";
import { GRID_TREE_DATA_GROUPING_FIELD } from "./gridTreeDataGroupColDef";
import { useGridApiEventHandler } from "../../utils/useGridApiEventHandler";

export const useGridTreeData = apiRef => {
  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback((params, event) => {
    const cellParams = apiRef.current.getCellParams(params.id, params.field);
    if (cellParams.colDef.field === GRID_TREE_DATA_GROUPING_FIELD && event.key === ' ' && !event.shiftKey) {
      if (params.rowNode.type !== 'group') {
        return;
      }
      apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
    }
  }, [apiRef]);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};
