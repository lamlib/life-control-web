export default class Bold {
  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      strong: true
    };
  }

  constructor({api}) {
    this.api = api;
    this.button = null;
    this._state = false;
    this.tag = 'STRONG';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(
      'px-2', 'py-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );

    this.button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 6c0-1.414 0-2.121.44-2.56C5.878 3 6.585 3 8 3h4.579C15.02 3 17 5.015 17 7.5S15.02 12 12.579 12H5zm7.429 6h1.238C16.06 12 18 14.015 18 16.5S16.06 21 13.667 21H8c-1.414 0-2.121 0-2.56-.44C5 20.122 5 19.415 5 18v-6" color="currentColor"/></svg>
    `;

    return this.button;
  }

  surround(range) {
    if (!range) {
      return;
    }

    const termWrapper = document.createElement(this.tag);

    termWrapper.classList.add('font-semibold');

    if (this._state) {
      this.unwrap(range);
    } else {
      this.wrap(range, termWrapper);
    }
  }

  wrap(range, tag) {
    const selectedContent = range.extractContents();
    tag.appendChild(selectedContent);
    range.insertNode(tag);

    this.api.selection.expandToTag(tag);
  }

  unwrap(range) {
    const bold = this.api.selection.findParentTag(this.tag);
    const text = bold.innerHTML;
    bold.remove();
    range.insertNode(document.createTextNode(text));
  }

  checkState() {
    const bold = this.api.selection.findParentTag(this.tag);
    this._state = !!bold;
    if (this._state) {
      this.button.classList.add('bg-gray-200');
    } else {
      this.button.classList.remove('bg-gray-200');
    }
  }
}
