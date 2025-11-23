export default class InlineCodeTool {
  static get isInline() {
    return true;
  }

  static get CSS() {
    return {
      code: `
        font-mono 
        text-[0.95em]
        px-[4px] py-[2px] 
        rounded 
        bg-zinc-200 text-red-500 
        dark:bg-zinc-700
      `
    };
  }

  static get sanitize() {
    return {
      code: true
    };
  }

  constructor({ api, config = {}, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;   // <<< QUAN TRỌNG
    this.button = null;
    this.tagName = 'CODE';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';

    this.button.innerHTML = `<span class="text-sm">&lt;/&gt;</span>`;

    this.button.classList.add(
      'p-1',
      'rounded',
      'hover:bg-zinc-200',
      'dark:hover:bg-zinc-700',
      'transition'
    );

    if (this.readOnly) {
      this.button.disabled = true;
      this.button.classList.add("opacity-50", "cursor-not-allowed");
    }

    return this.button;
  }

  surround(range) {
    if (this.readOnly) return;  // <<< CHẶN MỌI EDIT

    if (!range) return;

    const selectedText = range.extractContents();
    const isCode = this.api.selection.findParentTag(this.tagName);

    if (isCode) {
      const parent = isCode.parentNode;
      while (isCode.firstChild) {
        parent.insertBefore(isCode.firstChild, isCode);
      }
      parent.removeChild(isCode);
      return;
    }

    const code = document.createElement(this.tagName);
    code.className = InlineCodeTool.CSS.code.replace(/\s+/g, ' ');
    code.appendChild(selectedText);

    range.insertNode(code);
    this.api.selection.expandToTag(code);
  }
}
