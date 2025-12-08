import { IconCode, IconMarker } from "../svg/icons";

export default class EditorJSMarker {
  static get isInline() {
    return true;
  }

  static get shortcut() {
    return 'CMD+M';
  }

  static get sanitize() {
    return {
        mark: true
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

    this.tag = 'MARK';
    this.class = 'bg-yellow-200';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = "button";
    this.button.innerHTML = IconMarker;
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
    const mark = document.createElement(this.tag);

    mark.classList.add(...this.class.split(' '));
    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
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
