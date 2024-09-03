import * as React from 'react';
import { GridRenderCellParams } from '../models/params/gridCellParams';
import { GridGroupNode } from '../models/gridRows';

interface GridGroupingCriteriaCellProps extends GridRenderCellParams<any, any, any, GridGroupNode> {
    hideDescendantCount?: boolean;
}
export declare function GridGroupingCriteriaCell(props: GridGroupingCriteriaCellProps): React.JSX.Element;
export {};
