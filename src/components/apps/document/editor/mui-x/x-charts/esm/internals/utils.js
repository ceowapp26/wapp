// Returns the index of a defined shape
export function getSymbol(shape) {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);
  return symbolNames.indexOf(shape) || 0;
}
/**
 * Transform mouse event position to corrdinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
export function getSVGPoint(svg, event) {
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

/**
 * Helper that converts values and percentages into values.
 * @param value The value provided by the developer. Can either be a number or a string with '%' or 'px'.
 * @param refValue The numerical value associated to 100%.
 * @returns The numerical value associated to the provided value.
 */
export function getPercentageValue(value, refValue) {
  if (typeof value === 'number') {
    return value;
  }
  if (value === '100%') {
    // Avoid potential rounding issues
    return refValue;
  }
  if (value.endsWith('%')) {
    const percentage = Number.parseFloat(value.slice(0, value.length - 1));
    if (!Number.isNaN(percentage)) {
      return percentage * refValue / 100;
    }
  }
  if (value.endsWith('px')) {
    const val = Number.parseFloat(value.slice(0, value.length - 2));
    if (!Number.isNaN(val)) {
      return val;
    }
  }
  throw Error(`MUI-Charts: Received an unknown value "${value}". It should be a number, or a string with a percentage value.`);
}

/**
 * Remove spaces to have viable ids
 */
export function cleanId(id) {
  return id.replace(' ', '_');
}