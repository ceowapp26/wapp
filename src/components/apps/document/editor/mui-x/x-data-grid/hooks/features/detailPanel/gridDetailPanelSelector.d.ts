/// <reference types="react" />
import { GridRowId } from '@mui/x-data-grid';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
export declare const gridDetailPanelExpandedRowIdsSelector: (state: GridStateCommunity) => GridRowId[];
export declare const gridDetailPanelExpandedRowsContentCacheSelector: (state: GridStateCommunity) => Record<GridRowId, import("react").ReactNode>;
export declare const gridDetailPanelRawHeightCacheSelector: (state: GridStateCommunity) => {
    [x: string]: {
        autoHeight: boolean;
        height: number;
    };
    [x: number]: {
        autoHeight: boolean;
        height: number;
    };
};
export declare const gridDetailPanelExpandedRowsHeightCacheSelector: import("@mui/x-data-grid").OutputSelector<GridStateCommunity, Record<GridRowId, number>>;


