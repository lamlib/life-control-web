import { hasError, requestHandlers } from '@lamlib/data-sync';
import { getOneElementOrFail } from './utils';

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
    }

    const { getArticles, deleteArticleById } = requestHandlers;

    function _drawArticlesTable(articles) {
        ui.articlesTable.tBodies.item(0).innerHTML = ''; // Clear existing rows
        if(articles.length === 0) {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', '6');
            td.classList.add('text-center', 'py-4');
            td.textContent = 'Không có bài viết nào.';
            row.appendChild(td);
            ui.articlesTable.tBodies.item(0).appendChild(row);
            return;
        }
        articles.forEach((element, idx) => {
            const row = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            const td4 = document.createElement('td');
            const td5 = document.createElement('td');
            const td6 = document.createElement('td');
            const rowStyle = ['px-6', 'py-2'];
            td1.classList.add(...rowStyle);
            td2.classList.add(...rowStyle);
            td3.classList.add(...rowStyle);
            td4.classList.add(...rowStyle);
            td5.classList.add(...rowStyle);
            td6.classList.add(...rowStyle);
            td1.textContent = idx + 1;
            td2.textContent = element.title;
            td3.innerHTML = element.tags.map(tag => 
                `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">${tag}</span>`
            ).join(' ');
            td4.innerHTML = `<img src="${element.thumbnail}" class="w-16 h-16 object-cover rounded" alt="Thumbnail" />`;
            td5.innerHTML = `<a href="/pages/view-article?id=${element.id}" class="text-blue-500 hover:text-blue-700">Xem</a>`;
            td6.innerHTML = `<a href="/pages/edit-article?id=${element.id}" class="text-orange-500 hover:text-orange-700 mr-2">Sửa</a>`;
            td6.innerHTML += ` <button data-id="${element.id}" class="text-red-500 hover:text-red-700 deleteBtn">Xoá</button>`;
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            row.appendChild(td6);
            ui.articlesTable.tBodies.item(0).appendChild(row);
        });
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