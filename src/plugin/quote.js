export default class Quote {
  static get toolbox() {
    return {
      title: 'Quote',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M22 11.567c0 5.283-4.478 9.566-10 9.566q-.977.001-1.935-.178c-.459-.087-.688-.13-.848-.105c-.16.024-.388.145-.842.386a6.5 6.5 0 0 1-4.224.657a5.3 5.3 0 0 0 1.087-2.348c.1-.53-.148-1.045-.52-1.422C3.034 16.411 2 14.105 2 11.567C2 6.284 6.478 2 12 2s10 4.284 10 9.567"/><path d="M10.746 10c0-.943 0-1.414-.311-1.707S9.624 8 8.623 8s-1.501 0-1.812.293S6.5 9.057 6.5 10s0 1.414.31 1.707c.312.293.812.293 1.813.293s1.5 0 1.812-.293c.31-.293.31-.764.31-1.707m0 0v2.069c0 1.833-1.335 3.388-3.185 3.931m9.939-6c0-.943 0-1.414-.31-1.707C16.877 8 16.377 8 15.376 8s-1.5 0-1.812.293c-.31.293-.31.764-.31 1.707s0 1.414.31 1.707c.311.293.812.293 1.812.293s1.501 0 1.812-.293s.311-.764.311-1.707m0 0v2.069c0 1.833-1.335 3.388-3.184 3.931"/></g></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({data, config}) {
    this.data = {
      text: data.text || '',
      caption: data.caption || '',
      alignment: data.alignment || 'left'
    };
    this.config = config;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('relative', 'group');

    const container = document.createElement('blockquote');
    container.classList.add(
      'pl-4', 'border-l-4', 'border-gray-300',
      'my-4', 'transition-colors', 'bg-gray-50',
      'hover:border-gray-400', 'rounded-r',
      'py-4', 'pr-4'
    );

    // Add quote icon
    const quoteIcon = document.createElement('div');
    quoteIcon.classList.add(
      'absolute', '-left-3', '-top-3',
      'w-8', 'h-8', 'rounded-full',
      'bg-white', 'shadow-md', 'flex', 'items-center', 'justify-center',
      'text-gray-400'
    );
    quoteIcon.innerHTML = `
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
      </svg>
    `;

    const quote = document.createElement('div');
    quote.classList.add(
      'text-lg', 'text-gray-700', 'italic',
      'mb-3', 'mt-2', 'relative'
    );
    quote.contentEditable = true;
    quote.innerHTML = this.data.text;   
    quote.dataset.placeholder = 'Enter a quote';

    const caption = document.createElement('div');
    caption.classList.add(
      'text-sm', 'text-gray-500',
      'not-italic', 'font-medium'
    );
    caption.contentEditable = true;
    caption.innerHTML = this.data.caption;
    caption.dataset.placeholder = 'Enter a caption';

    const alignmentControl = document.createElement('div');
    alignmentControl.classList.add(
      'absolute', '-right-24', 'top-0',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'flex', 'gap-1', 'bg-white',
      'p-1', 'rounded-lg', 'shadow-sm'
    );

    ['left', 'center', 'right'].forEach(align => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add(
        'p-1', 'rounded', 'hover:bg-gray-100',
        'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
      );
      
      if (this.data.alignment === align) {
        button.classList.add('bg-gray-200');
      }

      button.innerHTML = this._getAlignmentIcon(align);

      button.addEventListener('click', () => {
        this.data.alignment = align;
        this._updateAlignment(container);
        
        // Update active state
        alignmentControl.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('bg-gray-200');
        });
        button.classList.add('bg-gray-200');
      });

      alignmentControl.appendChild(button);
    });

    quote.addEventListener('input', () => {
      this.data.text = quote.innerHTML;
    });

    caption.addEventListener('input', () => {
      this.data.caption = caption.innerHTML;
    });

    this._updateAlignment(container);

    container.appendChild(quoteIcon);
    container.appendChild(quote);
    container.appendChild(caption);
    wrapper.appendChild(alignmentControl);
    wrapper.appendChild(container);

    quote.classList.add('focus:outline-none', 'placeholder-gray-400');
    caption.classList.add('focus:outline-none', 'placeholder-gray-400');
    
    if (!quote.textContent.trim()) {
      quote.textContent = quote.dataset.placeholder;
      quote.classList.add('text-gray-400');
    }
    
    if (!caption.textContent.trim()) {
      caption.textContent = caption.dataset.placeholder;
      caption.classList.add('text-gray-400');
    }

    quote.addEventListener('focus', () => {
      if (quote.classList.contains('text-gray-400')) {
        quote.textContent = '';
        quote.classList.remove('text-gray-400');
      }
    });

    quote.addEventListener('blur', () => {
      if (!quote.textContent.trim()) {
        quote.textContent = quote.dataset.placeholder;
        quote.classList.add('text-gray-400');
      }
    });

    caption.addEventListener('focus', () => {
      if (caption.classList.contains('text-gray-400')) {
        caption.textContent = '';
        caption.classList.remove('text-gray-400');
      }
    });

    caption.addEventListener('blur', () => {
      if (!caption.textContent.trim()) {
        caption.textContent = caption.dataset.placeholder;
        caption.classList.add('text-gray-400');
      }
    });

    return wrapper;
  }

  _updateAlignment(container) {
    container.style.textAlign = this.data.alignment;
  }

  _getAlignmentIcon(alignment) {
    const icons = {
      left: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h12v1H2V4zm0 3h8v1H2V7zm0 3h12v1H2v-1zm0 3h8v1H2v-1z"/></svg>',
      center: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4h8v1H4V4zm2 3h4v1H6V7zm0 3h4v1H6v-1zm-2 3h8v1H4v-1z"/></svg>',
      right: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h12v1H2V4zm4 3h8v1H6V7zm-4 3h12v1H2v-1zm4 3h8v1H6v-1z"/></svg>'
    };
    return icons[alignment];
  }

  save(blockContent) {
    const quote = blockContent.querySelector('blockquote > div:nth-child(2)');
    const caption = blockContent.querySelector('blockquote > div:nth-child(3)');

    const text = quote.classList.contains('text-gray-400') ? '' : quote.innerHTML;
    const captionText = caption.classList.contains('text-gray-400') ? '' : caption.innerHTML;
    
    return {
      text: text,
      caption: captionText,
      alignment: this.data.alignment
    };
  }

  validate(savedData) {
    return savedData.text.trim().length > 0;
  }
}
