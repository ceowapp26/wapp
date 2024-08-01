import { GridRowModel } from '../gridRows';
/**
 * Object passed as parameter of the row order change event.
 */
export interface GridRowOrderChangeParams {
    /**
     * The row data.
     */
    row: GridRowModel;
    /**
     * The target row index.
     */
    targetIndex: number;
    /**
     * The old row index.
     */
    oldIndex: number;
}
