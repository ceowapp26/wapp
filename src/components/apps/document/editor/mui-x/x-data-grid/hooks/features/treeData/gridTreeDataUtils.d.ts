/// <reference types="react" />
import { GridRowTreeConfig, GridFilterState, GridFilterModel } from '@mui/x-data-grid';
import { GridAggregatedFilterItemApplier } from '@mui/x-data-grid/internals';
import type { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
interface FilterRowTreeFromTreeDataParams {
    rowTree: GridRowTreeConfig;
    disableChildrenFiltering: boolean;
    isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
    filterModel: GridFilterModel;
    apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
}
export declare const TREE_DATA_STRATEGY = "tree-data";
/**
 * A node is visible if one of the following criteria is met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
export declare const filterRowTreeFromTreeData: (params: FilterRowTreeFromTreeDataParams) => Omit<GridFilterState, 'filterModel'>;
export {};


