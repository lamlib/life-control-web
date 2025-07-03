import './main.js';
import { hasError, requestHandlers } from '@lamlib/data-sync';
import { getOneElementOrFail } from './utils';
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
            const tags = element.tags.map(tag => `<span class="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80">${tag}</span>`).join('')
            return `
                <article class="relative flex flex-col items-start">
                    <a class="relative w-full" data-discover="true" href="/pages/view-article?id=${element.id}">
                        <img src="${element.thumbnail}" alt="" class="aspect-[16/9] w-full rounded-2xl bg-gray-700 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
                        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-400/10">
                        </div>
                    </a>
                    <div class="w-full max-w-xl">
                        <div class="flex items-center justify-between w-full mt-2 text-xs gap-x-4 min-h-[28px]">
                        <div class="flex flex-wrap gap-2">
                            <a class="relative z-10 rounded-lg bg-dark-600 px-3 py-1.5 font-medium text-gray-300 hover:bg-dark-500" data-discover="true" href="/blog/category/CSS">CSS</a>
                        </div>
                        <div class="flex items-center gap-4 text-gray-400">
                            <time datetime="2025-06-24T13:26:40.837Z">Jun 24</time>
                            <div class="flex items-center gap-1">
                            <span>187</span> views
                            </div>
                        </div>
                    </div>
                    <div class="relative group">
                        <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-200 group-hover:text-gray-300">
                            <a data-discover="true" href="/pages/view-article?id=${element.id}"><span class="absolute inset-0"></span>${element.title}</a>
                        </h3>
                        <p class="mt-2 text-sm leading-6 text-gray-300 line-clamp-3">
                            ${element.description}
                        </p>
                    </div>
                    <div class="relative flex items-center mt-4 gap-x-3">
                        <span class="relative flex shrink-0 overflow-hidden rounded bg-black w-8 h-8">
                            <img class="aspect-square h-full w-full m-0" alt="Christine Vallaure de la Paz" src="https://pbs.twimg.com/profile_images/1800507023672451072/c6OPj69O_400x400.jpg">
                        </span>
                        <div class="text-sm leading-4">
                                <p class="font-semibold text-gray-200">
                                    <a data-discover="true" href="/profile/Christine Vallaure de la Paz">
                                        <span class="absolute inset-0"></span>Christine Vallaure de la Paz
                                    </a>
                                </p>
                            </div>
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
    const plugins = [ sidebar ];
    app.init(plugins);
});