import * as React from 'react';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { DateRangeCalendarProps } from '../DateRangeCalendar';
export interface DateRangeViewRendererProps<TDate extends PickerValidDate, TView extends DateOrTimeViewWithMeridiem> extends Omit<DateRangeCalendarProps<TDate>, 'views'> {
    views: readonly TView[];
}
/**
 * We don't pass all the props down to `DateRangeCalendar`,
 * because otherwise some unwanted props would be passed to the HTML element.
 */
export declare const renderDateRangeViewCalendar: <TDate extends PickerValidDate>({ value, defaultValue, referenceDate, onChange, className, classes, disableFuture, disablePast, minDate, maxDate, shouldDisableDate, reduceAnimations, onMonthChange, rangePosition, defaultRangePosition, onRangePositionChange, calendars, currentMonthCalendarPosition, slots, slotProps, loading, renderLoading, disableHighlightToday, readOnly, disabled, showDaysOutsideCurrentMonth, dayOfWeekFormatter, disableAutoMonthSwitching, sx, autoFocus, fixedWeekNumber, disableDragEditing, displayWeekNumber, timezone, availableRangePositions, views, view, onViewChange, }: DateRangeViewRendererProps<TDate, 'day'>) => React.JSX.Element;
