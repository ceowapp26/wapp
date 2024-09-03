/// <reference types="@react-spring/core" />
import * as React from 'react';
import { SpringValue } from '@react-spring/web';
import { HighlightScope } from '../context/HighlightProvider';
import { PieItemId } from '../models';
export interface PieArcClasses {
    /** Styles applied to the root element. */
    root: string;
    /** Styles applied to the root element when higlighted. */
    highlighted: string;
    /** Styles applied to the root element when faded. */
    faded: string;
}
export type PieArcClassKey = keyof PieArcClasses;
interface PieArcOwnerState {
    id: PieItemId;
    dataIndex: number;
    color: string;
    isFaded: boolean;
    isHighlighted: boolean;
    classes?: Partial<PieArcClasses>;
}
export declare function getPieArcUtilityClass(slot: string): string;
export declare const pieArcClasses: PieArcClasses;
export type PieArcProps = Omit<React.ComponentPropsWithoutRef<'path'>, 'id'> & PieArcOwnerState & {
    cornerRadius: SpringValue<number>;
    endAngle: SpringValue<number>;
    highlightScope?: Partial<HighlightScope>;
    innerRadius: SpringValue<number>;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    outerRadius: SpringValue<number>;
    paddingAngle: SpringValue<number>;
    startAngle: SpringValue<number>;
};
declare function PieArc(props: PieArcProps): React.JSX.Element;
declare namespace PieArc {
    var propTypes: any;
}
export { PieArc };
