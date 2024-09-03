"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiInputTimeRangeFieldClasses = exports.getMultiInputTimeRangeFieldUtilityClass = exports.MultiInputTimeRangeField = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = require("clsx");
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _styles = require("@mui/material/styles");
var _utils = require("@mui/base/utils");
var _utils2 = require("@mui/utils");
var _internals = require("@mui/x-date-pickers/internals");
var _PickersTextField = require("@mui/x-date-pickers/PickersTextField");
var _useMultiInputTimeRangeField = require("../internals/hooks/useMultiInputRangeField/useMultiInputTimeRangeField");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps", "unstableStartFieldRef", "unstableEndFieldRef", "className"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const multiInputTimeRangeFieldClasses = exports.multiInputTimeRangeFieldClasses = (0, _utils2.unstable_generateUtilityClasses)('MuiMultiInputTimeRangeField', ['root', 'separator']);
const getMultiInputTimeRangeFieldUtilityClass = slot => (0, _utils2.unstable_generateUtilityClass)('MuiMultiInputTimeRangeField', slot);
exports.getMultiInputTimeRangeFieldUtilityClass = getMultiInputTimeRangeFieldUtilityClass;
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    separator: ['separator']
  };
  return (0, _utils2.unstable_composeClasses)(slots, getMultiInputTimeRangeFieldUtilityClass, classes);
};
const MultiInputTimeRangeFieldRoot = (0, _styles.styled)( /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Stack.default, (0, _extends2.default)({
  ref: ref,
  spacing: 2,
  direction: "row",
  alignItems: "center"
}, props))), {
  name: 'MuiMultiInputTimeRangeField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});
const MultiInputTimeRangeFieldSeparator = (0, _styles.styled)(_Typography.default, {
  name: 'MuiMultiInputTimeRangeField',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator
})({
  lineHeight: '1.4375em' // 23px
});
/**
 * Demos:
 *
 * - [TimeRangeField](http://mui.com/x/react-date-pickers/time-range-field/)
 * - [Fields](https://mui.com/x/react-date-pickers/fields/)
 *
 * API:
 *
 * - [MultiInputTimeRangeField API](https://mui.com/x/api/multi-input-time-range-field/)
 */
const MultiInputTimeRangeField = exports.MultiInputTimeRangeField = /*#__PURE__*/React.forwardRef(function MultiInputTimeRangeField(inProps, ref) {
  const themeProps = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiMultiInputTimeRangeField'
  });
  const {
    internalProps,
    forwardedProps
  } = (0, _internals.splitFieldInternalAndForwardedProps)(themeProps, 'time');
  const {
      slots,
      slotProps,
      unstableStartFieldRef,
      unstableEndFieldRef,
      className
    } = forwardedProps,
    otherForwardedProps = (0, _objectWithoutPropertiesLoose2.default)(forwardedProps, _excluded);
  const ownerState = themeProps;
  const classes = useUtilityClasses(ownerState);
  const Root = slots?.root ?? MultiInputTimeRangeFieldRoot;
  const rootProps = (0, _utils.useSlotProps)({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: otherForwardedProps,
    additionalProps: {
      ref
    },
    ownerState,
    className: (0, _clsx.clsx)(className, classes.root)
  });
  const TextField = slots?.textField ?? (inProps.enableAccessibleFieldDOMStructure ? _PickersTextField.PickersTextField : _TextField.default);
  const startTextFieldProps = (0, _utils.useSlotProps)({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: (0, _extends2.default)({}, ownerState, {
      position: 'start'
    })
  });
  const endTextFieldProps = (0, _utils.useSlotProps)({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: (0, _extends2.default)({}, ownerState, {
      position: 'end'
    })
  });
  const Separator = slots?.separator ?? MultiInputTimeRangeFieldSeparator;
  const separatorProps = (0, _utils.useSlotProps)({
    elementType: Separator,
    externalSlotProps: slotProps?.separator,
    additionalProps: {
      children: ` ${internalProps.dateSeparator ?? '–'} `
    },
    ownerState,
    className: classes.separator
  });
  const fieldResponse = (0, _useMultiInputTimeRangeField.useMultiInputTimeRangeField)({
    sharedProps: internalProps,
    startTextFieldProps,
    endTextFieldProps,
    unstableStartFieldRef,
    unstableEndFieldRef
  });
  const startDateProps = (0, _internals.convertFieldResponseIntoMuiTextFieldProps)(fieldResponse.startDate);
  const endDateProps = (0, _internals.convertFieldResponseIntoMuiTextFieldProps)(fieldResponse.endDate);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(Root, (0, _extends2.default)({}, rootProps, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(TextField, (0, _extends2.default)({
      fullWidth: true
    }, startDateProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(Separator, (0, _extends2.default)({}, separatorProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(TextField, (0, _extends2.default)({
      fullWidth: true
    }, endDateProps))]
  }));
});
process.env.NODE_ENV !== "production" ? MultiInputTimeRangeField.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm: _propTypes.default.bool,
  /**
   * If `true`, the `input` element is focused during the first mount.
   */
  autoFocus: _propTypes.default.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  className: _propTypes.default.string,
  component: _propTypes.default.elementType,
  /**
   * String displayed between the start and the end dates.
   * @default "–"
   */
  dateSeparator: _propTypes.default.string,
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: _propTypes.default.arrayOf(_propTypes.default.object),
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'column'
   */
  direction: _propTypes.default.oneOfType([_propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']), _propTypes.default.arrayOf(_propTypes.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])), _propTypes.default.object]),
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: _propTypes.default.bool,
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: _propTypes.default.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: _propTypes.default.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: _propTypes.default.bool,
  /**
   * Add an element between each child.
   */
  divider: _propTypes.default.node,
  /**
   * @default false
   */
  enableAccessibleFieldDOMStructure: _propTypes.default.bool,
  /**
   * Format of the date when rendered in the input(s).
   */
  format: _propTypes.default.string,
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity: _propTypes.default.oneOf(['dense', 'spacious']),
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: _propTypes.default.object,
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime: _propTypes.default.object,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: _propTypes.default.number,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: _propTypes.default.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
   * @param {TError} error The new error.
   * @param {TValue} value The value associated to the error.
   */
  onError: _propTypes.default.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: _propTypes.default.func,
  /**
   * It prevents the user from changing the value of the field
   * (not from interacting with the field).
   * @default false
   */
  readOnly: _propTypes.default.bool,
  /**
   * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
   * For example, on time fields it will be used to determine the date to set.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
   */
  referenceDate: _propTypes.default.object,
  /**
   * The currently selected sections.
   * This prop accepts four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 3. If `"all"` is provided, all the sections will be selected.
   * 4. If `null` is provided, no section will be selected.
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: _propTypes.default.oneOfType([_propTypes.default.oneOf(['all', 'day', 'empty', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'weekDay', 'year']), _propTypes.default.number]),
  /**
   * Disable specific time.
   * @template TDate
   * @param {TDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: _propTypes.default.func,
  /**
   * If `true`, the format will respect the leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `8/16/2018`)
   * If `false`, the format will always add leading zeroes (e.g: on dayjs, the format `M/D/YYYY` will render `08/16/2018`)
   *
   * Warning n°1: Luxon is not able to respect the leading zeroes when using macro tokens (e.g: "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
   *
   * Warning n°2: When `shouldRespectLeadingZeros={true}`, the field will add an invisible character on the sections containing a single digit to make sure `onChange` is fired.
   * If you need to get the clean value from the input, you can remove this character using `input.value.replace(/\u200e/g, '')`.
   *
   * Warning n°3: When used in strict mode, dayjs and moment require to respect the leading zeros.
   * This mean that when using `shouldRespectLeadingZeros={false}`, if you retrieve the value directly from the input (not listening to `onChange`) and your format contains tokens without leading zeros, the value will not be parsed by your library.
   *
   * @default false
   */
  shouldRespectLeadingZeros: _propTypes.default.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable slots.
   * @default {}
   */
  slots: _propTypes.default.object,
  /**
   * Defines the space between immediate children.
   * @default 0
   */
  spacing: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.object, _propTypes.default.string]),
  style: _propTypes.default.object,
  /**
   * The system prop, which allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */
  timezone: _propTypes.default.string,
  unstableEndFieldRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),
  unstableStartFieldRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object]),
  /**
   * If `true`, the CSS flexbox `gap` is used instead of applying `margin` to children.
   *
   * While CSS `gap` removes the [known limitations](https://mui.com/joy-ui/react-stack/#limitations),
   * it is not fully supported in some browsers. We recommend checking https://caniuse.com/?search=flex%20gap before using this flag.
   *
   * To enable this flag globally, follow the [theme's default props](https://mui.com/material-ui/customization/theme-components/#default-props) configuration.
   * @default false
   */
  useFlexGap: _propTypes.default.bool,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: _propTypes.default.arrayOf(_propTypes.default.object)
} : void 0;