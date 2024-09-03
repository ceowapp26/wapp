import * as React from 'react';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
export declare const cellSelectionStateInitializer: GridStateInitializer<Pick<DataGridProcessedProps, 'cellSelectionModel' | 'initialState'>>;
export declare const useGridCellSelection: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'cellSelection' | 'cellSelectionModel' | 'onCellSelectionModelChange' | 'pagination' | 'paginationMode' | 'ignoreValueFormatterDuringExport' | 'clipboardCopyCellDelimiter' | 'columnHeaderHeight'>) => void;

