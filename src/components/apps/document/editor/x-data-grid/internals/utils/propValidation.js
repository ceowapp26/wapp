import { isNumber } from '../../utils/utils';
import { GridSignature } from '../../hooks/utils/useGridApiEventHandler';
export const propValidatorsDataGrid = [props => props.autoPageSize && props.autoHeight && ['MUI X: `<DataGrid autoPageSize={true} autoHeight={true} />` are not valid props.', 'You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.', '', 'Please remove one of these two props.'].join('\n') || undefined, props => props.paginationMode === 'client' && props.paginationMeta != null && ['MUI X: Usage of the `paginationMeta` prop with client-side pagination (`paginationMode="client"`) has no effect.', '`paginationMeta` is only meant to be used with `paginationMode="server"`.'].join('\n') || undefined, props => props.signature === GridSignature.DataGrid && props.paginationMode === 'client' && isNumber(props.rowCount) && ['MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect.', '`rowCount` is only meant to be used with `paginationMode="server"`.'].join('\n') || undefined, props => props.paginationMode === 'server' && props.rowCount == null && ["MUI X: The `rowCount` prop must be passed using `paginationMode='server'`", 'For more detail, see http://mui.com/components/data-grid/pagination/#index-based-pagination'].join('\n') || undefined];
const warnedOnceCache = new Set();
const warnOnce = message => {
  if (!warnedOnceCache.has(message)) {
    console.error(message);
    warnedOnceCache.add(message);
  }
};
export const validateProps = (props, validators) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  validators.forEach(validator => {
    const warning = validator(props);
    if (warning) {
      warnOnce(warning);
    }
  });
};
export const clearWarningsCache = () => {
  warnedOnceCache.clear();
};