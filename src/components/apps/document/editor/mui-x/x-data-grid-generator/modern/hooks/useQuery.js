import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { getGridDefaultColumnTypes, GridLogicOperator } from '@mui/x-data-grid-pro';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import { useDemoData, getColumnsFromOptions, getInitialState } from './useDemoData';
import { randomInt } from '../services/random-generator';
const apiRef = {};
const simplifiedValueGetter = (field, colDef) => row => {
  return colDef.valueGetter?.(row[row.id], row, colDef, apiRef) || row[field];
};
const getRowComparator = (sortModel, columnsWithDefaultColDef) => {
  if (!sortModel) {
    const comparator = () => 0;
    return comparator;
  }
  const sortOperators = sortModel.map(sortItem => {
    const columnField = sortItem.field;
    const colDef = columnsWithDefaultColDef.find(({
      field
    }) => field === columnField);
    return _extends({}, sortItem, {
      valueGetter: simplifiedValueGetter(columnField, colDef),
      sortComparator: colDef.sortComparator
    });
  });
  const comparator = (row1, row2) => sortOperators.reduce((acc, {
    valueGetter,
    sort,
    sortComparator
  }) => {
    if (acc !== 0) {
      return acc;
    }
    const v1 = valueGetter(row1);
    const v2 = valueGetter(row2);
    return sort === 'desc' ? -1 * sortComparator(v1, v2) : sortComparator(v1, v2);
  }, 0);
  return comparator;
};
const getFilteredRows = (rows, filterModel, columnsWithDefaultColDef) => {
  if (filterModel === undefined || filterModel.items.length === 0) {
    return rows;
  }
  const valueGetters = filterModel.items.map(({
    field
  }) => simplifiedValueGetter(field, columnsWithDefaultColDef.find(column => column.field === field)));
  const filterFunctions = filterModel.items.map(filterItem => {
    const {
      field,
      operator
    } = filterItem;
    const colDef = columnsWithDefaultColDef.find(column => column.field === field);
    const filterOperator = colDef.filterOperators.find(({
      value
    }) => operator === value);
    let parsedValue = filterItem.value;
    if (colDef.valueParser) {
      const parser = colDef.valueParser;
      parsedValue = Array.isArray(filterItem.value) ? filterItem.value?.map(x => parser(x)) : parser(filterItem.value);
    }
    return filterOperator?.getApplyFilterFn({
      filterItem,
      value: parsedValue
    }, colDef);
  });
  if (filterModel.logicOperator === GridLogicOperator.Or) {
    return rows.filter(row => filterModel.items.some((_, index) => {
      const value = valueGetters[index](row);
      return filterFunctions[index] === null ? true : filterFunctions[index]({
        value
      });
    }));
  }
  return rows.filter(row => filterModel.items.every((_, index) => {
    const value = valueGetters[index](row);
    return filterFunctions[index] === null ? true : filterFunctions[index](value);
  }));
};

/**
 * Simulates server data loading
 */
export const loadServerRows = (rows, queryOptions, serverOptions, columnsWithDefaultColDef) => {
  const {
    minDelay = 100,
    maxDelay = 300,
    useCursorPagination
  } = serverOptions;
  if (maxDelay < minDelay) {
    throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
  }
  const delay = randomInt(minDelay, maxDelay);
  const {
    cursor,
    page = 0,
    pageSize
  } = queryOptions;
  let nextCursor;
  let firstRowIndex;
  let lastRowIndex;
  let filteredRows = getFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);
  const rowComparator = getRowComparator(queryOptions.sortModel, columnsWithDefaultColDef);
  filteredRows = [...filteredRows].sort(rowComparator);
  const totalRowCount = filteredRows.length;
  if (!pageSize) {
    firstRowIndex = 0;
    lastRowIndex = filteredRows.length;
  } else if (useCursorPagination) {
    firstRowIndex = cursor ? filteredRows.findIndex(({
      id
    }) => id === cursor) : 0;
    firstRowIndex = Math.max(firstRowIndex, 0); // if cursor not found return 0
    lastRowIndex = firstRowIndex + pageSize;
    nextCursor = lastRowIndex >= filteredRows.length ? undefined : filteredRows[lastRowIndex].id;
  } else {
    firstRowIndex = page * pageSize;
    lastRowIndex = (page + 1) * pageSize;
  }
  const hasNextPage = lastRowIndex < filteredRows.length - 1;
  const response = {
    returnedRows: filteredRows.slice(firstRowIndex, lastRowIndex),
    nextCursor,
    hasNextPage,
    totalRowCount
  };
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response);
    }, delay); // simulate network latency
  });
};
const DEFAULT_DATASET_OPTIONS = {
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6
};
const disableDelay = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;
const DEFAULT_SERVER_OPTIONS = {
  minDelay: disableDelay ? 0 : 100,
  maxDelay: disableDelay ? 0 : 300,
  useCursorPagination: true
};
export const createFakeServer = (dataSetOptions, serverOptions) => {
  const dataSetOptionsWithDefault = _extends({}, DEFAULT_DATASET_OPTIONS, dataSetOptions);
  const serverOptionsWithDefault = _extends({}, DEFAULT_SERVER_OPTIONS, serverOptions);
  const columns = getColumnsFromOptions(dataSetOptionsWithDefault);
  const initialState = getInitialState(dataSetOptionsWithDefault, columns);
  const defaultColDef = getGridDefaultColumnTypes();
  const columnsWithDefaultColDef = columns.map(column => _extends({}, defaultColDef[column.type || 'string'], column));
  const useQuery = queryOptions => {
    const {
      data: {
        rows
      },
      loading: dataGenerationIsLoading
    } = useDemoData(dataSetOptionsWithDefault);
    const queryOptionsRef = React.useRef(queryOptions);
    const [response, setResponse] = React.useState({
      pageInfo: {},
      rows: []
    });
    const [isLoading, setIsLoading] = React.useState(dataGenerationIsLoading);
    React.useEffect(() => {
      if (dataGenerationIsLoading) {
        // dataset is not ready
        return () => {};
      }
      queryOptionsRef.current = queryOptions;
      let active = true;
      setIsLoading(true);
      setResponse(prev => Object.keys(prev.pageInfo).length === 0 ? prev : _extends({}, prev, {
        pageInfo: {}
      }));
      (async function fetchData() {
        const {
          returnedRows,
          nextCursor,
          totalRowCount,
          hasNextPage
        } = await loadServerRows(rows, queryOptions, serverOptionsWithDefault, columnsWithDefaultColDef);
        if (!active) {
          return;
        }
        const newRep = {
          rows: returnedRows,
          pageInfo: {
            totalRowCount,
            nextCursor,
            hasNextPage,
            pageSize: returnedRows.length
          }
        };
        setResponse(prev => isDeepEqual(prev, newRep) ? prev : newRep);
        setIsLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [dataGenerationIsLoading, queryOptions, rows]);

    // We use queryOptions pointer to be sure that isLoading===true as soon as the options change
    const effectShouldStart = queryOptionsRef.current !== queryOptions;
    return _extends({
      isLoading: isLoading || effectShouldStart
    }, response);
  };
  return {
    columns,
    columnsWithDefaultColDef,
    initialState,
    useQuery
  };
};