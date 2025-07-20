export default class Delimiter {
  static get toolbox() {
    return {
      title: 'Delimiter',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.5 12h19" color="currentColor"/></svg>'
    };
  }

  constructor({data}) {
    this.data = {
      style: data.style || 'dots' // dots, line, stars
    };
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group', 'py-4');

    const delimiter = document.createElement('div');
    delimiter.classList.add(
      'flex', 'items-center', 'justify-center',
      'text-gray-400', 'space-x-4'
    );

    this._createDelimiter(delimiter);

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
      'block', 'w-16', 'p-1', 'bg-transparent', 'hover:bg-gray-100',
      'rounded', 'text-sm', 'focus:outline-none', 'focus:ring-2', 
      'focus:ring-blue-500', 'border-none'
    );

    const options = [
      { value: 'dots', text: '•••' },
      { value: 'line', text: '—' },
      { value: 'stars', text: '***' }
    ];

    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.text = opt.text;
      option.selected = this.data.style === opt.value;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      this.data.style = e.target.value;
      this._createDelimiter(delimiter);
    });

    controls.appendChild(select);
    wrapper.appendChild(delimiter);
    wrapper.appendChild(controls);

    return wrapper;
  }

  _createDelimiter(container) {
    container.innerHTML = '';
    
    switch (this.data.style) {
      case 'dots':
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement('div');
          dot.classList.add('w-2', 'h-2', 'rounded-full', 'bg-gray-300');
          container.appendChild(dot);
        }
        break;
      case 'line':
        const line = document.createElement('div');
        line.classList.add('w-16', 'h-0.5', 'bg-gray-300');
        container.appendChild(line);
        break;
      case 'stars':
        const stars = document.createElement('div');
        stars.classList.add('text-gray-300', 'font-medium');
        stars.textContent = '* * *';
        container.appendChild(stars);
        break;
    }
  }

  save() {
    return this.data;
  }

  static get sanitize() {
    return {
      style: {}
    };
  }
}
