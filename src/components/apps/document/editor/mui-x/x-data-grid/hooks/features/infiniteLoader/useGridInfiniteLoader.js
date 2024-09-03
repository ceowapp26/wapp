import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import { useGridSelector } from '../../utils/useGridSelector';
import * as _useEventCallback from "@mui/utils/useEventCallback";
import { system } from "@mui/system";
import { styled } from '@mui/material/styles';
import { jsxs as _jsxs } from "react/jsx-runtime";
import { gridVisibleColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { gridDimensionsSelector } from '../dimensions/gridDimensionsSelectors';

const InfiniteLoadingTriggerElement = styled('div')({
  position: 'sticky',
  left: 0,
  width: 0,
  height: 0
});

/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export const useGridInfiniteLoader = (apiRef, props) => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const currentPage = useGridVisibleRows(apiRef, props);
  const observer = React.useRef();
  const triggerElement = React.useRef(null);
  const isEnabled = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;
  const handleLoadMoreRows = _useEventCallback.default(([entry]) => {
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;
    if (isIntersecting && currentRatio === 1) {
      const viewportPageSize = apiRef.current.getViewportPageSize();
      const rowScrollEndParams = {
        visibleColumns,
        viewportPageSize,
        visibleRowsCount: currentPage.rows.length
      };
      apiRef.current.publishEvent('rowsScrollEnd', rowScrollEndParams);
      observer.current?.disconnect();
      // do not observe this node anymore
      triggerElement.current = null;
    }
  });
  const virtualScroller = apiRef.current.virtualScrollerRef.current;
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const marginBottom = props.scrollEndThreshold - (dimensions.hasScrollX ? dimensions.scrollbarSize : 0);
  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }
    if (!virtualScroller) {
      return;
    }
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(handleLoadMoreRows, {
      threshold: 1,
      root: virtualScroller,
      rootMargin: `0px 0px ${marginBottom}px 0px`
    });
    if (triggerElement.current) {
      observer.current.observe(triggerElement.current);
    }
  }, [virtualScroller, handleLoadMoreRows, isEnabled, marginBottom]);
  const triggerRef = React.useCallback(node => {
    // Prevent the infite loading working in combination with lazy loading
    if (!isEnabled) {
      return;
    }
    if (triggerElement.current !== node) {
      observer.current?.disconnect();
      triggerElement.current = node;
      if (triggerElement.current) {
        observer.current?.observe(triggerElement.current);
      }
    }
  }, [isEnabled]);
  const getInfiniteLoadingTriggerElement = React.useCallback(({
    lastRowId
  }) => {
    if (!isEnabled) {
      return null;
    }
    return /*#__PURE__*/_jsxs(InfiniteLoadingTriggerElement, {
      ref: triggerRef
      // Force rerender on last row change to start observing the new trigger
      ,

      role: "presentation"
    }, `trigger-${lastRowId}`);
  }, [isEnabled, triggerRef]);
  const infiniteLoaderPrivateApi = {
    getInfiniteLoadingTriggerElement
  };
  useGridApiMethod(apiRef, infiniteLoaderPrivateApi, 'private');
  useGridApiOptionHandler(apiRef, 'rowsScrollEnd', props.onRowsScrollEnd);
};
