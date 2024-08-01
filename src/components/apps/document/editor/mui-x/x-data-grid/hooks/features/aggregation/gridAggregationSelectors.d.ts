import { GridStateCommunity } from '../../../models/gridStateCommunity';
export declare const gridAggregationStateSelector: (state: gridStateCommunity) => import("./gridAggregationInterfaces").GridAggregationState;
/**
 * Get the aggregation model, containing the aggregation function of each column.
 * If a column is not in the model, it is not aggregated.
 * @category Aggregation
 */
export declare const gridAggregationModelSelector: import("../../../utils/createSelector").OutputSelector<gridStateCommunity, import("./gridAggregationInterfaces").GridAggregationModel>;
/**
 * Get the aggregation results as a lookup.
 * @category Aggregation
 */
export declare const gridAggregationLookupSelector: import("../../../utils/createSelector").OutputSelector<gridStateCommunity, import("./gridAggregationInterfaces").GridAggregationLookup>;


