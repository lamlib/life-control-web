export default class List {
  static get toolbox() {
    return {
      title: 'List',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5h12M3 5h2m4 7h12M3 12h2m4 7h12M3 19h2" color="currentColor"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({data, config, api}) {
    this.api = api;
    this.data = {
      style: data.style || 'unordered',
      items: data.items || ['']
    };
    this.config = config;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    // Style toggle button
    const styleToggle = document.createElement('button');
    styleToggle.classList.add(
      'absolute', '-left-12', 'top-3',
      'opacity-0', 'group-hover:opacity-100', 'transition-opacity',
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    styleToggle.innerHTML = this.data.style === 'ordered' ? '1.' : '•';
    styleToggle.addEventListener('click', () => {
      this.data.style = this.data.style === 'ordered' ? 'unordered' : 'ordered';
      styleToggle.innerHTML = this.data.style === 'ordered' ? '1.' : '•';
      this._updateList();
    });

    // Create list
    this.listElement = this._createListElement();

    wrapper.appendChild(styleToggle);
    wrapper.appendChild(this.listElement);

    return wrapper;
  }

  _createListElement() {
    const list = this.data.style === 'ordered' ? document.createElement('ol') : document.createElement('ul');
    list.classList.add('list-inside', 'px-4');
    list.classList.add(this.data.style === 'ordered' ? 'list-decimal' : 'list-disc');

    this.data.items.forEach((item, index) => {
      list.appendChild(this._createListItem(item, index));
    });

    return list;
  }

  _createListItem(content, index) {
    const li = document.createElement('li');
    li.classList.add('my-1'); // spacing

    const input = document.createElement('span');
    input.contentEditable = true;
    input.classList.add('inline-block', 'outline-none', 'px-1');
    input.style.minWidth = '1ch'; // ensures empty items are clickable
    input.textContent = content;

    input.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Enter':
          e.preventDefault();
          this._addNewItem(index + 1);
          break;
        case 'Backspace':
          if (input.textContent === '') {
            e.preventDefault();
            this._removeItem(index);
          }
          break;
      }
    });

    li.appendChild(input);
    return li;
  }

  _updateList() {
    const items = Array.from(this.listElement.children).map(li =>
      li.querySelector('[contenteditable]').textContent
    );

    this.data.items = items;
    const newList = this._createListElement();

    this.listElement.replaceWith(newList);
    this.listElement = newList;
  }

  _addNewItem(index) {
    const items = Array.from(this.listElement.children).map(li =>
      li.querySelector('[contenteditable]').textContent
    );

    items.splice(index, 0, '');
    this.data.items = items;

    const newItem = this._createListItem('', index);

    if (this.listElement.children[index]) {
      this.listElement.insertBefore(newItem, this.listElement.children[index]);
    } else {
      this.listElement.appendChild(newItem);
    }

    newItem.querySelector('[contenteditable]').focus();
  }

  _removeItem(index) {
    if (this.listElement.children.length === 1) return;

    const items = Array.from(this.listElement.children).map(li =>
      li.querySelector('[contenteditable]').textContent
    );
    items.splice(index, 1);
    this.data.items = items;

    this.listElement.children[index].remove();

    if (index > 0) {
      const prevInput = this.listElement.children[index - 1].querySelector('[contenteditable]');
      const len = prevInput.textContent.length;
      prevInput.focus();
      this.api.selection.setRange(prevInput, len, len);
    }
  }

  save() {
    return {
      style: this.data.style,
      items: Array.from(this.listElement.children).map(li =>
        li.querySelector('[contenteditable]').textContent.trim()
      )
    };
  }

  validate(savedData) {
    return savedData.items && savedData.items.length > 0;
  }
}
