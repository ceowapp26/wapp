import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/gridApiCommunity';
import type { DataGridProcessedProps } from '../../../models/dataGridProps';
export declare const useGridClipboardImport: (apiRef: React.MutableRefObject<GridPrivateApiCommunity>, props: Pick<DataGridProcessedProps, 'pagination' | 'paginationMode' | 'processRowUpdate' | 'onProcessRowUpdateError' | 'getRowId' | 'onClipboardPasteStart' | 'onClipboardPasteEnd' | 'splitClipboardPastedText' | 'disableClipboardPaste' | 'onBeforeClipboardPasteStart'>) => void;



