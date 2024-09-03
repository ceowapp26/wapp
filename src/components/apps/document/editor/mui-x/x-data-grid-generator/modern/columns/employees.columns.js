import { gridStringOrNumberComparator } from '@mui/x-data-grid-premium';
import { randomCity, randomCompanyName, randomCountry, randomCreatedDate, randomEmail, randomId, randomJobTitle, randomPhoneNumber, randomRating, randomUpdatedDate, randomUrl, randomUserName, randomBoolean, randomName, randomColor, randomInt } from '../services';
import { renderAvatar, renderCountry, renderEmail, renderLink, renderRating, renderEditRating, renderEditCountry } from '../renderer';
import { COUNTRY_ISO_OPTIONS_SORTED } from '../services/static-data';
export const getEmployeeColumns = () => [{
  field: 'id',
  generateData: randomId,
  hide: true
}, {
  field: 'avatar',
  headerName: 'Avatar',
  generateData: randomColor,
  display: 'flex',
  renderCell: renderAvatar,
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
  generateData: randomName,
  dataGeneratorUniquenessEnabled: true,
  width: 120,
  editable: true,
  groupable: false,
  aggregable: false
}, {
  field: 'website',
  headerName: 'Website',
  generateData: randomUrl,
  renderCell: renderLink,
  width: 160,
  editable: true,
  groupable: false,
  aggregable: false
}, {
  field: 'rating',
  headerName: 'Rating',
  generateData: randomRating,
  display: 'flex',
  renderCell: renderRating,
  renderEditCell: renderEditRating,
  width: 180,
  type: 'number',
  editable: true,
  availableAggregationFunctions: ['avg', 'min', 'max', 'size']
}, {
  field: 'email',
  headerName: 'Email',
  generateData: randomEmail,
  renderCell: renderEmail,
  width: 150,
  editable: true
}, {
  field: 'phone',
  headerName: 'Phone',
  generateData: randomPhoneNumber,
  width: 150,
  editable: true
}, {
  field: 'username',
  headerName: 'Username',
  generateData: randomUserName,
  width: 150,
  editable: true
}, {
  field: 'city',
  headerName: 'City',
  generateData: randomCity,
  editable: true
}, {
  field: 'country',
  headerName: 'Country',
  type: 'singleSelect',
  valueOptions: COUNTRY_ISO_OPTIONS_SORTED,
  valueFormatter: value => value?.label,
  generateData: randomCountry,
  renderCell: renderCountry,
  renderEditCell: renderEditCountry,
  sortComparator: (v1, v2, param1, param2) => gridStringOrNumberComparator(v1.label, v2.label, param1, param2),
  width: 150,
  editable: true
}, {
  field: 'company',
  headerName: 'Company',
  generateData: randomCompanyName,
  width: 180,
  editable: true
}, {
  field: 'position',
  headerName: 'Position',
  generateData: randomJobTitle,
  width: 180,
  editable: true
}, {
  field: 'lastUpdated',
  headerName: 'Updated on',
  generateData: randomUpdatedDate,
  type: 'dateTime',
  width: 180,
  editable: true
}, {
  field: 'dateCreated',
  headerName: 'Created on',
  generateData: randomCreatedDate,
  type: 'date',
  width: 120,
  editable: true
}, {
  field: 'isAdmin',
  headerName: 'Is admin?',
  generateData: randomBoolean,
  type: 'boolean',
  width: 150,
  editable: true
}, {
  field: 'salary',
  headerName: 'Salary',
  generateData: () => randomInt(30000, 80000),
  type: 'number',
  valueFormatter: value => {
    if (!value || typeof value !== 'number') {
      return value;
    }
    return `${value.toLocaleString()}$`;
  }
}];