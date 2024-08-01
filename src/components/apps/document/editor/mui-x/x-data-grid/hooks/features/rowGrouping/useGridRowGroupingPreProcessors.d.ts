import * as React from 'react';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
export declare const useGridRowGroupingPreProcessors: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'disableRowGrouping' | 'groupingColDef' | 'rowGroupingColumnMode' | 'defaultGroupingExpansionDepth' | 'isGroupExpandedByDefault'>) => void;
