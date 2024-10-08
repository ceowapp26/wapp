import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["clearable", "onClear"];
import * as React from 'react';
import { resolveComponentProps } from '@mui/base/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { onSpaceOrEnter, useLocaleText } from '@mui/x-date-pickers/internals';
const useMultiInputFieldSlotProps = ({
  wrapperVariant,
  open,
  actions,
  readOnly,
  labelId,
  disableOpenPicker,
  onBlur,
  rangePosition,
  onRangePositionChange,
  localeText: inLocaleText,
  pickerSlotProps,
  pickerSlots,
  fieldProps,
  anchorRef,
  currentView,
  initialView,
  onViewChange,
  startFieldRef,
  endFieldRef
}) => {
  const localeText = useLocaleText();
  const handleStartFieldRef = useForkRef(fieldProps.unstableStartFieldRef, startFieldRef);
  const handleEndFieldRef = useForkRef(fieldProps.unstableEndFieldRef, endFieldRef);
  const previousRangePosition = React.useRef(rangePosition);
  React.useEffect(() => {
    if (!open) {
      return;
    }
    const currentFieldRef = rangePosition === 'start' ? startFieldRef : endFieldRef;
    currentFieldRef.current?.focusField();
    if (!currentFieldRef.current || !currentView) {
      // could happen when the user is switching between the inputs
      previousRangePosition.current = rangePosition;
      return;
    }

    // bring back focus to the field
    currentFieldRef.current.setSelectedSections(
    // use the current view or `0` when the range position has just been swapped
    previousRangePosition.current === rangePosition ? currentView : 0);
    previousRangePosition.current = rangePosition;
  }, [rangePosition, open, currentView, startFieldRef, endFieldRef]);
  const openRangeStartSelection = event => {
    event.stopPropagation();
    onRangePositionChange('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen(event);
    }
  };
  const openRangeEndSelection = event => {
    event.stopPropagation();
    onRangePositionChange('end');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen(event);
    }
  };
  const handleFocusStart = () => {
    if (open) {
      onRangePositionChange('start');
      if (previousRangePosition.current !== 'start' && initialView) {
        onViewChange?.(initialView);
      }
    }
  };
  const handleFocusEnd = () => {
    if (open) {
      onRangePositionChange('end');
      if (previousRangePosition.current !== 'end' && initialView) {
        onViewChange?.(initialView);
      }
    }
  };
  const slots = _extends({
    textField: pickerSlots?.textField,
    root: pickerSlots?.fieldRoot,
    separator: pickerSlots?.fieldSeparator
  }, fieldProps.slots);
  const slotProps = _extends({}, fieldProps.slotProps, {
    textField: ownerState => {
      const resolvedComponentProps = resolveComponentProps(pickerSlotProps?.textField, ownerState);
      let textFieldProps;
      let InputProps;
      if (ownerState.position === 'start') {
        textFieldProps = _extends({
          label: inLocaleText?.start ?? localeText.start,
          onKeyDown: onSpaceOrEnter(openRangeStartSelection),
          onFocus: handleFocusStart,
          focused: open ? rangePosition === 'start' : undefined
        }, !readOnly && !fieldProps.disabled && {
          onClick: openRangeStartSelection
        }, wrapperVariant === 'mobile' && {
          readOnly: true
        });
        if (anchorRef) {
          InputProps = _extends({}, resolvedComponentProps?.InputProps, {
            ref: anchorRef
          });
        }
      } else {
        textFieldProps = _extends({
          label: inLocaleText?.end ?? localeText.end,
          onKeyDown: onSpaceOrEnter(openRangeEndSelection),
          onFocus: handleFocusEnd,
          focused: open ? rangePosition === 'end' : undefined
        }, !readOnly && !fieldProps.disabled && {
          onClick: openRangeEndSelection
        }, wrapperVariant === 'mobile' && {
          readOnly: true
        });
        InputProps = resolvedComponentProps?.InputProps;
      }
      return _extends({}, labelId != null && {
        id: `${labelId}-${ownerState.position}`
      }, textFieldProps, resolveComponentProps(pickerSlotProps?.textField, ownerState), {
        InputProps
      });
    },
    root: ownerState => {
      const rootProps = {
        onBlur
      };
      return _extends({}, rootProps, resolveComponentProps(pickerSlotProps?.fieldRoot, ownerState));
    },
    separator: pickerSlotProps?.fieldSeparator
  });

  /* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
  const _ref = fieldProps,
    restFieldProps = _objectWithoutPropertiesLoose(_ref, _excluded);
  const enrichedFieldProps = _extends({}, restFieldProps, {
    unstableStartFieldRef: handleStartFieldRef,
    unstableEndFieldRef: handleEndFieldRef,
    slots,
    slotProps
  });
  return enrichedFieldProps;
};
const useSingleInputFieldSlotProps = ({
  wrapperVariant,
  open,
  actions,
  readOnly,
  labelId,
  disableOpenPicker,
  label,
  onBlur,
  rangePosition,
  onRangePositionChange,
  startFieldRef,
  endFieldRef,
  pickerSlots,
  pickerSlotProps,
  fieldProps,
  anchorRef,
  currentView
}) => {
  const handleFieldRef = useForkRef(fieldProps.unstableFieldRef, startFieldRef, endFieldRef);
  React.useEffect(() => {
    if (!open || !startFieldRef.current) {
      return;
    }
    if (startFieldRef.current.isFieldFocused()) {
      return;
    }

    // bring back focus to the field with the current view section selected
    if (currentView) {
      const sections = startFieldRef.current.getSections().map(section => section.type);
      const newSelectedSection = rangePosition === 'start' ? sections.indexOf(currentView) : sections.lastIndexOf(currentView);
      startFieldRef.current?.focusField(newSelectedSection);
    }
  }, [rangePosition, open, currentView, startFieldRef]);
  const updateRangePosition = () => {
    if (!startFieldRef.current?.isFieldFocused()) {
      return;
    }
    const sections = startFieldRef.current.getSections();
    const activeSectionIndex = startFieldRef.current?.getActiveSectionIndex();
    const domRangePosition = activeSectionIndex == null || activeSectionIndex < sections.length / 2 ? 'start' : 'end';
    if (domRangePosition != null && domRangePosition !== rangePosition) {
      onRangePositionChange(domRangePosition);
    }
  };
  const handleSelectedSectionsChange = useEventCallback(selectedSection => {
    setTimeout(updateRangePosition);
    fieldProps.onSelectedSectionsChange?.(selectedSection);
  });
  const openPicker = event => {
    event.stopPropagation();
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen(event);
    }
  };
  const slots = _extends({}, fieldProps.slots, {
    textField: pickerSlots?.textField,
    clearButton: pickerSlots?.clearButton,
    clearIcon: pickerSlots?.clearIcon
  });
  const slotProps = _extends({}, fieldProps.slotProps, {
    textField: pickerSlotProps?.textField,
    clearButton: pickerSlots?.clearButton,
    clearIcon: pickerSlots?.clearIcon
  });
  const enrichedFieldProps = _extends({}, fieldProps, {
    slots,
    slotProps,
    label,
    unstableFieldRef: handleFieldRef,
    onKeyDown: onSpaceOrEnter(openPicker, fieldProps.onKeyDown),
    onSelectedSectionsChange: handleSelectedSectionsChange,
    onBlur,
    InputProps: _extends({
      ref: anchorRef
    }, fieldProps?.InputProps),
    focused: open ? true : undefined
  }, labelId != null && {
    id: labelId
  }, wrapperVariant === 'mobile' && {
    readOnly: true
  }, !readOnly && !fieldProps.disabled && {
    onClick: openPicker
  });
  return enrichedFieldProps;
};
export const useEnrichedRangePickerFieldProps = params => {
  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    const fieldTypeRef = React.useRef(params.fieldType);
    if (params.fieldType !== fieldTypeRef.current) {
      console.error('Should not switch between a multi input field and a single input field on a range picker.');
    }
  }
  if (params.fieldType === 'multi-input') {
    return useMultiInputFieldSlotProps(params);
  }
  return useSingleInputFieldSlotProps(params);
  /* eslint-enable react-hooks/rules-of-hooks */
};