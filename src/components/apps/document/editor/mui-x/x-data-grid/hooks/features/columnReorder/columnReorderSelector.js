import { createSelector } from "../../../utils/createSelector";
export const gridColumnReorderSelector = state => state.columnReorder;
export const gridColumnReorderDragColSelector = createSelector(gridColumnReorderSelector, columnReorder => columnReorder.dragCol);