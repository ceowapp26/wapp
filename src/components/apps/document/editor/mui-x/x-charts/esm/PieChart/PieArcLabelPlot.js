import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["arcLabel", "arcLabelMinAngle", "arcLabelRadius", "cornerRadius", "data", "faded", "highlighted", "highlightScope", "id", "innerRadius", "outerRadius", "paddingAngle", "skipAnimation", "slotProps", "slots"],
  _excluded2 = ["startAngle", "endAngle", "paddingAngle", "innerRadius", "outerRadius", "arcLabelRadius", "cornerRadius"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import { defaultLabelTransitionConfig } from './dataTransform/transition';
import { useTransformData } from './dataTransform/useTransformData';
import { PieArcLabel } from './PieArcLabel';
import { jsx as _jsx } from "react/jsx-runtime";
const RATIO = 180 / Math.PI;
function getItemLabel(arcLabel, arcLabelMinAngle, item) {
  if (!arcLabel) {
    return null;
  }
  const angle = (item.endAngle - item.startAngle) * RATIO;
  if (angle < arcLabelMinAngle) {
    return null;
  }
  if (typeof arcLabel === 'string') {
    return item[arcLabel]?.toString();
  }
  return arcLabel(item);
}
function PieArcLabelPlot(props) {
  const {
      arcLabel,
      arcLabelMinAngle = 0,
      arcLabelRadius,
      cornerRadius = 0,
      data,
      faded = {
        additionalRadius: -5
      },
      highlighted,
      highlightScope,
      id,
      innerRadius,
      outerRadius,
      paddingAngle = 0,
      skipAnimation,
      slotProps,
      slots
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    arcLabelRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlightScope,
    highlighted,
    faded,
    data
  });
  const transition = useTransition(transformedData, _extends({}, defaultLabelTransitionConfig, {
    immediate: skipAnimation
  }));
  if (data.length === 0) {
    return null;
  }
  const ArcLabel = slots?.pieArcLabel ?? PieArcLabel;
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
    children: transition((_ref, item) => {
      let {
          startAngle,
          endAngle,
          paddingAngle: pA,
          innerRadius: iR,
          outerRadius: oR,
          arcLabelRadius: aLR,
          cornerRadius: cR
        } = _ref,
        style = _objectWithoutPropertiesLoose(_ref, _excluded2);
      return /*#__PURE__*/_jsx(ArcLabel, _extends({
        startAngle: startAngle,
        endAngle: endAngle,
        paddingAngle: pA,
        innerRadius: iR,
        outerRadius: oR,
        arcLabelRadius: aLR,
        cornerRadius: cR,
        style: style,
        id: id,
        color: item.color,
        isFaded: item.isFaded,
        isHighlighted: item.isHighlighted,
        formattedArcLabel: getItemLabel(arcLabel, arcLabelMinAngle, item)
      }, slotProps?.pieArcLabel));
    })
  }));
}
process.env.NODE_ENV !== "production" ? PieArcLabelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The label displayed into the arc.
   */
  arcLabel: PropTypes.oneOfType([PropTypes.oneOf(['formattedValue', 'label', 'value']), PropTypes.func]),
  /**
   * The minimal angle required to display the arc label.
   * @default 0
   */
  arcLabelMinAngle: PropTypes.number,
  /**
   * The radius between circle center and the arc label in px.
   * @default (innerRadius - outerRadius) / 2
   */
  arcLabelRadius: PropTypes.number,
  /**
   * The radius applied to arc corners (similar to border radius).
   * @default 0
   */
  cornerRadius: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    endAngle: PropTypes.number.isRequired,
    formattedValue: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    index: PropTypes.number.isRequired,
    label: PropTypes.string,
    padAngle: PropTypes.number.isRequired,
    startAngle: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired,
  /**
   * Override the arc attibutes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded: PropTypes.shape({
    additionalRadius: PropTypes.number,
    arcLabelRadius: PropTypes.number,
    color: PropTypes.string,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    paddingAngle: PropTypes.number
  }),
  /**
   * Override the arc attibutes when it is highlighted.
   */
  highlighted: PropTypes.shape({
    additionalRadius: PropTypes.number,
    arcLabelRadius: PropTypes.number,
    color: PropTypes.string,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    paddingAngle: PropTypes.number
  }),
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series'])
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The radius between circle center and the begining of the arc.
   * @default 0
   */
  innerRadius: PropTypes.number,
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: PropTypes.number.isRequired,
  /**
   * The padding angle (deg) between two arcs.
   * @default 0
   */
  paddingAngle: PropTypes.number,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object
} : void 0;
export { PieArcLabelPlot };