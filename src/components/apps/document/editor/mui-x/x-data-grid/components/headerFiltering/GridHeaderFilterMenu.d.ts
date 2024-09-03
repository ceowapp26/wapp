import * as React from 'react';
import { GridFilterOperator } from '../../models/gridFilterOperator';
import { GridFilterItem } from '../../models/gridFilterItem';
import { GridColDef } from '../../models/colDef/GridColDef';

interface GridHeaderFilterMenuProps {
    field: GridColDef['field'];
    applyFilterChanges: (item: GridFilterItem) => void;
    operators: GridFilterOperator<any, any, any>[];
    item: GridFilterItem;
    open: boolean;
    id: string;
    labelledBy: string;
    target: HTMLElement | null;
}
declare function GridHeaderFilterMenu({ open, field, target, applyFilterChanges, operators, item, id, labelledBy, }: GridHeaderFilterMenuProps): React.JSX.Element | null;
declare namespace GridHeaderFilterMenu {
    var propTypes: any;
}
export { GridHeaderFilterMenu };

