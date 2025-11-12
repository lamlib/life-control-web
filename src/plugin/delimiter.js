import { IconDelimiter, IconDelimiterDot, IconDelimiterLine, IconDelimiterStar } from "../svg";

export default class Delimiter {
  static get toolbox() {
    return {
      title: 'Delimiter',
      icon: IconDelimiter
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({data}) {
    this.data = {
      style: data.style || 'dots'
    };
  }

  renderSettings() {
    return [
      {
        icon: IconDelimiterDot,
        label: 'Dots',
        onActivate: () => {
          this.data.style = 'dots';
          this._createDelimiter(this.delimiter);
        }
      },
      {
        icon: IconDelimiterLine,
        label: 'Line',
        onActivate: () => {
          this.data.style = 'line';
          this._createDelimiter(this.delimiter);
        }
      },
      {
        icon: IconDelimiterStar,
        label: 'Stars',
        onActivate: () => {
          this.data.style = 'stars';
          this._createDelimiter(this.delimiter);
        }
      },
    ]
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group', 'py-4');

    this.delimiter = document.createElement('div');
    this.delimiter.classList.add(
      'flex', 'items-center', 'justify-center',
      'text-zinc-400', 'space-x-4'
    );

    this._createDelimiter(this.delimiter);
    wrapper.appendChild(this.delimiter);
    return wrapper;
  }

  _createDelimiter(container) {
    container.innerHTML = '';
    switch (this.data.style) {
      case 'dots':
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement('div');
          dot.classList.add('w-2', 'h-2', 'rounded-full', 'bg-zinc-700', 'dark:bg-zinc-300');
          container.appendChild(dot);
        }
        break;
      case 'line':
        const line = document.createElement('div');
        line.classList.add('w-16', 'h-0.5', 'bg-zinc-700', 'dark:bg-zinc-300');
        container.appendChild(line);
        break;
      case 'stars':
        const stars = document.createElement('div');
        stars.classList.add('text-zinc-700', 'font-medium', 'dark:text-zinc-300');
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
