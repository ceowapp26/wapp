import * as React from 'react';
import { GridColumnHeaderParams } from '../models/params/gridColumnHeaderParams';
import type { GridBaseColDef } from '../models/colDef/gridColDef';
declare function GridAggregationHeader(props: GridColumnHeaderParams & {
    renderHeader: GridBaseColDef['renderHeader'];
}): React.JSX.Element | null;
export { GridAggregationHeader };
