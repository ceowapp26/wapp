import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { getDataGridUtilityClass } from '../../../../constants/gridClasses';
import * as _utils from '@mui/utils';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _propTypes from "prop-types";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import * as _MenuItem from "@mui/material/MenuItem";
import * as _ListItemIcon from "@mui/material/ListItemIcon";
import * as _ListItemText from "@mui/material/ListItemText";
import * as _toPropertyKey2 from "@babel/runtime/helpers/toPropertyKey";
import * as _FormControl from "@mui/material/FormControl";
import * as _InputLabel from "@mui/material/InputLabel";
import * as _Select from "@mui/material/Select";
import * as _gridAggregationUtils from "../../../../hooks/features/aggregation/gridAggregationUtils";
import * as _gridAggregationSelectors from "../../../../hooks/features/aggregation/gridAggregationSelectors";

export function GridColumnMenuAggregationItem(props) {
  const {
    colDef
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const id = _utils.unstable_useId();
  const aggregationModel = useGridSelector(apiRef, _gridAggregationSelectors.gridAggregationModelSelector);
  const availableAggregationFunctions = React.useMemo(() => _gridAggregationUtils.getAvailableAggregationFunctions({
    aggregationFunctions: rootProps.aggregationFunctions,
    colDef
  }), [colDef, rootProps.aggregationFunctions]);
  const selectedAggregationRule = React.useMemo(() => {
    if (!colDef || !aggregationModel[colDef.field]) {
      return '';
    }
    const aggregationFunctionName = aggregationModel[colDef.field];
    if (_gridAggregationUtils.canColumnHaveAggregationFunction({
      colDef,
      aggregationFunctionName,
      aggregationFunction: rootProps.aggregationFunctions[aggregationFunctionName]
    })) {
      return aggregationFunctionName;
    }
    return '';
  }, [rootProps.aggregationFunctions, aggregationModel, colDef]);
  const handleAggregationItemChange = event => {
    const newAggregationItem = event.target?.value || undefined;
    const currentModel = _gridAggregationSelectors.gridAggregationModelSelector(apiRef);
    const _colDef$field = colDef.field,
      otherColumnItems = _objectWithoutPropertiesLoose2(currentModel, [_colDef$field].map(_toPropertyKey2.default));
    const newModel = newAggregationItem == null ? otherColumnItems : _extends({}, otherColumnItems, {
      [colDef?.field]: newAggregationItem
    });
    apiRef.current.setAggregationModel(newModel);
    apiRef.current.hideColumnMenu();
  };
  const label = apiRef.current.getLocaleText('aggregationMenuItemHeader');
  return /*#__PURE__*/_jsxs(_MenuItem.default, {
    disableRipple: true,
    children: [/*#__PURE__*/ _jsx(_ListItemIcon.default, {
      children: /*#__PURE__*/ _jsx(rootProps.slots.columnMenuAggregationIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/_jsx(_ListItemText.default, {
      children: /*#__PURE__*/_jsxs(_FormControl.default, {
        size: "small",
        fullWidth: true,
        sx: {
          minWidth: 150
        },
        children: [/*#__PURE__*/_jsx(_InputLabel.default, {
          id: `${id}-label`,
          children: label
        }), /*#__PURE__*/_jsxs(_Select.default, {
          labelId: `${id}-label`,
          id: `${id}-input`,
          value: selectedAggregationRule,
          label: label,
          color: "primary",
          onChange: handleAggregationItemChange,
          onBlur: e => e.stopPropagation(),
          fullWidth: true,
          children: [/*#__PURE__*/_jsx(_MenuItem.default, {
            value: "",
            children: "..."
          }), availableAggregationFunctions.map(aggFunc => /*#__PURE__*/_jsx(_MenuItem.default, {
            value: aggFunc,
            children: _gridAggregationUtils.getAggregationFunctionLabel({
              apiRef,
              aggregationRule: {
                aggregationFunctionName: aggFunc,
                aggregationFunction: rootProps.aggregationFunctions[aggFunc]
              }
            })
          }, aggFunc))]
        })]
      })
    })]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuAggregationItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
} : void 0;