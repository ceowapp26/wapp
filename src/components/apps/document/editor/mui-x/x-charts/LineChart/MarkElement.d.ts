import * as React from 'react';
import { HighlightScope } from '../context/HighlightProvider';
import { SeriesId } from '../models/seriesType/common';
export interface MarkElementClasses {
    /** Styles applied to the root element. */
    root: string;
    /** Styles applied to the root element when higlighted. */
    highlighted: string;
    /** Styles applied to the root element when faded. */
    faded: string;
}
export type MarkElementClassKey = keyof MarkElementClasses;
interface MarkElementOwnerState {
    id: SeriesId;
    color: string;
    isFaded: boolean;
    isHighlighted: boolean;
    classes?: Partial<MarkElementClasses>;
}
export declare function getMarkElementUtilityClass(slot: string): string;
export declare const markElementClasses: MarkElementClasses;
export type MarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> & Omit<React.ComponentPropsWithoutRef<'path'>, 'id'> & {
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
    highlightScope?: Partial<HighlightScope>;
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
declare function MarkElement(props: MarkElementProps): React.JSX.Element;
declare namespace MarkElement {
    var propTypes: any;
}
export { MarkElement };
