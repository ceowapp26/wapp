/// <reference types="@react-spring/core" />
import * as React from 'react';
import { SpringValue } from '@react-spring/web';
import { PieItemId } from '../models/seriesType/pie';
export interface PieArcLabelClasses {
    /** Styles applied to the root element. */
    root: string;
    /** Styles applied to the root element when higlighted. */
    highlighted: string;
    /** Styles applied to the root element when faded. */
    faded: string;
}
export type PieArcLabelClassKey = keyof PieArcLabelClasses;
interface PieArcLabelOwnerState {
    id: PieItemId;
    color: string;
    isFaded: boolean;
    isHighlighted: boolean;
    classes?: Partial<PieArcLabelClasses>;
}
export declare function getPieArcLabelUtilityClass(slot: string): string;
export declare const pieArcLabelClasses: PieArcLabelClasses;
export type PieArcLabelProps = PieArcLabelOwnerState & Omit<React.ComponentPropsWithoutRef<'text'>, 'id'> & {
    startAngle: SpringValue<number>;
    endAngle: SpringValue<number>;
    innerRadius: SpringValue<number>;
    outerRadius: SpringValue<number>;
    arcLabelRadius: SpringValue<number>;
    cornerRadius: SpringValue<number>;
    paddingAngle: SpringValue<number>;
} & {
    formattedArcLabel?: string | null;
};
declare function PieArcLabel(props: PieArcLabelProps): React.JSX.Element;
declare namespace PieArcLabel {
    var propTypes: any;
}
export { PieArcLabel };
