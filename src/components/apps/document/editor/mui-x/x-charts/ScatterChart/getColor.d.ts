import { AxisDefaultized } from '../models/axis';
import { ZAxisDefaultized } from '../models/z-axis';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
export default function getColor(series: DefaultizedScatterSeriesType, xAxis: AxisDefaultized, yAxis: AxisDefaultized, zAxis?: ZAxisDefaultized): (dataIndex: number) => string;
