"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _d3Shape = require("d3-shape");
var _stackSeries = require("../internals/stackSeries");
var _defaultizeValueFormatter = _interopRequireDefault(require("../internals/defaultizeValueFormatter"));
let warnedOnce = false;

// For now it's a copy past of bar charts formatter, but maybe will diverge later
const formatter = (params, dataset) => {
  const {
    seriesOrder,
    series
  } = params;
  const stackingGroups = (0, _stackSeries.getStackingGroups)((0, _extends2.default)({}, params, {
    defaultStrategy: {
      stackOffset: 'none'
    }
  }));

  // Create a data set with format adapted to d3
  const d3Dataset = dataset ?? [];
  seriesOrder.forEach(id => {
    const data = series[id].data;
    if (data !== undefined) {
      data.forEach((value, index) => {
        if (d3Dataset.length <= index) {
          d3Dataset.push({
            [id]: value
          });
        } else {
          d3Dataset[index][id] = value;
        }
      });
    } else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
      throw new Error([`MUI X Charts: line series with id='${id}' has no data.`, 'Either provide a data property to the series or use the dataset prop.'].join('\n'));
    }
  });
  const completedSeries = {};
  stackingGroups.forEach(stackingGroup => {
    // Get stacked values, and derive the domain
    const {
      ids,
      stackingOrder,
      stackingOffset
    } = stackingGroup;
    const stackedSeries = (0, _d3Shape.stack)().keys(ids.map(id => {
      // Use dataKey if needed and available
      const dataKey = series[id].dataKey;
      return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
    })).value((d, key) => d[key] ?? 0) // defaultize null value to 0
    .order(stackingOrder).offset(stackingOffset)(d3Dataset);
    ids.forEach((id, index) => {
      const dataKey = series[id].dataKey;
      completedSeries[id] = (0, _extends2.default)({}, series[id], {
        data: dataKey ? dataset.map(data => {
          const value = data[dataKey];
          if (typeof value !== 'number') {
            if (process.env.NODE_ENV !== 'production' && !warnedOnce && value !== null) {
              warnedOnce = true;
              console.error([`MUI-X charts: your dataset key "${dataKey}" is used for plotting line, but contains nonnumerical elements.`, 'Line plots only support numbers and null values.']);
            }
            return null;
          }
          return value;
        }) : series[id].data,
        stackedData: stackedSeries[index].map(([a, b]) => [a, b])
      });
    });
  });
  return {
    seriesOrder,
    stackingGroups,
    series: (0, _defaultizeValueFormatter.default)(completedSeries, v => v == null ? '' : v.toLocaleString())
  };
};
var _default = exports.default = formatter;