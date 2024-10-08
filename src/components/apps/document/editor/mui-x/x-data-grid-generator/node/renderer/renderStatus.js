"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderStatus = renderStatus;
var React = _interopRequireWildcard(require("react"));
var _ReportProblem = _interopRequireDefault(require("@mui/icons-material/ReportProblem"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _Autorenew = _interopRequireDefault(require("@mui/icons-material/Autorenew"));
var _Done = _interopRequireDefault(require("@mui/icons-material/Done"));
var _Chip = _interopRequireDefault(require("@mui/material/Chip"));
var _styles = require("@mui/material/styles");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const StyledChip = (0, _styles.styled)(_Chip.default)(({
  theme
}) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit'
  },
  '&.Open': {
    color: (theme.vars || theme).palette.info.dark,
    border: `1px solid ${(theme.vars || theme).palette.info.main}`
  },
  '&.Filled': {
    color: (theme.vars || theme).palette.success.dark,
    border: `1px solid ${(theme.vars || theme).palette.success.main}`
  },
  '&.PartiallyFilled': {
    color: (theme.vars || theme).palette.warning.dark,
    border: `1px solid ${(theme.vars || theme).palette.warning.main}`
  },
  '&.Rejected': {
    color: (theme.vars || theme).palette.error.dark,
    border: `1px solid ${(theme.vars || theme).palette.error.main}`
  }
}));
const Status = /*#__PURE__*/React.memo(props => {
  const {
    status
  } = props;
  let icon = null;
  if (status === 'Rejected') {
    icon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_ReportProblem.default, {
      className: "icon"
    });
  } else if (status === 'Open') {
    icon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
      className: "icon"
    });
  } else if (status === 'PartiallyFilled') {
    icon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Autorenew.default, {
      className: "icon"
    });
  } else if (status === 'Filled') {
    icon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Done.default, {
      className: "icon"
    });
  }
  let label = status;
  if (status === 'PartiallyFilled') {
    label = 'Partially Filled';
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledChip, {
    className: status,
    icon: icon,
    size: "small",
    label: label,
    variant: "outlined"
  });
});
function renderStatus(params) {
  if (params.value == null) {
    return '';
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Status, {
    status: params.value
  });
}