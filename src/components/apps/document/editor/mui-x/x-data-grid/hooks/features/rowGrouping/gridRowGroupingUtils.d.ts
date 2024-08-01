import * as React from 'react';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridRowTreeConfig } from '../../../models/gridRows';
import { GridColDef, GridKeyValue } from '../../../models/GridColDef';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { GridRowModel } from '../../../models/gridRows';
import { GridFilterState, GridAggregatedFilterItemApplier } from '../filter/gridFilterState';
import { GridColumnRawLookup } from "../columns/gridColumnsInterfaces";
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridGroupingRule, GridGroupingRules, GridRowGroupingModel } from './gridRowGroupingInterfaces';
import { gridApiCommunity } from '../../../models/gridApiCommunity';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
export declare const GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD = "__row_group_by_columns_group__";
export declare const ROW_GROUPING_STRATEGY = "grouping-columns";
export declare const getRowGroupingFieldFromGroupingCriteria: (groupingCriteria: string | null) => string;
export declare const getRowGroupingCriteriaFromGroupingField: (groupingColDefField: string) => string | null;
export declare const isGroupingColumn: (field: string) => boolean;
interface FilterRowTreeFromTreeDataParams {
    rowTree: GridRowTreeConfig;
    isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
    filterModel: GridFilterModel;
    apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
}
/**
 * A leaf is visible if it passed the filter
 * A group is visible if all the following criteria are met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
export declare const filterRowTreeFromGroupingColumns: (params: FilterRowTreeFromTreeDataParams) => Omit<GridFilterState, 'filterModel'>;
export declare const getColDefOverrides: (groupingColDefProp: DataGridProcessedProps['groupingColDef'], fields: string[]) => import("@mui/x-data-grid-pro").GridGroupingColDefOverride<any> | null | undefined;
export declare const mergeStateWithRowGroupingModel: (rowGroupingModel: GridRowGroupingModel) => (state: gridApiCommunity) => gridApiCommunity;
export declare const setStrategyAvailability: (privateApiRef: React.MutableRefObject<GridPrivateApiCommunity>, disableRowGrouping: boolean) => void;
export declare const getCellGroupingCriteria: ({ row, colDef, groupingRule, apiRef, }: {
    row: GridRowModel;
    colDef: GridColDef;
    groupingRule: GridGroupingRule;
    apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
}) => {
    key: GridKeyValue | null | undefined;
    field: string;
};
export declare const getGroupingRules: ({ sanitizedRowGroupingModel, columnsLookup, }: {
    sanitizedRowGroupingModel: GridRowGroupingModel;
    columnsLookup: GridColumnRawLookup;
}) => GridGroupingRules;
/**
 * Compares two sets of grouping rules to determine if they are equal or not.
 */
export declare const areGroupingRulesEqual: (newValue: GridGroupingRules, previousValue: GridGroupingRules) => boolean;
export {};
