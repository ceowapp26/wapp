import * as React from 'react';
import { GridApiCommunity } from '../../../models/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/dataGridProps';
import { GridAggregationFunction, GridAggregationLookup } from './gridAggregationInterfaces';
export declare const createAggregationLookup: ({ apiRef, aggregationFunctions, aggregationRowsScope, getAggregationPosition, }: {
    apiRef: React.MutableRefObject<gridApiCommunity>;
    aggregationFunctions: Record<string, GridAggregationFunction>;
    aggregationRowsScope: DataGridProcessedProps['aggregationRowsScope'];
    getAggregationPosition: DataGridProcessedProps['getAggregationPosition'];
}) => GridAggregationLookup;


