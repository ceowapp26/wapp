import * as React from 'react';
import { AreaPlotProps, AreaPlotSlotProps, AreaPlotSlots } from './AreaPlot';
import { LinePlotProps, LinePlotSlotProps, LinePlotSlots } from './LinePlot';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { MarkPlotProps, MarkPlotSlotProps, MarkPlotSlots } from './MarkPlot';
import { ChartsAxisProps } from '../ChartsAxis/ChartsAxis';
import { LineSeriesType } from '../models/seriesType/line';
import { MakeOptional } from '../models/helpers';
import { ChartsTooltipProps, ChartsTooltipSlotProps, ChartsTooltipSlots } from '../ChartsTooltip';
import { ChartsLegendProps, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsAxisSlotProps, ChartsAxisSlots } from '../models/axis';
import { LineHighlightPlotSlots, LineHighlightPlotSlotProps } from './LineHighlightPlot';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsOnAxisClickHandlerProps } from '../ChartsOnAxisClickHandler';
export interface LineChartSlots extends ChartsAxisSlots, AreaPlotSlots, LinePlotSlots, MarkPlotSlots, LineHighlightPlotSlots, ChartsLegendSlots, ChartsTooltipSlots {
}
export interface LineChartSlotProps extends ChartsAxisSlotProps, AreaPlotSlotProps, LinePlotSlotProps, MarkPlotSlotProps, LineHighlightPlotSlotProps, ChartsLegendSlotProps, ChartsTooltipSlotProps {
}
export interface LineChartProps extends Omit<ResponsiveChartContainerProps, 'series'>, Omit<ChartsAxisProps, 'slots' | 'slotProps'>, ChartsOnAxisClickHandlerProps {
    /**
     * The series to display in the line chart.
     * An array of [[LineSeriesType]] objects.
     */
    series: MakeOptional<LineSeriesType, 'type'>[];
    /**
     * The configuration of the tooltip.
     * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
     * @default { trigger: 'item' }
     */
    tooltip?: ChartsTooltipProps;
    /**
     * Option to display a cartesian grid in the background.
     */
    grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
    /**
     * The configuration of axes highlight.
     * @see See {@link https://mui.com/x/react-charts/tooltip/#highlights highlight docs} for more details.
     * @default { x: 'line' }
     */
    axisHighlight?: ChartsAxisHighlightProps;
    /**
     * @deprecated Consider using `slotProps.legend` instead.
     */
    legend?: ChartsLegendProps;
    /**
     * If `true`, render the line highlight item.
     */
    disableLineItemHighlight?: boolean;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: LineChartSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: LineChartSlotProps;
    /**
     * Callback fired when an area element is clicked.
     */
    onAreaClick?: AreaPlotProps['onItemClick'];
    /**
     * Callback fired when a line element is clicked.
     */
    onLineClick?: LinePlotProps['onItemClick'];
    /**
     * Callback fired when a mark element is clicked.
     */
    onMarkClick?: MarkPlotProps['onItemClick'];
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
}
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineChart API](https://mui.com/x/api/charts/line-chart/)
 */
declare const LineChart: React.ForwardRefExoticComponent<LineChartProps & React.RefAttributes<unknown>>;
export { LineChart };
