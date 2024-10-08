"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommodityColumns = void 0;
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _services = require("../services");
var _renderer = require("../renderer");
var _staticData = require("../services/static-data");
const getCommodityColumns = (editable = false) => [{
  field: 'id',
  generateData: _services.randomId,
  hide: true
}, {
  field: 'desk',
  headerName: 'Desk',
  generateData: _services.randomDesk,
  width: 110
}, {
  field: 'commodity',
  headerName: 'Commodity',
  generateData: _services.randomCommodity,
  width: 180,
  editable
}, {
  field: 'traderName',
  headerName: 'Trader Name',
  generateData: _services.randomTraderName,
  width: 120,
  editable
}, {
  field: 'traderEmail',
  headerName: 'Trader Email',
  generateData: _services.randomEmail,
  renderCell: _renderer.renderEmail,
  width: 150,
  editable
}, {
  field: 'quantity',
  headerName: 'Quantity',
  type: 'number',
  width: 140,
  generateData: _services.randomQuantity,
  editable,
  valueParser: value => Number(value)
}, {
  field: 'filledQuantity',
  headerName: 'Filled Quantity',
  generateData: _services.generateFilledQuantity,
  renderCell: _renderer.renderProgress,
  renderEditCell: _renderer.renderEditProgress,
  availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
  type: 'number',
  width: 120,
  editable
}, {
  field: 'isFilled',
  headerName: 'Is Filled',
  align: 'center',
  generateData: _services.generateIsFilled,
  type: 'boolean',
  width: 80,
  editable
}, {
  field: 'status',
  headerName: 'Status',
  generateData: _services.randomStatusOptions,
  renderCell: _renderer.renderStatus,
  renderEditCell: _renderer.renderEditStatus,
  type: 'singleSelect',
  valueOptions: _staticData.STATUS_OPTIONS,
  width: 150,
  editable
}, {
  field: 'unitPrice',
  headerName: 'Unit Price',
  generateData: _services.randomUnitPrice,
  type: 'number',
  editable,
  valueParser: value => Number(value)
}, {
  field: 'unitPriceCurrency',
  headerName: 'Unit Price Currency',
  generateData: _services.randomUnitPriceCurrency,
  renderEditCell: _renderer.renderEditCurrency,
  type: 'singleSelect',
  valueOptions: _staticData.CURRENCY_OPTIONS,
  width: 120,
  editable
}, {
  field: 'subTotal',
  headerName: 'Sub Total',
  valueGetter: (value, row) => row.quantity == null || row.unitPrice == null ? null : row.quantity * row.unitPrice,
  type: 'number',
  width: 120
}, {
  field: 'feeRate',
  headerName: 'Fee Rate',
  generateData: _services.randomFeeRate,
  type: 'number',
  width: 80,
  editable,
  valueParser: value => Number(value)
}, {
  field: 'feeAmount',
  headerName: 'Fee Amount',
  valueGetter: (value, row) => row.feeRate == null || row.quantity == null || row.unitPrice == null ? null : row.feeRate * row.quantity * row.unitPrice,
  type: 'number',
  width: 120
}, {
  field: 'incoTerm',
  generateData: _services.randomIncoterm,
  renderCell: _renderer.renderIncoterm,
  renderEditCell: _renderer.renderEditIncoterm,
  type: 'singleSelect',
  valueOptions: _staticData.INCOTERM_OPTIONS,
  editable
}, {
  field: 'totalPrice',
  headerName: 'Total in USD',
  valueGetter: (value, row) => row.feeRate == null || row.quantity == null || row.unitPrice == null ? null : row.feeRate + row.quantity * row.unitPrice,
  renderCell: _renderer.renderTotalPrice,
  type: 'number',
  width: 160
}, {
  field: 'pnl',
  headerName: 'PnL',
  generateData: _services.randomPnL,
  renderCell: _renderer.renderPnl,
  type: 'number',
  width: 140
}, {
  field: 'maturityDate',
  headerName: 'Maturity Date',
  generateData: _services.randomMaturityDate,
  type: 'date',
  editable
}, {
  field: 'tradeDate',
  headerName: 'Trade Date',
  generateData: _services.randomTradeDate,
  type: 'date',
  editable
}, {
  field: 'brokerId',
  headerName: 'Broker Id',
  generateData: _services.randomBrokerId,
  hide: true,
  editable
}, {
  field: 'brokerName',
  headerName: 'Broker Name',
  generateData: _services.randomCompanyName,
  width: 140,
  editable
}, {
  field: 'counterPartyName',
  headerName: 'Counterparty',
  generateData: _services.randomCompanyName,
  width: 180,
  editable
}, {
  field: 'counterPartyCountry',
  headerName: 'Counterparty Country',
  type: 'singleSelect',
  generateData: _services.randomCountry,
  renderCell: _renderer.renderCountry,
  valueOptions: _staticData.COUNTRY_ISO_OPTIONS_SORTED,
  valueParser: value => {
    if (typeof value === 'string') {
      return _staticData.COUNTRY_ISO_OPTIONS_SORTED.find(country => country.value === value);
    }
    return value;
  },
  valueFormatter: value => value?.label,
  groupingValueGetter: value => value.code,
  sortComparator: (v1, v2, param1, param2) => (0, _xDataGridPremium.gridStringOrNumberComparator)(v1.label, v2.label, param1, param2),
  editable,
  width: 120
}, {
  field: 'counterPartyCurrency',
  headerName: 'Counterparty Currency',
  generateData: _services.randomCurrency,
  renderEditCell: _renderer.renderEditCurrency,
  type: 'singleSelect',
  valueOptions: _staticData.CURRENCY_OPTIONS,
  editable
}, {
  field: 'counterPartyAddress',
  headerName: 'Counterparty Address',
  generateData: _services.randomAddress,
  width: 200,
  editable
}, {
  field: 'counterPartyCity',
  headerName: 'Counterparty City',
  generateData: _services.randomCity,
  width: 120,
  editable
}, {
  field: 'taxCode',
  headerName: 'Tax Code',
  generateData: _services.randomTaxCode,
  type: 'singleSelect',
  valueOptions: _staticData.TAXCODE_OPTIONS,
  editable
}, {
  field: 'contractType',
  headerName: 'Contract Type',
  generateData: _services.randomContractType,
  type: 'singleSelect',
  valueOptions: _staticData.CONTRACT_TYPE_OPTIONS,
  editable
}, {
  field: 'rateType',
  headerName: 'Rate Type',
  generateData: _services.randomRateType,
  type: 'singleSelect',
  valueOptions: _staticData.RATE_TYPE_OPTIONS,
  editable
}, {
  field: 'lastUpdated',
  headerName: 'Updated on',
  generateData: _services.randomUpdatedDate,
  type: 'dateTime',
  width: 180,
  editable
}, {
  field: 'dateCreated',
  headerName: 'Created on',
  generateData: _services.randomCreatedDate,
  type: 'date',
  width: 150,
  editable
}];
exports.getCommodityColumns = getCommodityColumns;