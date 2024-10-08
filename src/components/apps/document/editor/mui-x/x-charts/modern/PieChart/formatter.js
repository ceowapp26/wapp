import _extends from "@babel/runtime/helpers/esm/extends";
import { pie as d3Pie } from 'd3-shape';
const getSortingComparator = (comparator = 'none') => {
  if (typeof comparator === 'function') {
    return comparator;
  }
  switch (comparator) {
    case 'none':
      return null;
    case 'desc':
      return (a, b) => b - a;
    case 'asc':
      return (a, b) => a - b;
    default:
      return null;
  }
};
const formatter = params => {
  const {
    seriesOrder,
    series
  } = params;
  const defaultizedSeries = {};
  seriesOrder.forEach(seriesId => {
    const arcs = d3Pie().startAngle(2 * Math.PI * (series[seriesId].startAngle ?? 0) / 360).endAngle(2 * Math.PI * (series[seriesId].endAngle ?? 360) / 360).padAngle(2 * Math.PI * (series[seriesId].paddingAngle ?? 0) / 360).sortValues(getSortingComparator(series[seriesId].sortingValues ?? 'none'))(series[seriesId].data.map(piePoint => piePoint.value));
    defaultizedSeries[seriesId] = _extends({
      valueFormatter: item => item.value.toLocaleString()
    }, series[seriesId], {
      data: series[seriesId].data.map((item, index) => _extends({}, item, {
        id: item.id ?? `auto-generated-pie-id-${seriesId}-${index}`
      }, arcs[index])).map((item, index) => _extends({}, item, {
        formattedValue: series[seriesId].valueFormatter?.(item, {
          dataIndex: index
        }) ?? item.value.toLocaleString()
      }))
    });
  });
  return {
    seriesOrder,
    series: defaultizedSeries
  };
};
export default formatter;