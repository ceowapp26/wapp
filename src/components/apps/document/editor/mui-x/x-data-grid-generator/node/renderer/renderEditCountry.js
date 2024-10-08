"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderEditCountry = renderEditCountry;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _Autocomplete = _interopRequireWildcard(require("@mui/material/Autocomplete"));
var _InputBase = _interopRequireDefault(require("@mui/material/InputBase"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _styles = require("@mui/material/styles");
var _staticData = require("../services/static-data");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const StyledAutocomplete = (0, _styles.styled)(_Autocomplete.default)(({
  theme
}) => ({
  height: '100%',
  [`& .${_Autocomplete.autocompleteClasses.inputRoot}`]: (0, _extends2.default)({}, theme.typography.body2, {
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
  const apiRef = (0, _xDataGridPremium.useGridApiContext)();
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledAutocomplete, {
    value: value,
    onChange: handleChange,
    options: _staticData.COUNTRY_ISO_OPTIONS,
    getOptionLabel: option => option.label,
    autoHighlight: true,
    fullWidth: true,
    open: true,
    disableClearable: true,
    renderOption: (optionProps, option) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, (0, _extends2.default)({
      component: "li",
      sx: {
        '& > img': {
          mr: 1.5,
          flexShrink: 0
        }
      }
    }, optionProps, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
        loading: "lazy",
        width: "20",
        src: `https://flagcdn.com/w20/${option.code.toLowerCase()}.png`,
        srcSet: `https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`,
        alt: ""
      }), option.label]
    })),
    renderInput: params => /*#__PURE__*/(0, _jsxRuntime.jsx)(_InputBase.default, (0, _extends2.default)({
      autoFocus: true,
      fullWidth: true,
      id: params.id,
      inputProps: (0, _extends2.default)({}, params.inputProps, {
        autoComplete: 'new-password' // disable autocomplete and autofill
      })
    }, params.InputProps))
  });
}
function renderEditCountry(params) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(EditCountry, (0, _extends2.default)({}, params));
}