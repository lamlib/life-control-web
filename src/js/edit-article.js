import { getOneElementOrFail, getSearchParams } from "./utils";
import { requestHandlers as articlesService, hasError } from'@lamlib/data-sync';
import MonacoCodeBlock from "./plugin/code.js";
import Delimiter from './plugin/delimiter.js';
import Heading from './plugin/heading.js';
import List from './plugin/list.js';
import Note from './plugin/note.js';
import ImageBlock from './plugin/image.js';
import Table from './plugin/table.js';
import { toast } from './plugin/toast.js';
import EditorJS from '@editorjs/editorjs';
import InlineCodeTool from "./plugin/code-inline.js";

const app = (function () {
    let _editor;
    let _article;

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
        }
    }

    function _setupEditor(data = {}) {
        return new EditorJS({
            holder: 'editorjs',
            placeholder: 'Hãy bắt đầu viết nội dung của bạn...',
            tools: {
                monacoCode: MonacoCodeBlock,
                delimiter: Delimiter,
                heading: Heading,
                list: List,
                note: Note,
                inlineCode: InlineCodeTool,
                image: ImageBlock,
            },
            onChange: function () {
                console.log('Nội dung đã thay đổi');
            },
            data,
        })
    }

    async function _loadArticle() {
        const id = getSearchParams('id');
        if (!id) {
            console.error('Article ID is required to view the article.');
            return;
        }
        return await articlesService.getArticleById({ id });
    }

    async function _handleClickToolSave() {
        _ui.saveModal.classList.remove('hidden');
        _ui.saveForm.articleDescription.value = _article.description ?? '';
        _ui.saveForm.articleTitle.value = _article.title ?? '';
        return;
    }

    async function _handleClickToolClear() {
        _editor.clear();
    }

    function _setupEventListener() {
        _ui.toolSave.addEventListener('click', _handleClickToolSave);
        _ui.toolClear.addEventListener('click', _handleClickToolClear);
        _ui.saveForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = _ui.saveForm.articleTitle.value.trim();
            const description = _ui.saveForm.articleDescription.value.trim();
            if(!title) {
                toast.warning('Hệ thống', 'Vui lòng nhập tiêu đề bài viết');
                return;
            }
            if(!description) {
                toast.warning('Hệ thống', 'Vui lòng nhập mô tả bài viết');
                return;
            }
            const data = await _editor.save();
            await articlesService.patchArticleById({
                title,
                description,
                content: JSON.stringify(data),
            }, { id: _article.id });
            if(hasError()) {
                toast.error('Hệ thống', 'không thể chỉnh sửa bài viết, vui lòng thử lại sau.');
            } else {
                toast.success('Hệ thống', 'Cập nhập bài viết thành công!');
                _ui.saveModal.classList.add('hidden');
            }
        });
        _ui.saveModal.addEventListener('click', (e) => {
            if (e.target.id === 'cancelSave' || e.target.id === 'saveModal') {
                e.preventDefault();
                _ui.saveForm.reset();
                _ui.saveModal.classList.add('hidden');
            }
        });
    }

    async function init() {
        _article = await _loadArticle()
        _editor = _setupEditor(JSON.parse(_article.content));
        window.editor = _editor;
        _setupEventListener();
    }

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', app.init);