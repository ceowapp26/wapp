import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["text", "children", "classes"];
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { GaugeContainer } from './GaugeContainer';
import { GaugeValueArc } from './GaugeValueArc';
import { GaugeReferenceArc } from './GaugeReferenceArc';
import { getGaugeUtilityClass } from './gaugeClasses';
import { GaugeValueText } from './GaugeValueText';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = props => {
  const {
    classes
  } = props;
  const slots = {
    root: ['root'],
    valueArc: ['valueArc'],
    referenceArc: ['referenceArc'],
    valueText: ['valueText']
  };
  return composeClasses(slots, getGaugeUtilityClass, classes);
};
function Gauge(props) {
  const {
      text,
      children
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const classes = useUtilityClasses(props);
  return /*#__PURE__*/_jsxs(GaugeContainer, _extends({}, other, {
    className: classes.root,
    children: [/*#__PURE__*/_jsx(GaugeReferenceArc, {
      className: classes.referenceArc
    }), /*#__PURE__*/_jsx(GaugeValueArc, {
      className: classes.valueArc
    }), /*#__PURE__*/_jsx(GaugeValueText, {
      className: classes.valueText,
      text: text
    }), children]
  }));
}
process.env.NODE_ENV !== "production" ? Gauge.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The radius applied to arc corners (similar to border radius).
   * Set it to '50%' to get rounded arc.
   * @default 0
   */
  cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The x coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the width the drawing area.
   */
  cx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The y coordinate of the arc center.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the height the drawing area.
   */
  cy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The end angle (deg).
   * @default 360
   */
  endAngle: PropTypes.number,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The radius between circle center and the begining of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '80%'
   */
  innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  /**
   * The radius between circle center and the end of the arc.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the maximal radius that fit into the drawing area.
   * @default '100%'
   */
  outerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The start angle (deg).
   * @default 0
   */
  startAngle: PropTypes.number,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  text: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  title: PropTypes.string,
  /**
   * The value of the gauge.
   * Set to `null` to not display a value.
   */
  value: PropTypes.number,
  /**
   * The maximal value of the gauge.
   * @default 100
   */
  valueMax: PropTypes.number,
  /**
   * The minimal value of the gauge.
   * @default 0
   */
  valueMin: PropTypes.number,
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number
} : void 0;
export { Gauge };