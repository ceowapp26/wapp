"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEmployeeColumns = void 0;
var _xDataGridPremium = require("@mui/x-data-grid-premium");
var _services = require("../services");
var _renderer = require("../renderer");
var _staticData = require("../services/static-data");
const getEmployeeColumns = () => [{
  field: 'id',
  generateData: _services.randomId,
  hide: true
}, {
  field: 'avatar',
  headerName: 'Avatar',
  generateData: _services.randomColor,
  display: 'flex',
  renderCell: _renderer.renderAvatar,
  valueGetter: (value, row) => row.name == null || row.avatar == null ? null : {
    name: row.name,
    color: row.avatar
  },
  sortable: false,
  filterable: false,
  groupable: false,
  aggregable: false,
  disableExport: true
}, {
  field: 'name',
  headerName: 'Name',
  generateData: _services.randomName,
  dataGeneratorUniquenessEnabled: true,
  width: 120,
  editable: true,
  groupable: false,
  aggregable: false
}, {
  field: 'website',
  headerName: 'Website',
  generateData: _services.randomUrl,
  renderCell: _renderer.renderLink,
  width: 160,
  editable: true,
  groupable: false,
  aggregable: false
}, {
  field: 'rating',
  headerName: 'Rating',
  generateData: _services.randomRating,
  display: 'flex',
  renderCell: _renderer.renderRating,
  renderEditCell: _renderer.renderEditRating,
  width: 180,
  type: 'number',
  editable: true,
  availableAggregationFunctions: ['avg', 'min', 'max', 'size']
}, {
  field: 'email',
  headerName: 'Email',
  generateData: _services.randomEmail,
  renderCell: _renderer.renderEmail,
  width: 150,
  editable: true
}, {
  field: 'phone',
  headerName: 'Phone',
  generateData: _services.randomPhoneNumber,
  width: 150,
  editable: true
}, {
  field: 'username',
  headerName: 'Username',
  generateData: _services.randomUserName,
  width: 150,
  editable: true
}, {
  field: 'city',
  headerName: 'City',
  generateData: _services.randomCity,
  editable: true
}, {
  field: 'country',
  headerName: 'Country',
  type: 'singleSelect',
  valueOptions: _staticData.COUNTRY_ISO_OPTIONS_SORTED,
  valueFormatter: value => value?.label,
  generateData: _services.randomCountry,
  renderCell: _renderer.renderCountry,
  renderEditCell: _renderer.renderEditCountry,
  sortComparator: (v1, v2, param1, param2) => (0, _xDataGridPremium.gridStringOrNumberComparator)(v1.label, v2.label, param1, param2),
  width: 150,
  editable: true
}, {
  field: 'company',
  headerName: 'Company',
  generateData: _services.randomCompanyName,
  width: 180,
  editable: true
}, {
  field: 'position',
  headerName: 'Position',
  generateData: _services.randomJobTitle,
  width: 180,
  editable: true
}, {
  field: 'lastUpdated',
  headerName: 'Updated on',
  generateData: _services.randomUpdatedDate,
  type: 'dateTime',
  width: 180,
  editable: true
}, {
  field: 'dateCreated',
  headerName: 'Created on',
  generateData: _services.randomCreatedDate,
  type: 'date',
  width: 120,
  editable: true
}, {
  field: 'isAdmin',
  headerName: 'Is admin?',
  generateData: _services.randomBoolean,
  type: 'boolean',
  width: 150,
  editable: true
}, {
  field: 'salary',
  headerName: 'Salary',
  generateData: () => (0, _services.randomInt)(30000, 80000),
  type: 'number',
  valueFormatter: value => {
    if (!value || typeof value !== 'number') {
      return value;
    }
    return `${value.toLocaleString()}$`;
  }
}];
exports.getEmployeeColumns = getEmployeeColumns;