import { getOneElementOrFail } from "./utils";
import { requestHandlers as articlesService, hasError } from'@lamlib/data-sync';

const app = (function () {
    let _editor;

    const _ui = {
        get toolSave() {
            return getOneElementOrFail('#tool-save');
        },
        get toolClear() {
            return getOneElementOrFail('#tool-clear');
        },
    }

    function _setupEditor() {
        return new EditorJS({
            holder: 'editorjs',
            placeholder: 'Hãy bắt đầu viết nội dung của bạn...',
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Nhập tiêu đề...',
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: 'http://localhost:3000/api/v1/files/byFile',
                            byUrl: 'http://localhost:3000/api/v1/files/byUrl', 
                        }
                    }
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                embed: {
                    class: Embed,
                },
                list: {
                    class: EditorjsList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                    config: {
                        placeholder: 'Nhập đoạn văn...'
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+O',
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                delimiter: Delimiter,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    }
                },
                warning: Warning,
                code: {
                    class: editorJsCodeCup,
                    config: {
                        placeholder: 'Nhập code...'
                    }
                },
            },
            onChange: function () {
                console.log('Nội dung đã thay đổi');
            }
        })
    }

    async function _handleClickToolSave() {
        const data = await _editor.save();
        const title = window.prompt('Nhập tiêu đề bài viết', 'Tiêu đề bài viết');
        if(!title) {
            alert('Vui lòng nhập tiêu đề bài viết');
            return;
        }
        await articlesService.postArticle({
            title,
            content: JSON.stringify(data)
        });
        if(hasError()) {
            alert('Loi, vui long thu lai')
        } else {
            alert('Luu thanh cong');
            location.href = '/pages/all-article';
        }
    }

    async function _handleClickToolClear() {
        _editor.clear();
    }

    function _setupEventListener() {
        _ui.toolSave.addEventListener('click', _handleClickToolSave);
        _ui.toolClear.addEventListener('click', _handleClickToolClear);
    }

    function init() {
        _editor = _setupEditor();
        window.editor = _editor;
        _setupEventListener();
    }
    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', app.init);