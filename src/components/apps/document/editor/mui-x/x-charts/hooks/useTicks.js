"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTickNumber = getTickNumber;
exports.useTicks = useTicks;
var React = _interopRequireWildcard(require("react"));
var _isBandScale = require("../internals/isBandScale");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function getTickNumber(params) {
  const {
    tickMaxStep,
    tickMinStep,
    tickNumber,
    range,
    domain
  } = params;
  const maxTicks = tickMinStep === undefined ? 999 : Math.floor(Math.abs(domain[1] - domain[0]) / tickMinStep);
  const minTicks = tickMaxStep === undefined ? 2 : Math.ceil(Math.abs(domain[1] - domain[0]) / tickMaxStep);
  const defaultizedTickNumber = tickNumber ?? Math.floor(Math.abs(range[1] - range[0]) / 50);
  return Math.min(maxTicks, Math.max(minTicks, defaultizedTickNumber));
}
const offsetRatio = {
  start: 0,
  extremities: 0,
  end: 1,
  middle: 0.5
};
function useTicks(options) {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement = 'middle'
  } = options;
  return React.useMemo(() => {
    // band scale
    if ((0, _isBandScale.isBandScale)(scale)) {
      const domain = scale.domain();
      if (scale.bandwidth() > 0) {
        // scale type = 'band'
        return [...domain.map(value => ({
          value,
          formattedValue: valueFormatter?.(value, {
            location: 'tick'
          }) ?? `${value}`,
          offset: scale(value) - (scale.step() - scale.bandwidth()) / 2 + offsetRatio[tickPlacement] * scale.step(),
          labelOffset: tickLabelPlacement === 'tick' ? 0 : scale.step() * (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement])
        })), ...(tickPlacement === 'extremities' ? [{
          formattedValue: undefined,
          offset: scale.range()[1],
          labelOffset: 0
        }] : [])];
      }

      // scale type = 'point'
      const filteredDomain = typeof tickInterval === 'function' && domain.filter(tickInterval) || typeof tickInterval === 'object' && tickInterval || domain;
      return filteredDomain.map(value => ({
        value,
        formattedValue: valueFormatter?.(value, {
          location: 'tick'
        }) ?? `${value}`,
        offset: scale(value),
        labelOffset: 0
      }));
    }
    const ticks = typeof tickInterval === 'object' ? tickInterval : scale.ticks(tickNumber);
    return ticks.map(value => ({
      value,
      formattedValue: valueFormatter?.(value, {
        location: 'tick'
      }) ?? scale.tickFormat(tickNumber)(value),
      offset: scale(value),
      labelOffset: 0
    }));
  }, [scale, tickInterval, tickNumber, valueFormatter, tickPlacement, tickLabelPlacement]);
}