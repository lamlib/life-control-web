import { getOneElementOrFail, getSearchParams } from "./utils";
import { requestHandlers as articlesService, hasError } from'@lamlib/data-sync';
import MonacoCodeBlock from "../plugin/code";
import Delimiter from '../plugin/delimiter';
import Heading from '../plugin/heading';
import List from '../plugin/list';
import Note from '../plugin/note';
import Table from '../plugin/table';
import EditorJS from '@editorjs/editorjs';
import InlineCodeTool from "../plugin/code-inline";

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
                alert('Vui lòng nhập tiêu đề bài viết');
                return;
            }
            if(!description) {
                alert('Vui lòng nhập mô tả bài viết');
                return;
            }
            const data = await _editor.save();
            await articlesService.patchArticleById({
                title,
                description,
                content: JSON.stringify(data),
            }, { id: _article.id });
            if(hasError()) {
                alert('Lỗi, không thể chỉnh sửa bài viết, vui lòng thử lại sau.');
            } else {
                alert('Chỉnh sửa bài viết thành công!');
                location.href = '/pages/all-article';
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