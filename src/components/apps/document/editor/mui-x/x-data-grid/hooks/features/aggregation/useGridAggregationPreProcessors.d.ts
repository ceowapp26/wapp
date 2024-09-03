import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const useGridAggregationPreProcessors: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'aggregationFunctions' | 'disableAggregation' | 'getAggregationPosition' | 'slotProps' | 'slots'>) => void;

