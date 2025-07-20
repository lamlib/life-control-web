export default class File {
  static get toolbox() {
    return {
      title: 'File',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M21 11v-1c0-3.771 0-5.657-1.24-6.828C18.519 2 16.522 2 12.53 2h-1.06C7.479 2 5.482 2 4.24 3.172C3 4.343 3 6.229 3 10v4c0 3.771 0 5.657 1.24 6.828C5.481 22 7.478 22 11.47 22H12M8 7h8m-8 5h5"/><path d="M21 20.647V17c0-1.43-1.343-3-3-3s-3 1.57-3 3v3.5c0 .78.733 1.5 1.636 1.5c.904 0 1.637-.72 1.637-1.5v-2.735"/></g></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      file: data.file || null,
      caption: data.caption || '',
      url: data.url || '',
      name: data.name || '',
      size: data.size || 0,
      type: data.type || ''
    };
    this.config = config;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    if (this.data.url) {
      return this._createFilePreview();
    }

    const container = document.createElement('div');
    container.classList.add(
      'w-full', 'px-4', 'py-6', 'border-2', 'border-dashed',
      'border-gray-300', 'rounded-lg', 'text-center',
      'hover:border-gray-400', 'transition-colors'
    );

    const input = document.createElement('input');
    input.type = 'file';
    input.classList.add('hidden');
    input.multiple = false;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(
      'inline-flex', 'items-center', 'px-4', 'py-2', 'mb-2',
      'border', 'border-gray-300', 'rounded-md', 'shadow-sm',
      'text-sm', 'font-medium', 'text-gray-700', 'bg-white',
      'hover:bg-gray-50', 'focus:outline-none', 'focus:ring-2',
      'focus:ring-offset-2', 'focus:ring-blue-500'
    );
    button.innerHTML = `
      <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      Upload File
    `;

    const hint = document.createElement('div');
    hint.classList.add('mt-2', 'text-sm', 'text-gray-600');
    hint.textContent = 'or drag and drop';

    const types = document.createElement('div');
    types.classList.add('mt-1', 'text-xs', 'text-gray-500');
    types.textContent = 'PDF, DOC, DOCX, XLS, XLSX up to 10MB';

    button.addEventListener('click', () => {
      input.click();
    });

    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this._processFile(e.target.files[0]);
      }
    });

    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('border-blue-500', 'bg-blue-50');
    });

    wrapper.addEventListener('dragleave', () => {
      container.classList.remove('border-blue-500', 'bg-blue-50');
    });

    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('border-blue-500', 'bg-blue-50');
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this._processFile(e.dataTransfer.files[0]);
      }
    });

    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(hint);
    container.appendChild(types);
    wrapper.appendChild(container);

    return wrapper;
  }

  _processFile(file) {
    // Here you would typically upload the file to your server
    // For this example, we'll just store the file info
    this.data.file = file;
    this.data.name = file.name;
    this.data.size = file.size;
    this.data.type = file.type;
    this.data.url = URL.createObjectURL(file);

    const newContent = this._createFilePreview();
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(newContent);
  }

  _createFilePreview() {
    const container = document.createElement('div');
    container.classList.add('relative', 'group');

    const preview = document.createElement('div');
    preview.classList.add(
      'p-4', 'bg-gray-50', 'rounded-lg',
      'border', 'border-gray-200'
    );

    const fileInfo = document.createElement('div');
    fileInfo.classList.add('flex', 'items-center', 'space-x-3');

    // File icon
    const icon = document.createElement('div');
    icon.classList.add(
      'w-10', 'h-10', 'flex', 'items-center', 'justify-center',
      'rounded-lg', 'bg-gray-100'
    );
    icon.innerHTML = this._getFileIcon(this.data.type);

    // File details
    const details = document.createElement('div');
    details.classList.add('flex-1');

    const name = document.createElement('div');
    name.classList.add('text-sm', 'font-medium', 'text-gray-900');
    name.textContent = this.data.name;

    const meta = document.createElement('div');
    meta.classList.add('text-xs', 'text-gray-500');
    meta.textContent = this._formatFileSize(this.data.size);

    // Download button
    const download = document.createElement('a');
    download.href = this.data.url;
    download.download = this.data.name;
    download.classList.add(
      'inline-flex', 'items-center', 'px-3', 'py-1',
      'border', 'border-gray-300', 'rounded-md',
      'text-sm', 'font-medium', 'text-gray-700',
      'bg-white', 'hover:bg-gray-50'
    );
    download.innerHTML = `
      <svg class="-ml-1 mr-2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
      Download
    `;

    // Caption
    const caption = document.createElement('div');
    caption.contentEditable = true;
    caption.dataset.placeholder = 'Add a caption...';
    caption.classList.add(
      'mt-2', 'text-sm', 'text-gray-500',
      'focus:outline-none'
    );
    caption.innerHTML = this.data.caption;

    caption.addEventListener('input', () => {
      this.data.caption = caption.innerHTML;
    });

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1'
    );

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      'text-gray-500', 'hover:text-red-500'
    );
    removeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>';

    removeBtn.addEventListener('click', () => {
      URL.revokeObjectURL(this.data.url);
      this.data = {
        file: null,
        caption: '',
        url: '',
        name: '',
        size: 0,
        type: ''
      };
      this.wrapper.innerHTML = '';
      this.wrapper.appendChild(this.render());
    });

    controls.appendChild(removeBtn);
    details.appendChild(name);
    details.appendChild(meta);
    fileInfo.appendChild(icon);
    fileInfo.appendChild(details);
    fileInfo.appendChild(download);
    preview.appendChild(fileInfo);
    preview.appendChild(caption);
    container.appendChild(preview);
    container.appendChild(controls);

    return container;
  }

  _getFileIcon(type) {
    if (type.includes('pdf')) {
      return '<svg class="w-6 h-6 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
    }
    if (type.includes('word') || type.includes('document')) {
      return '<svg class="w-6 h-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
    }
    if (type.includes('sheet') || type.includes('excel')) {
      return '<svg class="w-6 h-6 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
    }
    return '<svg class="w-6 h-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
  }

  _formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.url !== '';
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
