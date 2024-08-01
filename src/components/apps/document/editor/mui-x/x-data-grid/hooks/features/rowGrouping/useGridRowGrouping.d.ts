import * as React from 'react';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const rowGroupingStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'rowGroupingModel' | 'initialState'>>;
/**
 * @requires useGridColumns (state, method) - can be after, async only
 * @requires useGridRows (state, method) - can be after, async only
 * @requires useGridParamsApi (method) - can be after, async only
 */
export declare const useGridRowGrouping: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'initialState' | 'rowGroupingModel' | 'onRowGroupingModelChange' | 'defaultGroupingExpansionDepth' | 'isGroupExpandedByDefault' | 'groupingColDef' | 'rowGroupingColumnMode' | 'disableRowGrouping' | 'slotProps' | 'slots'>) => void;


