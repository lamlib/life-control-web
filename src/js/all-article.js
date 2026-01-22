import { hasError, requestHandlers } from '@lamlib/data-sync';
import { getOneElementOrFail } from './utils';
import Pagination from '@lamlib/pagination';
import DOMPurify from 'dompurify';

const app = (function() {
    const state = {
        id: null,
    };
    const ui = {
        /** @type {HTMLTableElement} */
        get articlesTable () {
            return getOneElementOrFail('#articleTable');
        },
        get deleteModal () {
            return getOneElementOrFail('#deleteModal');
        },
        get articlesPagination () {
            return getOneElementOrFail('#articleTablePagination');
        }
    }

    const { getArticles, deleteArticleById } = requestHandlers;

    function _drawArticlesTable(articles) {
        new Pagination({
            tableId: ui.articlesTable.id,
            data: articles,
            itemsPerPage: 5,
            paginationContainerId: ui.articlesPagination.id,
            rowRenderer: (idx, article) => {
                const Tags = article.tags.map(tag => `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">${DOMPurify.sanitize(tag)}</span>`).join(' ');
                const Thumbnail = `<img src="${DOMPurify.sanitize(article.thumbnail)}" class="w-16 h-16 object-cover rounded" alt="Thumbnail" />`
                const BtnView = `<a href="/pages/view-article?id=${DOMPurify.sanitize(article.id)}" class="text-blue-500 hover:text-blue-700">Xem</a>`;
                const BtnEdit = `<a href="/pages/edit-article?id=${DOMPurify.sanitize(article.id)}" class="text-orange-500 hover:text-orange-700 mr-2">Sửa</a>`;
                const BtnDelete = `<button data-id="${DOMPurify.sanitize(article.id)}" class="text-red-500 hover:text-red-700 cursor-pointer deleteBtn">Xoá</button>`;
                return `
                <tr>
                    <td class="px-6 py-2">${DOMPurify.sanitize(idx + 1)}</td>
                    <td class="px-6 py-2">${DOMPurify.sanitize(article.title)}</td>
                    <td class="px-6 py-2">${Tags}</td>
                    <td class="px-6 py-2">${Thumbnail}</td>
                    <td class="px-6 py-2">${BtnView}</td>
                    <td class="px-6 py-2">${BtnEdit + BtnDelete}</td>
                </tr>
                `;
            },
        })
    }

    async function _loadArticles (time = new Date().getTime()) {
        const articles = await getArticles({time});
        if(hasError()) {
            _drawArticlesTable([]);
        } else {
            _drawArticlesTable(articles);
        }
    }

    function _setupEventListeners() {
        ui.articlesTable.addEventListener('click', (e) => {
            if(e.target.classList.contains('deleteBtn')) {
                state.id = e.target.dataset.id;
                ui.deleteModal.classList.remove('hidden');}
        });
        ui.deleteModal.addEventListener('click', async (e) => {
            console.log(e.target.id);
            
            if(e.target.id == 'cancelDelete' || e.target.id == 'deleteModal') {
                ui.deleteModal.classList.add('hidden');
            } else if(e.target.id == 'confirmDelete') {
                await deleteArticleById({ id: state.id })
                if(hasError()) {
                    alert('Lỗi khi xoá bài viết, vui lòng thử lại sau.');
                    return;
                } 
                ui.deleteModal.classList.add('hidden');
                _loadArticles();
            }
        });
    }

    function init () {
        _loadArticles();
        _setupEventListeners();
    }

    return {
        init,
        _loadArticles
    }
})();
document.addEventListener('DOMContentLoaded', app.init)