"use strict";
import * as React from 'react';
import { gridTabIndexColumnHeaderFilterSelector } from '../focus';
import { gridFilterModelSelector } from '../filter';
import { gridFocusColumnHeaderFilterSelector } from '../focus';
import { useGridSelector } from '../../utils';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import _extends from "@babel/runtime/helpers/esm/extends";
import clsx from 'clsx';
import { styled, useTheme } from '@mui/material/styles';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridColumnHeaderItem } from '../../../components/columnHeaders/GridColumnHeaderItem';
import { gridDimensionsSelector } from '../dimensions/gridDimensionsSelectors';
import { gridRenderContextColumnsSelector, gridVirtualizationColumnEnabledSelector } from '../virtualization/gridVirtualizationSelectors';
import { computeOffsetLeft } from '../virtualization/useGridVirtualScroller';
import { GridColumnGroupHeader } from '../../../components/columnHeaders/GridColumnGroupHeader';
import { GridPinnedColumnPosition } from '../columns/gridColumnsInterfaces';
import { gridColumnPositionsSelector } from '../columns/gridColumnsSelector';
import { gridVisiblePinnedColumnDefinitionsSelector } from '../columns/gridColumnsSelector';
import { GridScrollbarFillerCell as ScrollbarFiller } from '../../../components/GridScrollbarFillerCell';
import { getPinnedCellOffset } from '../../../internals/utils/getPinnedCellOffset';
import { GridColumnHeaderSeparatorSides } from '../../../components/columnHeaders/GridColumnHeaderSeparator';
import { gridClasses, getDataGridUtilityClass } from '../../../constants/gridClasses';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _utils from "@mui/utils";
import { getGridFilter } from '../../../components/panel/filterPanel/GridFilterPanel';

export const GridColumnHeaderRow = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ColumnHeaderRow',
  overridesResolver: (_, styles) => styles.columnHeaderRow
})({
  display: 'flex'
});

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  return React.useMemo(() => {
    const slots = {
      headerFilterRow: ['headerFilterRow']
    };
    return _utils.unstable_composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export const useGridColumnHeaders = props => {
  const {
    visibleColumns,
    sortColumnLookup,
    filterColumnLookup,
    columnHeaderTabIndexState,
    columnGroupHeaderTabIndexState,
    columnHeaderFocus,
    columnGroupHeaderFocus,
    headerGroupingMaxDepth,
    columnMenuState,
    columnVisibility,
    columnGroupsHeaderStructure,
    hasOtherElementInTabSequence,
  } = props;
  const [dragCol, setDragCol] = React.useState('');
  const [resizeCol, setResizeCol] = React.useState('');
  const apiRef = useGridPrivateApiContext();
  const theme = useTheme();
  const rootProps = useGridRootProps();
  const hasVirtualization = useGridSelector(apiRef, gridVirtualizationColumnEnabledSelector);
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const renderContext = useGridSelector(apiRef, gridRenderContextColumnsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
  const offsetLeft = computeOffsetLeft(columnPositions, renderContext, theme.direction, pinnedColumns.left.length);
  const gridHasFiller = dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width;
  const columnHeaderFilterTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderFilterSelector);
  const headerFiltersRef = React.useRef(null);
  const classes = useUtilityClasses(rootProps);
  const disableHeaderFiltering = !rootProps.headerFilters;
  const headerFilterMenuRef = React.useRef(null);
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const columnHeaderFilterFocus = useGridSelector(apiRef, gridFocusColumnHeaderFilterSelector);
  apiRef.current.register('private', {
    headerFiltersElementRef: headerFiltersRef
  });
  React.useEffect(() => {
    apiRef.current.columnHeadersContainerRef.current.scrollLeft = 0;
  }, [apiRef]);
  const handleColumnResizeStart = React.useCallback(params => setResizeCol(params.field), []);
  const handleColumnResizeStop = React.useCallback(() => setResizeCol(''), []);
  const handleColumnReorderStart = React.useCallback(params => setDragCol(params.field), []);
  const handleColumnReorderStop = React.useCallback(() => setDragCol(''), []);
  const leftRenderContext = React.useMemo(() => {
    return pinnedColumns.left.length ? {
      firstColumnIndex: 0,
      lastColumnIndex: pinnedColumns.left.length
    } : null;
  }, [pinnedColumns.left.length]);
  const rightRenderContext = React.useMemo(() => {
    return pinnedColumns.right.length ? {
      firstColumnIndex: visibleColumns.length - pinnedColumns.right.length,
      lastColumnIndex: visibleColumns.length
    } : null;
  }, [pinnedColumns.right.length, visibleColumns.length]);
  useGridApiEventHandler(apiRef, 'columnResizeStart', handleColumnResizeStart);
  useGridApiEventHandler(apiRef, 'columnResizeStop', handleColumnResizeStop);
  useGridApiEventHandler(apiRef, 'columnHeaderDragStart', handleColumnReorderStart);
  useGridApiEventHandler(apiRef, 'columnHeaderDragEnd', handleColumnReorderStop);

  // Helper for computation common between getColumnHeaders and getColumnGroupHeaders
  const getColumnsToRender = params => {
    const {
      renderContext: currentContext = renderContext,
      // TODO: `minFirstColumn` is not used anymore, could be refactored out.
      maxLastColumn = visibleColumns.length
    } = params || {};
    const firstColumnToRender = !hasVirtualization ? 0 : currentContext.firstColumnIndex;
    const lastColumnToRender = !hasVirtualization ? maxLastColumn : currentContext.lastColumnIndex;
    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);
    return {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender
    };
  };
  const getFillers = (params, children, leftOverflow, borderTop = false) => {
    const isPinnedRight = params?.position === GridPinnedColumnPosition.RIGHT;
    const isNotPinned = params?.position === undefined;
    const hasScrollbarFiller = pinnedColumns.right.length > 0 && isPinnedRight || pinnedColumns.right.length === 0 && isNotPinned;
    const leftOffsetWidth = offsetLeft - leftOverflow;
    return /*#__PURE__*/_jsxs(React.Fragment, {
      children: [isNotPinned && /*#__PURE__*/_jsx("div", {
        role: "presentation",
        style: {
          width: leftOffsetWidth
        }
      }), children, isNotPinned && /*#__PURE__*/_jsx("div", {
        role: "presentation",
        className: clsx(gridClasses.filler, borderTop && gridClasses['filler--borderTop'])
      }), hasScrollbarFiller && /*#__PURE__*/_jsx(ScrollbarFiller, {
        header: true,
        borderTop: borderTop,
        pinnedRight: isPinnedRight
      })]
    });
  };
  const getFilterItem = React.useCallback(colDef => {
    const filterModelItem = filterModel?.items.find(it => it.field === colDef.field && it.operator !== 'isAnyOf');
    if (filterModelItem != null) {
      // there's a valid `filterModelItem` for this column
      return filterModelItem;
    }
    const defaultCachedItem = filterItemsCache[colDef.field];
    if (defaultCachedItem != null) {
      // there's a cached `defaultItem` for this column
      return defaultCachedItem;
    }
    // there's no cached `defaultItem` for this column, let's generate one and cache it
    const defaultItem = getGridFilter(colDef);
    filterItemsCache[colDef.field] = defaultItem;
    return defaultItem;
  }, [filterModel]);

  const getCellOffsetStyle = ({
    pinnedPosition,
    columnIndex,
    computedWidth
  }) => {
    let style;
    if (pinnedPosition === 'left' || pinnedPosition === 'right') {
      const pinnedOffset = getPinnedCellOffset(pinnedPosition, computedWidth, columnIndex, columnPositions, dimensions);
      if (pinnedPosition === 'left') {
        style = {
          left: pinnedOffset
        };
      }
      if (pinnedPosition === 'right') {
        style = {
          right: pinnedOffset
        };
      }
    }
    return style;
  };
  const getColumnHeaders = (params, other = {}) => {
    const {
      renderedColumns,
      firstColumnToRender
    } = getColumnsToRender(params);
    const columns = [];
    for (let i = 0; i < renderedColumns.length; i += 1) {
      const colDef = renderedColumns[i];
      const columnIndex = firstColumnToRender + i;
      const isFirstColumn = columnIndex === 0;
      const tabIndex = columnHeaderTabIndexState !== null && columnHeaderTabIndexState.field === colDef.field || isFirstColumn && !hasOtherElementInTabSequence ? 0 : -1;
      const hasFocus = columnHeaderFocus !== null && columnHeaderFocus.field === colDef.field;
      const open = columnMenuState.open && columnMenuState.field === colDef.field;
      const pinnedPosition = params?.position;
      const style = getCellOffsetStyle({
        pinnedPosition,
        columnIndex,
        computedWidth: colDef.computedWidth
      });
      columns.push( /*#__PURE__*/_jsx(GridColumnHeaderItem, _extends({}, sortColumnLookup[colDef.field], {
        columnMenuOpen: open,
        filterItemsCounter: filterColumnLookup[colDef.field] && filterColumnLookup[colDef.field].length,
        headerHeight: dimensions.headerHeight,
        isDragging: colDef.field === dragCol,
        colDef: colDef,
        colIndex: columnIndex,
        isResizing: resizeCol === colDef.field,
        isLast: columnIndex === columnPositions.length - 1,
        hasFocus: hasFocus,
        tabIndex: tabIndex,
        pinnedPosition: pinnedPosition,
        style: style,
        indexInSection: i,
        sectionLength: renderedColumns.length,
        gridHasFiller: gridHasFiller
      }, other), colDef.field));
    }
    return getFillers(params, columns, 0);
  };
  const getColumnHeadersRow = () => {
    return /*#__PURE__*/_jsxs(GridColumnHeaderRow, {
      role: "row",
      "aria-rowindex": headerGroupingMaxDepth + 1,
      ownerState: rootProps,
      children: [leftRenderContext && getColumnHeaders({
        position: GridPinnedColumnPosition.LEFT,
        renderContext: leftRenderContext,
        minFirstColumn: leftRenderContext.firstColumnIndex,
        maxLastColumn: leftRenderContext.lastColumnIndex
      }, {
        disableReorder: true
      }), getColumnHeaders({
        renderContext,
        minFirstColumn: pinnedColumns.left.length,
        maxLastColumn: visibleColumns.length - pinnedColumns.right.length
      }), rightRenderContext && getColumnHeaders({
        position: GridPinnedColumnPosition.RIGHT,
        renderContext: rightRenderContext,
        minFirstColumn: rightRenderContext.firstColumnIndex,
        maxLastColumn: rightRenderContext.lastColumnIndex
      }, {
        disableReorder: true,
        separatorSide: GridColumnHeaderSeparatorSides.Left
      })]
    });
  };
  const getColumnGroupHeaders = ({
    depth,
    params
  }) => {
    const columnsToRender = getColumnsToRender(params);
    if (columnsToRender.renderedColumns.length === 0) {
      return null;
    }
    const {
      renderedColumns,
      firstColumnToRender,
      lastColumnToRender
    } = columnsToRender;
    const rowStructure = columnGroupsHeaderStructure[depth];
    const firstColumnFieldToRender = visibleColumns[firstColumnToRender].field;
    const firstGroupToRender = apiRef.current.getColumnGroupPath(firstColumnFieldToRender)[depth] ?? null;
    const firstGroupIndex = rowStructure.findIndex(({
      groupId,
      columnFields
    }) => groupId === firstGroupToRender && columnFields.includes(firstColumnFieldToRender));
    const lastColumnFieldToRender = visibleColumns[lastColumnToRender - 1].field;
    const lastGroupToRender = apiRef.current.getColumnGroupPath(lastColumnFieldToRender)[depth] ?? null;
    const lastGroupIndex = rowStructure.findIndex(({
      groupId,
      columnFields
    }) => groupId === lastGroupToRender && columnFields.includes(lastColumnFieldToRender));
    const visibleColumnGroupHeader = rowStructure.slice(firstGroupIndex, lastGroupIndex + 1).map(groupStructure => {
      return _extends({}, groupStructure, {
        columnFields: groupStructure.columnFields.filter(field => columnVisibility[field] !== false)
      });
    }).filter(groupStructure => groupStructure.columnFields.length > 0);
    const firstVisibleColumnIndex = visibleColumnGroupHeader[0].columnFields.indexOf(firstColumnFieldToRender);
    const hiddenGroupColumns = visibleColumnGroupHeader[0].columnFields.slice(0, firstVisibleColumnIndex);
    const leftOverflow = hiddenGroupColumns.reduce((acc, field) => {
      const column = apiRef.current.getColumn(field);
      return acc + (column.computedWidth ?? 0);
    }, 0);
    let columnIndex = firstColumnToRender;
    const children = visibleColumnGroupHeader.map(({
      groupId,
      columnFields
    }, index) => {
      const hasFocus = columnGroupHeaderFocus !== null && columnGroupHeaderFocus.depth === depth && columnFields.includes(columnGroupHeaderFocus.field);
      const tabIndex = columnGroupHeaderTabIndexState !== null && columnGroupHeaderTabIndexState.depth === depth && columnFields.includes(columnGroupHeaderTabIndexState.field) ? 0 : -1;
      const headerInfo = {
        groupId,
        width: columnFields.reduce((acc, field) => acc + apiRef.current.getColumn(field).computedWidth, 0),
        fields: columnFields,
        colIndex: columnIndex,
        hasFocus,
        tabIndex
      };
      const pinnedPosition = params.position;
      const style = getCellOffsetStyle({
        pinnedPosition,
        columnIndex,
        computedWidth: headerInfo.width
      });
      columnIndex += columnFields.length;
      let indexInSection = index;
      if (pinnedPosition === 'left') {
        // Group headers can expand to multiple columns, we need to adjust the index
        indexInSection = columnIndex - 1;
      }
      return /*#__PURE__*/_jsx(GridColumnGroupHeader, {
        groupId: groupId,
        width: headerInfo.width,
        fields: headerInfo.fields,
        colIndex: headerInfo.colIndex,
        depth: depth,
        isLastColumn: headerInfo.colIndex === visibleColumns.length - headerInfo.fields.length,
        maxDepth: headerGroupingMaxDepth,
        height: dimensions.headerHeight,
        hasFocus: hasFocus,
        tabIndex: tabIndex,
        pinnedPosition: pinnedPosition,
        style: style,
        indexInSection: indexInSection,
        sectionLength: renderedColumns.length,
        gridHasFiller: gridHasFiller
      }, index);
    });
    return getFillers(params, children, leftOverflow);
  };
  const getColumnGroupHeadersRows = () => {
    if (headerGroupingMaxDepth === 0) {
      return null;
    }
    const headerRows = [];
    for (let depth = 0; depth < headerGroupingMaxDepth; depth += 1) {
      headerRows.push( /*#__PURE__*/_jsxs(GridColumnHeaderRow, {
        role: "row",
        "aria-rowindex": depth + 1,
        ownerState: rootProps,
        children: [leftRenderContext && getColumnGroupHeaders({
          depth,
          params: {
            position: GridPinnedColumnPosition.LEFT,
            renderContext: leftRenderContext,
            minFirstColumn: leftRenderContext.firstColumnIndex,
            maxLastColumn: leftRenderContext.lastColumnIndex
          }
        }), getColumnGroupHeaders({
          depth,
          params: {
            renderContext
          }
        }), rightRenderContext && getColumnGroupHeaders({
          depth,
          params: {
            position: GridPinnedColumnPosition.RIGHT,
            renderContext: rightRenderContext,
            minFirstColumn: rightRenderContext.firstColumnIndex,
            maxLastColumn: rightRenderContext.lastColumnIndex
          }
        })]
      }, depth));
    }
    return headerRows;
  };

  const getColumnFilters = params => {
    const {
      renderedColumns,
      firstColumnToRender
    } = getColumnsToRender(params);
    const filters = [];
    for (let i = 0; i < renderedColumns.length; i += 1) {
      const colDef = renderedColumns[i];
      const columnIndex = firstColumnToRender + i;
      const hasFocus = columnHeaderFilterFocus?.field === colDef.field;
      const isFirstColumn = columnIndex === 0;
      const tabIndexField = columnHeaderFilterTabIndexState?.field;
      const tabIndex = tabIndexField === colDef.field || isFirstColumn && !props.hasOtherElementInTabSequence ? 0 : -1;
      const headerClassName = typeof colDef.headerClassName === 'function' ? colDef.headerClassName({
        field: colDef.field,
        colDef
      }) : colDef.headerClassName;
      const item = getFilterItem(colDef);
      const pinnedPosition = params?.position;
      const style = getCellOffsetStyle({
        pinnedPosition,
        columnIndex,
        computedWidth: colDef.computedWidth
      });
      filters.push( /*#__PURE__*/_jsx(rootProps.slots.headerFilterCell, _extends({}, {
        colIndex: columnIndex,
        height: dimensions.headerFilterHeight,
        width: colDef.computedWidth,
        colDef: colDef,
        hasFocus: hasFocus,
        tabIndex: tabIndex,
        headerFilterMenuRef: headerFilterMenuRef,
        headerClassName: headerClassName,
        "data-field": colDef.field,
        item: item,
        pinnedPosition: pinnedPosition,
        style: style,
        indexInSection: i,
        sectionLength: renderedColumns.length,
        gridHasFiller: gridHasFiller
      }, rootProps.slotProps?.headerFilterCell), `${colDef.field}-filter`));
    }
    return otherProps.getFillers(params, filters, 0, true);
  };

  const getColumnFiltersRow = () => {
    if (disableHeaderFiltering) {
      return null;
    }

    return headerRows.push( /*#__PURE__*/_jsxs(GridColumnHeaderRow, {
      ref: headerFiltersRef,
      className: classes.headerFilterRow,
      role: "row",
      "aria-rowindex": headerGroupingMaxDepth + 2,
      ownerState: rootProps,
      children: [leftRenderContext && getColumnFilters({
        position: GridPinnedColumnPosition.LEFT,
        renderContext: leftRenderContext,
        minFirstColumn: leftRenderContext.firstColumnIndex,
        maxLastColumn: leftRenderContext.lastColumnIndex
      }), getColumnFilters({
        renderContext,
        minFirstColumn: pinnedColumns.left.length,
        maxLastColumn: visibleColumns.length - pinnedColumns.right.length
      }), rightRenderContext && getColumnFilters({
        position: GridPinnedColumnPosition.RIGHT,
        renderContext: rightRenderContext,
        minFirstColumn: rightRenderContext.firstColumnIndex,
        maxLastColumn: rightRenderContext.lastColumnIndex
      })]
    }))
  };

  return {
    renderContext,
    leftRenderContext,
    rightRenderContext,
    pinnedColumns,
    visibleColumns,
    getCellOffsetStyle,
    getFillers,
    getColumnFiltersRow,
    getColumnHeadersRow,
    getColumnFilters,
    getColumnsToRender,
    getColumnGroupHeadersRows,
    isDragging: !!dragCol,
    getInnerProps: () => ({
      role: 'rowgroup'
    })
  };
};