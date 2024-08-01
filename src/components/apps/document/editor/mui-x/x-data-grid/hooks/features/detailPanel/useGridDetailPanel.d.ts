import * as React from 'react';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const detailPanelStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'initialState' | 'detailPanelExpandedRowIds'>>;
export declare const useGridDetailPanel: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'getDetailPanelContent' | 'getDetailPanelHeight' | 'detailPanelExpandedRowIds' | 'onDetailPanelExpandedRowIdsChange'>) => void;




