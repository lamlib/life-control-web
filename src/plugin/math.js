export default class Math {
  static get toolbox() {
    return {
      title: 'Math',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"/><path d="m5.5 12.5l.475-.316c.473-.316.71-.474.938-.404c.227.071.333.335.545.864L9 16.5l2.088-6.265c.44-1.32.66-1.98 1.184-2.357s1.22-.378 2.611-.378H18.5M17 12l-1.5 1.5m0 0L14 15m1.5-1.5L17 15m-1.5-1.5L14 12"/></g></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      tex: data.tex || '',
      displayMode: data.displayMode !== undefined ? data.displayMode : true
    };
    this.config = config;

    // Load KaTeX if not already loaded
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);
    }

    if (!window.katex) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      document.head.appendChild(script);
    }
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    const container = document.createElement('div');
    container.classList.add('px-4', 'py-3');

    const input = document.createElement('div');
    input.contentEditable = true;
    input.classList.add(
      'font-mono', 'text-sm', 'p-2', 'bg-gray-50',
      'rounded', 'outline-none', 'mb-2'
    );
    input.dataset.placeholder = 'Enter LaTeX equation...';
    input.textContent = this.data.tex;

    const preview = document.createElement('div');
    preview.classList.add('my-2', 'flex', 'justify-center');

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Display mode toggle
    const displayModeBtn = document.createElement('button');
    displayModeBtn.type = 'button';
    displayModeBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      this.data.displayMode ? 'bg-gray-200' : ''
    );
    displayModeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.5A.5.5 0 0 1 .5 2h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 7h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 12h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/></svg>';
    displayModeBtn.title = 'Toggle display mode';

    displayModeBtn.addEventListener('click', () => {
      this.data.displayMode = !this.data.displayMode;
      displayModeBtn.classList.toggle('bg-gray-200');
      this._renderPreview(preview, input.textContent);
    });

    // Error message
    const error = document.createElement('div');
    error.classList.add(
      'text-red-500', 'text-sm', 'hidden'
    );

    input.addEventListener('input', () => {
      this.data.tex = input.textContent;
      this._renderPreview(preview, input.textContent);
    });

    container.appendChild(input);
    container.appendChild(preview);
    container.appendChild(error);
    controls.appendChild(displayModeBtn);
    wrapper.appendChild(container);
    wrapper.appendChild(controls);

    // Initial render
    if (this.data.tex) {
      this._renderPreview(preview, this.data.tex);
    }

    return wrapper;
  }

  _renderPreview(preview, tex) {
    if (!tex.trim()) {
      preview.innerHTML = '';
      return;
    }

    try {
      if (window.katex) {
        window.katex.render(tex, preview, {
          displayMode: this.data.displayMode,
          throwOnError: false
        });
      } else {
        preview.textContent = tex;
      }
      preview.nextElementSibling.classList.add('hidden');
    } catch (error) {
      preview.innerHTML = '';
      preview.nextElementSibling.classList.remove('hidden');
      preview.nextElementSibling.textContent = error.message;
    }
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.tex.trim() !== '';
  }

  static get sanitize() {
    return {
      tex: {}
    };
  }
}
