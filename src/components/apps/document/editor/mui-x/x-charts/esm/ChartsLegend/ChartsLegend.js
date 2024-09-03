import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { getSeriesToDisplay } from './utils';
import { SeriesContext } from '../context/SeriesContextProvider';
import { getLegendUtilityClass } from './chartsLegendClasses';
import { DefaultChartsLegend } from './DefaultChartsLegend';
import { useDrawingArea } from '../hooks';
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    direction
  } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series']
  };
  return composeClasses(slots, getLegendUtilityClass, classes);
};
const defaultProps = {
  position: {
    horizontal: 'middle',
    vertical: 'top'
  },
  direction: 'row'
};
function ChartsLegend(inProps) {
  const props = useThemeProps({
    props: _extends({}, defaultProps, inProps),
    name: 'MuiChartsLegend'
  });
  const {
    position,
    direction,
    hidden,
    slots,
    slotProps
  } = props;
  const theme = useTheme();
  const classes = useUtilityClasses(_extends({}, props, {
    theme
  }));
  const drawingArea = useDrawingArea();
  const series = React.useContext(SeriesContext);
  const seriesToDisplay = getSeriesToDisplay(series);
  const ChartLegendRender = slots?.legend ?? DefaultChartsLegend;
  const chartLegendRenderProps = useSlotProps({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: {
      position,
      direction,
      classes,
      drawingArea,
      series,
      hidden,
      seriesToDisplay
    },
    ownerState: {}
  });
  return /*#__PURE__*/_jsx(ChartLegendRender, _extends({}, chartLegendRenderProps));
}
process.env.NODE_ENV !== "production" ? ChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired
  }),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object
} : void 0;
export { ChartsLegend };