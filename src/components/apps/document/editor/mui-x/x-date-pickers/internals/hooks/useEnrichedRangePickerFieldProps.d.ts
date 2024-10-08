import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import { BaseSingleInputFieldProps, FieldRef, PickerValidDate } from '@mui/x-date-pickers/models';
import { UseClearableFieldSlots, UseClearableFieldSlotProps } from '@mui/x-date-pickers/hooks';
import { PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import { BaseFieldProps, UsePickerResponse, WrapperVariant, UsePickerProps, SlotComponentPropsFromProps, DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import { UseDateRangeFieldProps } from '../models';
import { BaseMultiInputFieldProps, RangeFieldSection, DateRange, RangePosition, FieldType } from '../../models';
import { UseRangePositionResponse } from './useRangePosition';
export interface RangePickerFieldSlots extends UseClearableFieldSlots {
    field: React.ElementType;
    /**
     * Element rendered at the root.
     * Ignored if the field has only one input.
     */
    fieldRoot?: React.ElementType<StackProps>;
    /**
     * Element rendered between the two inputs.
     * Ignored if the field has only one input.
     */
    fieldSeparator?: React.ElementType<TypographyProps>;
    /**
     * Form control with an input to render a date or time inside the default field.
     * It is rendered twice: once for the start element and once for the end element.
     * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
     */
    textField?: React.ElementType;
}
export interface RangePickerFieldSlotProps<TDate extends PickerValidDate, TEnableAccessibleFieldDOMStructure extends boolean> extends UseClearableFieldSlotProps {
    field?: SlotComponentPropsFromProps<BaseMultiInputFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TEnableAccessibleFieldDOMStructure, unknown>, {}, UsePickerProps<DateRange<TDate>, TDate, any, any, any, any>>;
    fieldRoot?: SlotComponentProps<typeof Stack, {}, Record<string, any>>;
    fieldSeparator?: SlotComponentProps<typeof Typography, {}, Record<string, any>>;
    textField?: SlotComponentProps<typeof TextField, {}, UseDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
        position?: RangePosition;
    }>;
}
export interface UseEnrichedRangePickerFieldPropsParams<TDate extends PickerValidDate, TView extends DateOrTimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure extends boolean, TError, FieldProps extends BaseFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TEnableAccessibleFieldDOMStructure, TError> = BaseFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TEnableAccessibleFieldDOMStructure, TError>> extends Pick<UsePickerResponse<DateRange<TDate>, TView, RangeFieldSection, any>, 'open' | 'actions'>, UseRangePositionResponse {
    wrapperVariant: WrapperVariant;
    fieldType: FieldType;
    readOnly?: boolean;
    labelId?: string;
    disableOpenPicker?: boolean;
    onBlur?: () => void;
    label?: React.ReactNode;
    localeText: PickersInputLocaleText<TDate> | undefined;
    pickerSlotProps: RangePickerFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure> | undefined;
    pickerSlots: RangePickerFieldSlots | undefined;
    fieldProps: FieldProps;
    anchorRef?: React.Ref<HTMLDivElement>;
    currentView?: TView | null;
    initialView?: TView;
    onViewChange?: (view: TView) => void;
    startFieldRef: React.RefObject<FieldRef<RangeFieldSection>>;
    endFieldRef: React.RefObject<FieldRef<RangeFieldSection>>;
}
export declare const useEnrichedRangePickerFieldProps: <TDate extends PickerValidDate, TView extends DateOrTimeViewWithMeridiem, TEnableAccessibleFieldDOMStructure extends boolean, TError>(params: UseEnrichedRangePickerFieldPropsParams<TDate, TView, TEnableAccessibleFieldDOMStructure, TError>) => BaseMultiInputFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TEnableAccessibleFieldDOMStructure, TError> | BaseSingleInputFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TEnableAccessibleFieldDOMStructure, TError>;
