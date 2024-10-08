import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridSelector, useGridApiEventHandler, useGridApiMethod, gridDataRowIdsSelector } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from './gridDetailPanelToggleColDef';
import { gridDetailPanelExpandedRowIdsSelector, gridDetailPanelExpandedRowsContentCacheSelector, gridDetailPanelExpandedRowsHeightCacheSelector, gridDetailPanelRawHeightCacheSelector } from './gridDetailPanelSelector';
// FIXME: calling `api.updateDimensions()` here triggers a cycle where `updateDimensions` is
// called 3 times when opening/closing a panel.

export const detailPanelStateInitializer = (state, props) => {
  return _extends({}, state, {
    detailPanel: {
      heightCache: {},
      expandedRowIds: props.detailPanelExpandedRowIds ?? props.initialState?.detailPanel?.expandedRowIds ?? []
    }
  });
};
function cacheContentAndHeight(apiRef, getDetailPanelContent, getDetailPanelHeight, previousHeightCache) {
  if (typeof getDetailPanelContent !== 'function') {
    return {};
  }

  // TODO change to lazy approach using a Proxy
  // only call getDetailPanelContent when asked for an id
  const rowIds = gridDataRowIdsSelector(apiRef);
  const contentCache = rowIds.reduce((acc, id) => {
    const params = apiRef.current.getRowParams(id);
    acc[id] = getDetailPanelContent(params);
    return acc;
  }, {});
  const heightCache = rowIds.reduce((acc, id) => {
    if (contentCache[id] == null) {
      return acc;
    }
    const params = apiRef.current.getRowParams(id);
    const height = getDetailPanelHeight(params);
    const autoHeight = height === 'auto';
    acc[id] = {
      autoHeight,
      height: autoHeight ? previousHeightCache[id]?.height : height
    };
    return acc;
  }, {});
  return {
    contentCache,
    heightCache
  };
}
export const useGridDetailPanel = (apiRef, props) => {
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const handleCellClick = React.useCallback((params, event) => {
    if (params.field !== GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
      return;
    }
    const content = contentCache[params.id];
    if (! /*#__PURE__*/React.isValidElement(content)) {
      return;
    }

    // Ignore if the user didn't click specifically in the "i" button
    if (event.target === event.currentTarget) {
      return;
    }
    apiRef.current.toggleDetailPanel(params.id);
  }, [apiRef, contentCache, props.getDetailPanelContent]);
  const handleCellKeyDown = React.useCallback((params, event) => {
    if (props.getDetailPanelContent == null) {
      return;
    }
    if (params.field === GRID_DETAIL_PANEL_TOGGLE_FIELD && event.key === ' ') {
      apiRef.current.toggleDetailPanel(params.id);
    }
  }, [apiRef, props.getDetailPanelContent]);
  useGridApiEventHandler(apiRef, 'cellClick', handleCellClick);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
  apiRef.current.registerControlState({
    stateId: 'detailPanels',
    propModel: props.detailPanelExpandedRowIds,
    propOnChange: props.onDetailPanelExpandedRowIdsChange,
    stateSelector: gridDetailPanelExpandedRowIdsSelector,
    changeEvent: 'detailPanelsExpandedRowIdsChange'
  });
  const toggleDetailPanel = React.useCallback(id => {
    if (props.getDetailPanelContent == null) {
      return;
    }
    const content = contentCache[id];
    if (! /*#__PURE__*/React.isValidElement(content)) {
      return;
    }
    const ids = apiRef.current.getExpandedDetailPanels();
    apiRef.current.setExpandedDetailPanels(ids.includes(id) ? ids.filter(rowId => rowId !== id) : [...ids, id]);
  }, [apiRef, contentCache, props.getDetailPanelContent]);
  const getExpandedDetailPanels = React.useCallback(() => gridDetailPanelExpandedRowIdsSelector(apiRef.current.state), [apiRef]);
  const setExpandedDetailPanels = React.useCallback(ids => {
    apiRef.current.setState(state => {
      return _extends({}, state, {
        detailPanel: _extends({}, state.detailPanel, {
          expandedRowIds: ids
        })
      });
    });
    apiRef.current.updateDimensions();
    apiRef.current.forceUpdate();
  }, [apiRef]);
  const storeDetailPanelHeight = React.useCallback((id, height) => {
    const heightCache = gridDetailPanelRawHeightCacheSelector(apiRef.current.state);
    if (!heightCache[id] || heightCache[id].height === height) {
      return;
    }
    apiRef.current.setState(state => {
      return _extends({}, state, {
        detailPanel: _extends({}, state.detailPanel, {
          heightCache: _extends({}, heightCache, {
            [id]: _extends({}, heightCache[id], {
              height
            })
          })
        })
      });
    });
    apiRef.current.updateDimensions();
    apiRef.current.requestPipeProcessorsApplication('rowHeight');
  }, [apiRef]);
  const detailPanelHasAutoHeight = React.useCallback(id => {
    const heightCache = gridDetailPanelRawHeightCacheSelector(apiRef.current.state);
    return heightCache[id] ? heightCache[id].autoHeight : false;
  }, [apiRef]);
  const detailPanelPubicApi = {
    toggleDetailPanel,
    getExpandedDetailPanels,
    setExpandedDetailPanels
  };
  const detailPanelPrivateApi = {
    storeDetailPanelHeight,
    detailPanelHasAutoHeight
  };
  useGridApiMethod(apiRef, detailPanelPubicApi, 'public');
  useGridApiMethod(apiRef, detailPanelPrivateApi, 'private');
  React.useEffect(() => {
    if (props.detailPanelExpandedRowIds) {
      const currentModel = gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);
      if (currentModel !== props.detailPanelExpandedRowIds) {
        apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
      }
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);
  const updateCachesAndForceUpdate = React.useCallback(() => {
    apiRef.current.setState(state => {
      return _extends({}, state, {
        detailPanel: _extends({}, state.detailPanel, cacheContentAndHeight(apiRef, props.getDetailPanelContent, props.getDetailPanelHeight, state.detailPanel.heightCache))
      });
    });
    apiRef.current.updateDimensions?.();
    apiRef.current.forceUpdate();
  }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);
  useGridApiEventHandler(apiRef, 'sortedRowsSet', updateCachesAndForceUpdate);
  const previousGetDetailPanelContentProp = React.useRef();
  const previousGetDetailPanelHeightProp = React.useRef();
  const updateCachesIfNeeded = React.useCallback(() => {
    if (props.getDetailPanelContent === previousGetDetailPanelContentProp.current && props.getDetailPanelHeight === previousGetDetailPanelHeightProp.current) {
      return;
    }
    apiRef.current.setState(state => {
      return _extends({}, state, {
        detailPanel: _extends({}, state.detailPanel, cacheContentAndHeight(apiRef, props.getDetailPanelContent, props.getDetailPanelHeight, state.detailPanel.heightCache))
      });
    });
    apiRef.current.updateDimensions?.();
    previousGetDetailPanelContentProp.current = props.getDetailPanelContent;
    previousGetDetailPanelHeightProp.current = props.getDetailPanelHeight;
  }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);
  const addDetailHeight = React.useCallback((initialValue, row) => {
    if (!expandedRowIds || expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
      initialValue.detail = 0;
      return initialValue;
    }
    updateCachesIfNeeded();
    const heightCache = gridDetailPanelExpandedRowsHeightCacheSelector(apiRef);
    initialValue.detail = heightCache[row.id] ?? 0; // Fallback to zero because the cache might not be ready yet (for example page was changed)
    return initialValue;
  }, [apiRef, expandedRowIds, updateCachesIfNeeded]);
  useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight);
  const isFirstRender = React.useRef(true);
  if (isFirstRender.current) {
    isFirstRender.current = false;
    updateCachesIfNeeded();
  }
};