"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _d3Shape = require("d3-shape");
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
    const arcs = (0, _d3Shape.pie)().startAngle(2 * Math.PI * (series[seriesId].startAngle ?? 0) / 360).endAngle(2 * Math.PI * (series[seriesId].endAngle ?? 360) / 360).padAngle(2 * Math.PI * (series[seriesId].paddingAngle ?? 0) / 360).sortValues(getSortingComparator(series[seriesId].sortingValues ?? 'none'))(series[seriesId].data.map(piePoint => piePoint.value));
    defaultizedSeries[seriesId] = (0, _extends2.default)({
      valueFormatter: item => item.value.toLocaleString()
    }, series[seriesId], {
      data: series[seriesId].data.map((item, index) => (0, _extends2.default)({}, item, {
        id: item.id ?? `auto-generated-pie-id-${seriesId}-${index}`
      }, arcs[index])).map((item, index) => (0, _extends2.default)({}, item, {
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
var _default = exports.default = formatter;