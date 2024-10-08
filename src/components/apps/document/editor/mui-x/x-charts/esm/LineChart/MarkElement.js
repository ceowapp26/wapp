import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["x", "y", "id", "classes", "color", "shape", "dataIndex", "highlightScope", "onClick", "skipAnimation"];
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from 'd3-shape';
import { animated, to, useSpring } from '@react-spring/web';
import { getSymbol } from '../internals/utils';
import { InteractionContext } from '../context/InteractionProvider';
import { getIsFaded, getIsHighlighted, useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { jsx as _jsx } from "react/jsx-runtime";
export function getMarkElementUtilityClass(slot) {
  return generateUtilityClass('MuiMarkElement', slot);
}
export const markElementClasses = generateUtilityClasses('MuiMarkElement', ['root', 'highlighted', 'faded']);
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
  return composeClasses(slots, getMarkElementUtilityClass, classes);
};
const MarkElementPath = styled(animated.path, {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState,
  theme
}) => ({
  fill: (theme.vars || theme).palette.background.paper,
  stroke: ownerState.color,
  strokeWidth: 2
}));
MarkElementPath.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired
  }).isRequired,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
function MarkElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color,
      shape,
      dataIndex,
      highlightScope,
      onClick,
      skipAnimation
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const getInteractionItemProps = useInteractionItemProps(highlightScope);
  const {
    item,
    axis
  } = React.useContext(InteractionContext);
  const isHighlighted = axis.x?.index === dataIndex || getIsHighlighted(item, {
    type: 'line',
    seriesId: id
  }, highlightScope);
  const isFaded = !isHighlighted && getIsFaded(item, {
    type: 'line',
    seriesId: id
  }, highlightScope);
  const position = useSpring({
    x,
    y,
    immediate: skipAnimation
  });
  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted,
    isFaded,
    color
  };
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(MarkElementPath, _extends({}, other, {
    style: {
      transform: to([position.x, position.y], (pX, pY) => `translate(${pX}px, ${pY}px)`),
      transformOrigin: to([position.x, position.y], (pX, pY) => `${pX}px ${pY}px`)
    },
    ownerState: ownerState,
    className: classes.root,
    d: d3Symbol(d3SymbolsFill[getSymbol(shape)])(),
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset'
  }, getInteractionItemProps({
    type: 'line',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? MarkElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: PropTypes.number.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series'])
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The shape of the marker.
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool
} : void 0;
export { MarkElement };