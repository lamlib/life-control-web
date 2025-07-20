import Bold from "../plugin/bold";
import Checklist from "../plugin/checklist";
import MonacoCodeBlock from "../plugin/code";
import Heading from "../plugin/heading";
import Image from "../plugin/image";
import Link from "../plugin/link";
import List from "../plugin/list";
import Marker from "../plugin/marker";
import Quote from "../plugin/quote";
import Table from "../plugin/table";
import Color from "../plugin/color";
import Alignment from "../plugin/alignment";
import Footnote from "../plugin/footnote";
import ScriptTool from "../plugin/script";
import TableOfContents from "../plugin/table-of-contents";
import { getOneElementOrFail } from "./utils";
import { requestHandlers as articlesService, hasError, setResponseOperator, resetResponseOperator } from'@lamlib/data-sync';
import Delimiter from "../plugin/delimiter";
import Embed from "../plugin/embed";
import File from "../plugin/file";
import Math from "../plugin/math";
import Note from "../plugin/note";

const app = (function () {
    let _editor;

    const _ui = {
        get toolSave() {
            return getOneElementOrFail('#tool-save');
        },
        get toolClear() {
            return getOneElementOrFail('#tool-clear');
        },
        get toolPreview() {
            return getOneElementOrFail('#tool-preview');
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
            tools: {
                //  alignment: Alignment,
                //  bold: Bold,
                //  checklist: Checklist,
                //  monacoCode: MonacoCodeBlock,
                //  color: Color,
                //  delimiter: Delimiter,
                //  embed: Embed,
                //  file: File,
                //  footnote: Footnote,
                 heading: Heading,
                //  image: Image,
                //  link: Link,
                //  list: List,
                //  marker: Marker,
                //  math: Math,
                //  note: Note,
                //  quote: Quote,
                //  script: ScriptTool,
                //  toc: TableOfContents,
                //  table: Table,
            },
            onChange: () => { console.log('Nội dung đã thay đổi') },
            onReady: () => { console.log('Editor sẵn sàng hoạt động!') },
            autofocus: true,
            placeholder: 'Viết blog tại đây!',
            logLevel: 'VERBOSE',
            readOnly: false,
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
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    async function _handleClickToolPreview(event) {
        _editor.readOnly.toggle();
        event.currentTarget.querySelectorAll('svg').forEach(svg => {
            svg.classList.toggle('hidden');
        });
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
        _ui.toolPreview.addEventListener('click', _handleClickToolPreview)
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