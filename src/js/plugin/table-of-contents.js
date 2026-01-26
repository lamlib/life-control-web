export default class TableOfContents {
  static get toolbox() {
    return {
      title: 'Table of Contents',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="currentColor" fill-rule="evenodd" d="M4.146 21.682c1.39 1.39 3.38 1.39 7.36 1.39h1c3.98 0 5.97 0 7.36-1.39s1.39-3.39 1.39-7.36v-4c0-3.98 0-5.97-1.39-7.36s-3.38-1.39-7.36-1.39h-.5c-.41 0-.75.34-.75.75s.34.75.75.75h.5c3.56 0 5.35 0 6.3.95s.95 2.74.95 6.3v4c0 3.56 0 5.35-.95 6.3s-2.74.95-6.3.95h-1c-3.56 0-5.35 0-6.3-.95s-.95-2.74-.95-6.3v-5c0-.41-.34-.75-.75-.75s-.75.34-.75.75v5c0 3.98 0 5.97 1.39 7.36m9.36-3.61h4c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-4c-.41 0-.75.34-.75.75s.34.75.75.75m4-10h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75m-4 5h4c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-4c-.41 0-.75.34-.75.75s.34.75.75.75m-5.5 6c-.3 0-.57-.18-.69-.45c-.351-.816-.936-1.046-1.012-1.077l-.008-.003a.76.76 0 0 1-.5-.93c.12-.39.52-.62.91-.51c.09.02.61.18 1.15.69c.54-1.05 1.47-2.47 2.82-3.14c.37-.19.82-.03 1.01.34s.04.82-.34 1.01c-1.69.85-2.61 3.54-2.62 3.57c-.1.29-.37.5-.68.51h-.03zm-1.45-10.22c.15.15.34.22.53.22s.38-.08.53-.22s.41-.35.72-.6c1.42-1.15 2.42-2.02 2.42-2.93s-1-1.79-2.42-2.93c-.31-.24-.57-.45-.72-.6a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06c.17.17.47.42.83.71l.141.116c.288.235.701.572 1.05.894h-5.08c-.41 0-.75.34-.75.75s.34.75.75.75h5.08c-.41.38-.9.78-1.19 1.01l-.17.14c-.279.23-.519.428-.66.57c-.29.29-.29.77 0 1.06" color="currentColor"/></svg>'
    };
  }

  static get state() {
    return {
      headings: new Map(),
      observer: null
    };
  }

  constructor({data, config, api}) {
    this.data = {
      items: data.items || [],
      autoUpdate: data.autoUpdate !== undefined ? data.autoUpdate : true
    };
    this.config = config;
    this.api = api;
    this.wrapper = null;
    this.toc = null;
    this.holder = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('relative', 'group');

    const container = document.createElement('div');
    container.classList.add('px-4', 'py-3');

    const title = document.createElement('h2');
    title.classList.add(
      'text-lg', 'font-semibold', 'mb-4',
      'text-gray-900'
    );
    title.textContent = 'Table of Contents';

    this.toc = document.createElement('div');
    this.toc.classList.add('space-y-2');

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Auto-update toggle
    const autoUpdateBtn = document.createElement('button');
    autoUpdateBtn.type = 'button';
    autoUpdateBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      this.data.autoUpdate ? 'bg-gray-200' : ''
    );
    autoUpdateBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>';
    autoUpdateBtn.title = 'Toggle auto-update';

    autoUpdateBtn.addEventListener('click', () => {
      this.data.autoUpdate = !this.data.autoUpdate;
      autoUpdateBtn.classList.toggle('bg-gray-200');
      if (this.data.autoUpdate) {
        this._startObserving();
      } else {
        this._stopObserving();
      }
    });

    // Refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.type = 'button';
    refreshBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg>';
    refreshBtn.title = 'Refresh table of contents';

    refreshBtn.addEventListener('click', () => {
      this._updateTOC();
    });

    controls.appendChild(autoUpdateBtn);
    controls.appendChild(refreshBtn);
    container.appendChild(title);
    container.appendChild(this.toc);
    this.wrapper.appendChild(container);
    this.wrapper.appendChild(controls);

    // Initialize headings observation
    if (this.data.autoUpdate) {
      this._startObserving();
    }
    this._updateTOC();

    return this.wrapper;
  }

  _getEditorContentElement() {
    // EditorJS v2+ provides redactor node
    if (this.api && this.api.ui && this.api.ui.nodes && this.api.ui.nodes.redactor) {
      return this.api.ui.nodes.redactor;
    }
    // Fallback to holder element by ID
    if (this.api && this.api.config && this.api.config.holder) {
      return document.getElementById(this.api.config.holder);
    }
    // Fallback to document.body (not recommended)
    return document.body;
  }

  _startObserving(retryCount = 0) {
    this.holder = this._getEditorContentElement();
    if (!this.holder || !(this.holder instanceof Element)) {
      if (retryCount < 10) {
        setTimeout(() => this._startObserving(retryCount + 1), 100);
      } else {
        console.warn('Table of Contents: Editor content element not found after multiple retries');
      }
      return;
    }

    if (TableOfContents.state.observer) {
      this._stopObserving();
    }

    TableOfContents.state.observer = new MutationObserver(() => {
      if (this.data.autoUpdate) {
        this._updateTOC();
      }
    });
    

    TableOfContents.state.observer.observe(this.holder, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  _stopObserving() {
    if (TableOfContents.state.observer) {
      TableOfContents.state.observer.disconnect();
      TableOfContents.state.observer = null;
    }
  }

  _updateTOC() {
    this.toc.innerHTML = '';
    this.data.items = [];

    this.holder = this._getEditorContentElement();
    if (!this.holder) {
      console.warn('Table of Contents: Editor content element not found');
      return;
    }

    const headings = Array.from(this.holder.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(heading => !this.wrapper.contains(heading));

    // Create TOC items
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName[1]);
      const text = heading.textContent;
      const id = `toc-heading-${index}`;

      // Add ID to heading if not present
      if (!heading.id) {
        heading.id = id;
      }

      const item = {
        id: heading.id,
        level,
        text,
        children: []
      };

      this.data.items.push(item);

      // Create TOC entry
      const entry = document.createElement('a');
      entry.href = `#${heading.id}`;
      entry.classList.add(
        'block', 'text-gray-600', 'hover:text-gray-900',
        'text-sm', 'no-underline', 'transition-colors'
      );
      entry.style.paddingLeft = `${(level - 1) * 1}rem`;
      entry.textContent = text;

      entry.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });

      this.toc.appendChild(entry);
    });
  }

  save() {
    return this.data;
  }

  destroy() {
    this._stopObserving();
  }

  static get sanitize() {
    return {
      items: {}
    };
  }
}
