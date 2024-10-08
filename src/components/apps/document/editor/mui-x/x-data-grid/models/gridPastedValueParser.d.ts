/// <reference types="react" />
import { GridColDef, GridValidRowModel } from './colDef/GridColDef';
import { GridApiPremium } from './gridApiPremium';
export type GridPastedValueParser<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (value: string, row: R, column: GridColDef<R, V, F>, apiRef: React.MutableRefObject<GridApiPremium>) => V | undefined;
