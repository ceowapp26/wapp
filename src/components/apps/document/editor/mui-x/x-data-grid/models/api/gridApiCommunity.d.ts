import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type { DataGridProcessedProps } from '../props/DataGridProps';
import { GridColumnReorderApi } from './gridColumnApi';
import type { GridColumnPinningApi, GridDetailPanelApi, GridRowPinningApi, GridDetailPanelPrivateApi } from '../hooks';
import type { GridRowGroupingApi, GridExcelExportApi, GridAggregationApi } from '../hooks';
import type { GridApiCommon, GridPrivateOnlyApiCommon } from './gridApiCommon';
import type { GridColumnReorderApi } from './gridColumnApi';
import { GridRowProApi } from './gridRowApi';
import { GridRowMultiSelectionApi } from './gridRowSelectionApi';
import { GridCellSelectionApi } from '../hooks/features/cellSelection/gridCellSelectionInterfaces';

/**
 * The api of `DataGrid`.
 */
export interface GridApiCommunity extends GridApiCommon<GridStateCommunity, GridInitialStateCommunity>, GridColumnPinningApi, GridDetailPanelApi, GridRowGroupingApi, GridExcelExportApi, GridAggregationApi, GridRowPinningApi, GridCellSelectionApi, GridRowMultiSelectionApi, GridColumnReorderApi {
}
export interface GridPrivateApiCommunity extends GridApiCommunity, GridPrivateOnlyApiCommon<GridApiCommunity, GridPrivateApiCommunity, DataGridProcessedProps>, GridRowMultiSelectionApi, GridColumnReorderApi, GridRowProApi {
}

