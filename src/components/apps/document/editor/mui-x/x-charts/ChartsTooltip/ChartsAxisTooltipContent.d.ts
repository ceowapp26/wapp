import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { AxisInteractionData } from '../context/InteractionProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { AxisDefaultized } from '../models/axis';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
type ChartSeriesDefaultizedWithColorGetter = ChartSeriesDefaultized<ChartSeriesType> & {
    getColor: (dataIndex: number) => string;
};
export type ChartsAxisContentProps = {
    /**
     * Data identifying the triggered axis.
     */
    axisData: AxisInteractionData;
    /**
     * The series linked to the triggered axis.
     */
    series: ChartSeriesDefaultizedWithColorGetter[];
    /**
     * The properties of the triggered axis.
     */
    axis: AxisDefaultized;
    /**
     * The index of the data item triggered.
     */
    dataIndex?: null | number;
    /**
     * The value associated to the current mouse position.
     */
    axisValue: any;
    /**
     * Override or extend the styles applied to the component.
     */
    classes: ChartsTooltipClasses;
    sx?: SxProps<Theme>;
};
declare function ChartsAxisTooltipContent(props: {
    axisData: AxisInteractionData;
    content?: React.ElementType<ChartsAxisContentProps>;
    contentProps?: Partial<ChartsAxisContentProps>;
    sx?: SxProps<Theme>;
    classes: ChartsAxisContentProps['classes'];
}): React.JSX.Element;
declare namespace ChartsAxisTooltipContent {
    var propTypes: any;
}
export { ChartsAxisTooltipContent };
