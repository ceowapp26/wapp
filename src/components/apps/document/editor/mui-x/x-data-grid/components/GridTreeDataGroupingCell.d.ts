import * as React from 'react';
import { GridRenderCellParams } from '../models/params/gridCellParams';
import { GridGroupNode } from '../models/gridRows';
interface GridTreeDataGroupingCellProps extends GridRenderCellParams<any, any, any, GridGroupNode> {
    hideDescendantCount?: boolean;
    /**
     * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
     * @default 2
     */
    offsetMultiplier?: number;
}
declare function GridTreeDataGroupingCell(props: GridTreeDataGroupingCellProps): React.JSX.Element;
declare namespace GridTreeDataGroupingCell {
    var propTypes: any;
}
export { GridTreeDataGroupingCell };
