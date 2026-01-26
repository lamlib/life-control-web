import { IconCode } from "../../svg/icons";

export default class EditorJSCodeInline {
  static get isInline() {
    return true;
  }

  static get shortcut() {
    return 'CMD+G';
  }

  static get sanitize() {
    return {
        code: true
    };
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = 'CODE';
    this.class = `font-mono text-[0.95em] px-[4px] py-[2px] rounded bg-zinc-200 text-red-500 dark:bg-zinc-700`;
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = "button";
    this.button.innerHTML = IconCode;
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range) {
    if (!range) return;

    const wrapper = this.api.selection.findParentTag(this.tag, this.class);

    if (wrapper) {
      this.unwrap(wrapper);
    } else {
      this.wrap(range);
    }
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const code = document.createElement(this.tag);

    code.classList.add(...this.class.split(' '));
    code.appendChild(selectedText);
    range.insertNode(code);

    this.api.selection.expandToTag(code);
  }

  unwrap(wrapper) {
    this.api.selection.expandToTag(wrapper);

    const selection = window.getSelection();

    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const unwrappedContent = range.extractContents();

      wrapper.remove();
      range.insertNode(unwrappedContent);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  checkState() {
    const mark = this.api.selection.findParentTag(this.tag);
    this.state = !!mark;
  }
}
