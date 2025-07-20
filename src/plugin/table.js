export default class Table {
  static get toolbox() {
    return {
      title: 'Table',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12m-19-3h19m-19 4h14m-14 4H12m0 4.5V9m6.601 10.683l2.23-2.23c.311-.31.467-.466.55-.634a1.14 1.14 0 0 0 0-1.015c-.083-.168-.239-.323-.55-.635c-.312-.311-.467-.467-.635-.55a1.14 1.14 0 0 0-1.015 0c-.168.083-.323.239-.635.55l-2.43 2.43c-.713.714-1.07 1.07-1.29 1.507a3 3 0 0 0-.173.418c-.153.464-.153.968-.153 1.976l.655-.094c.996-.142 1.495-.213 1.937-.434s.798-.577 1.51-1.289" color="currentColor"/></svg>'
    };
  }

  constructor({data, config}) {
    this.data = {
      content: data.content || [['', ''], ['', '']], // Default 2x2 table
      withHeadings: data.withHeadings !== undefined ? data.withHeadings : true
    };
    this.config = config;
    this.wrapper = null;
    this.table = null;
    this.controlsWrapper = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('relative', 'group');

    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('overflow-x-auto');

    this.controlsWrapper = document.createElement('div');
    this.controlsWrapper.classList.add('absolute', 'right-0', 'top-0', 'translate-x-full', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'bg-white', 'rounded-lg', 'shadow-sm', 'p-1', 'flex', 'flex-col', 'gap-1');
    const controls = document.createElement('div');
    controls.classList.add('min-w-[32px]');

    // Add row button
    const addRowBtn = document.createElement('button');
    addRowBtn.type = 'button';
    addRowBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    addRowBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 7h12v2H2V7z"/><path d="M7 2h2v12H7V2z"/></svg>';
    addRowBtn.addEventListener('click', () => this._addRow());

    // Remove row button
    const removeRowBtn = document.createElement('button');
    removeRowBtn.type = 'button';
    removeRowBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    removeRowBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 7h12v2H2V7z"/></svg>';
    removeRowBtn.addEventListener('click', () => this._removeRow());

    // Add column button
    const addColBtn = document.createElement('button');
    addColBtn.type = 'button';
    addColBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    addColBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M7 2h2v12H7V2z"/></svg>';
    addColBtn.addEventListener('click', () => this._addColumn());

    // Remove column button
    const removeColBtn = document.createElement('button');
    removeColBtn.type = 'button';
    removeColBtn.classList.add(
      'p-1', 'rounded', 'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    removeColBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 2h2v12H3V2z"/><path d="M11 2h2v12h-2V2z"/></svg>';
    removeColBtn.addEventListener('click', () => this._removeColumn());

    // Toggle headings button
    const toggleHeadingsBtn = document.createElement('button');
    toggleHeadingsBtn.type = 'button';
    toggleHeadingsBtn.classList.add(
      'p-1', 'rounded', 
      this.data.withHeadings ? 'bg-gray-200' : '',
      'hover:bg-gray-100',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    );
    toggleHeadingsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M1 1h14v3H1V1zm0 4h3v10H1V5zm4 0h10v10H5V5z"/></svg>';
    toggleHeadingsBtn.addEventListener('click', () => {
      this.data.withHeadings = !this.data.withHeadings;
      this._updateTable();
    });

    controls.appendChild(addRowBtn);
    controls.appendChild(removeRowBtn);
    controls.appendChild(addColBtn);
    controls.appendChild(removeColBtn);
    controls.appendChild(toggleHeadingsBtn);

    this.table = document.createElement('table');
    this.table.classList.add(
      'min-w-full', 'border-collapse', 'border', 'border-gray-300',
      'table-fixed'
    );

    this._createTableContent(this.table);
    
    this.controlsWrapper.appendChild(controls);
    tableWrapper.appendChild(this.table);
    this.wrapper.appendChild(tableWrapper);
    this.wrapper.appendChild(this.controlsWrapper);

    return this.wrapper;
  }

  _createTableContent(table) {
    table.innerHTML = '';
    
    this.data.content.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      
      row.forEach((cell, cellIndex) => {
        const td = document.createElement(rowIndex === 0 && this.data.withHeadings ? 'th' : 'td');
        td.classList.add(
          'border', 'border-gray-300', 'p-2',
          'min-w-[100px]'
        );

        if (rowIndex === 0 && this.data.withHeadings) {
          td.classList.add('bg-gray-50', 'font-semibold');
        }

        const input = document.createElement('div');
        input.contentEditable = true;
        input.classList.add(
          'focus:outline-none',
          'min-h-[1.5em]',
          'w-full'
        );
        input.innerHTML = cell;

        input.addEventListener('input', () => {
          this.data.content[rowIndex][cellIndex] = input.innerHTML;
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            
            const nextCell = cellIndex < row.length - 1 ? 
              tr.cells[cellIndex + 1].querySelector('[contenteditable]') :
              tr.nextElementSibling?.cells[0]?.querySelector('[contenteditable]');

            if (nextCell) {
              nextCell.focus();
            } else if (!e.shiftKey) {
              this._addRow();
              const newRow = table.rows[table.rows.length - 1];
              newRow.cells[0].querySelector('[contenteditable]').focus();
            }
          }
        });

        td.appendChild(input);
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  }

  _addRow() {
    const columnsCount = this.data.content[0].length;
    this.data.content.push(new Array(columnsCount).fill(''));
    this._updateTable();
  }

  _removeRow() {
    if (this.data.content.length <= 1) return;
    this.data.content.pop();
    this._updateTable();
  }

  _addColumn() {
    this.data.content = this.data.content.map(row => [...row, '']);
    this._updateTable();
  }

  _removeColumn() {
    if (this.data.content[0].length <= 1) return;
    this.data.content = this.data.content.map(row => row.slice(0, -1));
    this._updateTable();
  }

  _updateTable() {
    this._createTableContent(this.table);
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    return savedData.content && Array.isArray(savedData.content);
  }

  static get sanitize() {
    return {
      content: {
        br: true
      }
    };
  }
}
