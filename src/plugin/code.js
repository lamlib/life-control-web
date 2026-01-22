import * as monaco from 'monaco-editor';
import { theme } from './theme.js';
import { IconCode } from '../svg/icons.js';
import githubDark from 'monaco-themes/themes/GitHub Dark.json'; 
import githubLight from 'monaco-themes/themes/GitHub Light.json';

monaco.editor.defineTheme('github-dark', githubDark);
monaco.editor.defineTheme('github-light', githubLight);

export default class CodeBlock {
  static get toolbox() {
    return {
      title: 'Code',
      icon: IconCode,
    };
  }

  static get isReadOnlySupported() { return true; }
  static get enableLineBreaks() { return true; }
  static get sanitize() {
    return { files: true, activeFileIndex: true };
  }

  constructor({ data = {}, readOnly }) {
    this.readOnly = readOnly;
    this.wrapper = null;
    this.tabBarEl = null;
    this.editorContainerEl = null;
    this.statusBarEl = null;
    this.editor = null;

    this.supportedLanguages = [ 'plaintext', 'javascript', 'typescript', 'html', 'css', 'json', 'python', 'c', 'cpp'];

    this.data = {
      files: data.files || [{ name: 'Untitled.js', code: '', language: 'plaintext' }],
      activeFileIndex: data.activeFileIndex || 0
    };
  }

  getThemeClasses() {
    const dark = {
      wrapper: 'border border-zinc-700 rounded-lg overflow-hidden font-mono bg-zinc-900',
      tabBar: 'flex bg-zinc-800 text-zinc-300 border-b border-zinc-700 pl-2',
      tabActive: 'bg-zinc-900 text-white',
      tabInactive: 'bg-zinc-800 text-zinc-300',
      statusBar: 'bg-zinc-900 text-zinc-300 text-xs px-2 py-1 border-t border-zinc-700 flex items-center justify-between',
      addBtn: 'px-3 py-1 cursor-pointer text-zinc-300',
      input: 'bg-transparent text-inherit border-0 outline-none px-0 py-0 w-[10ch]'
    };

    const light = {
      wrapper: 'border border-zinc-300 rounded-lg overflow-hidden font-mono bg-white',
      tabBar: 'flex bg-zinc-200 text-zinc-900 border-b border-zinc-300 pl-2',
      tabActive: 'bg-white text-black',
      tabInactive: 'bg-zinc-200 text-zinc-900',
      statusBar: 'bg-white text-zinc-900 text-xs px-2 py-1 border-t border-zinc-300 flex items-center justify-between',
      addBtn: 'px-3 py-1 cursor-pointer text-zinc-900',
      input: 'bg-transparent text-inherit border-0 outline-none px-0 py-0 w-[10ch]'
    };

    return theme.isDark() ? dark : light;
  }

  render() {
    const classes = this.getThemeClasses();

    this.wrapper = document.createElement('div');
    this.wrapper.className = classes.wrapper;

    this.tabBarEl = document.createElement('div');
    this.wrapper.appendChild(this.tabBarEl);

    this.editorContainerEl = document.createElement('div');
    this.editorContainerEl.className = 'w-full';
    this.editorContainerEl.style.minHeight = "100px";
    this.editorContainerEl.style.maxHeight = "384px"; // h-96
    this.editorContainerEl.style.overflow = "hidden";
    this.wrapper.appendChild(this.editorContainerEl);

    this.statusBarEl = document.createElement('div');
    this.statusBarEl.className = classes.statusBar;
    this.wrapper.appendChild(this.statusBarEl);

    this.updateTabUI();
    setTimeout(() => this.initEditor(), 0);

    return this.wrapper;
  }

  updateTabUI() {
    const classes = this.getThemeClasses();
    this.tabBarEl.innerHTML = '';
    this.tabBarEl.className = classes.tabBar;

    this.data.files.forEach((file, index) => {
      const tab = document.createElement('div');
      const isActive = index === this.data.activeFileIndex;
      tab.className = `flex items-center px-3 py-1 cursor-pointer border-r border-zinc-700 ${isActive ? classes.tabActive : classes.tabInactive}`;

      const nameEl = document.createElement('span');
      nameEl.textContent = file.name;
      nameEl.onclick = () => {
        if (index !== this.data.activeFileIndex) {
          this.saveCurrentFileContent();
          this.data.activeFileIndex = index;
          this.updateTabUI();
          this.updateEditorContent();
        }
      };

      nameEl.ondblclick = () => {
        if (this.readOnly) return;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = file.name;
        input.className = classes.input;
        tab.replaceChild(input, nameEl);
        input.focus();
        input.select();

        const confirmRename = () => {
          const newName = input.value.trim();
          if (newName && newName !== file.name) this.data.files[index].name = newName;
          this.updateTabUI();
        };

        const cancelRename = () => { this.updateTabUI(); };

        input.addEventListener('blur', confirmRename);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
          else if (e.key === 'Escape') { e.preventDefault(); cancelRename(); }
        });
      };

      const closeBtn = document.createElement('span');
      closeBtn.textContent = '×';
      closeBtn.className = 'ml-2 cursor-pointer font-bold';
      closeBtn.onclick = (e) => {
        if (this.readOnly) return;
        e.stopPropagation();
        this.closeFile(index);
      };

      tab.appendChild(nameEl);
      tab.appendChild(closeBtn);
      this.tabBarEl.appendChild(tab);
    });

    const addBtn = document.createElement('div');
    addBtn.textContent = '+';
    addBtn.className = classes.addBtn;
    addBtn.onclick = () => {
      if (this.readOnly) return;
      this.addNewFile();
    };

    this.tabBarEl.appendChild(addBtn);
  }

  /** 📌 Auto-resize Editor */
  updateEditorHeight() {
    if (!this.editor || !this.editorContainerEl) return;

    const minHeight = 100;
    const maxHeight = 384;

    const contentHeight = this.editor.getContentHeight();

    const newHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);

    this.editorContainerEl.style.height = newHeight + "px";
    this.editor.layout();
  }

  initEditor() {
    const file = this.data.files[this.data.activeFileIndex];

    this.editor = monaco.editor.create(this.editorContainerEl, {
      value: file.code,
      language: file.language,
      theme: theme.isDark() ? 'github-dark' : 'github-light',
      readOnly: this.readOnly,
      minimap: { enabled: false },
      padding: { top: 20, bottom: 20 },
      domReadOnly: true,
      automaticLayout: false,
      scrollBeyondLastLine: false,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      glyphMargin: false,
      lineNumbers: "on",
      folding: false,
      links: false,
      contextmenu: false,
      smoothScrolling: false,
      hover: { enabled: false },
      parameterHints: { enabled: false },
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      wordBasedSuggestions: false,
      renderLineHighlight: "none"
    });

    if (!this.readOnly) {
      this.editor.onDidChangeModelContent(() => {
        this.data.files[this.data.activeFileIndex].code = this.editor.getValue();
      });
    }

    // 📌 Auto-resize theo nội dung
    this.editor.onDidContentSizeChange(() => this.updateEditorHeight());
    this.updateEditorHeight();

    this.editor.onDidChangeCursorPosition((e) => this.updateStatusBar(e.position));
    this.updateStatusBar(this.editor.getPosition());
  }

  updateStatusBar(position) {
    const file = this.data.files[this.data.activeFileIndex];
    const left = `Ln ${position.lineNumber}, Col ${position.column}`;

    const langSelect = document.createElement('select');
    langSelect.className = `bg-transparent text-inherit border-none font-mono text-xs`;
    langSelect.disabled = this.readOnly;

    this.supportedLanguages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang;
      if (lang === file.language) option.selected = true;
      langSelect.appendChild(option);
    });

    langSelect.onchange = () => {
      file.language = langSelect.value;
      monaco.editor.setModelLanguage(this.editor.getModel(), file.language);
    };

    this.statusBarEl.innerHTML = '';
    const leftSpan = document.createElement('span');
    leftSpan.textContent = left;

    this.statusBarEl.appendChild(leftSpan);
    this.statusBarEl.appendChild(langSelect);
  }

  updateEditorContent() {
    const file = this.data.files[this.data.activeFileIndex];
    if (this.editor) {
      this.editor.setValue(file.code);
      monaco.editor.setModelLanguage(this.editor.getModel(), file.language);
      this.updateEditorHeight(); // update height khi đổi file
      this.updateStatusBar(this.editor.getPosition());
    }
  }

  saveCurrentFileContent() {
    if (this.editor) this.data.files[this.data.activeFileIndex].code = this.editor.getValue();
  }

  addNewFile() {
    const index = this.data.files.length;
    this.data.files.push({ name: `untitled-${index + 1}.js`, code: '', language: 'javascript' });
    this.data.activeFileIndex = index;
    this.updateTabUI();
    this.updateEditorContent();
  }

  closeFile(index) {
    this.saveCurrentFileContent();
    this.data.files.splice(index, 1);
    if (this.data.files.length === 0)
      this.data.files.push({ name: 'untitled.js', code: '', language: 'javascript' });

    this.data.activeFileIndex = Math.min(this.data.activeFileIndex, this.data.files.length - 1);
    this.updateTabUI();
    this.updateEditorContent();
  }

  save() {
    this.saveCurrentFileContent();
    return this.data;
  }

  validate(savedData) {
    return savedData.files && savedData.files.length > 0;
  }
}
