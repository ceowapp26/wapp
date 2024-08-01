import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { getDataGridUtilityClass } from '../../constant/gridClasses';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _propTypes from "prop-types";
import * as _utils from "@mui/utils";
import * as _Box from "@mui/material/Box";
import * as _detailPanel from "../../hooks/features/detailPanel";
import * as _GridDetailPanel from "./GridDetailPanel";

const useUtilityClasses = () => {
  const slots = {
    detailPanel: ['detailPanel']
  };
  return _utils.unstable_composeClasses(slots, getDataGridUtilityClass, {});
};

export function GridDetailPanels(props) {
  const rootProps = useGridRootProps();
  if (!rootProps.getDetailPanelContent) {
    return null;
  }
  return /*#__PURE__*/React.createElement(GridDetailPanelsImpl, props);
}

export function GridDetailPanelsImpl({
  virtualScroller
}) {
  const apiRef = useGridPrivateApiContext();
  const classes = useUtilityClasses();
  const {
    setPanels
  } = virtualScroller;
  const expandedRowIds = useGridSelector(apiRef, _detailPanel.gridDetailPanelExpandedRowIdsSelector);
  const detailPanelsContent = useGridSelector(apiRef, _detailPanel.gridDetailPanelExpandedRowsContentCacheSelector);
  const detailPanelsHeights = useGridSelector(apiRef, _detailPanel.gridDetailPanelExpandedRowsHeightCacheSelector);
  const getDetailPanel = React.useCallback(rowId => {
    const content = detailPanelsContent[rowId];

    // Check if the id exists in the current page
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);
    const exists = rowIndex !== undefined;
    if (! /*#__PURE__*/React.isValidElement(content) || !exists) {
      return null;
    }
    const hasAutoHeight = apiRef.current.detailPanelHasAutoHeight(rowId);
    const height = hasAutoHeight ? 'auto' : detailPanelsHeights[rowId];
    return /*#__PURE__*/_jsx(_GridDetailPanel.GridDetailPanel, {
      rowId: rowId,
      height: height,
      className: classes.detailPanel,
      children: content
    }, `panel-${rowId}`);
  }, [apiRef, classes.detailPanel, detailPanelsHeights, detailPanelsContent]);
  React.useEffect(() => {
    if (expandedRowIds.length === 0) {
      setPanels(_internals.EMPTY_DETAIL_PANELS);
    } else {
      setPanels(new Map(expandedRowIds.map(rowId => [rowId, getDetailPanel(rowId)])));
    }
  }, [expandedRowIds, setPanels, getDetailPanel]);
  return null;
}