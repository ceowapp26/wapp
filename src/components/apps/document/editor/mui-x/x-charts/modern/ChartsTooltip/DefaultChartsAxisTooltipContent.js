import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { ChartsTooltipCell, ChartsTooltipPaper, ChartsTooltipTable, ChartsTooltipMark, ChartsTooltipRow } from './ChartsTooltipTable';
import { isCartesianSeries, utcFormatter } from './utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  const axisFormatter = axis.valueFormatter ?? (v => axis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());
  return /*#__PURE__*/_jsx(ChartsTooltipPaper, {
    sx: sx,
    className: classes.root,
    children: /*#__PURE__*/_jsxs(ChartsTooltipTable, {
      className: classes.table,
      children: [axisValue != null && !axis.hideTooltip && /*#__PURE__*/_jsx("thead", {
        children: /*#__PURE__*/_jsx(ChartsTooltipRow, {
          children: /*#__PURE__*/_jsx(ChartsTooltipCell, {
            colSpan: 3,
            children: /*#__PURE__*/_jsx(Typography, {
              children: axisFormatter(axisValue, {
                location: 'tooltip'
              })
            })
          })
        })
      }), /*#__PURE__*/_jsx("tbody", {
        children: series.filter(isCartesianSeries).map(({
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
          return /*#__PURE__*/_jsxs(ChartsTooltipRow, {
            className: classes.row,
            children: [/*#__PURE__*/_jsx(ChartsTooltipCell, {
              className: clsx(classes.markCell, classes.cell),
              children: /*#__PURE__*/_jsx(ChartsTooltipMark, {
                color: getColor(dataIndex) ?? color,
                className: classes.mark
              })
            }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
              className: clsx(classes.labelCell, classes.cell),
              children: label ? /*#__PURE__*/_jsx(Typography, {
                children: label
              }) : null
            }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
              className: clsx(classes.valueCell, classes.cell),
              children: /*#__PURE__*/_jsx(Typography, {
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
  axis: PropTypes.object.isRequired,
  /**
   * Data identifying the triggered axis.
   */
  axisData: PropTypes.shape({
    x: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]).isRequired
    }),
    y: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]).isRequired
    })
  }).isRequired,
  /**
   * The value associated to the current mouse position.
   */
  axisValue: PropTypes.any.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * The index of the data item triggered.
   */
  dataIndex: PropTypes.number,
  /**
   * The series linked to the triggered axis.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { DefaultChartsAxisTooltipContent };