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
import * as _styles from "@mui/material/styles";
import { useResizeObserver } from '../../hooks/utils/useResizeObserver';

const DetailPanel = _styles.styled('div', {
  name: 'MuiDataGrid',
  slot: 'DetailPanel',
  overridesResolver: (props, styles) => styles.detailPanel
})(({
  theme
}) => ({
  width: 'calc(var(--DataGrid-rowWidth) - var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
  backgroundColor: (theme.vars || theme).palette.background.default,
  overflow: 'auto'
}));

export function GridDetailPanel(props) {
  const {
    rowId,
    height,
    className,
    children
  } = props;
  const apiRef = useGridPrivateApiContext();
  const ref = React.useRef(null);
  const rootProps = useGridRootProps();
  const ownerState = rootProps;
  const hasAutoHeight = height === 'auto';
  React.useLayoutEffect(() => {
    if (hasAutoHeight && typeof ResizeObserver === 'undefined') {
      // Fallback for IE
      apiRef.current.storeDetailPanelHeight(rowId, ref.current.clientHeight);
    }
  }, [apiRef, hasAutoHeight, rowId]);
  useResizeObserver(ref, entries => {
    const [entry] = entries;
    const observedHeight = entry.borderBoxSize && entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.contentRect.height;
    apiRef.current.storeDetailPanelHeight(rowId, observedHeight);
  }, hasAutoHeight);
  return /*#__PURE__*/_jsx(DetailPanel, {
    ref: ref,
    ownerState: ownerState,
    role: "presentation",
    style: {
      height
    },
    className: className,
    children: children
  });
}