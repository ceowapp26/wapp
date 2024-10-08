import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '../../x-data-grid/hooks/utils/useGridApiContext';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { INCOTERM_OPTIONS } from '../services/static-data';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function EditIncoterm(props) {
  const {
    id,
    value,
    field
  } = props;
  const apiRef = useGridApiContext();
  const handleChange = async event => {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value
    }, event);
    apiRef.current.stopCellEditMode({
      id,
      field
    });
  };
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({
        id,
        field
      });
    }
  };
  return /*#__PURE__*/_jsx(Select, {
    value: value,
    onChange: handleChange,
    MenuProps: {
      onClose: handleClose
    },
    sx: {
      height: '100%',
      '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        pl: 1
      }
    },
    autoFocus: true,
    fullWidth: true,
    open: true,
    children: INCOTERM_OPTIONS.map(option => {
      const tooltip = option.slice(option.indexOf('(') + 1, option.indexOf(')'));
      const code = option.slice(0, option.indexOf('(')).trim();
      return /*#__PURE__*/_jsxs(MenuItem, {
        value: option,
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          sx: {
            minWidth: 36
          },
          children: code
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: tooltip,
          sx: {
            overflow: 'hidden'
          }
        })]
      }, option);
    })
  });
}
export function renderEditIncoterm(params) {
  return /*#__PURE__*/_jsx(EditIncoterm, _extends({}, params));
}