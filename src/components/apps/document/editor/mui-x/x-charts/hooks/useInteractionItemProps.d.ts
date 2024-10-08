import { HighlightScope } from '../context/HighlightProvider';
import { SeriesItemIdentifier } from '../models';
export declare const useInteractionItemProps: (scope?: Partial<HighlightScope>, skip?: boolean) => (() => {}) | ((data: SeriesItemIdentifier) => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
});
export declare const getIsHighlighted: (selectedItem: SeriesItemIdentifier | null, currentItem: SeriesItemIdentifier, highlightScope?: Partial<HighlightScope>) => boolean;
export declare const getIsFaded: (selectedItem: SeriesItemIdentifier | null, currentItem: SeriesItemIdentifier, highlightScope?: Partial<HighlightScope>) => boolean;
