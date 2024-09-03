import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProps } from '../../../models/dataGridProps';
/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridSelection (state)
 * @requires useGridParamsApi (method)
 */
export declare const useGridExcelExport: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: DataGridProps) => void;


