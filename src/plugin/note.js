import { theme } from "./theme";

export default class Note {
  static get toolbox() {
    return {
      title: 'Note',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10"/><path d="M12.242 17v-5c0-.471 0-.707-.146-.854c-.147-.146-.382-.146-.854-.146m.75-3h.009"/></g></svg>'
    };
  }

  constructor({ data }) {
    this.data = {
      type: data.type || 'info', // info, warning, success, error
      title: data.title || '',
      message: data.message || ''
    };
    this.container = null;
  }

    getTypeClasses() {
      return {
        info: 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300',
        success: 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
        error: 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300'
      };
    }

  renderSettings() {
      return [
        {
          icon: '',
          label: 'Info',
          onActivate: () => {
            this.data.type = 'info';
            this._updateStyle(this.container);
          }
        },
        {
          icon: '',
          label: 'Warning',
          onActivate: () => {
            this.data.type = 'warning';
            this._updateStyle(this.container);
          }
        },
        {
          icon: '',
          label: 'Success',
          onActivate: () => {
            this.data.type = 'success';
            this._updateStyle(this.container);
          }
        },
        {
          icon: '',
          label: 'Error',
          onActivate: () => {
            this.data.type = 'error';
            this._updateStyle(this.container);
          }
        },
      ]
    }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    this.container = document.createElement('div');
    this.container.classList.add(
      'rounded-lg', 'p-4', 'my-4', 'border-l-4'
    );
    this._updateStyle(this.container);

    const title = document.createElement('div');
    title.classList.add('font-semibold', 'mb-2', 'outline-none');
    title.contentEditable = true;
    title.dataset.placeholder = 'Note title';
    title.innerHTML = this.data.title;

    const message = document.createElement('div');
    message.classList.add('text-sm', 'outline-none');
    message.contentEditable = true;
    message.dataset.placeholder = 'Note content';
    message.innerHTML = this.data.message;

    title.addEventListener('input', () => {
      this.data.title = title.innerHTML;
    });

    message.addEventListener('input', () => {
      this.data.message = message.innerHTML;
    });

    this.container.appendChild(title);
    this.container.appendChild(message);
    wrapper.appendChild(this.container);

    return wrapper;
  }

  _updateStyle(container) {
    container.className = 'rounded-lg p-4 my-4 border-l-4';
    const classes = this.getTypeClasses();
    if (classes[this.data.type]) {
      classes[this.data.type].split(' ').forEach(cls => container.classList.add(cls));
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
      title: { br: true },
      message: { br: true, b: true, i: true }
    };
  }
}
