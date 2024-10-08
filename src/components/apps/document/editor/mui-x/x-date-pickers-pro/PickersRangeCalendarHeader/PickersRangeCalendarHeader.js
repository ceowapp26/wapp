import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["calendars", "month", "monthIndex"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';
import { PickersArrowSwitcher, useLocaleText, useNextMonthDisabled, usePreviousMonthDisabled, useUtils } from '@mui/x-date-pickers/internals';
import { jsx as _jsx } from "react/jsx-runtime";
const PickersRangeCalendarHeaderContentMultipleCalendars = styled(PickersArrowSwitcher)({
  padding: '12px 16px 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});
const PickersRangeCalendarHeader = /*#__PURE__*/React.forwardRef(function PickersRangeCalendarHeader(props, ref) {
  const utils = useUtils();
  const localeText = useLocaleText();
  const {
      calendars,
      month,
      monthIndex
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    format,
    slots,
    slotProps,
    currentMonth,
    onMonthChange,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    timezone
  } = props;
  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, {
    disableFuture,
    maxDate,
    timezone
  });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, {
    disablePast,
    minDate,
    timezone
  });
  if (calendars === 1) {
    return /*#__PURE__*/_jsx(PickersCalendarHeader, _extends({}, other, {
      ref: ref
    }));
  }
  const selectNextMonth = () => onMonthChange(utils.addMonths(currentMonth, 1), 'left');
  const selectPreviousMonth = () => onMonthChange(utils.addMonths(currentMonth, -1), 'right');
  return /*#__PURE__*/_jsx(PickersRangeCalendarHeaderContentMultipleCalendars, {
    ref: ref,
    onGoToPrevious: selectPreviousMonth,
    onGoToNext: selectNextMonth,
    isPreviousHidden: monthIndex !== 0,
    isPreviousDisabled: isPreviousMonthDisabled,
    previousLabel: localeText.previousMonth,
    isNextHidden: monthIndex !== calendars - 1,
    isNextDisabled: isNextMonthDisabled,
    nextLabel: localeText.nextMonth,
    slots: slots,
    slotProps: slotProps,
    children: utils.formatByString(month, format ?? `${utils.formats.month} ${utils.formats.year}`)
  });
});
process.env.NODE_ENV !== "production" ? PickersRangeCalendarHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of calendars rendered.
   */
  calendars: PropTypes.oneOf([1, 2, 3]).isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  currentMonth: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format: PropTypes.string,
  labelId: PropTypes.string,
  maxDate: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  /**
   * Month used for this header.
   */
  month: PropTypes.object.isRequired,
  /**
   * Index of the month used for this header.
   */
  monthIndex: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  reduceAnimations: PropTypes.bool.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  timezone: PropTypes.string.isRequired,
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired
} : void 0;
export { PickersRangeCalendarHeader };