import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _Box from "@mui/material/Box";

export function GridGroupingColumnLeafCell(props) {
  const {
    rowNode
  } = props;
  const rootProps = useGridRootProps();
  return /*#__PURE__*/_jsx(_Box.default, {
    sx: {
      ml: rootProps.rowGroupingColumnMode === 'multiple' ? 1 : theme => `calc(var(--DataGrid-cellOffsetMultiplier) * ${theme.spacing(rowNode.depth)})`
    },
    children: props.formattedValue ?? props.value
  });
}