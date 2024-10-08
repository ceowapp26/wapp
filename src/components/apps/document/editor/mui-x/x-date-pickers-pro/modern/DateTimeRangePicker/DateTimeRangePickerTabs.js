import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { TimeIcon, DateRangeIcon, ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons';
import { useLocaleText, isDatePickerView } from '@mui/x-date-pickers/internals';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { getDateTimeRangePickerTabsUtilityClass } from './dateTimeRangePickerTabsClasses';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const viewToTab = (view, rangePosition) => {
  if (isDatePickerView(view)) {
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
  return composeClasses(slots, getDateTimeRangePickerTabsUtilityClass, classes);
};
const DateTimeRangePickerTabsRoot = styled('div', {
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
const DateTimeRangePickerTab = styled(Button, {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'TabButton',
  overridesResolver: (_, styles) => styles.tabButton
})({
  textTransform: 'none'
});
const DateTimeRangePickerTabFiller = styled('div', {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Filler',
  overridesResolver: (_, styles) => styles.filler
})({
  width: 40
});
const tabOptions = ['start-date', 'start-time', 'end-date', 'end-time'];
const DateTimeRangePickerTabs = function DateTimeRangePickerTabs(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDateTimeRangePickerTabs'
  });
  const {
    dateIcon = /*#__PURE__*/_jsx(DateRangeIcon, {}),
    onViewChange,
    timeIcon = /*#__PURE__*/_jsx(TimeIcon, {}),
    view,
    hidden = typeof window === 'undefined' || window.innerHeight < 667,
    rangePosition,
    onRangePositionChange,
    className,
    sx
  } = props;
  const localeText = useLocaleText();
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
  const handleRangePositionChange = useEventCallback(newTab => {
    if (newTab.includes('start')) {
      onRangePositionChange('start');
    } else {
      onRangePositionChange('end');
    }
  });
  const changeToPreviousTab = useEventCallback(() => {
    const previousTab = tabOptions[tabOptions.indexOf(value) - 1];
    onViewChange(tabToView(previousTab));
    handleRangePositionChange(previousTab);
  });
  const changeToNextTab = useEventCallback(() => {
    const nextTab = tabOptions[tabOptions.indexOf(value) + 1];
    onViewChange(tabToView(nextTab));
    handleRangePositionChange(nextTab);
  });
  if (hidden) {
    return null;
  }
  return /*#__PURE__*/_jsxs(DateTimeRangePickerTabsRoot, {
    ownerState: props,
    className: clsx(classes.root, className),
    sx: sx,
    children: [!isPreviousHidden ? /*#__PURE__*/_jsx(IconButton, {
      onClick: changeToPreviousTab,
      className: classes.navigationButton,
      title: localeText.openPreviousView,
      children: /*#__PURE__*/_jsx(ArrowLeftIcon, {})
    }) : /*#__PURE__*/_jsx(DateTimeRangePickerTabFiller, {
      className: classes.filler
    }), /*#__PURE__*/_jsx(DateTimeRangePickerTab, {
      startIcon: isDatePickerView(view) ? dateIcon : timeIcon,
      className: classes.tabButton,
      size: "large",
      children: tabLabel
    }), !isNextHidden ? /*#__PURE__*/_jsx(IconButton, {
      onClick: changeToNextTab,
      className: classes.navigationButton,
      title: localeText.openNextView,
      children: /*#__PURE__*/_jsx(ArrowRightIcon, {})
    }) : /*#__PURE__*/_jsx(DateTimeRangePickerTabFiller, {
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
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Date tab icon.
   * @default DateRangeIcon
   */
  dateIcon: PropTypes.element,
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`
   */
  hidden: PropTypes.bool,
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a tab is clicked.
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * Time tab icon.
   * @default TimeIcon
   */
  timeIcon: PropTypes.element,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year']).isRequired
} : void 0;
export { DateTimeRangePickerTabs };