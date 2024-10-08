import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { CartesianContext } from '../context/CartesianContextProvider';
import { ChartsXAxis } from '../ChartsXAxis';
import { ChartsYAxis } from '../ChartsYAxis';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const getAxisId = (propsValue, defaultAxisId) => {
  if (propsValue == null) {
    return null;
  }
  if (typeof propsValue === 'object') {
    return propsValue.axisId ?? defaultAxisId ?? null;
  }
  return propsValue;
};
const mergeProps = (axisConfig, slots, slotProps) => {
  return typeof axisConfig === 'object' ? _extends({}, axisConfig, {
    slots: _extends({}, slots, axisConfig?.slots),
    slotProps: _extends({}, slotProps, axisConfig?.slotProps)
  }) : {
    slots,
    slotProps
  };
};

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsAxis(props) {
  const {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps
  } = props;
  const {
    xAxis,
    xAxisIds,
    yAxis,
    yAxisIds
  } = React.useContext(CartesianContext);

  // TODO: use for plotting line without ticks or any thing
  // const drawingArea = React.useContext(DrawingContext);

  const leftId = getAxisId(leftAxis === undefined ? yAxisIds[0] : leftAxis, yAxisIds[0]);
  const bottomId = getAxisId(bottomAxis === undefined ? xAxisIds[0] : bottomAxis, xAxisIds[0]);
  const topId = getAxisId(topAxis, xAxisIds[0]);
  const rightId = getAxisId(rightAxis, yAxisIds[0]);
  if (topId !== null && !xAxis[topId]) {
    throw Error([`MUI X Charts: id used for top axis "${topId}" is not defined.`, `Available ids are: ${xAxisIds.join(', ')}.`].join('\n'));
  }
  if (leftId !== null && !yAxis[leftId]) {
    throw Error([`MUI X Charts: id used for left axis "${leftId}" is not defined.`, `Available ids are: ${yAxisIds.join(', ')}.`].join('\n'));
  }
  if (rightId !== null && !yAxis[rightId]) {
    throw Error([`MUI X Charts: id used for right axis "${rightId}" is not defined.`, `Available ids are: ${yAxisIds.join(', ')}.`].join('\n'));
  }
  if (bottomId !== null && !xAxis[bottomId]) {
    throw Error([`MUI X Charts: id used for bottom axis "${bottomId}" is not defined.`, `Available ids are: ${xAxisIds.join(', ')}.`].join('\n'));
  }
  const topAxisProps = mergeProps(topAxis, slots, slotProps);
  const bottomAxisProps = mergeProps(bottomAxis, slots, slotProps);
  const leftAxisProps = mergeProps(leftAxis, slots, slotProps);
  const rightAxisProps = mergeProps(rightAxis, slots, slotProps);
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [topId && /*#__PURE__*/_jsx(ChartsXAxis, _extends({}, topAxisProps, {
      position: "top",
      axisId: topId
    })), bottomId && /*#__PURE__*/_jsx(ChartsXAxis, _extends({}, bottomAxisProps, {
      position: "bottom",
      axisId: bottomId
    })), leftId && /*#__PURE__*/_jsx(ChartsYAxis, _extends({}, leftAxisProps, {
      position: "left",
      axisId: leftId
    })), rightId && /*#__PURE__*/_jsx(ChartsYAxis, _extends({}, rightAxisProps, {
      position: "right",
      axisId: rightId
    }))]
  });
}
process.env.NODE_ENV !== "production" ? ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
} : void 0;
export { ChartsAxis };