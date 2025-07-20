export default class ScriptTool {
  static get toolbox() {
    return {
      title: 'Script',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path stroke="currentColor" d="M12 21H6"/><path fill="currentColor" d="M9.75 3a.75.75 0 0 0-1.5 0zm-1.5 18a.75.75 0 0 0 1.5 0zm0-18v18h1.5V3z"/><path stroke="currentColor" d="M16 6c0-.628 0-.942-.08-1.217a2.04 2.04 0 0 0-1.166-1.29c-.265-.109-.566-.14-1.166-.2C12.17 3.146 10.388 3 9 3s-3.17.147-4.588.292c-.6.061-.9.092-1.166.2a2.04 2.04 0 0 0-1.165 1.29C2 5.059 2 5.373 2 6m20 6h-2c-.471 0-.707 0-.854-.143C19 11.713 19 11.483 19 11.02v-.944c0-.796.176-.952 1-.968c.777-.015 1.24-.07 1.56-.276c.44-.281.44-.735.44-1.641c0-1.733-3-1.066-3-1.066"/></g></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      text: data.text || '',
      type: data.type || 'super' // 'super' or 'sub'
    };
    this.config = config;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    const container = document.createElement('div');
    container.classList.add('px-4', 'py-3', 'flex', 'items-baseline', 'gap-2');

    const input = document.createElement('div');
    input.contentEditable = true;
    input.classList.add(
      'outline-none', 'min-h-[1em]',
      this.data.type === 'super' ? 'text-xs' : 'text-xs',
      this.data.type === 'super' ? '-mt-2' : 'mb-0'
    );
    input.dataset.placeholder = `Enter ${this.data.type === 'super' ? 'superscript' : 'subscript'} text...`;
    input.textContent = this.data.text;

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    toggleBtn.innerHTML = this.data.type === 'super' 
      ? '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.4 9.9c-.8.8-1.9 1.2-3.1 1.2-1.2 0-2.3-.4-3.1-1.2C.4 9.1 0 8 0 6.8s.4-2.3 1.2-3.1C2 2.9 3.1 2.5 4.3 2.5c1.2 0 2.3.4 3.1 1.2.3.3.6.7.8 1.1l1.1-1.1c.3-.3.7-.5 1.1-.5.4 0 .8.2 1.1.5.3.3.5.7.5 1.1 0 .4-.2.8-.5 1.1L10.4 7l1.1 1.1c.3.3.5.7.5 1.1 0 .4-.2.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5L8.2 9.2c-.2.3-.5.5-.8.7z"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.4 6.1c-.8-.8-1.9-1.2-3.1-1.2-1.2 0-2.3.4-3.1 1.2C.4 6.9 0 8 0 9.2s.4 2.3 1.2 3.1c.8.8 1.9 1.2 3.1 1.2 1.2 0 2.3-.4 3.1-1.2.3-.3.6-.7.8-1.1l1.1 1.1c.3.3.7.5 1.1.5.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1 0-.4-.2-.8-.5-1.1L10.4 9l1.1-1.1c.3-.3.5-.7.5-1.1 0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5-.4 0-.8.2-1.1.5L8.2 6.8c-.2-.3-.5-.5-.8-.7z"/></svg>';
    toggleBtn.title = `Toggle ${this.data.type === 'super' ? 'subscript' : 'superscript'}`;

    toggleBtn.addEventListener('click', () => {
      this.data.type = this.data.type === 'super' ? 'sub' : 'super';
      input.classList.toggle('-mt-2');
      input.classList.toggle('mb-0');
      input.dataset.placeholder = `Enter ${this.data.type === 'super' ? 'superscript' : 'subscript'} text...`;
      toggleBtn.innerHTML = this.data.type === 'super'
        ? '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.4 9.9c-.8.8-1.9 1.2-3.1 1.2-1.2 0-2.3-.4-3.1-1.2C.4 9.1 0 8 0 6.8s.4-2.3 1.2-3.1C2 2.9 3.1 2.5 4.3 2.5c1.2 0 2.3.4 3.1 1.2.3.3.6.7.8 1.1l1.1-1.1c.3-.3.7-.5 1.1-.5.4 0 .8.2 1.1.5.3.3.5.7.5 1.1 0 .4-.2.8-.5 1.1L10.4 7l1.1 1.1c.3.3.5.7.5 1.1 0 .4-.2.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5L8.2 9.2c-.2.3-.5.5-.8.7z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.4 6.1c-.8-.8-1.9-1.2-3.1-1.2-1.2 0-2.3.4-3.1 1.2C.4 6.9 0 8 0 9.2s.4 2.3 1.2 3.1c.8.8 1.9 1.2 3.1 1.2 1.2 0 2.3-.4 3.1-1.2.3-.3.6-.7.8-1.1l1.1 1.1c.3.3.7.5 1.1.5.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1 0-.4-.2-.8-.5-1.1L10.4 9l1.1-1.1c.3-.3.5-.7.5-1.1 0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5-.4 0-.8.2-1.1.5L8.2 6.8c-.2-.3-.5-.5-.8-.7z"/></svg>';
      toggleBtn.title = `Toggle ${this.data.type === 'super' ? 'subscript' : 'superscript'}`;
    });

    input.addEventListener('input', () => {
      this.data.text = input.textContent;
    });

    controls.appendChild(toggleBtn);
    container.appendChild(input);
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
      text: {}
    };
  }
}
