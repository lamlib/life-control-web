export default class Color {
  static get toolbox() {
    return {
      title: 'Color',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.58 9.71a6 6 0 0 0-7.16 3.58m7.16-3.58A6 6 0 1 1 12 19.972M17.58 9.71a6 6 0 1 0-11.16 0m4 3.58A6 6 0 0 0 10 15.5c0 1.777.773 3.374 2 4.472m-1.58-6.682a6.01 6.01 0 0 1-4-3.58m0 0A6 6 0 1 0 12 19.972" color="currentColor"/></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      text: data.text || '',
      color: data.color || '#000000',
      background: data.background || 'transparent'
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
      'outline-none', 'min-h-[1em]', 'w-full'
    );
    input.dataset.placeholder = 'Enter text...';
    input.textContent = this.data.text;
    input.style.color = this.data.color;
    input.style.backgroundColor = this.data.background;

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Text color picker
    const textColorPicker = document.createElement('input');
    textColorPicker.type = 'color';
    textColorPicker.value = this.data.color;
    textColorPicker.classList.add(
      'w-6', 'h-6', 'rounded', 'cursor-pointer',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    textColorPicker.title = 'Text color';

    // Background color picker
    const bgColorContainer = document.createElement('div');
    bgColorContainer.classList.add('relative', 'w-6', 'h-6');

    const bgColorPicker = document.createElement('input');
    bgColorPicker.type = 'color';
    bgColorPicker.value = this.data.background === 'transparent' ? '#ffffff' : this.data.background;
    bgColorPicker.classList.add(
      'w-6', 'h-6', 'rounded', 'cursor-pointer',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    bgColorPicker.title = 'Background color';

    // Clear background button
    const clearBgBtn = document.createElement('button');
    clearBgBtn.type = 'button';
    clearBgBtn.classList.add(
      'absolute', 'top-0', 'right-0',
      'w-3', 'h-3', 'bg-red-500', 'rounded-full',
      'transform', 'translate-x-1', '-translate-y-1',
      'hover:bg-red-600', 'focus:outline-none',
      this.data.background === 'transparent' ? 'hidden' : ''
    );
    clearBgBtn.title = 'Clear background';

    input.addEventListener('input', () => {
      this.data.text = input.textContent;
    });

    textColorPicker.addEventListener('input', (e) => {
      this.data.color = e.target.value;
      input.style.color = e.target.value;
    });

    bgColorPicker.addEventListener('input', (e) => {
      this.data.background = e.target.value;
      input.style.backgroundColor = e.target.value;
      clearBgBtn.classList.remove('hidden');
    });

    clearBgBtn.addEventListener('click', () => {
      this.data.background = 'transparent';
      input.style.backgroundColor = 'transparent';
      clearBgBtn.classList.add('hidden');
    });

    container.appendChild(input);
    bgColorContainer.appendChild(bgColorPicker);
    bgColorContainer.appendChild(clearBgBtn);
    controls.appendChild(textColorPicker);
    controls.appendChild(bgColorContainer);
    wrapper.appendChild(container);
    wrapper.appendChild(controls);

    return wrapper;
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
      color: {},
      background: {}
    };
  }
}
