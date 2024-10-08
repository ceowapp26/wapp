"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLegendRoot = void 0;
exports.DefaultChartsLegend = DefaultChartsLegend;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _NoSsr = require("@mui/base/NoSsr");
var _styles = require("@mui/material/styles");
var _ChartsText = require("../ChartsText");
var _getWordsByLines = require("../internals/getWordsByLines");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["rotate", "dominantBaseline"],
  _excluded2 = ["label"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ChartsLegendRoot = exports.ChartsLegendRoot = (0, _styles.styled)('g', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});
/**
 * Transforms number or partial padding object to a defaultized padding object.
 */
const getStandardizedPadding = padding => {
  if (typeof padding === 'number') {
    return {
      left: padding,
      right: padding,
      top: padding,
      bottom: padding
    };
  }
  return (0, _extends2.default)({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, padding);
};
function DefaultChartsLegend(props) {
  const {
    hidden,
    position,
    direction,
    seriesToDisplay,
    drawingArea,
    classes,
    itemMarkWidth = 20,
    itemMarkHeight = 20,
    markGap = 5,
    itemGap = 10,
    padding: paddingProps = 10,
    labelStyle: inLabelStyle
  } = props;
  const theme = (0, _styles.useTheme)();
  const isRTL = theme.direction === 'rtl';
  const labelStyle = React.useMemo(() => (0, _extends2.default)({}, theme.typography.subtitle1, {
    color: 'inherit',
    dominantBaseline: 'central',
    textAnchor: 'start',
    fill: (theme.vars || theme).palette.text.primary,
    lineHeight: 1
  }, inLabelStyle),
  // To say to TS that the dominantBaseline and textAnchor are correct
  [inLabelStyle, theme]);
  const padding = React.useMemo(() => getStandardizedPadding(paddingProps), [paddingProps]);
  const getItemSpace = React.useCallback((label, inStyle = {}) => {
    const style = (0, _objectWithoutPropertiesLoose2.default)(inStyle, _excluded);
    const linesSize = (0, _getWordsByLines.getWordsByLines)({
      style,
      needsComputation: true,
      text: label
    });
    const innerSize = {
      innerWidth: itemMarkWidth + markGap + Math.max(...linesSize.map(size => size.width)),
      innerHeight: Math.max(itemMarkHeight, linesSize.length * linesSize[0].height)
    };
    return (0, _extends2.default)({}, innerSize, {
      outerWidth: innerSize.innerWidth + itemGap,
      outerHeight: innerSize.innerHeight + itemGap
    });
  }, [itemGap, itemMarkHeight, itemMarkWidth, markGap]);
  const totalWidth = drawingArea.left + drawingArea.width + drawingArea.right;
  const totalHeight = drawingArea.top + drawingArea.height + drawingArea.bottom;
  const availableWidth = totalWidth - padding.left - padding.right;
  const availableHeight = totalHeight - padding.top - padding.bottom;
  const [seriesWithPosition, legendWidth, legendHeight] = React.useMemo(() => {
    // Start at 0, 0. Will be modified later by padding and position.
    let x = 0;
    let y = 0;

    // total values used to align legend later.
    let totalWidthUsed = 0;
    let totalHeightUsed = 0;
    let rowIndex = 0;
    const rowMaxHeight = [0];
    const seriesWithRawPosition = seriesToDisplay.map(_ref => {
      let {
          label
        } = _ref,
        other = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded2);
      const itemSpace = getItemSpace(label, labelStyle);
      const rep = (0, _extends2.default)({}, other, {
        label,
        positionX: x,
        positionY: y,
        innerHeight: itemSpace.innerHeight,
        innerWidth: itemSpace.innerWidth,
        outerHeight: itemSpace.outerHeight,
        outerWidth: itemSpace.outerWidth,
        rowIndex
      });
      if (direction === 'row') {
        if (x + itemSpace.innerWidth > availableWidth) {
          // This legend item would create overflow along the x-axis, so we start a new row.
          x = 0;
          y += rowMaxHeight[rowIndex];
          rowIndex += 1;
          if (rowMaxHeight.length <= rowIndex) {
            rowMaxHeight.push(0);
          }
          rep.positionX = x;
          rep.positionY = y;
          rep.rowIndex = rowIndex;
        }
        totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.outerWidth);
        totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.outerHeight);
        rowMaxHeight[rowIndex] = Math.max(rowMaxHeight[rowIndex], itemSpace.outerHeight);
        x += itemSpace.outerWidth;
      }
      if (direction === 'column') {
        if (y + itemSpace.innerHeight > availableHeight) {
          // This legend item would create overflow along the y-axis, so we start a new column.
          x = totalWidthUsed + itemGap;
          y = 0;
          rowIndex = 0;
          rep.positionX = x;
          rep.positionY = y;
          rep.rowIndex = rowIndex;
        }
        if (rowMaxHeight.length <= rowIndex) {
          rowMaxHeight.push(0);
        }
        totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.outerWidth);
        totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.outerHeight);
        rowIndex += 1;
        y += itemSpace.outerHeight;
      }
      return rep;
    });
    return [seriesWithRawPosition.map(item => (0, _extends2.default)({}, item, {
      positionY: item.positionY + (direction === 'row' ? rowMaxHeight[item.rowIndex] / 2 // Get the center of the entire row
      : item.outerHeight / 2) // Get the center of the item
    })), totalWidthUsed, totalHeightUsed];
  }, [seriesToDisplay, getItemSpace, labelStyle, direction, availableWidth, availableHeight, itemGap]);
  const gapX = React.useMemo(() => {
    switch (position.horizontal) {
      case 'left':
        return padding.left;
      case 'right':
        return totalWidth - padding.right - legendWidth;
      default:
        return (totalWidth - legendWidth) / 2;
    }
  }, [position.horizontal, padding.left, padding.right, totalWidth, legendWidth]);
  const gapY = React.useMemo(() => {
    switch (position.vertical) {
      case 'top':
        return padding.top;
      case 'bottom':
        return totalHeight - padding.bottom - legendHeight;
      default:
        return (totalHeight - legendHeight) / 2;
    }
  }, [position.vertical, padding.top, padding.bottom, totalHeight, legendHeight]);
  if (hidden) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_NoSsr.NoSsr, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsLegendRoot, {
      className: classes.root,
      children: seriesWithPosition.map(({
        id,
        label,
        color,
        positionX,
        positionY
      }) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", {
        className: classes.series,
        transform: `translate(${gapX + (isRTL ? legendWidth - positionX : positionX)} ${gapY + positionY})`,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
          className: classes.mark,
          x: isRTL ? -itemMarkWidth : 0,
          y: -itemMarkHeight / 2,
          width: itemMarkWidth,
          height: itemMarkHeight,
          fill: color
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsText.ChartsText, {
          style: labelStyle,
          text: label,
          x: (isRTL ? -1 : 1) * (itemMarkWidth + markGap),
          y: 0
        })]
      }, id))
    })
  });
}
process.env.NODE_ENV !== "production" ? DefaultChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object.isRequired,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: _propTypes.default.oneOf(['column', 'row']).isRequired,
  drawingArea: _propTypes.default.shape({
    bottom: _propTypes.default.number.isRequired,
    height: _propTypes.default.number.isRequired,
    left: _propTypes.default.number.isRequired,
    right: _propTypes.default.number.isRequired,
    top: _propTypes.default.number.isRequired,
    width: _propTypes.default.number.isRequired
  }).isRequired,
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: _propTypes.default.bool,
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap: _propTypes.default.number,
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight: _propTypes.default.number,
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth: _propTypes.default.number,
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: _propTypes.default.object,
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap: _propTypes.default.number,
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  })]),
  /**
   * The position of the legend.
   */
  position: _propTypes.default.shape({
    horizontal: _propTypes.default.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: _propTypes.default.oneOf(['bottom', 'middle', 'top']).isRequired
  }).isRequired,
  series: _propTypes.default.object.isRequired,
  seriesToDisplay: _propTypes.default.arrayOf(_propTypes.default.shape({
    color: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
    label: _propTypes.default.string.isRequired
  })).isRequired
} : void 0;