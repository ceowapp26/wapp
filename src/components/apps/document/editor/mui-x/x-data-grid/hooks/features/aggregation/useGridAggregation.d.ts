import * as React from 'react';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
export declare const aggregationStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'aggregationModel' | 'initialState'>, GridPrivateApiCommunity>;
export declare const useGridAggregation: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'onAggregationModelChange' | 'initialState' | 'aggregationModel' | 'getAggregationPosition' | 'aggregationFunctions' | 'aggregationRowsScope' | 'disableAggregation' | 'rowGroupingColumnMode'>) => void;
