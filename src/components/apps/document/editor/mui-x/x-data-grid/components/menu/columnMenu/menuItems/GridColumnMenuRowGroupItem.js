import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _propTypes from "prop-types";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import * as _MenuItem from "@mui/material/MenuItem";
import * as _ListItemIcon from "@mui/material/ListItemIcon";
import * as _ListItemText from "@mui/material/ListItemText";
import * as _gridRowGroupingSelector from "../../../../hooks/features/rowGrouping/gridRowGroupingSelector";
import * as _gridRowGroupingUtils from "../../../../hooks/features/rowGrouping/gridRowGroupingUtils";

export function GridColumnMenuRowGroupItem(props) {
  const {
    colDef,
    onClick
  } = props;
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(apiRef, _gridRowGroupingSelector.gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, useGridSelector.gridColumnLookupSelector);
  const rootProps = useGridRootProps();
  const renderUnGroupingMenuItem = field => {
    const ungroupColumn = event => {
      apiRef.current.removeRowGroupingCriteria(field);
      onClick(event);
    };
    const groupedColumn = columnsLookup[field];
    const name = groupedColumn.headerName ?? field;
    return /*#__PURE__*/_jsxs(_MenuItem.default, {
      onClick: ungroupColumn,
      disabled: !groupedColumn.groupable,
      children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {
        children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuUngroupIcon, {
          fontSize: "small"
        })
      }), /*#__PURE__*/_jsx(_ListItemText.default, {
        children: apiRef.current.getLocaleText('unGroupColumn')(name)
      })]
    }, field);
  };
  if (!colDef || !_gridRowGroupingUtils.isGroupingColumn(colDef.field)) {
    return null;
  }
  if (colDef.field === _gridRowGroupingUtils.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
    return /*#__PURE__*/_jsx(React.Fragment, {
      children: rowGroupingModel.map(renderUnGroupingMenuItem)
    });
  }
  return renderUnGroupingMenuItem(_gridRowGroupingUtils.getRowGroupingCriteriaFromGroupingField(colDef.field));
}
process.env.NODE_ENV !== "production" ? GridColumnMenuRowGroupItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
} : void 0;