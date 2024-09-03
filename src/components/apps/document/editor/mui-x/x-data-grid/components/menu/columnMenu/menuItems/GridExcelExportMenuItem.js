import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _propTypes from "prop-types";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import * as _MenuItem from "@mui/material/MenuItem";

const _excluded = ["hideMenu", "options"];

export function GridExcelExportMenuItem(props) {
  const apiRef = useGridApiContext();
  const {
      hideMenu,
      options
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsx(_MenuItem.default, _extends({
    onClick: () => {
      apiRef.current.exportDataAsExcel(options);
      hideMenu?.();
    }
  }, other, {
    children: apiRef.current.getLocaleText('toolbarExportExcel')
  }));
}
process.env.NODE_ENV !== "production" ? GridExcelExportMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  hideMenu: _propTypes.default.func,
  options: _propTypes.default.shape({
    allColumns: _propTypes.default.bool,
    columnsStyles: _propTypes.default.object,
    disableToolbarButton: _propTypes.default.bool,
    exceljsPostProcess: _propTypes.default.func,
    exceljsPreProcess: _propTypes.default.func,
    fields: _propTypes.default.arrayOf(_propTypes.default.string),
    fileName: _propTypes.default.string,
    getRowsToExport: _propTypes.default.func,
    includeColumnGroupsHeaders: _propTypes.default.bool,
    includeHeaders: _propTypes.default.bool,
    valueOptionsSheetName: _propTypes.default.string,
    worker: _propTypes.default.func
  })
} : void 0;