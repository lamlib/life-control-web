export default class Link {
  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      a: {
        href: true,
        target: '_blank',
        rel: 'nofollow'
      }
    };
  }

  constructor({ api }) {
    this.api = api;
    this.button = null;
    this._state = false;
    this.tag = 'A';
    this.class = 'cdx-link';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(
      'px-2', 'py-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );

    this.button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M10 13.229q.213.349.504.654a3.56 3.56 0 0 0 4.454.59q.391-.24.73-.59l3.239-3.372c1.43-1.49 1.43-3.904 0-5.394a3.564 3.564 0 0 0-5.183 0l-.714.743"/><path d="m10.97 18.14l-.713.743a3.564 3.564 0 0 1-5.184 0c-1.43-1.49-1.43-3.905 0-5.394l3.24-3.372a3.564 3.564 0 0 1 5.183 0q.291.305.504.654"/></g></svg>
    `;

    return this.button;
  }

  surround(range) {
    if (!range) return;

    const selectedText = range.toString();

    if (this._state) {
      this.unwrap(range);
      return;
    }

    const url = prompt('Enter link URL');

    if (!url) return;

    const link = document.createElement(this.tag);
    
    link.href = this._validateURL(url);
    link.target = '_blank';
    link.rel = 'nofollow';
    link.classList.add(
      'text-blue-600', 
      'hover:text-blue-800', 
      'underline',
      'decoration-blue-600',
      'hover:decoration-blue-800'
    );

    this.wrap(range, link);
  }

  wrap(range, link) {
    const selectedContent = range.extractContents();
    link.appendChild(selectedContent);
    range.insertNode(link);

    this.api.selection.expandToTag(link);
  }

  unwrap(range) {
    const link = this.api.selection.findParentTag(this.tag);
    const text = link.innerHTML;

    link.remove();

    range.insertNode(document.createTextNode(text));
  }

  checkState(selection) {
    const link = this.api.selection.findParentTag(this.tag);
    
    this._state = !!link;

    if (this._state) {
      this.button.classList.add('bg-gray-200');
    } else {
      this.button.classList.remove('bg-gray-200');
    }
  }

  _validateURL(str) {
    let url;
    
    try {
      url = new URL(str);
    } catch {
      url = new URL('http://' + str);
    }

    return url.href;
  }
}
