"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRID_AGGREGATION_FUNCTIONS = void 0;
var _internals = require("@mui/x-data-grid-pro/internals");
const sumAgg = {
  apply: ({
    values
  }) => {
    let sum = 0;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if ((0, _internals.isNumber)(value)) {
        sum += value;
      }
    }
    return sum;
  },
  columnTypes: ['number']
};
const avgAgg = {
  apply: ({
    values
  }) => {
    if (values.length === 0) {
      return null;
    }
    let sum = 0;
    let valuesCount = 0;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if ((0, _internals.isNumber)(value)) {
        valuesCount += 1;
        sum += value;
      }
    }
    return sum / valuesCount;
  },
  columnTypes: ['number']
};
const minAgg = {
  apply: ({
    values
  }) => {
    if (values.length === 0) {
      return null;
    }
    let min = +Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value != null && value < min) {
        min = value;
      }
    }
    return min;
  },
  columnTypes: ['number', 'date', 'dateTime']
};
const maxAgg = {
  apply: ({
    values
  }) => {
    if (values.length === 0) {
      return null;
    }
    let max = -Infinity;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (value != null && value > max) {
        max = value;
      }
    }
    return max;
  },
  columnTypes: ['number', 'date', 'dateTime']
};
const sizeAgg = {
  apply: ({
    values
  }) => {
    return values.filter(value => typeof value !== 'undefined').length;
  },
  valueFormatter: value => {
    if (value == null || !(0, _internals.isNumber)(value)) {
      return value;
    }
    return value.toLocaleString();
  },
  hasCellUnit: false
};
const GRID_AGGREGATION_FUNCTIONS = exports.GRID_AGGREGATION_FUNCTIONS = {
  sum: sumAgg,
  avg: avgAgg,
  min: minAgg,
  max: maxAgg,
  size: sizeAgg
};