"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PiePlot = PiePlot;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _SeriesContextProvider = require("../context/SeriesContextProvider");
var _DrawingProvider = require("../context/DrawingProvider");
var _PieArcPlot = require("./PieArcPlot");
var _PieArcLabelPlot = require("./PieArcLabelPlot");
var _utils = require("../internals/utils");
var _getPieCoordinates = require("./getPieCoordinates");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PiePlot API](https://mui.com/x/api/charts/pie-plot/)
 */
function PiePlot(props) {
  const {
    skipAnimation,
    slots,
    slotProps,
    onItemClick
  } = props;
  const seriesData = React.useContext(_SeriesContextProvider.SeriesContext).pie;
  const {
    left,
    top,
    width,
    height
  } = React.useContext(_DrawingProvider.DrawingContext);
  if (seriesData === undefined) {
    return null;
  }
  const {
    series,
    seriesOrder
  } = seriesData;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", {
    children: [seriesOrder.map(seriesId => {
      const {
        innerRadius: innerRadiusParam,
        outerRadius: outerRadiusParam,
        cornerRadius,
        paddingAngle,
        data,
        cx: cxParam,
        cy: cyParam,
        highlighted,
        faded,
        highlightScope
      } = series[seriesId];
      const {
        cx,
        cy,
        availableRadius
      } = (0, _getPieCoordinates.getPieCoordinates)({
        cx: cxParam,
        cy: cyParam
      }, {
        width,
        height
      });
      const outerRadius = (0, _utils.getPercentageValue)(outerRadiusParam ?? availableRadius, availableRadius);
      const innerRadius = (0, _utils.getPercentageValue)(innerRadiusParam ?? 0, availableRadius);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
        transform: `translate(${left + cx}, ${top + cy})`,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_PieArcPlot.PieArcPlot, {
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          cornerRadius: cornerRadius,
          paddingAngle: paddingAngle,
          id: seriesId,
          data: data,
          skipAnimation: skipAnimation,
          highlightScope: highlightScope,
          highlighted: highlighted,
          faded: faded,
          onItemClick: onItemClick,
          slots: slots,
          slotProps: slotProps
        })
      }, seriesId);
    }), seriesOrder.map(seriesId => {
      const {
        innerRadius: innerRadiusParam,
        outerRadius: outerRadiusParam,
        arcLabelRadius: arcLabelRadiusParam,
        cornerRadius,
        paddingAngle,
        arcLabel,
        arcLabelMinAngle,
        data,
        cx: cxParam,
        cy: cyParam,
        highlightScope
      } = series[seriesId];
      const {
        cx,
        cy,
        availableRadius
      } = (0, _getPieCoordinates.getPieCoordinates)({
        cx: cxParam,
        cy: cyParam
      }, {
        width,
        height
      });
      const outerRadius = (0, _utils.getPercentageValue)(outerRadiusParam ?? availableRadius, availableRadius);
      const innerRadius = (0, _utils.getPercentageValue)(innerRadiusParam ?? 0, availableRadius);
      const arcLabelRadius = arcLabelRadiusParam === undefined ? (outerRadius + innerRadius) / 2 : (0, _utils.getPercentageValue)(arcLabelRadiusParam, availableRadius);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
        transform: `translate(${left + cx}, ${top + cy})`,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_PieArcLabelPlot.PieArcLabelPlot, {
          innerRadius: innerRadius,
          outerRadius: outerRadius ?? availableRadius,
          arcLabelRadius: arcLabelRadius,
          cornerRadius: cornerRadius,
          paddingAngle: paddingAngle,
          id: seriesId,
          data: data,
          skipAnimation: skipAnimation,
          arcLabel: arcLabel,
          arcLabelMinAngle: arcLabelMinAngle,
          highlightScope: highlightScope,
          slots: slots,
          slotProps: slotProps
        })
      }, seriesId);
    })]
  });
}
process.env.NODE_ENV !== "production" ? PiePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onItemClick: _propTypes.default.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: _propTypes.default.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object
} : void 0;