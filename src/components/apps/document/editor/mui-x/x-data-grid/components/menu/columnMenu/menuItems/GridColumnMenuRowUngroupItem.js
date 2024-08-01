import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import * as _MenuItem from "@mui/material/MenuItem";
import * as _ListItemIcon from "@mui/material/ListItemIcon";
import * as _ListItemText from "@mui/material/ListItemText";
import * as _propTypes from "prop-types";
import { gridRowGroupingSanitizedModelSelector } from '../../../../hooks/features/rowGrouping/gridRowGroupingSelector';
import { gridColumnLookupSelector } from '../../../../hooks/features/columns/gridColumnsSelector';

export function GridColumnMenuRowUngroupItem(props) {
  const {
    colDef,
    onClick
  } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const rootProps = useGridRootProps();
  if (!colDef.groupable) {
    return null;
  }
  const ungroupColumn = event => {
    apiRef.current.removeRowGroupingCriteria(colDef.field);
    onClick(event);
  };
  const groupColumn = event => {
    apiRef.current.addRowGroupingCriteria(colDef.field);
    onClick(event);
  };
  const name = columnsLookup[colDef.field].headerName ?? colDef.field;
  if (rowGroupingModel.includes(colDef.field)) {
    return /*#__PURE__*/_jsxs(_MenuItem.default, {
      onClick: ungroupColumn,
      children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {
        children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuUngroupIcon, {
          fontSize: "small"
        })
      }), /*#__PURE__*/_jsx(_ListItemText.default, {
        children: apiRef.current.getLocaleText('unGroupColumn')(name)
      })]
    });
  }
  return /*#__PURE__*/_jsxs(_MenuItem.default, {
    onClick: groupColumn,
    children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {
      children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuGroupIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/_jsx(_ListItemText.default, {
      children: apiRef.current.getLocaleText('groupColumn')(name)
    })]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuRowUngroupItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
} : void 0;