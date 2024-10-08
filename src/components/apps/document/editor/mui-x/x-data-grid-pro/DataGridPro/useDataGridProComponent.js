"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataGridProComponent = void 0;
var _internals = require("@mui/x-data-grid/internals");
var _useGridInfiniteLoader = require("../hooks/features/infiniteLoader/useGridInfiniteLoader");
var _useGridColumnReorder = require("../hooks/features/columnReorder/useGridColumnReorder");
var _useGridTreeData = require("../hooks/features/treeData/useGridTreeData");
var _useGridTreeDataPreProcessors = require("../hooks/features/treeData/useGridTreeDataPreProcessors");
var _useGridColumnPinning = require("../hooks/features/columnPinning/useGridColumnPinning");
var _useGridColumnPinningPreProcessors = require("../hooks/features/columnPinning/useGridColumnPinningPreProcessors");
var _useGridDetailPanel = require("../hooks/features/detailPanel/useGridDetailPanel");
var _useGridDetailPanelPreProcessors = require("../hooks/features/detailPanel/useGridDetailPanelPreProcessors");
var _useGridRowReorder = require("../hooks/features/rowReorder/useGridRowReorder");
var _useGridRowReorderPreProcessors = require("../hooks/features/rowReorder/useGridRowReorderPreProcessors");
var _useGridLazyLoader = require("../hooks/features/lazyLoader/useGridLazyLoader");
var _useGridLazyLoaderPreProcessors = require("../hooks/features/lazyLoader/useGridLazyLoaderPreProcessors");
var _useGridRowPinning = require("../hooks/features/rowPinning/useGridRowPinning");
var _useGridRowPinningPreProcessors = require("../hooks/features/rowPinning/useGridRowPinningPreProcessors");
// Pro-only features

const useDataGridProComponent = (inputApiRef, props) => {
  const apiRef = (0, _internals.useGridInitialization)(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  (0, _internals.useGridRowSelectionPreProcessors)(apiRef, props);
  (0, _useGridRowReorderPreProcessors.useGridRowReorderPreProcessors)(apiRef, props);
  (0, _useGridTreeDataPreProcessors.useGridTreeDataPreProcessors)(apiRef, props);
  (0, _useGridLazyLoaderPreProcessors.useGridLazyLoaderPreProcessors)(apiRef, props);
  (0, _useGridRowPinningPreProcessors.useGridRowPinningPreProcessors)(apiRef);
  (0, _useGridDetailPanelPreProcessors.useGridDetailPanelPreProcessors)(apiRef, props);
  // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.
  (0, _useGridColumnPinningPreProcessors.useGridColumnPinningPreProcessors)(apiRef, props);
  (0, _internals.useGridRowsPreProcessors)(apiRef);

  /**
   * Register all state initializers here.
   */
  (0, _internals.useGridInitializeState)(_internals.dimensionsStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.headerFilteringStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.rowSelectionStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridDetailPanel.detailPanelStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridColumnPinning.columnPinningStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.columnsStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridRowPinning.rowPinningStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.rowsStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.editingStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.focusStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.sortingStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.preferencePanelStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.filterStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.densityStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_useGridColumnReorder.columnReorderStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.columnResizeStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.paginationStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.rowsMetaStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.columnMenuStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.columnGroupsStateInitializer, apiRef, props);
  (0, _internals.useGridInitializeState)(_internals.virtualizationStateInitializer, apiRef, props);
  (0, _internals.useGridHeaderFiltering)(apiRef, props);
  (0, _useGridTreeData.useGridTreeData)(apiRef);
  (0, _internals.useGridKeyboardNavigation)(apiRef, props);
  (0, _internals.useGridRowSelection)(apiRef, props);
  (0, _useGridColumnPinning.useGridColumnPinning)(apiRef, props);
  (0, _useGridRowPinning.useGridRowPinning)(apiRef, props);
  (0, _internals.useGridColumns)(apiRef, props);
  (0, _internals.useGridRows)(apiRef, props);
  (0, _internals.useGridParamsApi)(apiRef);
  (0, _useGridDetailPanel.useGridDetailPanel)(apiRef, props);
  (0, _internals.useGridColumnSpanning)(apiRef);
  (0, _internals.useGridColumnGrouping)(apiRef, props);
  (0, _internals.useGridEditing)(apiRef, props);
  (0, _internals.useGridFocus)(apiRef, props);
  (0, _internals.useGridPreferencesPanel)(apiRef, props);
  (0, _internals.useGridFilter)(apiRef, props);
  (0, _internals.useGridSorting)(apiRef, props);
  (0, _internals.useGridDensity)(apiRef, props);
  (0, _useGridColumnReorder.useGridColumnReorder)(apiRef, props);
  (0, _internals.useGridColumnResize)(apiRef, props);
  (0, _internals.useGridPagination)(apiRef, props);
  (0, _internals.useGridRowsMeta)(apiRef, props);
  (0, _useGridRowReorder.useGridRowReorder)(apiRef, props);
  (0, _internals.useGridScroll)(apiRef, props);
  (0, _useGridInfiniteLoader.useGridInfiniteLoader)(apiRef, props);
  (0, _useGridLazyLoader.useGridLazyLoader)(apiRef, props);
  (0, _internals.useGridColumnMenu)(apiRef);
  (0, _internals.useGridCsvExport)(apiRef, props);
  (0, _internals.useGridPrintExport)(apiRef, props);
  (0, _internals.useGridClipboard)(apiRef, props);
  (0, _internals.useGridDimensions)(apiRef, props);
  (0, _internals.useGridEvents)(apiRef, props);
  (0, _internals.useGridStatePersistence)(apiRef);
  (0, _internals.useGridVirtualization)(apiRef, props);
  return apiRef;
};
exports.useDataGridProComponent = useDataGridProComponent;