import * as React from 'react';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
export declare const useGridTreeDataPreProcessors: (privateApiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'treeData' | 'groupingColDef' | 'getTreeDataPath' | 'disableChildrenSorting' | 'disableChildrenFiltering' | 'defaultGroupingExpansionDepth' | 'isGroupExpandedByDefault'>) => void;

