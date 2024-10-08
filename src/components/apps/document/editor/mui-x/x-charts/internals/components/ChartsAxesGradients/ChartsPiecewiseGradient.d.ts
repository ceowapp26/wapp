import * as React from 'react';
import { PiecewiseColorConfig } from '../../../models/colorMapping';
type ChartsPiecewiseGradientProps = {
    isReveresed?: boolean;
    gradientId: string;
    size: number;
    direction: 'x' | 'y';
    scale: (value: any) => number | undefined;
    colorMap: PiecewiseColorConfig;
};
export default function ChartsPiecewiseGradient(props: ChartsPiecewiseGradientProps): React.JSX.Element;
export {};
