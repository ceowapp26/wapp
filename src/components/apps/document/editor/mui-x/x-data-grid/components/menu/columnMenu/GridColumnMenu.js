import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["defaultSlots", "defaultSlotProps", "slots", "slotProps"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridColumnMenuSlots } from '../../../hooks/features/columnMenu/useGridColumnMenuSlots';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuColumnsItem } from './menuItems/GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './menuItems/GridColumnMenuFilterItem';
import { GridColumnMenuSortItem } from './menuItems/GridColumnMenuSortItem';
import { GridColumnMenuPinningItem } from './menuItems/GridColumnMenuPinningItem';
import { GridColumnMenuAggregationItem } from './menuItems/GridColumnMenuAggregationItem';
import * as _rowGrouping from "../../../hooks/features/rowGrouping";
import * as _GridColumnMenuRowGroupItem from "./menuItems/GridColumnMenuRowGroupItem";
import { jsx as _jsx } from "react/jsx-runtime";

export function GridColumnMenuGroupingItem(props) {
  const {
    colDef
  } = props;
  if (_rowGrouping.isGroupingColumn(colDef.field)) {
    return /*#__PURE__*/_jsx(_GridColumnMenuRowGroupItem.GridColumnMenuRowGroupItem, _extends({}, props));
  }
  return /*#__PURE__*/_jsx(_GridColumnMenuRowUngroupItem.GridColumnMenuRowUngroupItem, _extends({}, props));
}

export const GRID_COLUMN_MENU_SLOTS = {
  columnMenuSortItem: GridColumnMenuSortItem,
  columnMenuFilterItem: GridColumnMenuFilterItem,
  columnMenuColumnsItem: GridColumnMenuColumnsItem,
  columnMenuAggregationItem: GridColumnMenuAggregationItem,
  columnMenuPinningItem: GridColumnMenuPinningItem,
  columnMenuGroupingItem: GridColumnMenuGroupingItem
};
export const GRID_COLUMN_MENU_SLOT_PROPS = {
  columnMenuSortItem: {
    displayOrder: 10
  },
  columnMenuFilterItem: {
    displayOrder: 20
  },
  columnMenuColumnsItem: {
    displayOrder: 30
  },
  columnMenuAggregationItem: {
    displayOrder: 23
  },
  columnMenuGroupingItem: {
    displayOrder: 27
  },
  columnMenuPinningItem: {
    displayOrder: 15
  },
  columnMenuGroupingItem: {
    displayOrder: 18
  },
};
const GridGenericColumnMenu = /*#__PURE__*/React.forwardRef(function GridGenericColumnMenu(props, ref) {
  const {
      defaultSlots,
      defaultSlotProps,
      slots,
      slotProps
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const orderedSlots = useGridColumnMenuSlots(_extends({}, other, {
    defaultSlots,
    defaultSlotProps,
    slots,
    slotProps
  }));
  return /*#__PURE__*/_jsx(GridColumnMenuContainer, _extends({
    ref: ref
  }, other, {
    children: orderedSlots.map(([Component, otherProps], index) => /*#__PURE__*/_jsx(Component, _extends({}, otherProps), index))
  }));
});
const GridColumnMenu = /*#__PURE__*/React.forwardRef(function GridColumnMenu(props, ref) {
  return /*#__PURE__*/_jsx(GridGenericColumnMenu, _extends({}, props, {
    ref: ref,
    defaultSlots: GRID_COLUMN_MENU_SLOTS,
    defaultSlotProps: GRID_COLUMN_MENU_SLOT_PROPS
  }));
});
process.env.NODE_ENV !== "production" ? GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  slotProps: PropTypes.object,
  /**
   * `slots` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `slotProps`
   * or it will be placed in the end of the list
   */
  slots: PropTypes.object
} : void 0;
export { GridColumnMenu, GridGenericColumnMenu };

