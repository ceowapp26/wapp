import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["operators", "item", "field", "buttonRef", "headerFilterMenuRef", "disabled"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { refType, unstable_useId as useId } from '@mui/utils';
import { gridHeaderFilteringMenuSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sx = {
  width: 22,
  height: 22,
  margin: 'auto 0 10px 5px'
};
function GridHeaderFilterMenuContainer(props) {
  const {
      operators,
      item,
      field,
      buttonRef,
      headerFilterMenuRef,
      disabled = false
    } = props,
    others = _objectWithoutPropertiesLoose(props, _excluded);
  const buttonId = useId();
  const menuId = useId();
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const menuOpenField = useGridSelector(apiRef, gridHeaderFilteringMenuSelector);
  const open = Boolean(menuOpenField === field && headerFilterMenuRef.current);
  const handleClick = event => {
    headerFilterMenuRef.current = event.currentTarget;
    apiRef.current.showHeaderFilterMenu(field);
  };
  if (!rootProps.slots.headerFilterMenu) {
    return null;
  }
  const label = apiRef.current.getLocaleText('filterPanelOperator');
  const labelString = label ? String(label) : undefined;
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [/*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
      id: buttonId,
      ref: buttonRef,
      "aria-label": labelString,
      title: labelString,
      "aria-controls": menuId,
      "aria-expanded": open ? 'true' : undefined,
      "aria-haspopup": "true",
      tabIndex: -1,
      size: "small",
      onClick: handleClick,
      sx: sx,
      disabled: disabled
    }, rootProps.slotProps?.baseIconButton, {
      children: /*#__PURE__*/_jsx(rootProps.slots.openFilterButtonIcon, {
        fontSize: "small"
      })
    })), /*#__PURE__*/_jsx(rootProps.slots.headerFilterMenu, _extends({
      field: field,
      open: open,
      item: item,
      target: headerFilterMenuRef.current,
      operators: operators,
      labelledBy: buttonId,
      id: menuId
    }, others))]
  });
}
process.env.NODE_ENV !== "production" ? GridHeaderFilterMenuContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  applyFilterChanges: PropTypes.func.isRequired,
  buttonRef: refType,
  disabled: PropTypes.bool,
  field: PropTypes.string.isRequired,
  headerFilterMenuRef: PropTypes.shape({
    current: PropTypes.object
  }).isRequired,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired,
  operators: PropTypes.arrayOf(PropTypes.shape({
    getApplyFilterFn: PropTypes.func.isRequired,
    getValueAsString: PropTypes.func,
    headerLabel: PropTypes.string,
    InputComponent: PropTypes.elementType,
    InputComponentProps: PropTypes.object,
    label: PropTypes.string,
    requiresFilterValue: PropTypes.bool,
    value: PropTypes.string.isRequired
  })).isRequired
} : void 0;
export { GridHeaderFilterMenuContainer };