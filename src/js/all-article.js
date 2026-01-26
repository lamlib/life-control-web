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
        const paginationInstance = new Pagination({
            tableId: ui.articlesTable.id,
            data: articles,
            itemsPerPage: 10,
            paginationContainerId: ui.articlesPagination.id,
            cssClasses: {
                btnActive: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer',
                btnNormal: 'px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 dark:hover:bg-blue-900/20 transition cursor-pointer',
                formSelect: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer',
                totalSize: 'mr-4 text-gray-600 dark:text-gray-400',
                ellipsis: 'mx-2 text-gray-400',
                row: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                col: '',
            },
            rowRenderer: (idx, article) => {
                const Tags = article.tags.map(tag => `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">${DOMPurify.sanitize(tag)}</span>`).join(' ');
                const Thumbnail = `<img src="${DOMPurify.sanitize(article.thumbnail)}" class="w-16 h-16 object-cover rounded" alt="Thumbnail" />`;
                const BtnView = `<a href="/pages/view-article?id=${DOMPurify.sanitize(article.id)}" class="text-blue-500 hover:text-blue-700">Xem</a>`;
                const BtnEdit = `<a href="/pages/edit-article?id=${DOMPurify.sanitize(article.id)}" class="text-orange-500 hover:text-orange-700 mr-2">Sửa</a>`;
                const BtnDelete = `<button data-id="${DOMPurify.sanitize(article.id)}" class="text-red-500 hover:text-red-700 cursor-pointer deleteBtn">Xoá</button>`;
                return `
                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-2">${DOMPurify.sanitize(idx + 1)}</td>
                    <td class="px-6 py-2">${DOMPurify.sanitize(article.title)}</td>
                    <td class="px-6 py-2">${Tags}</td>
                    <td class="px-6 py-2">${Thumbnail}</td>
                    <td class="px-6 py-2">${BtnView}</td>
                    <td class="px-6 py-2">${BtnEdit + BtnDelete}</td>
                </tr>
                `;
            },
            cardRenderer: (idx, article) => {
                const Tags = article.tags.map(tag => `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">${DOMPurify.sanitize(tag)}</span>`).join(' ');
                const BtnEdit = `<a href="/pages/edit-article?id=${DOMPurify.sanitize(article.id)}" class="text-orange-500 hover:text-orange-700 text-sm">Sửa</a>`;
                const BtnDelete = `<button data-id="${DOMPurify.sanitize(article.id)}" class="text-red-500 hover:text-red-700 cursor-pointer deleteBtn text-sm">Xoá</button>`;
                const BtnView = `<a href="/pages/view-article?id=${DOMPurify.sanitize(article.id)}" class="text-blue-500 hover:text-blue-700 text-sm">Xem</a>`;
                
                return `
                <div class="bg-white rounded-lg transition p-4 border border-gray-100">
                    <div class="flex gap-4 mb-3">
                        <img src="${DOMPurify.sanitize(article.thumbnail)}" class="w-20 h-20 object-cover rounded" alt="Thumbnail" />
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">${DOMPurify.sanitize(article.title)}</h3>
                            <span class="text-xs text-gray-500 dark:text-gray-400">#${idx + 1}</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${Tags}
                    </div>
                    <div class="flex justify-end gap-3 pt-3 border-t dark:border-gray-700">
                        ${BtnView}
                        ${BtnEdit}
                        ${BtnDelete}
                    </div>
                </div>
                `;
            },
            gridColumns: 3,
        });

        function handleResponsive() {
            const isMobile = window.innerWidth < 768; // md breakpoint
            if (isMobile) {
                paginationInstance.changeTypeDisplayToGrid();
            } else {
                paginationInstance.changeTypeDisplayToTable();
            }
        }

        handleResponsive();
        window.addEventListener('resize', handleResponsive);
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