import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["classes", "color", "cornerRadius", "dataIndex", "endAngle", "highlightScope", "id", "innerRadius", "isFaded", "isHighlighted", "onClick", "outerRadius", "paddingAngle", "startAngle"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from 'd3-shape';
import { animated, to } from '@react-spring/web';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { jsx as _jsx } from "react/jsx-runtime";
export function getPieArcUtilityClass(slot) {
  return generateUtilityClass('MuiPieArc', slot);
}
export const pieArcClasses = generateUtilityClasses('MuiPieArc', ['root', 'highlighted', 'faded']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return composeClasses(slots, getPieArcUtilityClass, classes);
};
const PieArcRoot = styled(animated.path, {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc
})(({
  theme
}) => ({
  stroke: (theme.vars || theme).palette.background.paper,
  strokeWidth: 1,
  strokeLinejoin: 'round'
}));
function PieArc(props) {
  const {
      classes: innerClasses,
      color,
      cornerRadius,
      dataIndex,
      endAngle,
      highlightScope,
      id,
      innerRadius,
      isFaded,
      isHighlighted,
      onClick,
      outerRadius,
      paddingAngle,
      startAngle
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted
  };
  const classes = useUtilityClasses(ownerState);
  const getInteractionItemProps = useInteractionItemProps(highlightScope);
  return /*#__PURE__*/_jsx(PieArcRoot, _extends({
    d: to([startAngle, endAngle, paddingAngle, innerRadius, outerRadius, cornerRadius], (sA, eA, pA, iR, oR, cR) => d3Arc().cornerRadius(cR)({
      padAngle: pA,
      startAngle: sA,
      endAngle: eA,
      innerRadius: iR,
      outerRadius: oR
    })),
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset',
    ownerState: ownerState,
    className: classes.root
  }, other, getInteractionItemProps({
    type: 'pie',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series'])
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired
} : void 0;
export { PieArc };