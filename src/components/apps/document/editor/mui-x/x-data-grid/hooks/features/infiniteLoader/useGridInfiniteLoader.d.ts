import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';

/**
 * @requires useGridColumns (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export declare const useGridInfiniteLoader: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'onRowsScrollEnd' | 'pagination' | 'paginationMode' | 'rowsLoadingMode' | 'scrollEndThreshold'>) => void;

