export default class Note {
  static get toolbox() {
    return {
      title: 'Note',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10"/><path d="M12.242 17v-5c0-.471 0-.707-.146-.854c-.147-.146-.382-.146-.854-.146m.75-3h.009"/></g></svg>'
    };
  }

  constructor({data}) {
    this.data = {
      type: data.type || 'info', // info, warning, success, error
      title: data.title || '',
      message: data.message || ''
    };
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    const container = document.createElement('div');
    container.classList.add(
      'rounded-lg', 'p-4', 'my-4',
      'border-l-4'
    );

    this._updateStyle(container);

    const title = document.createElement('div');
    title.classList.add(
      'font-semibold', 'mb-2',
      'outline-none'
    );
    title.contentEditable = true;
    title.dataset.placeholder = 'Note title';
    title.innerHTML = this.data.title;

    const message = document.createElement('div');
    message.classList.add(
      'text-sm',
      'outline-none'
    );
    message.contentEditable = true;
    message.dataset.placeholder = 'Note content';
    message.innerHTML = this.data.message;

    // Event listeners
    title.addEventListener('input', () => {
      this.data.title = title.innerHTML;
    });

    message.addEventListener('input', () => {
      this.data.message = message.innerHTML;
    });

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1'
    );

    const select = document.createElement('select');
    select.classList.add(
      'block', 'w-20', 'p-1', 'bg-transparent', 'hover:bg-gray-100',
      'rounded', 'text-sm', 'focus:outline-none', 'focus:ring-2', 
      'focus:ring-blue-500', 'border-none'
    );

    const types = [
      { value: 'info', text: 'Info' },
      { value: 'warning', text: 'Warning' },
      { value: 'success', text: 'Success' },
      { value: 'error', text: 'Error' }
    ];

    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type.value;
      option.text = type.text;
      option.selected = this.data.type === type.value;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      this.data.type = e.target.value;
      this._updateStyle(container);
    });

    controls.appendChild(select);
    container.appendChild(title);
    container.appendChild(message);
    wrapper.appendChild(container);
    wrapper.appendChild(controls);

    return wrapper;
  }

  _updateStyle(container) {
    // Remove existing style classes
    container.classList.remove(
      'bg-blue-50', 'border-blue-500', 'text-blue-700',
      'bg-yellow-50', 'border-yellow-500', 'text-yellow-700',
      'bg-green-50', 'border-green-500', 'text-green-700',
      'bg-red-50', 'border-red-500', 'text-red-700'
    );

    // Add new style classes based on type
    switch (this.data.type) {
      case 'info':
        container.classList.add('bg-blue-50', 'border-blue-500', 'text-blue-700');
        break;
      case 'warning':
        container.classList.add('bg-yellow-50', 'border-yellow-500', 'text-yellow-700');
        break;
      case 'success':
        container.classList.add('bg-green-50', 'border-green-500', 'text-green-700');
        break;
      case 'error':
        container.classList.add('bg-red-50', 'border-red-500', 'text-red-700');
        break;
    }
  }

  save(blockContent) {
    const title = blockContent.querySelector('[data-placeholder="Note title"]');
    const message = blockContent.querySelector('[data-placeholder="Note content"]');

    return {
      type: this.data.type,
      title: title.innerHTML,
      message: message.innerHTML
    };
  }

  validate(savedData) {
    return savedData.message.trim() !== '';
  }

  static get sanitize() {
    return {
      title: {
        br: true
      },
      message: {
        br: true,
        b: true,
        i: true
      }
    };
  }
}
