"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsVoronoiHandler = ChartsVoronoiHandler;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _d3Delaunay = require("d3-delaunay");
var _useEnhancedEffect = _interopRequireDefault(require("@mui/utils/useEnhancedEffect"));
var _InteractionProvider = require("../context/InteractionProvider");
var _CartesianContextProvider = require("../context/CartesianContextProvider");
var _SeriesContextProvider = require("../context/SeriesContextProvider");
var _useScale = require("../hooks/useScale");
var _utils = require("../internals/utils");
var _hooks = require("../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ChartsVoronoiHandler(props) {
  const {
    voronoiMaxRadius,
    onItemClick
  } = props;
  const svgRef = (0, _hooks.useSvgRef)();
  const {
    left,
    top,
    width,
    height
  } = (0, _hooks.useDrawingArea)();
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = React.useContext(_CartesianContextProvider.CartesianContext);
  const {
    dispatch
  } = React.useContext(_InteractionProvider.InteractionContext);
  const {
    series,
    seriesOrder
  } = React.useContext(_SeriesContextProvider.SeriesContext).scatter ?? {};
  const voronoiRef = React.useRef({});
  const delauneyRef = React.useRef(undefined);
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  (0, _useEnhancedEffect.default)(() => {
    dispatch({
      type: 'updateVoronoiUsage',
      useVoronoiInteraction: true
    });
    return () => {
      dispatch({
        type: 'updateVoronoiUsage',
        useVoronoiInteraction: false
      });
    };
  }, [dispatch]);
  (0, _useEnhancedEffect.default)(() => {
    // This effect generate and store the Delaunay object that's used to map coordinate to closest point.

    if (seriesOrder === undefined || series === undefined) {
      // If there is no scatter chart series
      return;
    }
    voronoiRef.current = {};
    let points = [];
    seriesOrder.forEach(seriesId => {
      const {
        data,
        xAxisKey,
        yAxisKey
      } = series[seriesId];
      const xScale = xAxis[xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisKey ?? defaultYAxisId].scale;
      const getXPosition = (0, _useScale.getValueToPositionMapper)(xScale);
      const getYPosition = (0, _useScale.getValueToPositionMapper)(yScale);
      const seriesPoints = data.flatMap(({
        x,
        y
      }) => [getXPosition(x), getYPosition(y)]);
      voronoiRef.current[seriesId] = {
        seriesId,
        startIndex: points.length,
        endIndex: points.length + seriesPoints.length
      };
      points = points.concat(seriesPoints);
    });
    delauneyRef.current = new _d3Delaunay.Delaunay(points);
  }, [defaultXAxisId, defaultYAxisId, series, seriesOrder, xAxis, yAxis]);
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return undefined;
    }

    // TODO: A perf optimisation of voronoi could be to use the last point as the initial point for the next search.
    function getClosestPoint(event) {
      // Get mouse coordinate in global SVG space
      const svgPoint = (0, _utils.getSVGPoint)(svgRef.current, event);
      const outsideX = svgPoint.x < left || svgPoint.x > left + width;
      const outsideY = svgPoint.y < top || svgPoint.y > top + height;
      if (outsideX || outsideY) {
        return 'outside-chart';
      }
      if (!delauneyRef.current) {
        return 'no-point-found';
      }
      const closestPointIndex = delauneyRef.current.find(svgPoint.x, svgPoint.y);
      if (closestPointIndex === undefined) {
        return 'no-point-found';
      }
      const closestSeries = Object.values(voronoiRef.current).find(value => {
        return 2 * closestPointIndex >= value.startIndex && 2 * closestPointIndex < value.endIndex;
      });
      if (closestSeries === undefined) {
        return 'no-point-found';
      }
      const dataIndex = (2 * closestPointIndex - voronoiRef.current[closestSeries.seriesId].startIndex) / 2;
      if (voronoiMaxRadius !== undefined) {
        const pointX = delauneyRef.current.points[2 * closestPointIndex];
        const pointY = delauneyRef.current.points[2 * closestPointIndex + 1];
        const dist2 = (pointX - svgPoint.x) ** 2 + (pointY - svgPoint.y) ** 2;
        if (dist2 > voronoiMaxRadius ** 2) {
          // The closest point is too far to be considered.
          return 'outside-voronoi-max-radius';
        }
      }
      return {
        seriesId: closestSeries.seriesId,
        dataIndex
      };
    }
    const handleMouseOut = () => {
      dispatch({
        type: 'exitChart'
      });
    };
    const handleMouseMove = event => {
      const closestPoint = getClosestPoint(event);
      if (closestPoint === 'outside-chart') {
        dispatch({
          type: 'exitChart'
        });
        return;
      }
      if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
        dispatch({
          type: 'leaveItem',
          data: {
            type: 'scatter'
          }
        });
        return;
      }
      const {
        seriesId,
        dataIndex
      } = closestPoint;
      dispatch({
        type: 'enterItem',
        data: {
          type: 'scatter',
          seriesId,
          dataIndex
        }
      });
    };
    const handleMouseClick = event => {
      if (!onItemClick) {
        return;
      }
      const closestPoint = getClosestPoint(event);
      if (typeof closestPoint === 'string') {
        // No point fond for any reason
        return;
      }
      const {
        seriesId,
        dataIndex
      } = closestPoint;
      onItemClick(event, {
        type: 'scatter',
        seriesId,
        dataIndex
      });
    };
    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleMouseClick);
    };
  }, [svgRef, dispatch, left, width, top, height, yAxis, xAxis, voronoiMaxRadius, onItemClick]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {});
}
process.env.NODE_ENV !== "production" ? ChartsVoronoiHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick: _propTypes.default.func,
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius: _propTypes.default.number
} : void 0;