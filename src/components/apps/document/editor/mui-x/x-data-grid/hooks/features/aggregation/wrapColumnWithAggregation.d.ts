import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFilterOperator } from '../../../models/gridFilterOperator';
import { GridBaseColDef } from '@mui';
import { GridApiCommunity } from '../../../models/gridApiCommunity';
import { GridAggregationRule } from './gridAggregationInterfaces';

declare const AGGREGATION_WRAPPABLE_PROPERTIES: readonly ["valueGetter", "valueFormatter", "renderCell", "renderHeader", "filterOperators"];
type WrappableColumnProperty = (typeof AGGREGATION_WRAPPABLE_PROPERTIES)[number];
interface GridColDefWithAggregationWrappers extends GridBaseColDef {
    aggregationWrappedProperties: {
        name: WrappableColumnProperty;
        originalValue: GridBaseColDef[WrappableColumnProperty];
        wrappedValue: GridBaseColDef[WrappableColumnProperty];
    }[];
}
/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation cells.
 */
export declare const wrapColumnWithAggregationValue: ({ column, apiRef, aggregationRule, }: {
    column: GridBaseColDef;
    apiRef: React.MutableRefObject<GridApiCommunity>;
    aggregationRule: GridAggregationRule;
}) => GridBaseColDef;
/**
 * Remove the aggregation wrappers around the wrappable properties of the column.
 */
export declare const unwrapColumnFromAggregation: ({ column, }: {
    column: GridColDef | GridColDefWithAggregationWrappers;
}) => GridBaseColDef<any, any, any> | {
    field: string;
    headerName?: string | undefined;
    description?: string | undefined;
    width?: number | undefined;
    flex?: number | undefined;
    minWidth?: number | undefined;
    maxWidth?: number | undefined;
    hideable?: boolean | undefined;
    sortable?: boolean | undefined;
    sortingOrder?: import("../../../models/gridSortModel").GridSortDirection[] | undefined;
    resizable?: boolean | undefined;
    editable?: boolean | undefined;
    groupable?: boolean | undefined;
    pinnable?: boolean | undefined;
    sortComparator?: import("../../../models/gridSortModel").GridComparatorFn<any> | undefined;
    getSortComparator?: ((sortDirection: import("../../../models/gridSortModel").GridSortDirection) => import("../../../models/gridSortModel").GridComparatorFn<any> | undefined) | undefined;
    type?: import("../../../models/colDef/gridColDef").GridColType | undefined;
    align?: import("../../../models/colDef/gridColDef").GridAlignment | undefined;
    valueGetter?: import("../../../models/colDef/gridColDef").GridValueGetter<import("../../../models/gridRows").GridValidRowModel, any, any, never> | undefined;
    valueSetter?: import("../../../models/colDef/gridColDef").GridValueSetter<import("../../../models/gridRows").GridValidRowModel, any, any> | undefined;
    valueFormatter?: import("../../../models/colDef/gridColDef").GridValueFormatter<import("../../../models/gridRows").GridValidRowModel, any, any, never> | undefined;
    valueParser?: import("../../../models/colDef/gridColDef").GridValueParser<import("../../../models/gridRows").GridValidRowModel, any, any> | undefined;
    cellClassName?: import("../../../models/gridCellClass").GridCellClassNamePropType<import("../../../models/gridRows").GridValidRowModel, any> | undefined;
    display?: "text" | "flex" | undefined;
    renderCell?: ((params: import("../../../models/params/gridCellParams").GridRenderCellParams<import("../../../models/gridRows").GridValidRowModel, any, any, import("../../../models/gridRows").GridTreeNodeWithRender>) => React.ReactNode) | undefined;
    renderEditCell?: ((params: import("../../../models/params/gridCellParams").GridRenderEditCellParams<import("../../../models/gridRows").GridValidRowModel, any, any, import("../../../models/gridRows").GridTreeNodeWithRender>) => React.ReactNode) | undefined;
    preProcessEditCellProps?: ((params: import("../../../models/params/gridCellParams").GridPreProcessEditCellProps<any, any>) => import("../../../models/gridEditRowModel").GridEditCellProps<any> | Promise<import("../../../models/gridEditRowModel").GridEditCellProps<any>>) | undefined;
    headerClassName?: import("../../../models/gridColumnHeaderClass").GridColumnHeaderClassNamePropType | undefined;
    renderHeader?: ((params: import("../../../models/params/gridColumnHeaderParams").GridColumnHeaderParams<import("../../../models/gridRows").GridValidRowModel, any, any>) => React.ReactNode) | undefined;
    headerAlign?: import("../../../models/colDef/gridColDef").GridAlignment | undefined;
    hideSortIcons?: boolean | undefined;
    disableColumnMenu?: boolean | undefined;
    filterable?: boolean | undefined;
    filterOperators?: GridFilterOperator<import("../../../models/gridRows").GridValidRowModel, any, any>[] | undefined;
    getApplyQuickFilterFn?: import("../../../models/colDef/gridColDef").GetApplyQuickFilterFn<import("../../../models/gridRows").GridValidRowModel, any> | undefined;
    disableReorder?: boolean | undefined;
    disableExport?: boolean | undefined;
    colSpan?: number | import("../../../models/colDef/gridColDef").GridColSpanFn<import("../../../models/gridRows").GridValidRowModel, any, any> | undefined;
    renderHeaderFilter?: ((params: import("../../../components/headerFiltering/GridHeaderFilterCell").GridRenderHeaderFilterProps) => React.ReactNode) | undefined;
    aggregable?: boolean | undefined;
    availableAggregationFunctions?: string[] | undefined;
    groupingValueGetter?: import("../../..").GridGroupingValueGetter<import("../../../models/gridRows").GridValidRowModel> | undefined;
    pastedValueParser?: import("../../..").GridPastedValueParser<import("../../../models/gridRows").GridValidRowModel, any, any> | undefined;
};
export {};
