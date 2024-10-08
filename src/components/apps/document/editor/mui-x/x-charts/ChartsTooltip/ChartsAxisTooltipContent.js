"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxisTooltipContent = ChartsAxisTooltipContent;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utils = require("@mui/base/utils");
var _SeriesContextProvider = require("../context/SeriesContextProvider");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _DefaultChartsAxisTooltipContent = require("./DefaultChartsAxisTooltipContent");
var _utils2 = require("./utils");
var _colorGetter = _interopRequireDefault(require("../internals/colorGetter"));
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ChartsAxisTooltipContent(props) {
  const {
    content,
    contentProps,
    axisData,
    sx,
    classes
  } = props;
  const isXaxis = (axisData.x && axisData.x.index) !== undefined;
  const dataIndex = isXaxis ? axisData.x && axisData.x.index : axisData.y && axisData.y.index;
  const axisValue = isXaxis ? axisData.x && axisData.x.value : axisData.y && axisData.y.value;
  const {
    xAxisIds,
    xAxis,
    yAxisIds,
    yAxis
  } = React.useContext(_CartesianContextProvider.CartesianContext);
  const {
    zAxisIds,
    zAxis
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
  const series = React.useContext(_SeriesContextProvider.SeriesContext);
  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
  const relevantSeries = React.useMemo(() => {
    const rep = [];
    Object.keys(series).filter(_utils2.isCartesianSeriesType).forEach(seriesType => {
      series[seriesType].seriesOrder.forEach(seriesId => {
        const item = series[seriesType].series[seriesId];
        const axisKey = isXaxis ? item.xAxisKey : item.yAxisKey;
        if (axisKey === undefined || axisKey === USED_AXIS_ID) {
          const seriesToAdd = series[seriesType].series[seriesId];
          let getColor;
          switch (seriesToAdd.type) {
            case 'scatter':
              getColor = (0, _colorGetter.default)(seriesToAdd, xAxis[seriesToAdd.xAxisKey ?? xAxisIds[0]], yAxis[seriesToAdd.yAxisKey ?? yAxisIds[0]], zAxis[seriesToAdd.zAxisKey ?? zAxisIds[0]]);
              break;
            default:
              getColor = (0, _colorGetter.default)(seriesToAdd, xAxis[seriesToAdd.xAxisKey ?? xAxisIds[0]], yAxis[seriesToAdd.yAxisKey ?? yAxisIds[0]]);
              break;
          }
          rep.push((0, _extends2.default)({}, seriesToAdd, {
            getColor
          }));
        }
      });
    });
    return rep;
  }, [USED_AXIS_ID, isXaxis, series, xAxis, xAxisIds, yAxis, yAxisIds, zAxis, zAxisIds]);
  const relevantAxis = React.useMemo(() => {
    return isXaxis ? xAxis[USED_AXIS_ID] : yAxis[USED_AXIS_ID];
  }, [USED_AXIS_ID, isXaxis, xAxis, yAxis]);
  const Content = content ?? _DefaultChartsAxisTooltipContent.DefaultChartsAxisTooltipContent;
  const chartTooltipContentProps = (0, _utils.useSlotProps)({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      axisData,
      series: relevantSeries,
      axis: relevantAxis,
      dataIndex,
      axisValue,
      sx,
      classes
    },
    ownerState: {}
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Content, (0, _extends2.default)({}, chartTooltipContentProps));
}
process.env.NODE_ENV !== "production" ? ChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  axisData: _propTypes.default.shape({
    x: _propTypes.default.shape({
      index: _propTypes.default.number,
      value: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired
    }),
    y: _propTypes.default.shape({
      index: _propTypes.default.number,
      value: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired
    })
  }).isRequired,
  classes: _propTypes.default.object.isRequired,
  content: _propTypes.default.elementType,
  contentProps: _propTypes.default.shape({
    axis: _propTypes.default.object,
    axisData: _propTypes.default.shape({
      x: _propTypes.default.shape({
        index: _propTypes.default.number,
        value: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired
      }),
      y: _propTypes.default.shape({
        index: _propTypes.default.number,
        value: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired
      })
    }),
    axisValue: _propTypes.default.any,
    classes: _propTypes.default.object,
    dataIndex: _propTypes.default.number,
    series: _propTypes.default.arrayOf(_propTypes.default.object),
    sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
  }),
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;