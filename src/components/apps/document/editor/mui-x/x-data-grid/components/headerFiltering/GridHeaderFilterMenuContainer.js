import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import * as _utils from '@mui/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _styles from "@mui/material/styles";
import * as _propTypes from "prop-types";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { gridHeaderFilteringMenuSelector } from "../../hooks/features/headerFiltering/gridHeaderFilteringSelectors"; 

const _excluded = ["operators", "item", "field", "buttonRef", "headerFilterMenuRef", "disabled"];
const sx = {
  width: 22,
  height: 22,
  margin: 'auto 0 10px 5px'
};
export function GridHeaderFilterMenuContainer(props) {
  const {
      operators,
      item,
      field,
      buttonRef,
      headerFilterMenuRef,
      disabled = false
    } = props,
    others = _objectWithoutPropertiesLoose(props, _excluded);
  const buttonId = _utils.unstable_useId();
  const menuId = _utils.unstable_useId();
  const rootProps = useGridRootProps.useGridRootProps();
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
  applyFilterChanges: _propTypes.default.func.isRequired,
  buttonRef: _utils.refType,
  disabled: _propTypes.default.bool,
  field: _propTypes.default.string.isRequired,
  headerFilterMenuRef: _propTypes.default.shape({
    current: _propTypes.default.object
  }).isRequired,
  item: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operator: _propTypes.default.string.isRequired,
    value: _propTypes.default.any
  }).isRequired,
  operators: _propTypes.default.arrayOf(_propTypes.default.shape({
    getApplyFilterFn: _propTypes.default.func.isRequired,
    getValueAsString: _propTypes.default.func,
    headerLabel: _propTypes.default.string,
    InputComponent: _propTypes.default.elementType,
    InputComponentProps: _propTypes.default.object,
    label: _propTypes.default.string,
    requiresFilterValue: _propTypes.default.bool,
    value: _propTypes.default.string.isRequired
  })).isRequired
} : void 0;