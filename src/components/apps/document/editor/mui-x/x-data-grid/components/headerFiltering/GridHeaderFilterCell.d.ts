import * as React from 'react';
import { GridFilterOperator } from '../../models/gridFilterOperator';
import { GridFilterItem } from '../../models/gridFilterItem';
import { GridColDef, GridStateColDef } from '../../models/colDef/GridColDef';
import { GridPinnedColumnPosition } from '../../hooks/features/columns/gridColumnsInterfaces'

export interface GridRenderHeaderFilterProps extends GridHeaderFilterCellProps {
    inputRef: React.RefObject<unknown>;
}
export interface GridHeaderFilterCellProps extends Pick<GridStateColDef, 'headerClassName'> {
    colIndex: number;
    height: number;
    sortIndex?: number;
    hasFocus?: boolean;
    tabIndex: 0 | -1;
    width: number;
    colDef: GridColDef;
    headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
    item: GridFilterItem;
    showClearIcon?: boolean;
    InputComponentProps: GridFilterOperator['InputComponentProps'];
    pinnedPosition?: GridPinnedColumnPosition;
    style?: React.CSSProperties;
    indexInSection: number;
    sectionLength: number;
    gridHasFiller: boolean;
}
declare const Memoized: React.ForwardRefExoticComponent<GridHeaderFilterCellProps & React.RefAttributes<HTMLDivElement>>;
export { Memoized as GridHeaderFilterCell };
