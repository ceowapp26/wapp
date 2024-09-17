import { EditorView, KeyBinding } from '@codemirror/view';
import { KEYBOARD_SHORTCUTS } from "@/constants/code";

class KeyboardShortcutManager {
  private shortcuts: typeof KEYBOARD_SHORTCUTS;
  private handlers: { [key: string]: () => void };

  constructor(handlers: { [key: string]: () => void }) {
    this.shortcuts = KEYBOARD_SHORTCUTS;
    this.handlers = handlers;
  }

  public getKeymap(): KeyBinding[] {
    return Object.entries(this.shortcuts).map(([shortcut, action]) => ({
      key: shortcut,
      run: () => {
        if (this.handlers[action]) {
          this.handlers[action]();
          return true;
        }
        return false;
      },
    }));
  }
}

export default KeyboardShortcutManager;