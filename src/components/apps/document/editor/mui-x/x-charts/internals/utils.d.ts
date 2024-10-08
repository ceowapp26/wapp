export type SymbolsTypes = 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
export declare function getSymbol(shape: SymbolsTypes): number;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
/**
 * Transform mouse event position to corrdinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
export declare function getSVGPoint(svg: SVGSVGElement, event: MouseEvent): DOMPoint;
/**
 * Helper that converts values and percentages into values.
 * @param value The value provided by the developer. Can either be a number or a string with '%' or 'px'.
 * @param refValue The numerical value associated to 100%.
 * @returns The numerical value associated to the provided value.
 */
export declare function getPercentageValue(value: number | string, refValue: number): number;
/**
 * Remove spaces to have viable ids
 */
export declare function cleanId(id: string): string;
export {};
