import * as React from 'react';
import { ScatterPlotProps, ScatterPlotSlotProps, ScatterPlotSlots } from './ScatterPlot';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { ChartsAxisProps } from '../ChartsAxis';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { MakeOptional } from '../models/helpers';
import { ChartsTooltipProps, ChartsTooltipSlotProps, ChartsTooltipSlots } from '../ChartsTooltip';
import { ChartsLegendProps, ChartsLegendSlotProps, ChartsLegendSlots } from '../ChartsLegend';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsAxisSlots, ChartsAxisSlotProps } from '../models/axis';
import { ChartsVoronoiHandlerProps } from '../ChartsVoronoiHandler/ChartsVoronoiHandler';
import { ChartsGridProps } from '../ChartsGrid';
import { ZAxisContextProviderProps } from '../context/ZAxisContextProvider';
export interface ScatterChartSlots extends ChartsAxisSlots, ScatterPlotSlots, ChartsLegendSlots, ChartsTooltipSlots {
}
export interface ScatterChartSlotProps extends ChartsAxisSlotProps, ScatterPlotSlotProps, ChartsLegendSlotProps, ChartsTooltipSlotProps {
}
export interface ScatterChartProps extends Omit<ResponsiveChartContainerProps, 'series'>, Omit<ZAxisContextProviderProps, 'children' | 'dataset'>, Omit<ChartsAxisProps, 'slots' | 'slotProps'>, Omit<ChartsVoronoiHandlerProps, 'onItemClick'> {
    /**
     * The series to display in the scatter chart.
     * An array of [[ScatterSeriesType]] objects.
     */
    series: MakeOptional<ScatterSeriesType, 'type'>[];
    /**
     * The configuration of the tooltip.
     * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
     * @default { trigger: 'item' }
     */
    tooltip?: ChartsTooltipProps;
    /**
     * The configuration of axes highlight.
     * @see See {@link https://mui.com/x/react-charts/tooltip/#highlights highlight docs} for more details.
     * @default { x: 'none', y: 'none' }
     */
    axisHighlight?: ChartsAxisHighlightProps;
    /**
     * Option to display a cartesian grid in the background.
     */
    grid?: Pick<ChartsGridProps, 'vertical' | 'horizontal'>;
    /**
     * If true, the interaction will not use the Voronoi cell and fall back to hover events.
     * @default false
     */
    disableVoronoi?: boolean;
    /**
     * @deprecated Consider using `slotProps.legend` instead.
     */
    legend?: ChartsLegendProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: ScatterChartSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: ScatterChartSlotProps;
    /**
     * Callback fired when clicking on a scatter item.
     * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element if using Voronoi cells. Or the Mouse event from the scatter element, when `disableVoronoi=true`.
     * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
     */
    onItemClick?: ScatterPlotProps['onItemClick'] | ChartsVoronoiHandlerProps['onItemClick'];
}
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterChart API](https://mui.com/x/api/charts/scatter-chart/)
 */
declare const ScatterChart: React.ForwardRefExoticComponent<ScatterChartProps & React.RefAttributes<unknown>>;
export { ScatterChart };
