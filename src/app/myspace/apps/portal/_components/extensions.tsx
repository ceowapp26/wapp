import { EditorState, Extension } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';

function createBeforeChangeExtension(onBeforeChange) {
  return EditorView.updateListener.of((update: ViewUpdate) => {
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
        onBeforeChange(changeObj, update.view);
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
      onBeforeChange(changeObj, update.view);
    }
  });
}

export function beforeChangeExtension(onBeforeChange): Extension {
  return createBeforeChangeExtension(onBeforeChange);
}