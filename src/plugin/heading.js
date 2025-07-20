export default class Heading {
  static get toolbox() {
    return {
      title: 'Heading',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 4v16M18 4v16M6 12h12" color="currentColor"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get isInline() {
    return false;
  }

  constructor({data, config, readOnly}){
    this.readOnly = readOnly;
    this.data = {
      text: data.text || '',
      level: data.level || 2
    };
    this.config = config;
  }

  render(){
    const wrapper = document.createElement('div');
    if (this.readOnly) {
      wrapper.classList.add('cdx-block', 'cdx-heading', 'read-only');
    } else {
      wrapper.classList.add('relative', 'group');
      const input = document.createElement('div');
      input.classList.add('ce-paragraph', 'cdx-block', 'px-4', 'py-3', 'outline-none');
      input.setAttribute('contenteditable', true);
      input.dataset.placeholder = 'Enter a heading';
      input.innerHTML = this.data.text;
      
      const levelSelector = document.createElement('div');
      levelSelector.classList.add(
        'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
        'opacity-0', 'group-hover:opacity-100',
        'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
        'p-1'
      );
      
      const select = document.createElement('select');
      select.classList.add(
        'block', 'w-12', 'p-1', 'bg-transparent', 'hover:bg-gray-100',
        'rounded', 'text-sm', 'focus:outline-none', 'focus:ring-2', 
        'focus:ring-blue-500', 'border-none'
      );
      
      [1, 2, 3, 4, 5, 6].forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.text = `H${level}`;
        option.selected = this.data.level === level;
        select.appendChild(option);
      });
      
      select.addEventListener('change', (e) => {
        this.data.level = parseInt(e.target.value);
        this._updateHeadingStyle(input);
      });
      
      input.addEventListener('input', () => {
        this.data.text = input.innerHTML;
      });
      
      this._updateHeadingStyle(input);
      
      levelSelector.appendChild(select);
      wrapper.appendChild(levelSelector);
      wrapper.appendChild(input);
      
    }
    return wrapper;
  }

  _updateHeadingStyle(element) {
    const sizes = {
      1: 'text-4xl font-bold',
      2: 'text-3xl font-bold',
      3: 'text-2xl font-bold',
      4: 'text-xl font-bold',
      5: 'text-lg font-bold',
      6: 'text-base font-bold'
    };

    // Remove all size classes
    Object.values(sizes).forEach(classes => {
      classes.split(' ').forEach(cls => {
        element.classList.remove(cls);
      });
    });

    // Add new size classes
    sizes[this.data.level].split(' ').forEach(cls => {
      element.classList.add(cls);
    });
  }

  save(blockContent){
    return {
      text: blockContent.querySelector('[contenteditable]').innerHTML,
      level: this.data.level
    };
  }

  validate(savedData){
    if (!savedData.text.trim()) {
      return false;
    }
    return true;
  }
}
