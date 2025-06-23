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
            return `
                <article class="p-6 flex flex-col gap-4 ${idx % 2 === 0 ? '' : 'dark:bg-gray-800'}">
                    <img src="./src/img/banner.png" alt="" class="w-full object-cover rounded-lg mb-4">
                    <div>
                        <h2 class="text-2xl font-bold mb-2 hover:underline cursor-pointer"><a href="/pages/view-article?id=${element.id}">${element.title}</a></h2>
                        <p class="mb-4 text-gray-600 dark:text-gray-300">${element.description}</p>
                        <a href="/pages/view-article?id=${element.id}" class="text-yellow-500 text-sm hover:underline cursor-pointer">Read More</a>
                    </div>
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
window.app = app;
document.addEventListener('DOMContentLoaded', app.init)