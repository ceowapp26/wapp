"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBarSeries = useBarSeries;
exports.useLineSeries = useLineSeries;
exports.usePieSeries = usePieSeries;
exports.useScatterSeries = useScatterSeries;
exports.useSeries = useSeries;
var React = _interopRequireWildcard(require("react"));
var _SeriesContextProvider = require("../context/SeriesContextProvider");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
function useSeries() {
  const series = React.useContext(_SeriesContextProvider.SeriesContext);
  if (series === undefined) {
    throw new Error(['MUI X: Could not find the series ref context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  return series;
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedPieSeriesType>; seriesOrder: SeriesId[]; } | undefined pieSeries
 */
function usePieSeries() {
  const series = useSeries();
  return React.useMemo(() => series.pie, [series.pie]);
}

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedLineSeriesType>; seriesOrder: SeriesId[]; } | undefined lineSeries
 */
function useLineSeries() {
  const series = useSeries();
  return React.useMemo(() => series.line, [series.line]);
}

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedBarSeriesType>; seriesOrder: SeriesId[]; } | undefined barSeries
 */
function useBarSeries() {
  const series = useSeries();
  return React.useMemo(() => series.bar, [series.bar]);
}

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedScatterSeriesType>; seriesOrder: SeriesId[]; } | undefined scatterSeries
 */
function useScatterSeries() {
  const series = useSeries();
  return React.useMemo(() => series.scatter, [series.scatter]);
}