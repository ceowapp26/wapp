import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiContext } from '@mui/x-data-grid-premium';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { COUNTRY_ISO_OPTIONS } from '../services/static-data';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const StyledAutocomplete = styled(Autocomplete)(({
  theme
}) => ({
  height: '100%',
  [`& .${autocompleteClasses.inputRoot}`]: _extends({}, theme.typography.body2, {
    padding: '1px 0',
    height: '100%',
    '& input': {
      padding: '0 16px',
      height: '100%'
    }
  })
}));
function EditCountry(props) {
  const {
    id,
    value,
    field
  } = props;
  const apiRef = useGridApiContext();
  const handleChange = React.useCallback(async (event, newValue) => {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue
    }, event);
    apiRef.current.stopCellEditMode({
      id,
      field
    });
  }, [apiRef, field, id]);
  return /*#__PURE__*/_jsx(StyledAutocomplete, {
    value: value,
    onChange: handleChange,
    options: COUNTRY_ISO_OPTIONS,
    getOptionLabel: option => option.label,
    autoHighlight: true,
    fullWidth: true,
    open: true,
    disableClearable: true,
    renderOption: (optionProps, option) => /*#__PURE__*/_jsxs(Box, _extends({
      component: "li",
      sx: {
        '& > img': {
          mr: 1.5,
          flexShrink: 0
        }
      }
    }, optionProps, {
      children: [/*#__PURE__*/_jsx("img", {
        loading: "lazy",
        width: "20",
        src: `https://flagcdn.com/w20/${option.code.toLowerCase()}.png`,
        srcSet: `https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`,
        alt: ""
      }), option.label]
    })),
    renderInput: params => /*#__PURE__*/_jsx(InputBase, _extends({
      autoFocus: true,
      fullWidth: true,
      id: params.id,
      inputProps: _extends({}, params.inputProps, {
        autoComplete: 'new-password' // disable autocomplete and autofill
      })
    }, params.InputProps))
  });
}
export function renderEditCountry(params) {
  return /*#__PURE__*/_jsx(EditCountry, _extends({}, params));
}