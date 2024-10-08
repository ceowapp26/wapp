import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { PopperProps as BasePopperProps } from '@mui/base/Popper';
import { TriggerOptions } from './utils';
import { ChartsItemContentProps } from './ChartsItemTooltipContent';
import { ChartsAxisContentProps } from './ChartsAxisTooltipContent';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
export type PopperProps = BasePopperProps & {
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps<Theme>;
};
export interface ChartsTooltipSlots {
    /**
     * Custom component for the tooltip popper.
     * @default ChartsTooltipRoot
     */
    popper?: React.ElementType<PopperProps>;
    /**
     * Custom component for displaying tooltip content when triggered by axis event.
     * @default DefaultChartsAxisTooltipContent
     */
    axisContent?: React.ElementType<ChartsAxisContentProps>;
    /**
     * Custom component for displaying tooltip content when triggered by item event.
     * @default DefaultChartsItemTooltipContent
     */
    itemContent?: React.ElementType<ChartsItemContentProps>;
}
export interface ChartsTooltipSlotProps {
    popper?: Partial<PopperProps>;
    axisContent?: Partial<ChartsAxisContentProps>;
    itemContent?: Partial<ChartsItemContentProps>;
}
export type ChartsTooltipProps = {
    /**
     * Select the kind of tooltip to display
     * - 'item': Shows data about the item below the mouse.
     * - 'axis': Shows values associated with the hovered x value
     * - 'none': Does not display tooltip
     * @default 'item'
     */
    trigger?: TriggerOptions;
    /**
     * Component to override the tooltip content when triger is set to 'item'.
     * @deprecated Use slots.itemContent instead
     */
    itemContent?: React.ElementType<ChartsItemContentProps<any>>;
    /**
     * Component to override the tooltip content when triger is set to 'axis'.
     * @deprecated Use slots.axisContent instead
     */
    axisContent?: React.ElementType<ChartsAxisContentProps>;
    /**
     * Override or extend the styles applied to the component.
     */
    classes?: Partial<ChartsTooltipClasses>;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: ChartsTooltipSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: ChartsTooltipSlotProps;
};
/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
declare function ChartsTooltip(props: ChartsTooltipProps): React.JSX.Element | null;
declare namespace ChartsTooltip {
    var propTypes: any;
}
export { ChartsTooltip };
