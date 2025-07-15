import * as monaco from 'monaco-editor';
import ('monaco-themes/themes/Github Dark.json').then((data) => {
  monaco.editor.defineTheme('github-dark', data);
})

export default class CodeBlock {
  static get toolbox() {
    return {
      title: 'Code',
      icon: '<svg width="17" height="15"><path d="M6 14l-5-7 5-7M11 0l5 7-5 7"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
  return true;
}

  static get sanitize() {
    return {
      files: true,
      activeFileIndex: true,
    };
  }

  constructor({ data = {}, readOnly }) {
    this.readOnly = readOnly;
    this.wrapper = null;
    this.tabBarEl = null;
    this.editorContainerEl = null;
    this.statusBarEl = null;
    this.editor = null;

    this.supportedLanguages = ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'c', 'cpp'];

    this.data = {
      files: data.files || [
        { name: 'main.js', code: '', language: 'javascript' }
      ],
      activeFileIndex: data.activeFileIndex || 0
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.border = '1px solid #ddd';
    this.wrapper.style.borderRadius = '6px';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.fontFamily = 'monospace';
    this.wrapper.style.backgroundColor = '#1e1e1e';

    this.tabBarEl = document.createElement('div');
    this.wrapper.appendChild(this.tabBarEl);

    this.editorContainerEl = document.createElement('div');
    this.editorContainerEl.style.height = '400px';
    this.editorContainerEl.style.width = '100%';
    this.wrapper.appendChild(this.editorContainerEl);

    this.statusBarEl = document.createElement('div');
    this.statusBarEl.style.background = '#1e1e1e';
    this.statusBarEl.style.color = '#ccc';
    this.statusBarEl.style.fontSize = '12px';
    this.statusBarEl.style.padding = '4px 10px';
    this.statusBarEl.style.borderTop = '1px solid #333';
    this.statusBarEl.style.display = 'flex';
    this.statusBarEl.style.alignItems = 'center';
    this.statusBarEl.style.justifyContent = 'space-between';
    this.wrapper.appendChild(this.statusBarEl);

    this.updateTabUI();
    setTimeout(() => this.initEditor(), 0);

    return this.wrapper;
  }

  updateTabUI() {
    this.tabBarEl.innerHTML = '';
    this.tabBarEl.style.display = 'flex';
    this.tabBarEl.style.backgroundColor = '#2d2d2d';
    this.tabBarEl.style.color = '#ccc';
    this.tabBarEl.style.borderBottom = '1px solid #444';
    this.tabBarEl.style.paddingLeft = '8px';

    this.data.files.forEach((file, index) => {
      const tab = document.createElement('div');
      tab.style.display = 'flex';
      tab.style.alignItems = 'center';
      tab.style.padding = '6px 12px';
      tab.style.cursor = 'pointer';
      tab.style.borderRight = '1px solid #444';
      tab.style.backgroundColor = (index === this.data.activeFileIndex) ? '#1e1e1e' : '#2d2d2d';
      tab.style.color = (index === this.data.activeFileIndex) ? '#fff' : '#ccc';

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
  console.log('hể');
  
  const input = document.createElement('input');
  input.type = 'text';
  input.value = file.name;
  input.style.fontSize = 'inherit';
  input.style.fontFamily = 'inherit';
  input.style.background = 'transparent';
  input.style.color = 'inherit';
  input.style.border = '0px';
  input.style.padding = '0px';
  input.style.width = `${Math.max(file.name.length, 10)}ch`;
  input.style.outline = 'none';
  input.style.borderRadius = '4px';

  // Thay thế nameEl bằng input trong chính tab
  tab.replaceChild(input, nameEl);
  input.focus();
  input.select();

  const confirmRename = () => {
    const newName = input.value.trim();
    if (newName && newName !== file.name) {
      this.data.files[index].name = newName;
    }
    this.updateTabUI(); // Cập nhật lại giao diện tab
  };

  const cancelRename = () => {
    this.updateTabUI(); // Không đổi tên
  };

  input.addEventListener('blur', confirmRename);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur(); // Gọi blur → save
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  });
};

      const closeBtn = document.createElement('span');
      closeBtn.textContent = '×';
      closeBtn.style.marginLeft = '8px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.color = '#888';
      closeBtn.style.fontWeight = 'bold';
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
    addBtn.style.padding = '6px 12px';
    addBtn.style.cursor = 'pointer';
    addBtn.style.color = '#ccc';
    addBtn.onclick = () => {
      if (this.readOnly) return;
      this.addNewFile();
    };

    this.tabBarEl.appendChild(addBtn);
  }

  initEditor() {
    const file = this.data.files[this.data.activeFileIndex];

    this.editor = monaco.editor.create(this.editorContainerEl, {
      value: file.code,
      language: file.language,
      theme: 'github-dark',
      readOnly: this.readOnly,
      minimap: { enabled: false },
      padding: { top: 20, bottom: 20 },
    })

    if (!this.readOnly) {
      this.editor.onDidChangeModelContent(() => {
        this.data.files[this.data.activeFileIndex].code = this.editor.getValue();
      });
    }

    this.editor.onDidChangeCursorPosition((e) => {
      this.updateStatusBar(e.position);
    });

    this.updateStatusBar(this.editor.getPosition());
  }

  updateStatusBar(position) {
    const file = this.data.files[this.data.activeFileIndex];

    const left = `Ln ${position.lineNumber}, Col ${position.column}`;

    const langSelect = document.createElement('select');
    langSelect.style.background = '#1e1e1e';
    langSelect.style.color = '#ccc';
    langSelect.style.border = 'none';
    langSelect.style.fontFamily = 'monospace';
    langSelect.style.fontSize = '12px';

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
      this.updateStatusBar(this.editor.getPosition());
    }
  }

  saveCurrentFileContent() {
    if (this.editor) {
      this.data.files[this.data.activeFileIndex].code = this.editor.getValue();
    }
  }

  addNewFile() {
    const index = this.data.files.length;
    const fileName = `untitled-${index + 1}.js`;
    this.data.files.push({
      name: fileName,
      code: '',
      language: 'javascript'
    });
    this.data.activeFileIndex = index;
    this.updateTabUI();
    this.updateEditorContent();
  }

  closeFile(index) {
    this.saveCurrentFileContent();
    this.data.files.splice(index, 1);

    if (this.data.files.length === 0) {
      this.data.files.push({
        name: 'untitled.js',
        code: '',
        language: 'javascript'
      });
      this.data.activeFileIndex = 0;
    } else if (this.data.activeFileIndex >= index) {
      this.data.activeFileIndex = Math.max(this.data.activeFileIndex - 1, 0);
    }

    this.updateTabUI();
    this.updateEditorContent();
  }

  save() {
    if (this.editor) {
      this.data.files[this.data.activeFileIndex].code = this.editor.getValue();
    }
    return this.data;
  }

  validate(savedData) {
    return savedData.files && savedData.files.length > 0;
  }
}
