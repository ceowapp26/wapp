"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTimeRangePickerTabs = void 0;
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _useEventCallback = _interopRequireDefault(require("@mui/utils/useEventCallback"));
var _icons = require("@mui/x-date-pickers/icons");
var _internals = require("@mui/x-date-pickers/internals");
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _dateTimeRangePickerTabsClasses = require("./dateTimeRangePickerTabsClasses");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const viewToTab = (view, rangePosition) => {
  if ((0, _internals.isDatePickerView)(view)) {
    return rangePosition === 'start' ? 'start-date' : 'end-date';
  }
  return rangePosition === 'start' ? 'start-time' : 'end-time';
};
const tabToView = tab => {
  if (tab === 'start-date' || tab === 'end-date') {
    return 'day';
  }
  return 'hours';
};
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    tabButton: ['tabButton'],
    navigationButton: ['navigationButton'],
    filler: ['filler']
  };
  return (0, _composeClasses.default)(slots, _dateTimeRangePickerTabsClasses.getDateTimeRangePickerTabsUtilityClass, classes);
};
const DateTimeRangePickerTabsRoot = (0, _styles.styled)('div', {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  theme
}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  minHeight: 48
}));
const DateTimeRangePickerTab = (0, _styles.styled)(_Button.default, {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'TabButton',
  overridesResolver: (_, styles) => styles.tabButton
})({
  textTransform: 'none'
});
const DateTimeRangePickerTabFiller = (0, _styles.styled)('div', {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Filler',
  overridesResolver: (_, styles) => styles.filler
})({
  width: 40
});
const tabOptions = ['start-date', 'start-time', 'end-date', 'end-time'];
const DateTimeRangePickerTabs = exports.DateTimeRangePickerTabs = function DateTimeRangePickerTabs(inProps) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiDateTimeRangePickerTabs'
  });
  const {
    dateIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.DateRangeIcon, {}),
    onViewChange,
    timeIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.TimeIcon, {}),
    view,
    hidden = typeof window === 'undefined' || window.innerHeight < 667,
    rangePosition,
    onRangePositionChange,
    className,
    sx
  } = props;
  const localeText = (0, _internals.useLocaleText)();
  const classes = useUtilityClasses(props);
  const value = React.useMemo(() => viewToTab(view, rangePosition), [view, rangePosition]);
  const isPreviousHidden = value === 'start-date';
  const isNextHidden = value === 'end-time';
  const tabLabel = React.useMemo(() => {
    switch (value) {
      case 'start-date':
        return localeText.startDate;
      case 'start-time':
        return localeText.startTime;
      case 'end-date':
        return localeText.endDate;
      case 'end-time':
        return localeText.endTime;
      default:
        return '';
    }
  }, [localeText.endDate, localeText.endTime, localeText.startDate, localeText.startTime, value]);
  const handleRangePositionChange = (0, _useEventCallback.default)(newTab => {
    if (newTab.includes('start')) {
      onRangePositionChange('start');
    } else {
      onRangePositionChange('end');
    }
  });
  const changeToPreviousTab = (0, _useEventCallback.default)(() => {
    const previousTab = tabOptions[tabOptions.indexOf(value) - 1];
    onViewChange(tabToView(previousTab));
    handleRangePositionChange(previousTab);
  });
  const changeToNextTab = (0, _useEventCallback.default)(() => {
    const nextTab = tabOptions[tabOptions.indexOf(value) + 1];
    onViewChange(tabToView(nextTab));
    handleRangePositionChange(nextTab);
  });
  if (hidden) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(DateTimeRangePickerTabsRoot, {
    ownerState: props,
    className: (0, _clsx.default)(classes.root, className),
    sx: sx,
    children: [!isPreviousHidden ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
      onClick: changeToPreviousTab,
      className: classes.navigationButton,
      title: localeText.openPreviousView,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.ArrowLeftIcon, {})
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(DateTimeRangePickerTabFiller, {
      className: classes.filler
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(DateTimeRangePickerTab, {
      startIcon: (0, _internals.isDatePickerView)(view) ? dateIcon : timeIcon,
      className: classes.tabButton,
      size: "large",
      children: tabLabel
    }), !isNextHidden ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
      onClick: changeToNextTab,
      className: classes.navigationButton,
      title: localeText.openNextView,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.ArrowRightIcon, {})
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(DateTimeRangePickerTabFiller, {
      className: classes.filler
    })]
  });
};
process.env.NODE_ENV !== "production" ? DateTimeRangePickerTabs.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  className: _propTypes.default.string,
  /**
   * Date tab icon.
   * @default DateRangeIcon
   */
  dateIcon: _propTypes.default.element,
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`
   */
  hidden: _propTypes.default.bool,
  onRangePositionChange: _propTypes.default.func.isRequired,
  /**
   * Callback called when a tab is clicked.
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: _propTypes.default.func.isRequired,
  rangePosition: _propTypes.default.oneOf(['end', 'start']).isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  /**
   * Time tab icon.
   * @default TimeIcon
   */
  timeIcon: _propTypes.default.element,
  /**
   * Currently visible picker view.
   */
  view: _propTypes.default.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']).isRequired
} : void 0;