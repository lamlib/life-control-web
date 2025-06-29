import './main.js';
import { hasError, requestHandlers } from '@lamlib/data-sync';
import { getOneElementOrFail } from './utils';
import { theme } from '../plugin/theme.js';
import { sidebar } from '../plugin/sidebar.js';

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
                <article class="glass rounded-2xl overflow-hidden card-hover">
                    <div class="relative">
                        <img src="${element.thumbnail}" alt="${element.title}" class="w-full h-48 object-cover">
                        <div class="absolute top-3 left-3">${tags}</div>
                    </div>
                    <div class="p-6">
                        <h2 class="text-xl font-bold mb-2 ">
                        <a href="/pages/view-article?id=${element.id}" class="hover:text-blue-300 transition-colors">${element.title}</a>
                        </h2>
                        <p class="text-sm mb-4 line-clamp-2">${element.description}</p>
                        <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-red-800"></div>
                            <span class="text-xs">${element.author}</span>
                        </div>
                        <div class="text-xs">${element.date} • ${element.views}</div>
                        </div>
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

    function init (plugins) {
        plugins.forEach(plugin => plugin.init());
        _loadArticles();
    }

    return {
        init,
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const plugins = [ theme, sidebar ];
    app.init(plugins);
});