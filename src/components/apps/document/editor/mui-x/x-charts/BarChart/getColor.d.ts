import { AxisDefaultized } from '../models/axis';
import { DefaultizedBarSeriesType } from '../models/seriesType/bar';
export default function getColor(series: DefaultizedBarSeriesType, xAxis: AxisDefaultized, yAxis: AxisDefaultized): (dataIndex: number) => string;
