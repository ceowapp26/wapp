import * as React from 'react';
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as _utils from "@mui/utils";
import clsx from 'clsx';
import { gridClasses, getDataGridUtilityClass } from "../constants/gridClasses";
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridRenderContextSelector } from '../hooks/features/virtualization/gridVirtualizationSelectors';
import { gridPinnedRowsSelector } from '../hooks/features/rowPinning/gridRowPinningSelector';

const useUtilityClasses = () => {
  const slots = {
    root: ['pinnedRows']
  };
  return _utils.unstable_composeClasses(slots, getDataGridUtilityClass, {});
};

export function GridPinnedRows({
  position,
  virtualScroller
}) {
  const classes = useUtilityClasses();
  const apiRef = useGridPrivateApiContext();
  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);
  const pinnedRowsData = useGridSelector(apiRef, gridPinnedRowsSelector);
  const rows = pinnedRowsData[position];
  
  if (!apiRef || !renderContext || !pinnedRowsData || !rows) {
    return null;
  }

  const pinnedRenderContext = React.useMemo(() => ({
    firstRowIndex: 0,
    lastRowIndex: rows.length,
    firstColumnIndex: renderContext.firstColumnIndex,
    lastColumnIndex: renderContext.lastColumnIndex
  }), [rows, renderContext.firstColumnIndex, renderContext.lastColumnIndex]);

  if (rows.length === 0) {
    return null;
  }

  const pinnedRows = virtualScroller.getRows({
    position,
    rows,
    renderContext: pinnedRenderContext
  });

  return _jsxs("div", {
    className: clsx(classes.root, gridClasses[`pinnedRows--${position}`]),
    role: "presentation",
    children: pinnedRows
  });
}


