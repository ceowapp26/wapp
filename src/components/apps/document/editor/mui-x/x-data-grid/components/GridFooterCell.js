import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { fastMemo } from '../utils/fastMemo';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import * as _utils from '@mui/utils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import * as _detailPanel from "../hooks/features/detailPanel";
import * as _GridDetailPanel from "./GridDetailPanel";
import * as _styles from "@mui/material/styles";
import { useResizeObserver } from '../hooks/utils/useResizeObserver';
import * as _propTypes from "prop-types";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { gridDetailPanelSelector } from "../hooks/features/detailPanel/gridDetailPanelSelector";

const _excluded = ["formattedValue", "colDef", "cellMode", "row", "api", "id", "value", "rowNode", "field", "focusElementRef", "hasFocus", "tabIndex", "isEditable"];
const GridFooterCellRoot = _styles.styled('div', {
  name: 'MuiDataGrid',
  slot: 'FooterCell',
  overridesResolver: (_, styles) => styles.footerCell
})(({
  theme
}) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.primary.dark
}));
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['footerCell']
  };
  return _utils.unstable_composeClasses(slots, getDataGridUtilityClass, classes);
};
export function GridFooterCell(props) {
  const {
      formattedValue
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const rootProps = useGridRootProps();
  const ownerState = rootProps;
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(GridFooterCellRoot, _extends({
    ownerState: ownerState,
    className: classes.root
  }, other, {
    children: formattedValue
  }));
}