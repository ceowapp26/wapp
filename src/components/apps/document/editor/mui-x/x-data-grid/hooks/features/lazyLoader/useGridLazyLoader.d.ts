import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
/**
 * @requires useGridRows (state)
 * @requires useGridPagination (state)
 * @requires useGridDimensions (method) - can be after
 * @requires useGridScroll (method
 */
export declare const useGridLazyLoader: (privateApiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'onFetchRows' | 'rowsLoadingMode' | 'pagination' | 'paginationMode' | 'experimentalFeatures'>) => void;



