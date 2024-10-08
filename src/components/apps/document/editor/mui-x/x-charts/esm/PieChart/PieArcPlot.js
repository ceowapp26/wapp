import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["slots", "slotProps", "innerRadius", "outerRadius", "cornerRadius", "paddingAngle", "id", "highlightScope", "highlighted", "faded", "data", "onItemClick", "skipAnimation"],
  _excluded2 = ["startAngle", "endAngle", "paddingAngle", "innerRadius", "arcLabelRadius", "outerRadius", "cornerRadius"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import { PieArc } from './PieArc';
import { defaultTransitionConfig } from './dataTransform/transition';
import { useTransformData } from './dataTransform/useTransformData';
import { jsx as _jsx } from "react/jsx-runtime";
function PieArcPlot(props) {
  const {
      slots,
      slotProps,
      innerRadius = 0,
      outerRadius,
      cornerRadius = 0,
      paddingAngle = 0,
      id,
      highlightScope,
      highlighted,
      faded = {
        additionalRadius: -5
      },
      data,
      onItemClick,
      skipAnimation
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlightScope,
    highlighted,
    faded,
    data
  });
  const transition = useTransition(transformedData, _extends({}, defaultTransitionConfig, {
    immediate: skipAnimation
  }));
  if (data.length === 0) {
    return null;
  }
  const Arc = slots?.pieArc ?? PieArc;
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
    children: transition((_ref, item, _, index) => {
      let {
          startAngle,
          endAngle,
          paddingAngle: pA,
          innerRadius: iR,
          outerRadius: oR,
          cornerRadius: cR
        } = _ref,
        style = _objectWithoutPropertiesLoose(_ref, _excluded2);
      return /*#__PURE__*/_jsx(Arc, _extends({
        startAngle: startAngle,
        endAngle: endAngle,
        paddingAngle: pA,
        innerRadius: iR,
        outerRadius: oR,
        cornerRadius: cR,
        style: style,
        id: id,
        color: item.color,
        dataIndex: index,
        highlightScope: highlightScope,
        isFaded: item.isFaded,
        isHighlighted: item.isHighlighted,
        onClick: onItemClick && (event => {
          onItemClick(event, {
            type: 'pie',
            seriesId: id,
            dataIndex: index
          }, item);
        })
      }, slotProps?.pieArc));
    })
  }));
}
process.env.NODE_ENV !== "production" ? PieArcPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
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
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onItemClick: PropTypes.func,
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
export { PieArcPlot };