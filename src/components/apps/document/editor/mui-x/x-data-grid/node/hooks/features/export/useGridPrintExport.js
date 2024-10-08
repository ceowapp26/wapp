"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGridPrintExport = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _utils = require("@mui/utils");
var _useGridLogger = require("../../utils/useGridLogger");
var _gridFilterSelector = require("../filter/gridFilterSelector");
var _gridColumnsSelector = require("../columns/gridColumnsSelector");
var _gridClasses = require("../../../constants/gridClasses");
var _useGridApiMethod = require("../../utils/useGridApiMethod");
var _gridRowsMetaSelector = require("../rows/gridRowsMetaSelector");
var _utils2 = require("./utils");
var _useGridPaginationModel = require("../pagination/useGridPaginationModel");
var _pipeProcessing = require("../../core/pipeProcessing");
var _GridToolbarExport = require("../../../components/toolbar/GridToolbarExport");
var _gridColumnsUtils = require("../columns/gridColumnsUtils");
var _gridCheckboxSelectionColDef = require("../../../colDef/gridCheckboxSelectionColDef");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function raf() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}
function buildPrintWindow(title) {
  const iframeEl = document.createElement('iframe');
  iframeEl.style.position = 'absolute';
  iframeEl.style.width = '0px';
  iframeEl.style.height = '0px';
  iframeEl.title = title || document.title;
  return iframeEl;
}

/**
 * @requires useGridColumns (state)
 * @requires useGridFilter (state)
 * @requires useGridSorting (state)
 * @requires useGridParamsApi (method)
 */
const useGridPrintExport = (apiRef, props) => {
  const logger = (0, _useGridLogger.useGridLogger)(apiRef, 'useGridPrintExport');
  const doc = React.useRef(null);
  const previousGridState = React.useRef(null);
  const previousColumnVisibility = React.useRef({});
  const previousRows = React.useRef([]);
  React.useEffect(() => {
    doc.current = (0, _utils.unstable_ownerDocument)(apiRef.current.rootElementRef.current);
  }, [apiRef]);

  // Returns a promise because updateColumns triggers state update and
  // the new state needs to be in place before the grid can be sized correctly
  const updateGridColumnsForPrint = React.useCallback((fields, allColumns, includeCheckboxes) => new Promise(resolve => {
    const exportedColumnFields = (0, _utils2.getColumnsToExport)({
      apiRef,
      options: {
        fields,
        allColumns
      }
    }).map(column => column.field);
    const columns = (0, _gridColumnsSelector.gridColumnDefinitionsSelector)(apiRef);
    const newColumnVisibilityModel = {};
    columns.forEach(column => {
      newColumnVisibilityModel[column.field] = exportedColumnFields.includes(column.field);
    });
    if (includeCheckboxes) {
      newColumnVisibilityModel[_gridCheckboxSelectionColDef.GRID_CHECKBOX_SELECTION_COL_DEF.field] = true;
    }
    apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
    resolve();
  }), [apiRef]);
  const updateGridRowsForPrint = React.useCallback(getRowsToExport => {
    const rowsToExportIds = getRowsToExport({
      apiRef
    });
    const newRows = rowsToExportIds.map(id => apiRef.current.getRow(id));
    apiRef.current.setRows(newRows);
  }, [apiRef]);
  const handlePrintWindowLoad = React.useCallback((printWindow, options) => {
    const normalizeOptions = (0, _extends2.default)({
      copyStyles: true,
      hideToolbar: false,
      hideFooter: false,
      includeCheckboxes: false
    }, options);
    const printDoc = printWindow.contentDocument;
    if (!printDoc) {
      return;
    }
    const rowsMeta = (0, _gridRowsMetaSelector.gridRowsMetaSelector)(apiRef.current.state);
    const gridRootElement = apiRef.current.rootElementRef.current;
    const gridClone = gridRootElement.cloneNode(true);

    // Allow to overflow to not hide the border of the last row
    const gridMain = gridClone.querySelector(`.${_gridClasses.gridClasses.main}`);
    gridMain.style.overflow = 'visible';

    // See https://support.google.com/chrome/thread/191619088?hl=en&msgid=193009642
    gridClone.style.contain = 'size';
    let gridToolbarElementHeight = gridRootElement.querySelector(`.${_gridClasses.gridClasses.toolbarContainer}`)?.offsetHeight || 0;
    let gridFooterElementHeight = gridRootElement.querySelector(`.${_gridClasses.gridClasses.footerContainer}`)?.offsetHeight || 0;
    if (normalizeOptions.hideToolbar) {
      gridClone.querySelector(`.${_gridClasses.gridClasses.toolbarContainer}`)?.remove();
      gridToolbarElementHeight = 0;
    }
    if (normalizeOptions.hideFooter) {
      gridClone.querySelector(`.${_gridClasses.gridClasses.footerContainer}`)?.remove();
      gridFooterElementHeight = 0;
    }

    // Expand container height to accommodate all rows
    const computedTotalHeight = rowsMeta.currentPageTotalHeight + (0, _gridColumnsUtils.getTotalHeaderHeight)(apiRef, props) + gridToolbarElementHeight + gridFooterElementHeight;
    gridClone.style.height = `${computedTotalHeight}px`;
    // The height above does not include grid border width, so we need to exclude it
    gridClone.style.boxSizing = 'content-box';

    // the footer is always being placed at the bottom of the page as if all rows are exported
    // so if getRowsToExport is being used to only export a subset of rows then we need to
    // adjust the footer position to be correctly placed at the bottom of the grid
    const gridFooterElement = gridClone.querySelector(`.${_gridClasses.gridClasses.footerContainer}`);
    gridFooterElement.style.position = 'absolute';
    gridFooterElement.style.width = '100%';
    gridFooterElement.style.top = `${computedTotalHeight - gridFooterElementHeight}px`;

    // printDoc.body.appendChild(gridClone); should be enough but a clone isolation bug in Safari
    // prevents us to do it
    const container = document.createElement('div');
    container.appendChild(gridClone);
    printDoc.body.innerHTML = container.innerHTML;
    const defaultPageStyle = typeof normalizeOptions.pageStyle === 'function' ? normalizeOptions.pageStyle() : normalizeOptions.pageStyle;
    if (typeof defaultPageStyle === 'string') {
      // TODO custom styles should always win
      const styleElement = printDoc.createElement('style');
      styleElement.appendChild(printDoc.createTextNode(defaultPageStyle));
      printDoc.head.appendChild(styleElement);
    }
    if (normalizeOptions.bodyClassName) {
      printDoc.body.classList.add(...normalizeOptions.bodyClassName.split(' '));
    }
    const stylesheetLoadPromises = [];
    if (normalizeOptions.copyStyles) {
      const rootCandidate = gridRootElement.getRootNode();
      const root = rootCandidate.constructor.name === 'ShadowRoot' ? rootCandidate : doc.current;
      const headStyleElements = root.querySelectorAll("style, link[rel='stylesheet']");
      for (let i = 0; i < headStyleElements.length; i += 1) {
        const node = headStyleElements[i];
        if (node.tagName === 'STYLE') {
          const newHeadStyleElements = printDoc.createElement(node.tagName);
          const sheet = node.sheet;
          if (sheet) {
            let styleCSS = '';
            // NOTE: for-of is not supported by IE
            for (let j = 0; j < sheet.cssRules.length; j += 1) {
              if (typeof sheet.cssRules[j].cssText === 'string') {
                styleCSS += `${sheet.cssRules[j].cssText}\r\n`;
              }
            }
            newHeadStyleElements.appendChild(printDoc.createTextNode(styleCSS));
            printDoc.head.appendChild(newHeadStyleElements);
          }
        } else if (node.getAttribute('href')) {
          // If `href` tag is empty, avoid loading these links

          const newHeadStyleElements = printDoc.createElement(node.tagName);
          for (let j = 0; j < node.attributes.length; j += 1) {
            const attr = node.attributes[j];
            if (attr) {
              newHeadStyleElements.setAttribute(attr.nodeName, attr.nodeValue || '');
            }
          }
          stylesheetLoadPromises.push(new Promise(resolve => {
            newHeadStyleElements.addEventListener('load', () => resolve());
          }));
          printDoc.head.appendChild(newHeadStyleElements);
        }
      }
    }

    // Trigger print
    if (process.env.NODE_ENV !== 'test') {
      // wait for remote stylesheets to load
      Promise.all(stylesheetLoadPromises).then(() => {
        printWindow.contentWindow.print();
      });
    }
  }, [apiRef, doc, props]);
  const handlePrintWindowAfterPrint = React.useCallback(printWindow => {
    // Remove the print iframe
    doc.current.body.removeChild(printWindow);

    // Revert grid to previous state
    apiRef.current.restoreState(previousGridState.current || {});
    if (!previousGridState.current?.columns?.columnVisibilityModel) {
      // if the apiRef.current.exportState(); did not exported the column visibility, we update it
      apiRef.current.setColumnVisibilityModel(previousColumnVisibility.current);
    }
    apiRef.current.unstable_setVirtualization(true);
    apiRef.current.setRows(previousRows.current);

    // Clear local state
    previousGridState.current = null;
    previousColumnVisibility.current = {};
    previousRows.current = [];
  }, [apiRef]);
  const exportDataAsPrint = React.useCallback(async options => {
    logger.debug(`Export data as Print`);
    if (!apiRef.current.rootElementRef.current) {
      throw new Error('MUI X: No grid root element available.');
    }
    previousGridState.current = apiRef.current.exportState();
    // It appends that the visibility model is not exported, especially if columnVisibility is not controlled
    previousColumnVisibility.current = (0, _gridColumnsSelector.gridColumnVisibilityModelSelector)(apiRef);
    previousRows.current = apiRef.current.getSortedRows();
    if (props.pagination) {
      const visibleRowCount = (0, _gridFilterSelector.gridExpandedRowCountSelector)(apiRef);
      const paginationModel = {
        page: 0,
        pageSize: visibleRowCount
      };
      apiRef.current.setState(state => (0, _extends2.default)({}, state, {
        pagination: (0, _extends2.default)({}, state.pagination, {
          paginationModel: (0, _useGridPaginationModel.getDerivedPaginationModel)(state.pagination,
          // Using signature `DataGridPro` to allow more than 100 rows in the print export
          'DataGridPro', paginationModel)
        })
      }));
      apiRef.current.forceUpdate();
    }
    await updateGridColumnsForPrint(options?.fields, options?.allColumns, options?.includeCheckboxes);
    updateGridRowsForPrint(options?.getRowsToExport ?? _utils2.defaultGetRowsToExport);
    apiRef.current.unstable_setVirtualization(false);
    await raf(); // wait for the state changes to take action
    const printWindow = buildPrintWindow(options?.fileName);
    if (process.env.NODE_ENV === 'test') {
      doc.current.body.appendChild(printWindow);
      // In test env, run the all pipeline without waiting for loading
      handlePrintWindowLoad(printWindow, options);
      handlePrintWindowAfterPrint(printWindow);
    } else {
      printWindow.onload = () => {
        handlePrintWindowLoad(printWindow, options);
        const mediaQueryList = printWindow.contentWindow.matchMedia('print');
        mediaQueryList.addEventListener('change', mql => {
          const isAfterPrint = mql.matches === false;
          if (isAfterPrint) {
            handlePrintWindowAfterPrint(printWindow);
          }
        });
      };
      doc.current.body.appendChild(printWindow);
    }
  }, [props, logger, apiRef, handlePrintWindowLoad, handlePrintWindowAfterPrint, updateGridColumnsForPrint, updateGridRowsForPrint]);
  const printExportApi = {
    exportDataAsPrint
  };
  (0, _useGridApiMethod.useGridApiMethod)(apiRef, printExportApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addExportMenuButtons = React.useCallback((initialValue, options) => {
    if (options.printOptions?.disableToolbarButton) {
      return initialValue;
    }
    return [...initialValue, {
      component: /*#__PURE__*/(0, _jsxRuntime.jsx)(_GridToolbarExport.GridPrintExportMenuItem, {
        options: options.printOptions
      }),
      componentName: 'printExport'
    }];
  }, []);
  (0, _pipeProcessing.useGridRegisterPipeProcessor)(apiRef, 'exportMenu', addExportMenuButtons);
};
exports.useGridPrintExport = useGridPrintExport;