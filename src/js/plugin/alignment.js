export default class Alignment {
  static get toolbox() {
    return {
      title: 'Alignment',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19v3m0-12v4m0-12v3M8 7.5c0-.844-.083-1.818.75-2.299C9.098 5 9.566 5 10.5 5h3c.935 0 1.402 0 1.75.201c.834.481.75 1.455.75 2.299s.084 1.818-.75 2.299c-.348.201-.815.201-1.75.201h-3c-.934 0-1.402 0-1.75-.201C7.917 9.318 8 8.344 8 7.5m-4 9c0-.844-.083-1.818.75-2.299C5.098 14 5.566 14 6.5 14h11c.935 0 1.402 0 1.75.201c.834.481.75 1.455.75 2.299s.084 1.818-.75 2.299c-.348.201-.815.201-1.75.201h-11c-.934 0-1.402 0-1.75-.201C3.917 18.318 4 17.344 4 16.5" color="currentColor"/></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      text: data.text || '',
      alignment: data.alignment || 'left'
    };
    this.config = config;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    const container = document.createElement('div');
    container.classList.add('px-4', 'py-3');

    const input = document.createElement('div');
    input.contentEditable = true;
    input.classList.add(
      'outline-none', 'min-h-[1em]', 'w-full',
      this._getAlignmentClass(this.data.alignment)
    );
    input.dataset.placeholder = 'Enter text...';
    input.textContent = this.data.text;

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Alignment buttons
    const alignments = [
      {value: 'left', icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>'},
      {value: 'center', icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>'},
      {value: 'right', icon: '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>'}
    ];

    alignments.forEach(({value, icon}) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add(
        'p-1', 'rounded', 'hover:bg-gray-100',
        'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
      );
      if (value === this.data.alignment) {
        btn.classList.add('bg-gray-200');
      }
      btn.innerHTML = icon;
      btn.title = `Align ${value}`;

      btn.addEventListener('click', () => {
        // Remove previous alignment class
        input.classList.remove(
          'text-left', 'text-center', 'text-right'
        );
        // Add new alignment class
        this.data.alignment = value;
        input.classList.add(this._getAlignmentClass(value));
        
        // Update button states
        controls.querySelectorAll('button').forEach(button => {
          button.classList.remove('bg-gray-200');
        });
        btn.classList.add('bg-gray-200');
      });

      controls.appendChild(btn);
    });

    input.addEventListener('input', () => {
      this.data.text = input.textContent;
    });

    container.appendChild(input);
    wrapper.appendChild(container);
    wrapper.appendChild(controls);

    return wrapper;
  }

  _getAlignmentClass(alignment) {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.text.trim() !== '';
  }

  static get sanitize() {
    return {
      text: {},
      alignment: {}
    };
  }
}
