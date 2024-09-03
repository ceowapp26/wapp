import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["renderHeader", "className", "visibleColumns", "sortColumnLookup", "filterColumnLookup", "columnHeaderTabIndexState", "columnGroupHeaderTabIndexState", "columnHeaderFocus", "columnGroupHeaderFocus", "headerGroupingMaxDepth", "columnMenuState", "columnVisibility", "columnGroupsHeaderStructure", "hasOtherElementInTabSequence"];
import * as React from 'react';
import * as _styles from "@mui/material/styles";
import { unstable_composeClasses } from "@mui/utils";
import * as _gridAggregationUtils from "../hooks/features/aggregation/gridAggregationUtils";
import { useGridApiContext } from "../hooks/utils/useGridApiContext";
import { useGridRootProps } from "../hooks/utils/useGridRootProps";
import { getDataGridUtilityClass, gridClasses } from "../constants/gridClasses";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridColumnHeaderTitle } from "./columnHeaders/GridColumnHeaderTitle";

const GridAggregationHeaderRoot = _styles.styled('div', {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeader',
  overridesResolver: (_, styles) => styles.aggregationColumnHeader
})({
  display: 'flex',
  flexDirection: 'column',
  [`&.${gridClasses['aggregationColumnHeader--alignRight']}`]: {
    alignItems: 'flex-end'
  },
  [`&.${gridClasses['aggregationColumnHeader--alignCenter']}`]: {
    alignItems: 'center'
  }
});
const GridAggregationFunctionLabel = _styles.styled('div', {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeaderLabel',
  overridesResolver: (_, styles) => styles.aggregationColumnHeaderLabel
})(({
  theme
}) => {
  return {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.fontSize,
    position: 'absolute',
    bottom: 4,
    fontWeight: theme.typography.fontWeightMedium,
    color: (theme.vars || theme).palette.primary.dark,
    textTransform: 'uppercase'
  };
});
const useUtilityClasses = ownerState => {
  const {
    classes,
    colDef
  } = ownerState;
  const slots = {
    root: ['aggregationColumnHeader', colDef.headerAlign === 'left' && 'aggregationColumnHeader--alignLeft', colDef.headerAlign === 'center' && 'aggregationColumnHeader--alignCenter', colDef.headerAlign === 'right' && 'aggregationColumnHeader--alignRight'],
    aggregationLabel: ['aggregationColumnHeaderLabel']
  };
  return unstable_composeClasses(slots, getDataGridUtilityClass, classes);
};
export function GridAggregationHeader(props) {
  const {
      renderHeader
    } = props,
    params = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    colDef,
    aggregation
  } = params;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = _extends({}, rootProps, {
    classes: rootProps.classes,
    colDef
  });
  const classes = useUtilityClasses(ownerState);
  if (!aggregation) {
    return null;
  }
  const aggregationLabel = _gridAggregationUtils.getAggregationFunctionLabel({
    apiRef,
    aggregationRule: aggregation.aggregationRule
  });
  return /*#__PURE__*/_jsxs(GridAggregationHeaderRoot, {
    ownerState: ownerState,
    className: classes.root,
    children: [renderHeader ? renderHeader(params) : /*#__PURE__*/_jsx(GridColumnHeaderTitle, {
      label: colDef.headerName ?? colDef.field,
      description: colDef.description,
      columnWidth: colDef.computedWidth
    }), /*#__PURE__*/_jsx(GridAggregationFunctionLabel, {
      ownerState: ownerState,
      className: classes.aggregationLabel,
      children: aggregationLabel
    })]
  });
}