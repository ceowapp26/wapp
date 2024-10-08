import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import { getRowIdFromRowModel } from '@mui/x-data-grid/internals';
function createPinnedRowsInternalCache(pinnedRows, getRowId) {
  const cache = {
    topIds: [],
    bottomIds: [],
    idLookup: {}
  };
  pinnedRows?.top?.forEach(rowModel => {
    const id = getRowIdFromRowModel(rowModel, getRowId);
    cache.topIds.push(id);
    cache.idLookup[id] = rowModel;
  });
  pinnedRows?.bottom?.forEach(rowModel => {
    const id = getRowIdFromRowModel(rowModel, getRowId);
    cache.bottomIds.push(id);
    cache.idLookup[id] = rowModel;
  });
  return cache;
}
export const rowPinningStateInitializer = (state, props, apiRef) => {
  apiRef.current.caches.pinnedRows = createPinnedRowsInternalCache(props.pinnedRows, props.getRowId);
  return _extends({}, state, {
    rows: _extends({}, state.rows, {
      additionalRowGroups: _extends({}, state.rows?.additionalRowGroups, {
        pinnedRows: {
          top: [],
          bottom: []
        }
      })
    })
  });
};
export const useGridRowPinning = (apiRef, props) => {
  const setPinnedRows = React.useCallback(newPinnedRows => {
    apiRef.current.caches.pinnedRows = createPinnedRowsInternalCache(newPinnedRows, props.getRowId);
    apiRef.current.requestPipeProcessorsApplication('hydrateRows');
  }, [apiRef, props.getRowId]);
  useGridApiMethod(apiRef, {
    unstable_setPinnedRows: setPinnedRows
  }, 'public');
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    apiRef.current.unstable_setPinnedRows(props.pinnedRows);
  }, [apiRef, props.pinnedRows]);
};