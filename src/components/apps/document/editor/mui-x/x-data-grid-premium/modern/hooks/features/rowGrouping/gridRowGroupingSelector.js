import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { createSelector, createSelectorMemoized } from '@mui/x-data-grid/internals';
const gridRowGroupingStateSelector = state => state.rowGrouping;
export const gridRowGroupingModelSelector = createSelector(gridRowGroupingStateSelector, rowGrouping => rowGrouping.model);
export const gridRowGroupingSanitizedModelSelector = createSelectorMemoized(gridRowGroupingModelSelector, gridColumnLookupSelector, (model, columnsLookup) => model.filter(field => !!columnsLookup[field]));