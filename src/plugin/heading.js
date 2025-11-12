import { IconH, IconH1, IconH2, IconH3, IconH4, IconH5, IconH6 } from "../svg";

export default class Heading {
  static get toolbox() {
    return {
      title: 'Heading',
      icon: IconH
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
    this.input = null;
  }

  render(){
    const wrapper = document.createElement('div');
    if (this.readOnly) {
      wrapper.classList.add('cdx-block', 'cdx-heading', 'read-only');
    } else {
      wrapper.classList.add('relative', 'group');
      this.input = document.createElement('div');
      this.input.classList.add('ce-paragraph', 'cdx-block', 'px-4', 'py-3', 'outline-none');
      this.input.setAttribute('contenteditable', true);
      this.input.dataset.placeholder = 'Enter a heading';
      this.input.innerHTML = this.data.text;
      this.input.addEventListener('input', () => {
        this.data.text = input.innerHTML;
      });
      this._updateHeadingStyle(this.input);
      wrapper.appendChild(this.input);
    }
    return wrapper;
  }

  renderSettings(){
    return [
      {
        icon: IconH1,
        label: 'H1',
        onActivate: () => {
          this.data.level = 1;          
          this._updateHeadingStyle(this.input);
        }
      },
      {
        icon: IconH2,
        label: 'H2',
        onActivate: () => {
          this.data.level = 2;
          this._updateHeadingStyle(this.input);
        }
      },
      {
        icon: IconH3,
        label: 'H3',
        onActivate: () => {
          this.data.level = 3;
          this._updateHeadingStyle(this.input);
        }
      },
      {
        icon: IconH4,
        label: 'H4',
        onActivate: () => {
          this.data.level = 4;
          this._updateHeadingStyle(this.input);
        }
      },
      {
        icon: IconH5,
        label: 'H5',
        onActivate: () => {
          this.data.level = 5;
          this._updateHeadingStyle(this.input);
        }
      },
      {
        icon: IconH6,
        label: 'H6',
        onActivate: () => {
          this.data.level = 6;
          this._updateHeadingStyle(this.input);
        }
      },
    ];
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

    // Xóa mọi style có thể được thêm vào lúc trước
    Object.values(sizes).forEach(classes => {
      classes.split(' ').forEach(cls => {
        element.classList.remove(cls);
      });
    });

    // Thêm lớp css mới vào
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
