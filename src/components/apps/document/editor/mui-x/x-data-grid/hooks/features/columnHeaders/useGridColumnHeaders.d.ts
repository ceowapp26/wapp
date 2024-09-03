import * as React from 'react';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { GridSortColumnLookup } from '../sorting/gridSortingSelector';
import { GridFilterActiveItemsLookup } from '../filter/gridFilterSelector';
import { GridColumnGroupIdentifier, GridColumnIdentifier } from '../focus/gridFocusState';
import { GridColumnMenuState } from '../columnMenu/columnMenuInterface';
import { GridPinnedColumnPosition, GridColumnVisibilityModel } from '../columns/gridColumnsInterfaces';
import { GridGroupingStructure } from '../columnGrouping/gridColumnGroupsInterfaces';

export interface UseGridColumnHeadersProps {
  visibleColumns: GridStateColDef[];
  sortColumnLookup: GridSortColumnLookup;
  filterColumnLookup: GridFilterActiveItemsLookup;
  columnHeaderTabIndexState: GridColumnIdentifier | null;
  columnGroupHeaderTabIndexState: GridColumnGroupIdentifier | null;
  columnHeaderFocus: GridColumnIdentifier | null;
  columnGroupHeaderFocus: GridColumnGroupIdentifier | null;
  headerGroupingMaxDepth: number;
  columnMenuState: GridColumnMenuState;
  columnVisibility: GridColumnVisibilityModel;
  columnGroupsHeaderStructure: GridGroupingStructure[][];
  hasOtherElementInTabSequence: boolean;
}

export interface GetHeadersParams {
  position?: GridPinnedColumnPosition;
  renderContext?: GridColumnsRenderContext;
  minFirstColumn?: number;
  maxLastColumn?: number;
}

export declare const useGridColumnHeaders: (props: UseGridColumnHeadersProps) => {
    getColumnFiltersRow: () => React.JSX.Element | null;
    getFillers: (params: GetHeadersParams | undefined, children: React.ReactNode, leftOverflow: number, borderTop?: boolean | undefined) => React.JSX.Element;
    getColumnHeadersRow: () => React.JSX.Element;
    getColumnGroupHeadersRows: () => React.JSX.Element[] | null;
    isDragging: boolean;
    getInnerProps: () => {
        role: string;
    };
};
