/// <reference types="react" />
import { GridValidRowModel, GridColDef, GridKeyValue } from './colDef/GridColDef';
import { GridApiCommunity } from './api/gridApiCommunity';
export type GridGroupingValueGetter<R extends GridValidRowModel = GridValidRowModel, TValue = never> = (value: TValue, row: R, column: GridColDef<R>, apiRef: React.MutableRefObject<GridApiPremium>) => GridKeyValue | null | undefined;
