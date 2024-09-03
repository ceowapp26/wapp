import { createSelector, createSelectorMemoized } from "../../../utils/createSelector";
import { gridColumnLookupSelector } from "../columns/gridColumnsSelector";

export const gridRowGroupingStateSelector = state => state.rowGrouping;
export const gridRowGroupingModelSelector = createSelector(gridRowGroupingStateSelector, rowGrouping => rowGrouping.model);
export const gridRowGroupingSanitizedModelSelector = createSelectorMemoized(gridRowGroupingModelSelector, gridColumnLookupSelector, (model, columnsLookup) => model.filter(field => !!columnsLookup[field]));



