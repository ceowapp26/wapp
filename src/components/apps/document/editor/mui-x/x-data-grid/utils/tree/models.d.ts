import { GridRowId } from '../../models/gridRows';
import { GridKeyValue } from '../../models/colDef/gridColDef';
export interface RowTreeBuilderGroupingCriterion {
    field: string | null;
    key: GridKeyValue | null;
}
export interface RowTreeBuilderNode {
    id: GridRowId;
    path: RowTreeBuilderGroupingCriterion[];
}
/**
 * Callback called when trying to insert a data row in the tree in place of an already existing data row.
 */
export type GridTreePathDuplicateHandler = (firstId: GridRowId, secondId: GridRowId, path: RowTreeBuilderGroupingCriterion[]) => void;
