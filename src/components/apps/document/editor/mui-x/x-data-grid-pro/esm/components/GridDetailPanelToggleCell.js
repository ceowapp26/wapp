import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass, useGridSelector } from '@mui/x-data-grid';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridDetailPanelExpandedRowsContentCacheSelector } from '../hooks/features/detailPanel/gridDetailPanelSelector';
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    isExpanded
  } = ownerState;
  const slots = {
    root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded']
  };
  return composeClasses(slots, getDataGridUtilityClass, classes);
};
function GridDetailPanelToggleCell(props) {
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
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
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
  api: PropTypes.object.isRequired,
  /**
   * The mode of the cell.
   */
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the cell that triggered the event.
   */
  field: PropTypes.string.isRequired,
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.shape({
      focus: PropTypes.func.isRequired
    })
  })]),
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: PropTypes.any,
  /**
   * If true, the cell is the active element.
   */
  hasFocus: PropTypes.bool.isRequired,
  /**
   * The grid row id.
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * If true, the cell is editable.
   */
  isEditable: PropTypes.bool,
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: PropTypes.any.isRequired,
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: PropTypes.object.isRequired,
  /**
   * the tabIndex value.
   */
  tabIndex: PropTypes.oneOf([-1, 0]).isRequired,
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value: PropTypes.any
} : void 0;
export { GridDetailPanelToggleCell };