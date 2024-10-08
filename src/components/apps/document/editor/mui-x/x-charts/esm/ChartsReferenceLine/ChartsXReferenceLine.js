import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { useDrawingArea, useXScale } from '../hooks';
import { ReferenceLineRoot } from './common';
import { ChartsText } from '../ChartsText';
import { getReferenceLineUtilityClass } from './chartsReferenceLineClasses';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const getTextParams = ({
  top,
  height,
  spacingY,
  labelAlign = 'middle'
}) => {
  switch (labelAlign) {
    case 'start':
      return {
        y: top + spacingY,
        style: {
          dominantBaseline: 'hanging',
          textAnchor: 'start'
        }
      };
    case 'end':
      return {
        y: top + height - spacingY,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start'
        }
      };
    default:
      return {
        y: top + height / 2,
        style: {
          dominantBaseline: 'central',
          textAnchor: 'start'
        }
      };
  }
};
export function getXReferenceLineClasses(classes) {
  return composeClasses({
    root: ['root', 'vertical'],
    line: ['line'],
    label: ['label']
  }, getReferenceLineUtilityClass, classes);
}
let warnedOnce = false;
function ChartsXReferenceLine(props) {
  const {
    x,
    label = '',
    spacing = 5,
    classes: inClasses,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId
  } = props;
  const {
    top,
    height
  } = useDrawingArea();
  const xAxisScale = useXScale(axisId);
  const xPosition = xAxisScale(x);
  if (xPosition === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      if (!warnedOnce) {
        warnedOnce = true;
        console.error(`MUI X Charts: the value ${x} does not exist in the data of x axis with id ${axisId}.`);
      }
    }
    return null;
  }
  const d = `M ${xPosition} ${top} l 0 ${height}`;
  const classes = getXReferenceLineClasses(inClasses);
  const spacingX = typeof spacing === 'object' ? spacing.x ?? 0 : spacing;
  const spacingY = typeof spacing === 'object' ? spacing.y ?? 0 : spacing;
  const textParams = _extends({
    x: xPosition + spacingX,
    text: label,
    fontSize: 12
  }, getTextParams({
    top,
    height,
    spacingY,
    labelAlign
  }), {
    className: classes.label
  });
  return /*#__PURE__*/_jsxs(ReferenceLineRoot, {
    className: classes.root,
    children: [/*#__PURE__*/_jsx("path", {
      d: d,
      className: classes.line,
      style: lineStyle
    }), /*#__PURE__*/_jsx(ChartsText, _extends({}, textParams, {
      style: _extends({}, textParams.style, labelStyle)
    }))]
  });
}
export { ChartsXReferenceLine };