import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import * as _utils from '@mui/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _styles from "@mui/material/styles";
import * as _propTypes from "prop-types";

const sx = {
  padding: '2px'
};

export function GridHeaderFilterClearButton(props) {
  const rootProps = useGridRootProps.useGridRootProps();
  return /*#__PURE__*/_jsx(rootProps.slots.baseIconButton, _extends({
    tabIndex: -1,
    "aria-label": "Clear filter",
    size: "small",
    sx: sx
  }, props, rootProps.slotProps?.baseIconButton, {
    children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuClearIcon, {
      fontSize: "inherit"
    })
  }));
}