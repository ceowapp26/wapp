import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { fastMemo } from '../../utils/fastMemo';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import * as _utils from '@mui/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _detailPanel from "../../hooks/features/detailPanel";
import * as _styles from "@mui/material/styles";
import { useResizeObserver } from '../../hooks/utils/useResizeObserver';
import * as _propTypes from "prop-types";
import * as _Box from "@mui/material/Box";
import * as _MenuList from "@mui/material/MenuList";
import * as _MenuItem from "@mui/material/MenuItem";

export function GridHeaderFilterMenu({
  open,
  field,
  target,
  applyFilterChanges,
  operators,
  item,
  id,
  labelledBy
}) {
  const apiRef = useGridApiContext();
  const hideMenu = React.useCallback(() => {
    apiRef.current.hideHeaderFilterMenu();
  }, [apiRef]);
  const handleListKeyDown = React.useCallback(event => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      hideMenu();
    }
  }, [hideMenu]);
  if (!target) {
    return null;
  }
  return /*#__PURE__*/_jsx(GridMenu, {
    placement: "bottom-end",
    open: open,
    target: target,
    onClose: hideMenu,
    children: /*#__PURE__*/_jsx(_MenuList.default, {
      "aria-labelledby": labelledBy,
      id: id,
      onKeyDown: handleListKeyDown,
      children: operators.map((op, i) => {
        const label = op?.headerLabel ?? apiRef.current.getLocaleText(`headerFilterOperator${_utils.unstable_capitalize(op.value)}`);
        return /*#__PURE__*/_jsx(_MenuItem.default, {
          onClick: () => {
            applyFilterChanges(_extends({}, item, {
              operator: op.value
            }));
            hideMenu();
          },
          autoFocus: i === 0 ? open : false,
          selected: op.value === item.operator,
          children: label
        }, `${field}-${op.value}`);
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? GridHeaderFilterMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  applyFilterChanges: _propTypes.default.func.isRequired,
  field: _propTypes.default.string.isRequired,
  id: _propTypes.default.string.isRequired,
  item: _propTypes.default.shape({
    field: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    operator: _propTypes.default.string.isRequired,
    value: _propTypes.default.any
  }).isRequired,
  labelledBy: _propTypes.default.string.isRequired,
  open: _propTypes.default.bool.isRequired,
  operators: _propTypes.default.arrayOf(_propTypes.default.shape({
    getApplyFilterFn: _propTypes.default.func.isRequired,
    getValueAsString: _propTypes.default.func,
    headerLabel: _propTypes.default.string,
    InputComponent: _propTypes.default.elementType,
    InputComponentProps: _propTypes.default.object,
    label: _propTypes.default.string,
    requiresFilterValue: _propTypes.default.bool,
    value: _propTypes.default.string.isRequired
  })).isRequired,
  target: _utils.HTMLElementType
} : void 0;