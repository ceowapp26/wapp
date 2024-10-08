import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["id", "classes", "color", "gradientId", "highlightScope", "slots", "slotProps", "onClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { getIsFaded, getIsHighlighted, useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { AnimatedArea } from './AnimatedArea';
import { jsx as _jsx } from "react/jsx-runtime";
export function getAreaElementUtilityClass(slot) {
  return generateUtilityClass('MuiAreaElement', slot);
}
export const areaElementClasses = generateUtilityClasses('MuiAreaElement', ['root', 'highlighted', 'faded']);
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
  return composeClasses(slots, getAreaElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/area-element/)
 */
function AreaElement(props) {
  const {
      id,
      classes: innerClasses,
      color,
      gradientId,
      highlightScope,
      slots,
      slotProps,
      onClick
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const getInteractionItemProps = useInteractionItemProps(highlightScope);
  const {
    item
  } = React.useContext(InteractionContext);
  const isHighlighted = getIsHighlighted(item, {
    type: 'line',
    seriesId: id
  }, highlightScope);
  const isFaded = !isHighlighted && getIsFaded(item, {
    type: 'line',
    seriesId: id
  }, highlightScope);
  const ownerState = {
    id,
    classes: innerClasses,
    color,
    gradientId,
    isFaded,
    isHighlighted
  };
  const classes = useUtilityClasses(ownerState);
  const Area = slots?.area ?? AnimatedArea;
  const areaProps = useSlotProps({
    elementType: Area,
    externalSlotProps: slotProps?.area,
    additionalProps: _extends({}, other, getInteractionItemProps({
      type: 'line',
      seriesId: id
    }), {
      className: classes.root,
      onClick,
      cursor: onClick ? 'pointer' : 'unset'
    }),
    ownerState
  });
  return /*#__PURE__*/_jsx(Area, _extends({}, areaProps));
}
process.env.NODE_ENV !== "production" ? AreaElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  d: PropTypes.string.isRequired,
  gradientId: PropTypes.string,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series'])
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
export { AreaElement };