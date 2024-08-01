import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridRowId } from '../../../models/gridRows';
import { GridColumnRawLookup } from '../columns/gridColumnsInterfaces';
import { GridHydrateRowsValue } from '../rows/gridRowsInterfaces';
import { GridAggregationFunction, GridAggregationModel, GridAggregationRule, GridAggregationRules } from './gridAggregationInterfaces';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
export declare const GRID_AGGREGATION_ROOT_FOOTER_ROW_ID = "auto-generated-group-footer-root";
export declare const getAggregationFooterRowIdFromGroupId: (groupId: GridRowId | null) => string;
export declare const canColumnHaveAggregationFunction: ({ colDef, aggregationFunctionName, aggregationFunction, }: {
    colDef: GridColDef | undefined;
    aggregationFunctionName: string;
    aggregationFunction: GridAggregationFunction | undefined;
}) => boolean;
export declare const getAvailableAggregationFunctions: ({ aggregationFunctions, colDef, }: {
    aggregationFunctions: Record<string, GridAggregationFunction>;
    colDef: GridColDef;
}) => string[];
export declare const mergeStateWithAggregationModel: (aggregationModel: GridAggregationModel) => (state: GridStateCommunity) => GridStateCommunity;
export declare const getAggregationRules: ({ columnsLookup, aggregationModel, aggregationFunctions, }: {
    columnsLookup: GridColumnRawLookup;
    aggregationModel: GridAggregationModel;
    aggregationFunctions: Record<string, GridAggregationFunction>;
}) => GridAggregationRules;
interface AddFooterRowsParams {
    groupingParams: GridHydrateRowsValue;
    getAggregationPosition: DataGridProcessedProps['getAggregationPosition'];
    /**
     * If `true`, there are some aggregation rules to apply
     */
    hasAggregationRule: boolean;
    apiRef: React.MutableRefObject<GridPrivateApiPremium>;
}
/**
 * Add a footer for each group that has at least one column with an aggregated value.
 */
export declare const addFooterRows: ({ groupingParams, apiRef, getAggregationPosition, hasAggregationRule, }: AddFooterRowsParams) => GridHydrateRowsValue;
/**
 * Compares two sets of aggregation rules to determine if they are equal or not.
 */
export declare const areAggregationRulesEqual: (previousValue: GridAggregationRules | undefined, newValue: GridAggregationRules) => boolean;
export declare const getAggregationFunctionLabel: ({ apiRef, aggregationRule, }: {
    apiRef: React.MutableRefObject<GridApiPremium>;
    aggregationRule: GridAggregationRule;
}) => string;
export {};
