import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _styles from "@mui/material/styles";
import * as _propTypes from "prop-types";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import * as _MenuItem from "@mui/material/MenuItem";
import * as _ListItemIcon from "@mui/material/ListItemIcon";
import * as _ListItemText from "@mui/material/ListItemText";
import { GridPinnedColumnPosition } from '../../../../hooks/features/columns/gridColumnsInterfaces';

export function GridColumnMenuPinningItem(props) {
  const {
    colDef,
    onClick
  } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const theme = _styles.useTheme();
  const pinColumn = React.useCallback(side => event => {
    apiRef.current.pinColumn(colDef.field, side);
    onClick(event);
  }, [apiRef, colDef.field, onClick]);
  const unpinColumn = event => {
    apiRef.current.unpinColumn(colDef.field);
    onClick(event);
  };
  const pinToLeftMenuItem = /*#__PURE__*/_jsxs(_MenuItem.default, {
    onClick: pinColumn(GridPinnedColumnPosition.LEFT),
    children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {
      children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuPinLeftIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/_jsx(_ListItemText.default, {
      children: apiRef.current.getLocaleText('pinToLeft')
    })]
  });
  const pinToRightMenuItem = /*#__PURE__*/_jsxs(_MenuItem.default, {
    onClick: pinColumn(GridPinnedColumnPosition.RIGHT),
    children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {
      children: /*#__PURE__*/_jsx(rootProps.slots.columnMenuPinRightIcon, {
        fontSize: "small"
      })
    }), /*#__PURE__*/_jsx(_ListItemText.default, {
      children: apiRef.current.getLocaleText('pinToRight')
    })]
  });
  if (!colDef) {
    return null;
  }
  const side = apiRef.current.isColumnPinned(colDef.field);
  if (side) {
    const otherSide = side === GridPinnedColumnPosition.RIGHT ? _xDataGrid.GridPinnedColumnPosition.LEFT : GridPinnedColumnPosition.RIGHT;
    const label = otherSide === GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
    const Icon = side === GridPinnedColumnPosition.RIGHT ? rootProps.slots.columnMenuPinLeftIcon : rootProps.slots.columnMenuPinRightIcon;
    return /*#__PURE__*/_jsxs(React.Fragment, {
      children: [/*#__PURE__*/_jsxs(_MenuItem.default, {
        onClick: pinColumn(otherSide),
        children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {
          children: /*#__PURE__*/_jsx(Icon, {
            fontSize: "small"
          })
        }), /*#__PURE__*/_jsx(_ListItemText.default, {
          children: apiRef.current.getLocaleText(label)
        })]
      }), /*#__PURE__*/_jsxs(_MenuItem.default, {
        onClick: unpinColumn,
        children: [/*#__PURE__*/_jsx(_ListItemIcon.default, {}), /*#__PURE__*/_jsx(_ListItemText.default, {
          children: apiRef.current.getLocaleText('unpin')
        })]
      })]
    });
  }
  if (theme.direction === 'rtl') {
    return /*#__PURE__*/_jsxs(React.Fragment, {
      children: [pinToRightMenuItem, pinToLeftMenuItem]
    });
  }
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [pinToLeftMenuItem, pinToRightMenuItem]
  });
}
process.env.NODE_ENV !== "production" ? GridColumnMenuPinningItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
} : void 0;