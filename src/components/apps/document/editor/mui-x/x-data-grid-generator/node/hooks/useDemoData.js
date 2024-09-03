"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDemoData = exports.getInitialState = exports.getColumnsFromOptions = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _lruCache = _interopRequireDefault(require("lru-cache"));
var _realDataService = require("../services/real-data-service");
var _commodities = require("../columns/commodities.columns");
var _employees = require("../columns/employees.columns");
var _asyncWorker = _interopRequireDefault(require("../services/asyncWorker"));
var _treeDataGenerator = require("../services/tree-data-generator");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const dataCache = new _lruCache.default({
  max: 10,
  ttl: 60 * 5 * 1e3 // 5 minutes
});
// Generate fake data from a seed.
// It's about x20 faster than getRealData.
async function extrapolateSeed(rowLength, data) {
  return new Promise(resolve => {
    const seed = data.rows;
    const rows = data.rows.slice();
    const tasks = {
      current: rowLength - seed.length
    };
    function work() {
      const row = {};
      for (let j = 0; j < data.columns.length; j += 1) {
        const column = data.columns[j];
        const index = Math.round(Math.random() * (seed.length - 1));
        if (column.field === 'id') {
          row.id = `id-${tasks.current + seed.length}`;
        } else {
          row[column.field] = seed[index][column.field];
        }
      }
      rows.push(row);
      tasks.current -= 1;
    }
    (0, _asyncWorker.default)({
      work,
      done: () => resolve((0, _extends2.default)({}, data, {
        rows
      })),
      tasks
    });
  });
}
const deepFreeze = object => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  // eslint-disable-next-line no-restricted-syntax
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
};
const getColumnsFromOptions = options => {
  let columns = options.dataSet === 'Commodity' ? (0, _commodities.getCommodityColumns)(options.editable) : (0, _employees.getEmployeeColumns)();
  if (options.visibleFields) {
    columns = columns.map(col => options.visibleFields?.includes(col.field) ? col : (0, _extends2.default)({}, col, {
      hide: true
    }));
  }
  if (options.maxColumns) {
    columns = columns.slice(0, options.maxColumns);
  }
  return columns;
};
exports.getColumnsFromOptions = getColumnsFromOptions;
const getInitialState = (options, columns) => {
  const columnVisibilityModel = {};
  columns.forEach(col => {
    if (col.hide) {
      columnVisibilityModel[col.field] = false;
    }
  });
  const groupingField = options.treeData?.groupingField;
  if (groupingField) {
    columnVisibilityModel[groupingField] = false;
  }
  return {
    columns: {
      columnVisibilityModel
    }
  };
};
exports.getInitialState = getInitialState;
const useDemoData = options => {
  const [rowLength, setRowLength] = React.useState(options.rowLength);
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const columns = React.useMemo(() => {
    return getColumnsFromOptions({
      dataSet: options.dataSet,
      editable: options.editable,
      maxColumns: options.maxColumns,
      visibleFields: options.visibleFields
    });
  }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);
  const [data, setData] = React.useState(() => {
    return (0, _treeDataGenerator.addTreeDataOptionsToDemoData)({
      columns,
      rows: [],
      initialState: getInitialState(options, columns)
    }, options.treeData);
  });
  React.useEffect(() => {
    const cacheKey = `${options.dataSet}-${rowLength}-${index}-${options.maxColumns}`;

    // Cache to allow fast switch between the JavaScript and TypeScript version
    // of the demos.
    if (dataCache.has(cacheKey)) {
      const newData = dataCache.get(cacheKey);
      setData(newData);
      setLoading(false);
      return undefined;
    }
    let active = true;
    (async () => {
      setLoading(true);
      let newData;
      if (rowLength > 1000) {
        newData = await (0, _realDataService.getRealGridData)(1000, columns);
        newData = await extrapolateSeed(rowLength, newData);
      } else {
        newData = await (0, _realDataService.getRealGridData)(rowLength, columns);
      }
      if (!active) {
        return;
      }
      newData = (0, _treeDataGenerator.addTreeDataOptionsToDemoData)(newData, {
        maxDepth: options.treeData?.maxDepth,
        groupingField: options.treeData?.groupingField,
        averageChildren: options.treeData?.averageChildren
      });

      // It's quite slow. No need for it in production.
      if (process.env.NODE_ENV !== 'production') {
        deepFreeze(newData);
      }
      dataCache.set(cacheKey, newData);
      setData(newData);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [rowLength, options.dataSet, options.maxColumns, options.treeData?.maxDepth, options.treeData?.groupingField, options.treeData?.averageChildren, index, columns]);
  return {
    data,
    loading,
    setRowLength,
    loadNewData: () => {
      setIndex(oldIndex => oldIndex + 1);
    }
  };
};
exports.useDemoData = useDemoData;