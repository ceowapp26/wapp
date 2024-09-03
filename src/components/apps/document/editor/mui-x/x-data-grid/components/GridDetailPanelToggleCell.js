import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { fastMemo } from '../utils/fastMemo';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import * as _utils from '@mui/utils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { jsx as _jsx } from "react/jsx-runtime";
import * as _propTypes from "prop-types";
import * as _gridDetailPanelSelector from "../hooks/features/detailPanel/gridDetailPanelSelector";

const useUtilityClasses = ownerState => {
  const {
    classes,
    isExpanded
  } = ownerState;
  const slots = {
    root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded']
  };
  return _utils.unstable_composeClasses(slots, getDataGridUtilityClass, classes);
};
export function GridDetailPanelToggleCell(props) {
  const {
    id,
    value: isExpanded
  } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const ownerState = {
    classes: rootProps.classes,
    isExpanded
  };
  const classes = useUtilityClasses(ownerState);
  const contentCache = useGridSelector(apiRef, _gridDetailPanelSelector.gridDetailPanelExpandedRowsContentCacheSelector);
  const hasContent = /*#__PURE__*/React.isValidElement(contentCache[id]);
  const Icon = isExpanded ? rootProps.slots.detailPanelCollapseIcon : rootProps.slots.detailPanelExpandIcon;
  return /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
    size: "small",
    tabIndex: -1,
    disabled: !hasContent,
    className: classes.root,
    "aria-label": isExpanded ? apiRef.current.getLocaleText('collapseDetailPanel') : apiRef.current.getLocaleText('expandDetailPanel')
  }, rootProps.slotProps?.baseIconButton, {
    children: /*#__PURE__*/_jsx(Icon, {
      fontSize: "inherit"
    })
  }));
}
process.env.NODE_ENV !== "production" ? GridDetailPanelToggleCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * GridApi that let you manipulate the grid.
   */
  api: _propTypes.default.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: _propTypes.default.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: _propTypes.default.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: _propTypes.default.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.shape({
      focus: _propTypes.default.func.isRequired
    })
  })]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: _propTypes.default.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: _propTypes.default.bool.isRequired,
  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: _propTypes.default.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: _propTypes.default.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: _propTypes.default.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: _propTypes.default.any
} : void 0;