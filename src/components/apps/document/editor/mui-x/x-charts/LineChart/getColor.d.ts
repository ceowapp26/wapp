import { AxisDefaultized } from '../models/axis';
import { DefaultizedLineSeriesType } from '../models/seriesType/line';
export default function getColor(series: DefaultizedLineSeriesType, xAxis: AxisDefaultized, yAxis: AxisDefaultized): (dataIndex: number) => string;
