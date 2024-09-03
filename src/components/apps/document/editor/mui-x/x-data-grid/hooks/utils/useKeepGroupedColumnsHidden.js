import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import * as _utils from '@mui/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as _styles from "@mui/material/styles";
import * as _propTypes from "prop-types";
import * as _clsx from "clsx";
import { gridColumnVisibilityModelSelector } from "../features/columns/gridColumnsSelector";

export const updateColumnVisibilityModel = (columnVisibilityModel, rowGroupingModel, prevRowGroupingModel) => {
  const newColumnVisibilityModel = _extends({}, columnVisibilityModel);
  rowGroupingModel?.forEach(field => {
    if (!prevRowGroupingModel?.includes(field)) {
      newColumnVisibilityModel[field] = false;
    }
  });
  prevRowGroupingModel?.forEach(field => {
    if (!rowGroupingModel?.includes(field)) {
      newColumnVisibilityModel[field] = true;
    }
  });
  return newColumnVisibilityModel;
};

/**
 * Automatically hide columns when added to the row grouping model and stop hiding them when they are removed.
 * Handles both the `props.initialState.rowGrouping.model` and `props.rowGroupingModel`
 * Does not work when used with the `hide` property of `GridColDef`
 */
export const useKeepGroupedColumnsHidden = props => {
  const initialProps = React.useRef(props);
  const rowGroupingModel = React.useRef(props.rowGroupingModel ?? props.initialState?.rowGrouping?.model);
  React.useEffect(() => {
    props.apiRef.current.subscribeEvent('rowGroupingModelChange', newModel => {
      const columnVisibilityModel = updateColumnVisibilityModel(gridColumnVisibilityModelSelector(props.apiRef), newModel, rowGroupingModel.current);
      props.apiRef.current.setColumnVisibilityModel(columnVisibilityModel);
      rowGroupingModel.current = newModel;
    });
  }, [props.apiRef]);
  return React.useMemo(() => {
    const invariantInitialState = initialProps.current.initialState;
    const columnVisibilityModel = updateColumnVisibilityModel(invariantInitialState?.columns?.columnVisibilityModel, rowGroupingModel.current, undefined);
    return _extends({}, invariantInitialState, {
      columns: _extends({}, invariantInitialState?.columns, {
        columnVisibilityModel
      })
    });
  }, []);
};
