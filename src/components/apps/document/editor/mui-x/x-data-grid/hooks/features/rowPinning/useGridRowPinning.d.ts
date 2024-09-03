import * as React from 'react';
import { GridStateInitializer } from '../..//utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const rowPinningStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'pinnedRows' | 'getRowId' | 'experimentalFeatures'>>;
export declare const useGridRowPinning: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'pinnedRows' | 'getRowId'>) => void;

