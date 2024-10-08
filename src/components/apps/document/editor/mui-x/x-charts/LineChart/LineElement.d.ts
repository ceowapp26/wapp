import * as React from 'react';
import { HighlightScope } from '../context/HighlightProvider';
import { AnimatedLineProps } from './AnimatedLine';
import { SeriesId } from '../models/seriesType/common';
export interface LineElementClasses {
    /** Styles applied to the root element. */
    root: string;
    /** Styles applied to the root element when higlighted. */
    highlighted: string;
    /** Styles applied to the root element when faded. */
    faded: string;
}
export type LineElementClassKey = keyof LineElementClasses;
export interface LineElementOwnerState {
    id: SeriesId;
    color: string;
    gradientId?: string;
    isFaded: boolean;
    isHighlighted: boolean;
    classes?: Partial<LineElementClasses>;
}
export declare function getLineElementUtilityClass(slot: string): string;
export declare const lineElementClasses: LineElementClasses;
export interface LineElementSlots {
    /**
     * The component that renders the line.
     * @default LineElementPath
     */
    line?: React.JSXElementConstructor<AnimatedLineProps>;
}
export interface LineElementSlotProps {
    line?: AnimatedLineProps;
}
export interface LineElementProps extends Omit<LineElementOwnerState, 'isFaded' | 'isHighlighted'>, Pick<AnimatedLineProps, 'skipAnimation'>, Omit<React.ComponentPropsWithoutRef<'path'>, 'color' | 'id'> {
    d: string;
    highlightScope?: Partial<HighlightScope>;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: LineElementSlotProps;
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: LineElementSlots;
}
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineElement API](https://mui.com/x/api/charts/line-element/)
 */
declare function LineElement(props: LineElementProps): React.JSX.Element;
declare namespace LineElement {
    var propTypes: any;
}
export { LineElement };
