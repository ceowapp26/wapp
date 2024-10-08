import * as React from 'react';
import { CartesianContext } from '../context/CartesianContextProvider';
import { isBandScale } from '../internals/isBandScale';
/**
 * For a given scale return a function that map value to their position.
 * Usefull when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
export function getValueToPositionMapper(scale) {
  if (isBandScale(scale)) {
    return value => scale(value) + scale.bandwidth() / 2;
  }
  return value => scale(value);
}
export function useXScale(identifier) {
  const {
    xAxis,
    xAxisIds
  } = React.useContext(CartesianContext);
  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];
  return xAxis[id].scale;
}
export function useYScale(identifier) {
  const {
    yAxis,
    yAxisIds
  } = React.useContext(CartesianContext);
  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];
  return yAxis[id].scale;
}