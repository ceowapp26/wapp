import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '../../x-data-grid/hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../x-data-grid/hooks/utils/useGridRootProps';
import { GridEditModes } from '../../x-data-grid/models/gridEditRowModel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS } from '../services/static-data';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function EditStatus(props) {
  const {
    id,
    value,
    field
  } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const handleChange = async event => {
    const isValid = await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value
    });
    if (isValid && rootProps.editMode === GridEditModes.Cell) {
      apiRef.current.stopCellEditMode({
        id,
        field,
        cellToFocusAfter: 'below'
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({
        id,
        field,
        ignoreModifications: true
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
    children: STATUS_OPTIONS.map(option => {
      let IconComponent = null;
      if (option === 'Rejected') {
        IconComponent = ReportProblemIcon;
      } else if (option === 'Open') {
        IconComponent = InfoIcon;
      } else if (option === 'PartiallyFilled') {
        IconComponent = AutorenewIcon;
      } else if (option === 'Filled') {
        IconComponent = DoneIcon;
      }
      let label = option;
      if (option === 'PartiallyFilled') {
        label = 'Partially Filled';
      }
      return /*#__PURE__*/_jsxs(MenuItem, {
        value: option,
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          sx: {
            minWidth: 36
          },
          children: /*#__PURE__*/_jsx(IconComponent, {
            fontSize: "small"
          })
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: label,
          sx: {
            overflow: 'hidden'
          }
        })]
      }, option);
    })
  });
}
export function renderEditStatus(params) {
  return /*#__PURE__*/_jsx(EditStatus, _extends({}, params));
}