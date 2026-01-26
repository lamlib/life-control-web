export default class Embed {
  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M14.002 4.5c.375-.333.696-.5 1.066-.5c.698 0 1.222.594 2.269 1.782l2.574 2.922C21.304 10.284 22 11.074 22 12s-.696 1.715-2.089 3.296l-2.575 2.922C16.29 19.406 15.767 20 15.069 20c-.37 0-.69-.167-1.066-.5"/><path d="M7 5.44C7.862 4.48 8.354 4 8.989 4c.706 0 1.235.594 2.294 1.782l2.605 2.922C15.295 10.284 16 11.074 16 12s-.704 1.715-2.112 3.296l-2.605 2.922C10.224 19.406 9.695 20 8.99 20c-.635 0-1.127-.48-1.989-1.44M5.5 15.5v-7M2 12h7"/></g></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      service: data.service || '',
      embed: data.embed || '',
      source: data.source || '',
      caption: data.caption || ''
    };
    this.config = config;
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('relative', 'group');

    if (this.data.embed) {
      return this._createEmbedPreview();
    }

    const input = document.createElement('div');
    input.classList.add(
      'w-full', 'px-4', 'py-3', 'border-2', 'border-dashed',
      'border-gray-300', 'rounded-lg', 'text-center',
      'hover:border-gray-400', 'transition-colors'
    );

    const placeholder = document.createElement('div');
    placeholder.classList.add('text-gray-500', 'text-sm');
    placeholder.innerHTML = 'Paste an embed code or URL from YouTube, Twitter, etc.';

    input.appendChild(placeholder);
    input.setAttribute('contenteditable', true);

    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const text = event.clipboardData.getData('text');
      this._processEmbed(text);
    });

    input.addEventListener('input', () => {
      const text = input.innerText;
      if (text.trim()) {
        this._processEmbed(text);
      }
    });

    this.wrapper.appendChild(input);
    return this.wrapper;
  }

  _processEmbed(url) {
    // Show loading state
    this._showLoading();

    try {
      // Basic URL validation
      if (!url.match(/^https?:\/\//)) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      // Detect service
      if (url.match(/youtube|youtu\.be/)) {
        this.data.service = 'youtube';
        this.data.embed = this._parseYouTube(url);
        if (!this.data.embed) {
          throw new Error('Invalid YouTube URL');
        }
      } else if (url.match(/twitter\.com/)) {
        this.data.service = 'twitter';
        this.data.embed = url;
        // Twitter requires its script
        if (!window.twttr) {
          const script = document.createElement('script');
          script.src = 'https://platform.twitter.com/widgets.js';
          document.head.appendChild(script);
        }
      } else if (url.match(/vimeo\.com/)) {
        this.data.service = 'vimeo';
        this.data.embed = this._parseVimeo(url);
        if (!this.data.embed) {
          throw new Error('Invalid Vimeo URL');
        }
      } else if (url.match(/instagram\.com/)) {
        this.data.service = 'instagram';
        this.data.embed = this._parseInstagram(url);
        if (!this.data.embed) {
          throw new Error('Invalid Instagram URL');
        }
      } else if (url.match(/facebook\.com/)) {
        this.data.service = 'facebook';
        this.data.embed = this._parseFacebook(url);
        if (!this.data.embed) {
          throw new Error('Invalid Facebook URL');
        }
      } else {
        throw new Error('Unsupported embed service. We support YouTube, Twitter, Vimeo, Instagram, and Facebook.');
      }

      this.data.source = url;

      if (this.data.embed) {
        const newContent = this._createEmbedPreview();
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(newContent);
      }
    } catch (error) {
      this._showError(error.message);
    } finally {
      this._hideLoading();
    }

    this.data.source = url;

    if (this.data.embed) {
      const newContent = this._createEmbedPreview();
      this.wrapper.innerHTML = '';
      this.wrapper.appendChild(newContent);
    }
  }

  _createEmbedPreview() {
    const container = document.createElement('div');
    container.classList.add('relative', 'group');

    const embedContainer = document.createElement('div');
    embedContainer.classList.add(
      'w-full', 'rounded-lg', 'overflow-hidden',
      'bg-gray-100', 'aspect-video'
    );

    const embed = document.createElement('div');
    embed.classList.add('w-full', 'h-full');

    const embedHTML = {
      youtube: `
        <iframe 
          class="w-full h-full"
          src="${this.data.embed}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      `,
      twitter: `<div class="twitter-tweet"><a href="${this.data.source}"></a></div>`,
      vimeo: `
        <iframe
          class="w-full h-full"
          src="${this.data.embed}"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        ></iframe>
      `,
      instagram: `
        <iframe
          class="w-full h-full"
          src="${this.data.embed}"
          frameborder="0"
          scrolling="no"
          allowtransparency="true"
        ></iframe>
      `,
      facebook: `
        <iframe
          class="w-full h-full"
          src="${this.data.embed}"
          frameborder="0"
          allowfullscreen="true"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      `
    };

    embed.innerHTML = embedHTML[this.data.service] || '';

    // Handle Twitter widgets
    if (this.data.service === 'twitter' && window.twttr) {
      window.twttr.widgets.load(embed);
    }

    embedContainer.appendChild(embed);

    // Caption
    const caption = document.createElement('div');
    caption.classList.add(
      'mt-2', 'text-center', 'text-sm', 'text-gray-500',
      'focus:outline-none'
    );
    caption.contentEditable = true;
    caption.dataset.placeholder = 'Enter a caption';
    caption.innerHTML = this.data.caption || '';
    
    caption.addEventListener('input', () => {
      this.data.caption = caption.innerHTML;
    });

    // Controls
    const controls = document.createElement('div');
    controls.classList.add(
      'absolute', 'right-[-24px]', 'top-1/2', '-translate-y-1/2',
      'opacity-0', 'group-hover:opacity-100',
      'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm',
      'p-1', 'flex', 'flex-col', 'gap-1'
    );

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
      'text-gray-500', 'hover:text-red-500'
    );
    removeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>';
    removeBtn.addEventListener('click', () => {
      this.wrapper.innerHTML = '';
      this.data = {
        service: '',
        embed: '',
        source: '',
        caption: ''
      };
      this.wrapper.appendChild(this.render());
    });

    controls.appendChild(removeBtn);
    container.appendChild(embedContainer);
    container.appendChild(caption);
    container.appendChild(controls);

    return container;
  }

  _parseYouTube(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  _parseVimeo(url) {
    const regex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?))/;
    const match = url.match(regex);
    return match ? `https://player.vimeo.com/video/${match[3]}` : null;
  }

  _showLoading() {
    const loader = document.createElement('div');
    loader.classList.add(
      'absolute', 'inset-0', 'flex', 'items-center',
      'justify-center', 'bg-white', 'bg-opacity-75'
    );
    loader.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
    `;
    loader.id = 'embed-loader';
    this.wrapper.appendChild(loader);
  }

  _hideLoading() {
    const loader = this.wrapper.querySelector('#embed-loader');
    if (loader) {
      loader.remove();
    }
  }

  _showError(message) {
    const error = document.createElement('div');
    error.classList.add(
      'text-red-500', 'text-sm', 'p-4',
      'border', 'border-red-200', 'rounded-lg',
      'bg-red-50', 'my-2'
    );
    error.textContent = message;
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(error);

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      if (error.parentNode === this.wrapper) {
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.render());
      }
    }, 5000);
  }

  _parseInstagram(url) {
    const regex = /instagram\.com\/p\/([^/?#&]+)/;
    const match = url.match(regex);
    return match ? `https://www.instagram.com/p/${match[1]}/embed` : null;
  }

  _parseFacebook(url) {
    // Support for posts and videos
    if (url.includes('/videos/')) {
      const regex = /facebook\.com\/[^/]+\/videos\/(\d+)/;
      const match = url.match(regex);
      return match ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0` : null;
    } else {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true`;
    }
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.embed.trim() !== '';
  }

  static get sanitize() {
    return {
      caption: {
        br: true
      }
    };
  }
}
