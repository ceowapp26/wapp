import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { getValueToPositionMapper } from '../hooks/useScale';
import { getIsFaded, getIsHighlighted, useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function Scatter(props) {
  const {
    series,
    xScale,
    yScale,
    color,
    colorGetter,
    markerSize,
    onItemClick
  } = props;
  const highlightScope = React.useMemo(() => _extends({
    highlighted: 'item',
    faded: 'global'
  }, series.highlightScope), [series.highlightScope]);
  const {
    item,
    useVoronoiInteraction
  } = React.useContext(InteractionContext);
  const skipInteractionHandlers = useVoronoiInteraction || series.disableHover;
  const getInteractionItemProps = useInteractionItemProps(highlightScope, skipInteractionHandlers);
  const cleanData = React.useMemo(() => {
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);
    const xRange = xScale.range();
    const yRange = yScale.range();
    const minXRange = Math.min(...xRange);
    const maxXRange = Math.max(...xRange);
    const minYRange = Math.min(...yRange);
    const maxYRange = Math.max(...yRange);
    const temp = [];
    for (let i = 0; i < series.data.length; i += 1) {
      const scatterPoint = series.data[i];
      const x = getXPosition(scatterPoint.x);
      const y = getYPosition(scatterPoint.y);
      const isInRange = x >= minXRange && x <= maxXRange && y >= minYRange && y <= maxYRange;
      const pointCtx = {
        type: 'scatter',
        seriesId: series.id,
        dataIndex: i
      };
      if (isInRange) {
        const isHighlighted = getIsHighlighted(item, pointCtx, highlightScope);
        temp.push({
          x,
          y,
          isHighlighted,
          isFaded: !isHighlighted && getIsFaded(item, pointCtx, highlightScope),
          interactionProps: getInteractionItemProps(pointCtx),
          id: scatterPoint.id,
          dataIndex: i,
          color: colorGetter ? colorGetter(i) : color
        });
      }
    }
    return temp;
  }, [xScale, yScale, series.data, series.id, item, highlightScope, getInteractionItemProps, color, colorGetter]);
  return /*#__PURE__*/_jsx("g", {
    children: cleanData.map(dataPoint => /*#__PURE__*/_jsx("circle", _extends({
      cx: 0,
      cy: 0,
      r: (dataPoint.isHighlighted ? 1.2 : 1) * markerSize,
      transform: `translate(${dataPoint.x}, ${dataPoint.y})`,
      fill: dataPoint.color,
      opacity: dataPoint.isFaded && 0.3 || 1,
      onClick: onItemClick && (event => onItemClick(event, {
        type: 'scatter',
        seriesId: series.id,
        dataIndex: dataPoint.dataIndex
      })),
      cursor: onItemClick ? 'pointer' : 'unset'
    }, dataPoint.interactionProps), dataPoint.id))
  });
}
process.env.NODE_ENV !== "production" ? Scatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  colorGetter: PropTypes.func,
  markerSize: PropTypes.number.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
} : void 0;
export { Scatter };