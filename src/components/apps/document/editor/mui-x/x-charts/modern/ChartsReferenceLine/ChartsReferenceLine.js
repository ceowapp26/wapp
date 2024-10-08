import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXReferenceLine } from './ChartsXReferenceLine';
import { ChartsYReferenceLine } from './ChartsYReferenceLine';
import { jsx as _jsx } from "react/jsx-runtime";
function ChartsReferenceLine(props) {
  const {
    x,
    y
  } = props;
  if (x !== undefined && y !== undefined) {
    throw new Error('MUI X Charts: The ChartsReferenceLine cannot have both `x` and `y` props set.');
  }
  if (x === undefined && y === undefined) {
    throw new Error('MUI X Charts: The ChartsReferenceLine should have a value in `x` or `y` prop.');
  }
  if (x !== undefined) {
    return /*#__PURE__*/_jsx(ChartsXReferenceLine, _extends({}, props));
  }
  return /*#__PURE__*/_jsx(ChartsYReferenceLine, _extends({}, props));
}
process.env.NODE_ENV !== "production" ? ChartsReferenceLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The label to display along the reference line.
   */
  label: PropTypes.string,
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign: PropTypes.oneOf(['end', 'middle', 'start']),
  /**
   * The style applied to the label.
   */
  labelStyle: PropTypes.object,
  /**
   * The style applied to the line.
   */
  lineStyle: PropTypes.object,
  /**
   * Additional space arround the label in px.
   * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
   * @default 5
   */
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })]),
  /**
   * The x value associated with the reference line.
   * If defined the reference line will be vertical.
   */
  x: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
  /**
   * The y value associated with the reference line.
   * If defined the reference line will be horizontal.
   */
  y: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
} : void 0;
export { ChartsReferenceLine };