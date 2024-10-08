import { ScaleOrdinal } from 'd3-scale';
import { ContinuousColorConfig, PiecewiseColorConfig, OrdinalColorConfig } from '../models/colorMapping';
export declare function getSequentialColorScale<Value extends number | Date>(config: ContinuousColorConfig<Value> | PiecewiseColorConfig<Value>): import("d3-scale").ScaleThreshold<Value, string, never> | import("d3-scale").ScaleSequential<string, never>;
export declare function getOrdinalColorScale<Value extends number | Date | string>(config: OrdinalColorConfig<Value>): ScaleOrdinal<Value, string, null | string> | ScaleOrdinal<number, string, null | string>;
export declare function getColorScale(config: ContinuousColorConfig | PiecewiseColorConfig | OrdinalColorConfig): ScaleOrdinal<string | number | Date, string, string | null> | ScaleOrdinal<number, string, string | null> | import("d3-scale").ScaleSequential<string, never> | import("d3-scale").ScaleThreshold<number | Date, string, never>;
