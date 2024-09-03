"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRangeChange = calculateRangeChange;
exports.calculateRangePreview = calculateRangePreview;
var _internals = require("@mui/x-date-pickers/internals");
function calculateRangeChange({
  utils,
  range,
  newDate: selectedDate,
  rangePosition,
  allowRangeFlip = false,
  shouldMergeDateAndTime = false
}) {
  const [start, end] = range;
  if (shouldMergeDateAndTime && selectedDate) {
    // If there is a date already selected, then we want to keep its time
    if (start && rangePosition === 'start') {
      selectedDate = (0, _internals.mergeDateAndTime)(utils, selectedDate, start);
    }
    if (end && rangePosition === 'end') {
      selectedDate = (0, _internals.mergeDateAndTime)(utils, selectedDate, end);
    }
  }
  if (rangePosition === 'start') {
    const truthyResult = allowRangeFlip ? {
      nextSelection: 'start',
      newRange: [end, selectedDate]
    } : {
      nextSelection: 'end',
      newRange: [selectedDate, null]
    };
    return Boolean(end) && utils.isAfter(selectedDate, end) ? truthyResult : {
      nextSelection: 'end',
      newRange: [selectedDate, end]
    };
  }
  const truthyResult = allowRangeFlip ? {
    nextSelection: 'end',
    newRange: [selectedDate, start]
  } : {
    nextSelection: 'end',
    newRange: [selectedDate, null]
  };
  return Boolean(start) && utils.isBeforeDay(selectedDate, start) ? truthyResult : {
    nextSelection: 'start',
    newRange: [start, selectedDate]
  };
}
function calculateRangePreview(options) {
  if (options.newDate == null) {
    return [null, null];
  }
  const [start, end] = options.range;
  const {
    newRange
  } = calculateRangeChange(options);
  if (!start || !end) {
    return newRange;
  }
  const [previewStart, previewEnd] = newRange;
  return options.rangePosition === 'end' ? [end, previewEnd] : [previewStart, start];
}