import * as React from 'react';
import { GridStateInitializer } from '../utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const columnPinningStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'pinnedColumns' | 'initialState'>>;
export declare const useGridColumnPinning: (apiRef: React.MutableRefObject<GridPrivateApiCommunityGridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'disableColumnPinning' | 'initialState' | 'pinnedColumns' | 'onPinnedColumnsChange' | 'slotProps' | 'slots'>) => void;


