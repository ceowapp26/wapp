import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../../utils/useGridApiEventHandler';
import * as _utils from "@mui/utils";
import * as _gridRowReorderColDef from "./gridRowReorderColDef";
import { getDataGridUtilityClass } from "../../../constants/gridClasses";
import { useGridLogger } from "../../utils/useGridLogger";
import { useGridSelector } from "../../utils/useGridSelector";
import { gridSortModelSelector } from "../sorting/gridSortingSelector";
import { gridRowMaximumTreeDepthSelector } from "../rows/gridRowsSelector";
import { gridEditRowsStateSelector } from "../editing/gridEditingSelectors";
import { useGridRegisterPipeProcessor } from "../../core/pipeProcessing/useGridRegisterPipeProcessor";

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  return React.useMemo(() => {
    const slots = {
      rowReorderCellContainer: ['rowReorderCellContainer'],
      columnHeaderReorder: ['columnHeaderReorder']
    };
    return (0, _utils.unstable_composeClasses)(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

export const useGridRowReorderPreProcessors = (privateApiRef, props) => {
  const ownerState = {
    classes: props.classes
  };
  const classes = useUtilityClasses(ownerState);
  const updateReorderColumn = React.useCallback(columnsState => {
    const reorderColumn = _extends({}, _gridRowReorderColDef.GRID_REORDER_COL_DEF, {
      cellClassName: classes.rowReorderCellContainer,
      headerClassName: classes.columnHeaderReorder,
      headerName: privateApiRef.current.getLocaleText('rowReorderingHeaderName')
    });
    const shouldHaveReorderColumn = props.rowReordering;
    const haveReorderColumn = columnsState.lookup[reorderColumn.field] != null;
    if (shouldHaveReorderColumn && haveReorderColumn) {
      return columnsState;
    }
    if (shouldHaveReorderColumn && !haveReorderColumn) {
      columnsState.lookup[reorderColumn.field] = reorderColumn;
      columnsState.orderedFields = [reorderColumn.field, ...columnsState.orderedFields];
    } else if (!shouldHaveReorderColumn && haveReorderColumn) {
      delete columnsState.lookup[reorderColumn.field];
      columnsState.orderedFields = columnsState.orderedFields.filter(field => field !== reorderColumn.field);
    }
    return columnsState;
  }, [privateApiRef, classes, props.rowReordering]);
  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateReorderColumn);
};
