import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { getDataGridUtilityClass } from '../constants/gridClasses';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridFilteredDescendantCountLookupSelector } from '../hooks/features/filter/gridFilterSelector';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _propTypes from "prop-types";
import * as _utils from "@mui/utils";
import * as _Box from "@mui/material/Box";

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle']
  };
  return _utils.unstable_composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridTreeDataGroupingCell(props) {
  const {
    id,
    field,
    formattedValue,
    rowNode,
    hideDescendantCount,
    offsetMultiplier = 2
  } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const ownerState = {
    classes: rootProps.classes
  };
  const classes = useUtilityClasses(ownerState);
  const filteredDescendantCountLookup = useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
  const Icon = rowNode.childrenExpanded ? rootProps.slots.treeDataCollapseIcon : rootProps.slots.treeDataExpandIcon;
  const handleClick = event => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  };
  return /*#__PURE__*/_jsxs(_Box.default, {
    className: classes.root,
    sx: {
      ml: rowNode.depth * offsetMultiplier
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: classes.toggle,
      children: filteredDescendantCount > 0 && /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
        size: "small",
        onClick: handleClick,
        tabIndex: -1,
        "aria-label": rowNode.childrenExpanded ? apiRef.current.getLocaleText('treeDataCollapse') : apiRef.current.getLocaleText('treeDataExpand')
      }, rootProps?.slotProps?.baseIconButton, {
        children: /*#__PURE__*/_jsx(Icon, {
          fontSize: "inherit"
        })
      }))
    }), /*#__PURE__*/_jsxs("span", {
      children: [formattedValue === undefined ? rowNode.groupingKey : formattedValue, !hideDescendantCount && filteredDescendantCount > 0 ? ` (${filteredDescendantCount})` : '']
    })]
  });
}
process.env.NODE_ENV !== "production" ? GridTreeDataGroupingCell.propTypes = {
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
  hideDescendantCount: _propTypes.default.bool,
  /**
   * The grid row id.
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: _propTypes.default.bool,
  /**
   * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
   * @default 2
   */
  offsetMultiplier: _propTypes.default.number,
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