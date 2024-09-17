import { EditorState, Extension, EditorSelection, SelectionRange } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';

export interface Statistics {
  /** Get the number of lines in the editor. */
  lineCount: number;
  /** Total length of the document */
  length: number;
  /** Get the proper line-break string for this state. */
  lineBreak: string;
  /** Returns true when the editor is configured to be read-only. */
  readOnly: boolean;
  /** The size (in columns) of a tab in the document. */
  tabSize: number;
  /** Cursor Position */
  selection: EditorSelection;
  /** Make sure the selection only has one range. */
  selectionAsSingle: SelectionRange;
  /** Retrieves a list of all current selections. */
  ranges: readonly SelectionRange[];
  /** Get the currently selected code. */
  selectionCode: string;
  /** The length of the given array should be the same as the number of active selections. */
  selections: string[];
  /** Return true if any text is selected. */
  selectedText: boolean;
}

export const getStatistics = (view: ViewUpdate): Statistics => {
  const state = view.state;
  const selection = state.selection;
  const selectedText = selection.ranges.some(range => range.from !== range.to);
  const selectionCode = selectedText ? state.sliceDoc(selection.main.from, selection.main.to) : '';

  return {
    lineCount: state.doc.lines,
    length: state.doc.length,
    lineBreak: state.lineBreak,
    readOnly: state.readOnly,
    tabSize: state.facet(EditorState.tabSize),
    selection,
    selectionAsSingle: selection.main,
    ranges: selection.ranges,
    selectionCode,
    selections: selection.ranges.map(range => state.sliceDoc(range.from, range.to)),
    selectedText,
  };
};

function createBeforeChangeExtension(onBeforeChange) {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    const stats = getStatistics(update); // Get statistics on every update

    if (update.docChanged) {
      const changes = update.changes;
      changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        const changeObj = {
          from: fromA,
          to: toA,
          text: inserted.toString(),
          cancel: () => {
            // This will effectively cancel the change
            return [];
          },
          update: (from, to, text) => {
            // This will modify the change
            return [{ from, to, insert: text }];
          }
        };
        onBeforeChange(changeObj, update.view, stats); 
      });
    } else if (update.selectionSet) {
      const selection = update.state.selection.main;
      const changeObj = {
        from: selection.from,
        to: selection.to,
        text: update.state.sliceDoc(selection.from, selection.to),
        cancel: () => {
          // For selection, cancelling doesn't make sense, so we do nothing
        },
        update: () => {
          // For selection, updating doesn't make sense, so we do nothing
        }
      };
      onBeforeChange(changeObj, update.view, stats); // Pass statistics to the callback
    }
  });
}

export function beforeChangeExtension(onBeforeChange): Extension {
  return createBeforeChangeExtension(onBeforeChange);
}
