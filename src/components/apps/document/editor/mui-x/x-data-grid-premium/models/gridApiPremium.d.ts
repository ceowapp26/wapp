import { GridPrivateOnlyApiCommon } from '@mui/x-data-grid/internals';
import { GridApiCommon, GridColumnPinningApi, GridDetailPanelApi, GridDetailPanelPrivateApi, GridRowPinningApi, GridRowMultiSelectionApi, GridColumnReorderApi, GridRowProApi } from '@mui/x-data-grid-pro';
import { GridInitialStatePremium, GridStatePremium } from './gridStatePremium';
import type { GridRowGroupingApi, GridExcelExportApi, GridAggregationApi } from '../hooks';
import { GridCellSelectionApi } from '../hooks/features/cellSelection/gridCellSelectionInterfaces';
import type { DataGridPremiumProcessedProps } from './dataGridPremiumProps';
/**
 * The api of `DataGridPremium`.
 * TODO: Do not redefine manually the pro features
 */
export interface GridApiPremium extends GridApiCommon<GridStatePremium, GridInitialStatePremium>, GridRowProApi, GridColumnPinningApi, GridDetailPanelApi, GridRowGroupingApi, GridExcelExportApi, GridAggregationApi, GridRowPinningApi, GridCellSelectionApi, GridRowMultiSelectionApi, GridColumnReorderApi {
}
export interface GridPrivateApiPremium extends GridApiPremium, GridPrivateOnlyApiCommon<GridApiPremium, GridPrivateApiPremium, DataGridPremiumProcessedProps>, GridDetailPanelPrivateApi {
}
