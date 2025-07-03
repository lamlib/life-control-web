import { getOneElementOrFail } from "./utils";
import { requestHandlers as articlesService, hasError, setResponseOperator, resetResponseOperator } from'@lamlib/data-sync';

const app = (function () {
    let _editor;

    const _ui = {
        get toolSave() {
            return getOneElementOrFail('#tool-save');
        },
        get toolClear() {
            return getOneElementOrFail('#tool-clear');
        },
        get saveModal () {
            return getOneElementOrFail('#saveModal');
        },
        get saveForm () {
            return document.forms['save'];
        },
        get dropArea () {
            return getOneElementOrFail('#drop-area');
        },
        get fileInput () {
            return getOneElementOrFail('#articleImage');
        },
        get previewImage () {
            return getOneElementOrFail('#previewImage');
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

    async function _uploadFile(file) {
        const formData = new FormData();
        formData.append('image', file);
        setResponseOperator({ picker: result => result });
        const data = await articlesService.postImage(formData);
        resetResponseOperator();
        if(hasError()) {
            alert('Lỗi, không thể lưu image, vui lòng thử lại sau.');
        } else {
            _showPreview(file);
            _ui.saveForm.thumbnail.value = data.file.url;
        }
    }

    function _showPreview(file) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            _ui.previewImage.src = e.target.result;
            _ui.previewImage.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    async function _handleClickToolSave() {
        _ui.saveModal.classList.remove('hidden');
        return;
    }

    async function _handleClickToolClear() {
        _editor.clear();
    }

    function _handleDragOver(e) {
        e.preventDefault();
        _ui.dropArea.classList.add('border-blue-400', 'bg-blue-50');
    }

    function _handleDragLeave(e) {
        e.preventDefault();
        _ui.dropArea.classList.remove('border-blue-400', 'bg-blue-50');
    }

    function _handleDrop(e) {
        e.preventDefault();
        _ui.dropArea.classList.remove('border-blue-400', 'bg-blue-50');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            _ui.fileInput.files = e.dataTransfer.files;
            _uploadFile(e.dataTransfer.files[0]);
        }
    }

    function _handleChangeFileInput(e) {
        if (_ui.fileInput.files && _ui.fileInput.files[0]) {
            _uploadFile(_ui.fileInput.files[0]);
        }
    }

    async function _handleSubmitForm(e) {
        e.preventDefault();
        const title = _ui.saveForm.articleTitle.value.trim();
        const description = _ui.saveForm.articleDescription.value.trim();
        const thumbnail = _ui.saveForm.thumbnail.value.trim();
        const listTag = _ui.saveForm.articleTags.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag);
        if(listTag.length === 0) {
            alert('Vui lòng nhập ít nhất một tag cho bài viết');
            return;
        }
        if(listTag.length > 5) {
            alert('Vui lòng nhập tối đa 5 tag cho bài viết');
            return;
        } 
        if(!title) {
            alert('Vui lòng nhập tiêu đề bài viết');
            return;
        }
        if(!description) {
            alert('Vui lòng nhập mô tả bài viết');
            return;
        }
        if(!thumbnail) {
            alert('Vui lòng tải lên hình ảnh đại diện cho bài viết');
            return;
        }
        const data = await _editor.save();
        await articlesService.postArticle({
            title,
            listTag,
            thumbnail,
            description,
            content: JSON.stringify(data)
        });
        if(hasError()) {
            alert('Lỗi, không thể lưu bài viết, vui lòng thử lại sau.');
        } else {
            alert('Lưu bài viết thành công!');
            location.href = '/';
        }
    }

    function _handleClickModal(e) {
        if (e.target.id === 'cancelSave' || e.target.id === 'saveModal') {
            e.preventDefault();
            _ui.saveModal.classList.add('hidden');
        }
    }

    function _setupEventListener() {
        _ui.dropArea.addEventListener('dragover', _handleDragOver);
        _ui.dropArea.addEventListener('dragleave', _handleDragLeave);
        _ui.dropArea.addEventListener('drop', _handleDrop);
        _ui.fileInput.addEventListener('change', _handleChangeFileInput);
        _ui.toolSave.addEventListener('click', _handleClickToolSave);
        _ui.toolClear.addEventListener('click', _handleClickToolClear);
        _ui.saveForm.addEventListener('submit', _handleSubmitForm);
        _ui.saveModal.addEventListener('click', _handleClickModal);
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