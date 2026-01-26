export default class Checklist {
  static get toolbox() {
    return {
      title: 'Checklist',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 6h10m-10 6h10m-10 6h10M3 7.393S4 8.045 4.5 9C4.5 9 6 5.25 8 4M3 18.393S4 19.045 4.5 20c0 0 1.5-3.75 3.5-5" color="currentColor"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({data, readOnly}) {
    this.readOnly = readOnly;
    this.data = {
      items: data.items || [{ text: '', checked: false }]
    };
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('space-y-2');

    this.data.items.forEach((item, index) => {
      const itemEl = this._createItem(item, index);
      wrapper.appendChild(itemEl);
    });

    if (!this.readOnly) {
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.classList.add(
        'flex', 'items-center', 'text-sm', 'text-gray-500',
        'hover:text-gray-700', 'focus:outline-none'
      );
      
      addButton.innerHTML = `
        <svg class="w-4 h-4 mr-2" viewBox="0 0 16 16">
          <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
        </svg>
        Add item
      `;

      addButton.addEventListener('click', () => {
        const newItem = { text: '', checked: false };
        this.data.items.push(newItem);
        
        const itemEl = this._createItem(newItem, this.data.items.length - 1);
        wrapper.insertBefore(itemEl, addButton);
        
        const input = itemEl.querySelector('[contenteditable]');
        input.focus();
      });

      wrapper.appendChild(addButton);
    }

    return wrapper;
  }

  _createItem(item, index) {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add(
      'flex', 'items-start', 'group',
      'hover:bg-gray-50', 'rounded', 'p-1'
    );

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    checkbox.disabled = this.readOnly;
    checkbox.classList.add(
      'mt-1', 'h-4', 'w-4', 'rounded',
      'border-gray-300', 'text-blue-600',
      'focus:ring-blue-500'
    );

    const textWrapper = document.createElement('div');
    textWrapper.classList.add('flex-1', 'ml-3');

    const text = document.createElement('div');
    text.contentEditable = !this.readOnly;
    text.classList.add('outline-none', 'focus:bg-white');
    
    if (item.checked) {
      text.classList.add('line-through');
    }
    
    text.innerHTML = item.text;

    if (!this.readOnly) {
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.classList.add(
        'ml-2', 'opacity-0', 'group-hover:opacity-100',
        'transition-opacity', 'text-gray-400',
        'hover:text-gray-600', 'focus:outline-none'
      );
      
      deleteButton.innerHTML = `
        <svg class="w-4 h-4" viewBox="0 0 16 16">
          <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" transform="rotate(45 8 8)"/>
        </svg>
      `;

      deleteButton.addEventListener('click', () => {
        if (this.data.items.length === 1) {
          this.data.items[0] = { text: '', checked: false };
          checkbox.checked = false;
          text.innerHTML = '';
          text.classList.remove('line-through');
        } else {
          this.data.items.splice(index, 1);
          itemWrapper.remove();
        }
      });

      textWrapper.appendChild(deleteButton);
    }

    checkbox.addEventListener('change', () => {
      item.checked = checkbox.checked;
      text.classList.toggle('line-through', checkbox.checked);
    });

    text.addEventListener('input', () => {
      item.text = text.innerHTML;
    });

    text.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const newItem = { text: '', checked: false };
        this.data.items.splice(index + 1, 0, newItem);
        
        const newItemEl = this._createItem(newItem, index + 1);
        if (itemWrapper.nextSibling) {
          itemWrapper.parentNode.insertBefore(newItemEl, itemWrapper.nextSibling);
        } else {
          itemWrapper.parentNode.insertBefore(
            newItemEl, 
            itemWrapper.parentNode.lastElementChild
          );
        }
        
        newItemEl.querySelector('[contenteditable]').focus();
      } else if (e.key === 'Backspace' && text.innerHTML === '') {
        e.preventDefault();
        if (this.data.items.length > 1) {
          this.data.items.splice(index, 1);
          itemWrapper.remove();
          
          if (index > 0) {
            const prevInput = wrapper.children[index - 1].querySelector('[contenteditable]');
            const len = prevInput.innerHTML.length;
            prevInput.focus();
            // Set cursor to end
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(prevInput.childNodes[0] || prevInput, len);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
    });

    textWrapper.insertBefore(text, textWrapper.firstChild);
    itemWrapper.appendChild(checkbox);
    itemWrapper.appendChild(textWrapper);

    return itemWrapper;
  }

  save() {
    return {
      items: this.data.items
    };
  }

  validate(savedData) {
    return savedData.items && Array.isArray(savedData.items);
  }

  static get sanitize() {
    return {
      items: {
        text: true
      }
    };
  }
}
