import * as React from 'react';
import { ContinuousColorConfig } from '../../../models/colorMapping';
type ChartsContinuousGradientProps = {
    isReveresed?: boolean;
    gradientId: string;
    size: number;
    direction: 'x' | 'y';
    scale: (value: any) => number | undefined;
    colorMap: ContinuousColorConfig;
    colorScale: (value: any) => string | null;
};
export default function ChartsContinuousGradient(props: ChartsContinuousGradientProps): React.JSX.Element | null;
export {};
