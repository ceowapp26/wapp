import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["x", "y", "id", "classes", "color"];
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { jsx as _jsx } from "react/jsx-runtime";
export function getHighlightElementUtilityClass(slot) {
  return generateUtilityClass('MuiHighlightElement', slot);
}
export const lineHighlightElementClasses = generateUtilityClasses('MuiHighlightElement', ['root']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`]
  };
  return composeClasses(slots, getHighlightElementUtilityClass, classes);
};
const HighlightElement = styled('circle', {
  name: 'MuiHighlightElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState
}) => ({
  transform: `translate(${ownerState.x}px, ${ownerState.y}px)`,
  transformOrigin: `${ownerState.x}px ${ownerState.y}px`,
  fill: ownerState.color
}));
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = {
    id,
    classes: innerClasses,
    color,
    x,
    y
  };
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(HighlightElement, _extends({
    pointerEvents: "none",
    ownerState: ownerState,
    className: classes.root,
    cx: 0,
    cy: 0,
    r: other.r === undefined ? 5 : other.r
  }, other));
}
process.env.NODE_ENV !== "production" ? LineHighlightElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
} : void 0;
export { LineHighlightElement };