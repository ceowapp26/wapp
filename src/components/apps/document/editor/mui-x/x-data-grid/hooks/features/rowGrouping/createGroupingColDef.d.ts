import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { gridGroupingColDefOverride } from '../../../models/gridGroupingColDefOverride';
import { GridColumnRawLookup } from "../columns/gridColumnsInterfaces";
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

interface CreateGroupingColDefMonoCriteriaParams {
    columnsLookup: GridColumnRawLookup;
    /**
     * The field from which we are grouping the rows.
     */
    groupingCriteria: string;
    /**
     * The col def from which we are grouping the rows.
     */
    groupedByColDef: GridColDef;
    /**
     * The col def properties the user wants to override.
     * This value comes `prop.groupingColDef`.
     */
    colDefOverride: GridGroupingColDefOverride | null | undefined;
}
/**
 * Creates the `GridColDef` for a grouping column that only takes care of a single grouping criteria
 */
export declare const createGroupingColDefForOneGroupingCriteria: ({ columnsLookup, groupedByColDef, groupingCriteria, colDefOverride, }: CreateGroupingColDefMonoCriteriaParams) => GridColDef;
interface CreateGroupingColDefSeveralCriteriaParams {
    apiRef: React.MutableRefObject<GridApiCommunity>;
    columnsLookup: GridColumnRawLookup;
    /**
     * The fields from which we are grouping the rows.
     */
    rowGroupingModel: string[];
    /**
     * The col def properties the user wants to override.
     * This value comes `prop.groupingColDef`.
     */
    colDefOverride: GridGroupingColDefOverride | null | undefined;
}
/**
 * Creates the `GridColDef` for a grouping column that takes care of all the grouping criteria
 */
export declare const createGroupingColDefForAllGroupingCriteria: ({ apiRef, columnsLookup, rowGroupingModel, colDefOverride, }: CreateGroupingColDefSeveralCriteriaParams) => GridColDef;
export {};





