"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsOnAxisClickHandler = ChartsOnAxisClickHandler;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _DrawingProvider = require("../context/DrawingProvider");
var _InteractionProvider = require("../context/InteractionProvider");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _SeriesContextProvider = require("../context/SeriesContextProvider");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ChartsOnAxisClickHandler(props) {
  const {
    onAxisClick
  } = props;
  const svgRef = React.useContext(_DrawingProvider.SvgContext);
  const series = React.useContext(_SeriesContextProvider.SeriesContext);
  const {
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const {
    xAxisIds,
    xAxis,
    yAxisIds,
    yAxis
  } = React.useContext(_CartesianContextProvider.CartesianContext);
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !onAxisClick) {
      return () => {};
    }
    const handleMouseClick = event => {
      event.preventDefault();
      const isXaxis = (axis.x && axis.x.index) !== undefined;
      const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
      const dataIndex = isXaxis ? axis.x && axis.x.index : axis.y && axis.y.index;
      if (dataIndex == null) {
        return;
      }
      const seriesValues = {};
      Object.keys(series).filter(seriesType => ['bar', 'line'].includes(seriesType)).forEach(seriesType => {
        series[seriesType]?.seriesOrder.forEach(seriesId => {
          const seriesItem = series[seriesType].series[seriesId];
          const axisKey = isXaxis ? seriesItem.xAxisKey : seriesItem.yAxisKey;
          if (axisKey === undefined || axisKey === USED_AXIS_ID) {
            seriesValues[seriesId] = seriesItem.data[dataIndex];
          }
        });
      });
      const axisValue = (isXaxis ? xAxis : yAxis)[USED_AXIS_ID].data?.[dataIndex];
      onAxisClick(event, {
        dataIndex,
        axisValue,
        seriesValues
      });
    };
    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('click', handleMouseClick);
    };
  }, [axis.x, axis.y, onAxisClick, series, svgRef, xAxis, xAxisIds, yAxis, yAxisIds]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {});
}
process.env.NODE_ENV !== "production" ? ChartsOnAxisClickHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: _propTypes.default.func
} : void 0;