import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/gridApiPro';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
/**
 * Only available in DataGridPro
 * @requires useGridRows (method)
 */
export declare const useGridRowReorder: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'rowReordering' | 'onRowOrderChange' | 'classes'>) => void;
