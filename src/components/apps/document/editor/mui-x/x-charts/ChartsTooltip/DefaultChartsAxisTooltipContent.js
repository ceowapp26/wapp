"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultChartsAxisTooltipContent = DefaultChartsAxisTooltipContent;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _ChartsTooltipTable = require("./ChartsTooltipTable");
var _utils = require("./utils");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function DefaultChartsAxisTooltipContent(props) {
  const {
    series,
    axis,
    dataIndex,
    axisValue,
    sx,
    classes
  } = props;
  if (dataIndex == null) {
    return null;
  }
  const axisFormatter = axis.valueFormatter ?? (v => axis.scaleType === 'utc' ? (0, _utils.utcFormatter)(v) : v.toLocaleString());
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipPaper, {
    sx: sx,
    className: classes.root,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipTable, {
      className: classes.table,
      children: [axisValue != null && !axis.hideTooltip && /*#__PURE__*/(0, _jsxRuntime.jsx)("thead", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipRow, {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
            colSpan: 3,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
              children: axisFormatter(axisValue, {
                location: 'tooltip'
              })
            })
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("tbody", {
        children: series.filter(_utils.isCartesianSeries).map(({
          color,
          id,
          label,
          valueFormatter,
          data,
          getColor
        }) => {
          // @ts-ignore
          const formattedValue = valueFormatter(data[dataIndex] ?? null, {
            dataIndex
          });
          if (formattedValue == null) {
            return null;
          }
          return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsTooltipTable.ChartsTooltipRow, {
            className: classes.row,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
              className: (0, _clsx.default)(classes.markCell, classes.cell),
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipMark, {
                color: getColor(dataIndex) ?? color,
                className: classes.mark
              })
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
              className: (0, _clsx.default)(classes.labelCell, classes.cell),
              children: label ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                children: label
              }) : null
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltipTable.ChartsTooltipCell, {
              className: (0, _clsx.default)(classes.valueCell, classes.cell),
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                children: formattedValue
              })
            })]
          }, id);
        })
      })]
    })
  });
}
process.env.NODE_ENV !== "production" ? DefaultChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The properties of the triggered axis.
   */
  axis: _propTypes.default.object.isRequired,
  /**
   * Data identifying the triggered axis.
   */
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
  /**
   * The value associated to the current mouse position.
   */
  axisValue: _propTypes.default.any.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object.isRequired,
  /**
   * The index of the data item triggered.
   */
  dataIndex: _propTypes.default.number,
  /**
   * The series linked to the triggered axis.
   */
  series: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;