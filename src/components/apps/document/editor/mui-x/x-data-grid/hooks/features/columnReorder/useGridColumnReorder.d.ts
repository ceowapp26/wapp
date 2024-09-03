import * as React from 'react';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const columnReorderStateInitializer: GridStateInitializer;
/**
 * @requires useGridColumns (method)
 */
export declare const useGridColumnReorder: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'disableColumnReorder' | 'keepColumnPositionIfDraggedOutside' | 'classes' | 'onColumnOrderChange'>) => void;


