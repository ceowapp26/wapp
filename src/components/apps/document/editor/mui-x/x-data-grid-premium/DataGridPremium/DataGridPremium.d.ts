import * as React from 'react';
import { GridValidRowModel } from '@mui/x-data-grid-pro';
import { DataGridPremiumProps } from '../models/dataGridPremiumProps';
export type { GridPremiumSlotsComponent as GridSlots } from '../models';
interface DataGridPremiumComponent {
    <R extends GridValidRowModel = any>(props: DataGridPremiumProps<R> & React.RefAttributes<HTMLDivElement>): React.JSX.Element;
    propTypes?: any;
}
/**
 * Demos:
 * - [DataGridPremium](https://mui.com/x/react-data-grid/demo/)
 *
 * API:
 * - [DataGridPremium API](https://mui.com/x/api/data-grid/data-grid-premium/)
 */
export declare const DataGridPremium: DataGridPremiumComponent;
