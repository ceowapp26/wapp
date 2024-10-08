import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["value", "rangePosition", "onRangePositionChange", "className", "onViewChange", "toolbarVariant", "onChange", "classes", "view", "isLandscape", "views", "ampm", "disabled", "readOnly", "hidden", "toolbarFormat", "toolbarPlaceholder", "titleId", "sx"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useLocaleText, useUtils } from '@mui/x-date-pickers/internals';
import { DateTimePickerToolbar } from '@mui/x-date-pickers/DateTimePicker';
import { getDateTimeRangePickerToolbarUtilityClass } from './dateTimeRangePickerToolbarClasses';
import { calculateRangeChange } from '../internals/utils/date-range-manager';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    startToolbar: ['startToolbar'],
    endToolbar: ['endToolbar']
  };
  return composeClasses(slots, getDateTimeRangePickerToolbarUtilityClass, classes);
};
const DateTimeRangePickerToolbarRoot = styled('div', {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})({
  display: 'flex',
  flexDirection: 'column'
});
const DateTimeRangePickerToolbarStart = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'StartToolbar',
  overridesResolver: (_, styles) => styles.startToolbar
})({
  borderBottom: 'none',
  variants: [{
    props: ({
      toolbarVariant
    }) => toolbarVariant !== 'desktop',
    style: {
      padding: '12px 8px 0 12px'
    }
  }, {
    props: {
      toolbarVariant: 'desktop'
    },
    style: {
      paddingBottom: 0
    }
  }]
});
const DateTimeRangePickerToolbarEnd = styled(DateTimePickerToolbar, {
  name: 'MuiDateTimeRangePickerToolbar',
  slot: 'EndToolbar',
  overridesResolver: (_, styles) => styles.endToolbar
})({
  variants: [{
    props: ({
      toolbarVariant
    }) => toolbarVariant !== 'desktop',
    style: {
      padding: '12px 8px 12px 12px'
    }
  }]
});
const DateTimeRangePickerToolbar = /*#__PURE__*/React.forwardRef(function DateTimeRangePickerToolbar(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDateTimeRangePickerToolbar'
  });
  const utils = useUtils();
  const {
      value: [start, end],
      rangePosition,
      onRangePositionChange,
      className,
      onViewChange,
      onChange,
      view,
      isLandscape,
      views,
      ampm,
      disabled,
      readOnly,
      hidden,
      toolbarFormat,
      toolbarPlaceholder,
      titleId,
      sx
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const commonToolbarProps = {
    isLandscape,
    views,
    ampm,
    disabled,
    readOnly,
    hidden,
    toolbarFormat,
    toolbarPlaceholder
  };
  const localeText = useLocaleText();
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  const handleStartRangeViewChange = React.useCallback(newView => {
    if (newView === 'year' || newView === 'month') {
      return;
    }
    if (rangePosition !== 'start') {
      onRangePositionChange('start');
    }
    onViewChange(newView);
  }, [onRangePositionChange, onViewChange, rangePosition]);
  const handleEndRangeViewChange = React.useCallback(newView => {
    if (newView === 'year' || newView === 'month') {
      return;
    }
    if (rangePosition !== 'end') {
      onRangePositionChange('end');
    }
    onViewChange(newView);
  }, [onRangePositionChange, onViewChange, rangePosition]);
  const handleOnChange = React.useCallback(newDate => {
    const {
      nextSelection,
      newRange
    } = calculateRangeChange({
      newDate,
      utils,
      range: props.value,
      rangePosition,
      allowRangeFlip: true
    });
    onRangePositionChange(nextSelection);
    onChange(newRange);
  }, [onChange, onRangePositionChange, props.value, rangePosition, utils]);
  if (hidden) {
    return null;
  }
  return /*#__PURE__*/_jsxs(DateTimeRangePickerToolbarRoot, _extends({
    className: clsx(className, classes.root),
    ownerState: ownerState,
    ref: ref,
    sx: sx
  }, other, {
    children: [/*#__PURE__*/_jsx(DateTimeRangePickerToolbarStart, _extends({
      value: start,
      onViewChange: handleStartRangeViewChange,
      toolbarTitle: localeText.start,
      ownerState: ownerState,
      toolbarVariant: "desktop",
      view: rangePosition === 'start' ? view : undefined,
      className: classes.startToolbar,
      onChange: handleOnChange,
      titleId: titleId ? `${titleId}-start-toolbar` : undefined
    }, commonToolbarProps)), /*#__PURE__*/_jsx(DateTimeRangePickerToolbarEnd, _extends({
      value: end,
      onViewChange: handleEndRangeViewChange,
      toolbarTitle: localeText.end,
      ownerState: ownerState,
      toolbarVariant: "desktop",
      view: rangePosition === 'end' ? view : undefined,
      className: classes.endToolbar,
      onChange: handleOnChange,
      titleId: titleId ? `${titleId}-end-toolbar` : undefined
    }, commonToolbarProps))]
  }));
});
process.env.NODE_ENV !== "production" ? DateTimeRangePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
  readOnly: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  titleId: PropTypes.string,
  /**
   * Toolbar date format.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
  toolbarVariant: PropTypes.oneOf(['desktop', 'mobile']),
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'seconds']).isRequired).isRequired
} : void 0;
export { DateTimeRangePickerToolbar };