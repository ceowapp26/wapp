"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderEditProgress = renderEditProgress;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _Slider = _interopRequireWildcard(require("@mui/material/Slider"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _utils = require("@mui/utils");
var _styles = require("@mui/material/styles");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const StyledSlider = (0, _styles.styled)(_Slider.default)(({
  theme
}) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: 0,
  [`& .${_Slider.sliderClasses.rail}`]: {
    height: '100%',
    backgroundColor: 'transparent'
  },
  [`& .${_Slider.sliderClasses.track}`]: {
    height: '100%',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter
    }),
    '&.low': {
      backgroundColor: '#f44336'
    },
    '&.medium': {
      backgroundColor: '#efbb5aa3'
    },
    '&.high': {
      backgroundColor: '#088208a3'
    }
  },
  [`& .${_Slider.sliderClasses.thumb}`]: {
    height: '100%',
    width: 5,
    borderRadius: 0,
    marginTop: 0,
    backgroundColor: (0, _styles.alpha)('#000000', 0.2)
  }
}));
function ValueLabelComponent(props) {
  const {
    children,
    open,
    value
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
    open: open,
    enterTouchDelay: 0,
    placement: "top",
    title: value,
    children: children
  });
}
function EditProgress(props) {
  const {
    id,
    value,
    field
  } = props;
  const [valueState, setValueState] = React.useState(Number(value));
  const apiRef = (0, _xDataGridPremium.useGridApiContext)();
  const updateCellEditProps = React.useCallback(newValue => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue
    });
  }, [apiRef, field, id]);
  const debouncedUpdateCellEditProps = React.useMemo(() => (0, _utils.unstable_debounce)(updateCellEditProps, 60), [updateCellEditProps]);
  const handleChange = (event, newValue) => {
    setValueState(newValue);
    debouncedUpdateCellEditProps(newValue);
  };
  React.useEffect(() => {
    setValueState(Number(value));
  }, [value]);
  const handleRef = element => {
    if (element) {
      element.querySelector('[type="range"]').focus();
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledSlider, {
    ref: handleRef,
    classes: {
      track: (0, _clsx.default)(valueState < 0.3 && "low", valueState >= 0.3 && valueState <= 0.7 && "medium", valueState > 0.7 && "high")
    },
    value: valueState,
    max: 1,
    step: 0.00001,
    onChange: handleChange,
    components: {
      ValueLabel: ValueLabelComponent
    },
    valueLabelDisplay: "auto",
    valueLabelFormat: newValue => `${(newValue * 100).toLocaleString()} %`
  });
}
function renderEditProgress(params) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(EditProgress, (0, _extends2.default)({}, params));
}