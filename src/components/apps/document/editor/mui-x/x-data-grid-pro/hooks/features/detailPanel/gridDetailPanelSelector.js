"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridDetailPanelRawHeightCacheSelector = exports.gridDetailPanelExpandedRowsHeightCacheSelector = exports.gridDetailPanelExpandedRowsContentCacheSelector = exports.gridDetailPanelExpandedRowIdsSelector = void 0;
var _internals = require("@mui/x-data-grid/internals");
const gridDetailPanelExpandedRowIdsSelector = state => state.detailPanel.expandedRowIds;
exports.gridDetailPanelExpandedRowIdsSelector = gridDetailPanelExpandedRowIdsSelector;
const gridDetailPanelExpandedRowsContentCacheSelector = state => state.detailPanel.contentCache;
exports.gridDetailPanelExpandedRowsContentCacheSelector = gridDetailPanelExpandedRowsContentCacheSelector;
const gridDetailPanelRawHeightCacheSelector = state => state.detailPanel.heightCache;

// TODO v6: Make this selector return the full object, including the autoHeight flag
exports.gridDetailPanelRawHeightCacheSelector = gridDetailPanelRawHeightCacheSelector;
const gridDetailPanelExpandedRowsHeightCacheSelector = exports.gridDetailPanelExpandedRowsHeightCacheSelector = (0, _internals.createSelectorMemoized)(gridDetailPanelRawHeightCacheSelector, heightCache => Object.entries(heightCache).reduce((acc, [id, {
  height
}]) => {
  acc[id] = height || 0;
  return acc;
}, {}));