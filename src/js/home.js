import { hasError, requestHandlers } from '@lamlib/data-sync';
import { getOneElementOrFail } from './utils';

const app = (function() {
    const { getArticles } = requestHandlers;

    const ui = {
        get articlesTable () {
            return getOneElementOrFail('#articleTable');
        },
    }

    function _drawArticlesTable(articles) {
        ui.articlesTable.innerHTML = articles.map((element, idx) => {
            const tags = element.tags.map(tag => `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">${tag}</span>`).join('')
            return `
                <article class="p-4">
                    <div class="mb-2 flex gap-2 h-6">${tags}</div>
                    <img src="${element.thumbnail}" alt="" class="w-full rounded mb-2 size-52 object-cover">
                    <h2 class="text-lg font-bold mb-1"><a href="/pages/view-article?id=${element.id}" class="hover:underline">${element.title}</a></h2>
                    <p class="text-xs text-gray-600 mb-2">${element.description}</p>
                    <a href="/pages/view-article?id=${element.id}" class="text-yellow-500 text-xs hover:underline">Read More</a>
                </article>
            `;
        }).join('');
    }

    async function _loadArticles (time = new Date().getTime()) {
        const articles = await getArticles({time});
        if(hasError()) {
            _drawArticlesTable([]);
        } else {
            _drawArticlesTable(articles);
        }
    }

    function init () {
        _loadArticles();
    }

    return {
        init,
    }
})();
document.addEventListener('DOMContentLoaded', app.init)