export default class Footnote {
  static get toolbox() {
    return {
      title: 'Footnote',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.75 5.888v2.835m0 0L22 7.706m-2.25 1.017L17.5 7.706m2.25 1.017l-1.8 2.165m1.8-2.165l1.8 2.165M12 21.002H6M16 5.998c0-.657 0-.986-.08-1.274a2.1 2.1 0 0 0-1.166-1.35c-.265-.113-.566-.145-1.166-.209c-1.418-.151-3.2-.167-4.588-.167s-3.17.016-4.588.167c-.6.064-.9.096-1.166.21a2.1 2.1 0 0 0-1.165 1.35C2 5.011 2 5.34 2 5.997M9 3.35V21" color="currentColor"/></svg>'
    };
  }

  static get state() {
    return {
      footnoteCounter: 0,
      footnotes: new Map()
    };
  }

  constructor({data, config}) {
    this.data = {
      id: data.id || `footnote-${Date.now()}`,
      number: data.number || ++Footnote.state.footnoteCounter,
      content: data.content || ''
    };
    this.config = config;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    const container = document.createElement('div');
    container.classList.add('px-4', 'py-3', 'flex', 'items-start', 'gap-2');

    // Reference number
    const reference = document.createElement('sup');
    reference.classList.add(
      'text-xs', 'font-medium', 'text-blue-600',
      'cursor-pointer', 'hover:text-blue-800'
    );
    reference.textContent = this.data.number;

    // Footnote content
    const content = document.createElement('div');
    content.contentEditable = true;
    content.classList.add(
      'flex-1', 'text-sm', 'text-gray-600',
      'outline-none', 'min-h-[1em]'
    );
    content.dataset.placeholder = 'Enter footnote content...';
    content.textContent = this.data.content;

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add(
      'absolute', 'left-0', 'bottom-full', 'mb-2',
      'bg-white', 'shadow-lg', 'rounded-lg', 'p-3',
      'text-sm', 'max-w-sm', 'hidden',
      'border', 'border-gray-200', 'z-50'
    );
    tooltip.textContent = this.data.content || 'No content yet';

    reference.addEventListener('mouseenter', () => {
      tooltip.classList.remove('hidden');
    });

    reference.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });

    content.addEventListener('input', () => {
      this.data.content = content.textContent;
      tooltip.textContent = content.textContent;
      Footnote.state.footnotes.set(this.data.id, {
        number: this.data.number,
        content: this.data.content
      });
    });

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      'text-gray-500', 'hover:text-red-500'
    );
    deleteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>';
    deleteBtn.title = 'Delete footnote';

    deleteBtn.addEventListener('click', () => {
      Footnote.state.footnotes.delete(this.data.id);
      wrapper.remove();
      // Renumber remaining footnotes
      this._renumberFootnotes();
    });

    controls.appendChild(deleteBtn);
    container.appendChild(reference);
    container.appendChild(content);
    wrapper.appendChild(container);
    wrapper.appendChild(controls);
    wrapper.appendChild(tooltip);

    // Store footnote in static map
    Footnote.state.footnotes.set(this.data.id, {
      number: this.data.number,
      content: this.data.content
    });

    return wrapper;
  }

  _renumberFootnotes() {
    let counter = 1;
    for (const [id, footnote] of Footnote.state.footnotes) {
      footnote.number = counter++;
    }
    Footnote.state.footnoteCounter = counter - 1;
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.content.trim() !== '';
  }

  static get sanitize() {
    return {
      content: {
        br: true,
        a: {
          href: true,
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }
    };
  }
}
