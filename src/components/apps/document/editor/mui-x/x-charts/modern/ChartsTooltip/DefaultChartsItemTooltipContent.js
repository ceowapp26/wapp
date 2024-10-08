import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChartsTooltipTable, ChartsTooltipCell, ChartsTooltipMark, ChartsTooltipPaper, ChartsTooltipRow } from './ChartsTooltipTable';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function DefaultChartsItemTooltipContent(props) {
  const {
    series,
    itemData,
    sx,
    classes,
    getColor
  } = props;
  if (itemData.dataIndex === undefined || !series.data[itemData.dataIndex]) {
    return null;
  }
  const {
    displayedLabel,
    color
  } = series.type === 'pie' ? {
    color: getColor(itemData.dataIndex),
    displayedLabel: series.data[itemData.dataIndex].label
  } : {
    color: getColor(itemData.dataIndex) ?? series.color,
    displayedLabel: series.label
  };
  const value = series.data[itemData.dataIndex];
  const formattedValue = series.valueFormatter?.(value, {
    dataIndex: itemData.dataIndex
  });
  return /*#__PURE__*/_jsx(ChartsTooltipPaper, {
    sx: sx,
    className: classes.root,
    children: /*#__PURE__*/_jsx(ChartsTooltipTable, {
      className: classes.table,
      children: /*#__PURE__*/_jsx("tbody", {
        children: /*#__PURE__*/_jsxs(ChartsTooltipRow, {
          className: classes.row,
          children: [/*#__PURE__*/_jsx(ChartsTooltipCell, {
            className: clsx(classes.markCell, classes.cell),
            children: /*#__PURE__*/_jsx(ChartsTooltipMark, {
              color: color,
              className: classes.mark
            })
          }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
            className: clsx(classes.labelCell, classes.cell),
            children: displayedLabel
          }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
            className: clsx(classes.valueCell, classes.cell),
            children: formattedValue
          })]
        })
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? DefaultChartsItemTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Get the color of the item with index `dataIndex`.
   * @param {number} dataIndex The data index of the item.
   * @returns {string} The color to display.
   */
  getColor: PropTypes.func.isRequired,
  /**
   * The data used to identify the triggered item.
   */
  itemData: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired
  }).isRequired,
  /**
   * The series linked to the triggered axis.
   */
  series: PropTypes.object.isRequired,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { DefaultChartsItemTooltipContent };