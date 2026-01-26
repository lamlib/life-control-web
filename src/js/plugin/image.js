import { requestHandlers as apiService, hasError, setResponseOperator, resetResponseOperator, messageState } from'@lamlib/data-sync';

export default class ImageBlock {
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><circle cx="7.5" cy="7.5" r="1.5"/><path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"/><path d="M5 21c4.372-5.225 9.274-12.116 16.498-7.458"/></g></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return {
      tags: ['IMG'],
      files: {
        mimeTypes: ['image/*'],
        extensions: ['gif', 'jpg', 'jpeg', 'png', 'webp', 'svg']
      },
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|webp|svg)$/i
      }
    };
  }

  constructor({data, api, config, readOnly}) {
    this.api = api;
    this.config = config || {};
    this.readOnly = readOnly || false;
    this.data = {
      url: data.url || '',
      caption: data.caption || '',
      withBorder: data.withBorder !== undefined ? data.withBorder : false,
      withBackground: data.withBackground !== undefined ? data.withBackground : false,
      stretched: data.stretched !== undefined ? data.stretched : false,
    };

    this.wrapper = undefined;
    this.settings = [
      {
        name: 'withBorder',
        icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.1v3.373H1.9zm0 2.137h2.2v3.374h8.4v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.422zm15.3-2.137H14.9V5.868h-4.2V3.73h4.2c1.215 0 2.2.936 2.2 2.09v3.422z"/></svg>'
      },
      {
        name: 'withBackground',
        icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>'
      },
      {
        name: 'stretched',
        icon: '<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>'
      }
    ];
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('relative', 'group');

    if (this.data.url) {
      this._createImage(this.data.url);
      return this.wrapper;
    }

    // In readonly mode, show nothing if there's no image
    if (this.readOnly) {
      const placeholder = document.createElement('div');
      placeholder.classList.add('p-4', 'text-center', 'text-gray-400', 'text-sm');
      placeholder.textContent = 'No image';
      this.wrapper.appendChild(placeholder);
      return this.wrapper;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.classList.add('hidden');

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(
      'w-full', 'p-8', 'border-2', 'border-dashed',
      'border-gray-300', 'rounded-lg',
      'hover:border-gray-400', 'transition-colors',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );

    const buttonContent = document.createElement('div');
    buttonContent.classList.add('text-center', 'space-y-2');
    buttonContent.innerHTML = `
      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="text-sm text-gray-600">
        <label class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
          <span>Upload an image</span>
        </label>
        <p class="pl-1">or drag and drop</p>
      </div>
      <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
    `;

    button.appendChild(buttonContent);
    this.wrapper.appendChild(input);
    this.wrapper.appendChild(button);

    button.addEventListener('click', () => {
      input.click();
    });

    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this._uploadImage(e.target.files[0]);
      }
    });

    this.wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      button.classList.add('border-blue-500', 'bg-blue-50');
    });

    this.wrapper.addEventListener('dragleave', () => {
      button.classList.remove('border-blue-500', 'bg-blue-50');
    });

    this.wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      button.classList.remove('border-blue-500', 'bg-blue-50');
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this._uploadImage(e.dataTransfer.files[0]);
      }
    });

    return this.wrapper;
  }

  async _uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    setResponseOperator({ picker: result => result });
    const data = await apiService.postImage(formData);
    resetResponseOperator();
    if(hasError()) {
        alert('Lỗi, không thể lưu image, vui lòng thử lại sau.');
    } else {
        this.data.url = data.file.url;
        this._createImage(this.data.url);
    }
  }

  _createImage(url) {
    this.wrapper.innerHTML = '';

    const image = document.createElement('img');
    const caption = document.createElement('div');

    image.src = url;
    image.alt = this.data.caption;
    
    // Make caption non-editable in readonly mode
    caption.contentEditable = !this.readOnly;
    caption.dataset.placeholder = 'Enter a caption';
    caption.classList.add(
      'mt-2', 'text-center', 'text-sm', 'text-gray-500',
      'focus:outline-none'
    );
    
    // Only add placeholder styles if not in readonly mode
    if (!this.readOnly) {
      caption.classList.add(
        'empty:before:content-[attr(data-placeholder)]',
        'empty:before:text-gray-400'
      );
    }
    
    caption.innerHTML = this.data.caption;

    if (!this.readOnly) {
      caption.addEventListener('input', () => {
        this.data.caption = caption.innerHTML;
      });
    }

    const container = document.createElement('div');
    container.classList.add('relative');

    if (this.data.withBorder) {
      image.classList.add('border', 'border-gray-300', 'rounded');
    }

    if (this.data.withBackground) {
      container.classList.add('bg-gray-100', 'p-3', 'rounded');
    }

    if (this.data.stretched) {
      container.classList.add('w-full');
      image.classList.add('w-full');
    } else {
      container.classList.add('inline-block');
    }

    container.appendChild(image);
    
    // Only add controls in edit mode
    if (!this.readOnly) {
      const controls = this._createControls();
      controls.classList.add(
        'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
        'opacity-0', 'group-hover:opacity-100',
        'transition-opacity', 'bg-white', 'rounded-lg',
        'shadow-sm', 'p-1', 'flex', 'flex-col', 'gap-1'
      );
      container.appendChild(controls);
    }
    
    this.wrapper.appendChild(container);
    this.wrapper.appendChild(caption);
  }

  _createControls() {
    const wrapper = document.createElement('div');

    this.settings.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add(
        'p-2', 'rounded', 'hover:bg-gray-100',
        'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      );
      if(this.data[item.name]) {
        button.classList.add(this.data[item.name]);
      }
      button.innerHTML = item.icon;

      button.addEventListener('click', () => {
        this.data[item.name] = !this.data[item.name];
        this._createImage(this.data.url);
      });

      wrapper.appendChild(button);
    });

    return wrapper;
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.url.trim() !== '';
  }

  static get sanitize() {
    return {
      url: {},
      caption: {
        br: true
      }
    };
  }
}
