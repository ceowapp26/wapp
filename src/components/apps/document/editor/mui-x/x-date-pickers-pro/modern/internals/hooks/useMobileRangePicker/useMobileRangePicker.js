import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["props"];
import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import { usePicker, PickersModalDialog, useLocaleText } from '@mui/x-date-pickers/internals';
import useId from '@mui/utils/useId';
import { useEnrichedRangePickerFieldProps } from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { useRangePosition } from '../useRangePosition';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const releaseInfo = getReleaseInfo();
export const useMobileRangePicker = _ref => {
  let {
      props
    } = _ref,
    pickerParams = _objectWithoutPropertiesLoose(_ref, _excluded);
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    formatDensity,
    enableAccessibleFieldDOMStructure,
    selectedSections,
    onSelectedSectionsChange,
    timezone,
    label,
    inputRef,
    name,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText
  } = props;
  const startFieldRef = React.useRef(null);
  const endFieldRef = React.useRef(null);
  const fieldType = slots.field.fieldType ?? 'multi-input';
  const {
    rangePosition,
    onRangePositionChange
  } = useRangePosition(props, fieldType === 'single-input' ? startFieldRef : undefined);
  const labelId = useId();
  const contextLocaleText = useLocaleText();
  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps
  } = usePicker(_extends({}, pickerParams, {
    props,
    wrapperVariant: 'mobile',
    autoFocusView: true,
    fieldRef: rangePosition === 'start' ? startFieldRef : endFieldRef,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange
    }
  }));
  const Field = slots.field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: _extends({}, pickerFieldProps, {
      readOnly: readOnly ?? true,
      disabled,
      className,
      sx,
      format,
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      timezone
    }, inputRef ? {
      inputRef,
      name
    } : {}),
    ownerState: props
  });
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;
  const enrichedFieldProps = useEnrichedRangePickerFieldProps({
    wrapperVariant: 'mobile',
    fieldType,
    open,
    actions,
    readOnly,
    labelId,
    disableOpenPicker,
    label,
    localeText,
    rangePosition,
    onRangePositionChange,
    pickerSlots: slots,
    pickerSlotProps: innerSlotProps,
    fieldProps,
    startFieldRef,
    endFieldRef
  });
  const slotPropsForLayout = _extends({}, innerSlotProps, {
    tabs: _extends({}, innerSlotProps?.tabs, {
      rangePosition,
      onRangePositionChange
    }),
    toolbar: _extends({}, innerSlotProps?.toolbar, {
      titleId: labelId,
      rangePosition,
      onRangePositionChange
    })
  });
  const Layout = slots?.layout ?? PickersLayout;
  const finalLocaleText = _extends({}, contextLocaleText, localeText);
  let labelledById = pickerParams.valueType === 'date-time' ? `${labelId}-start-toolbar ${labelId}-end-toolbar` : labelId;
  if (isToolbarHidden) {
    const labels = [];
    if (fieldType === 'multi-input') {
      if (finalLocaleText.start) {
        labels.push(`${labelId}-start-label`);
      }
      if (finalLocaleText.end) {
        labels.push(`${labelId}-end-label`);
      }
    } else if (label != null) {
      labels.push(`${labelId}-label`);
    }
    labelledById = labels.length > 0 ? labels.join(' ') : undefined;
  }
  const slotProps = _extends({}, innerSlotProps, {
    mobilePaper: _extends({
      'aria-labelledby': labelledById
    }, innerSlotProps?.mobilePaper)
  });
  const renderPicker = () => /*#__PURE__*/_jsxs(LocalizationProvider, {
    localeText: localeText,
    children: [/*#__PURE__*/_jsx(Field, _extends({}, enrichedFieldProps)), /*#__PURE__*/_jsx(PickersModalDialog, _extends({}, actions, {
      open: open,
      slots: slots,
      slotProps: slotProps,
      children: /*#__PURE__*/_jsx(Layout, _extends({}, layoutProps, slotProps?.layout, {
        slots: slots,
        slotProps: slotPropsForLayout,
        children: renderCurrentView()
      }))
    }))]
  });
  return {
    renderPicker
  };
};