import './main.js';
import { hasError, requestHandlers, messageState } from '@lamlib/data-sync';
import { getOneElementOrFail } from './utils';
import { sidebar } from '../plugin/sidebar.js';
import { theme } from '../plugin/theme.js';
import { toast } from '../plugin/toast.js';
import fallbackAvatar from '../img/fallback/avatar.svg';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';

const app = (function() {
    const { getArticles, getProfile } = requestHandlers;

    const ui = {
        get articlesTable () {
            return getOneElementOrFail('#articleTable');
        },
    }

    async function _loadProfile () {
        const profile = await getProfile();
        if(hasError()) {
            messageState.error = null;
        }
        console.log(profile);
    }

    /**
     * @param {string | undefined} date 
     */
    function _convertPublishDate(date) {
        if(date == null) {
            return 'Chưa xuất bản';
        } else {
            return dayjs(date).format('DD/MM/YYYY');
        }
    }

    function _drawArticlesTable(articles) {
        ui.articlesTable.innerHTML = articles.map((element, idx) => {
            const tags = element.tags.map(tag => `<a class="relative z-10 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-200 px-2 py-1 font-medium hover:bg-dark-500" data-discover="true" href="/blog/category/${tag}">${tag}</a>`).join('')
            return `
                <article class="relative flex flex-col items-start">
                    <a class="relative w-full" data-discover="true" href="/pages/view-article?id=${element.id}">
                        <img src="${element.thumbnail}" alt="" class="aspect-[16/9] w-full rounded-2xl bg-gray-700 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
                    </a>
                    <div class="w-full max-w-xl">
                        <div class="flex items-center justify-between w-full mt-2 text-xs gap-x-4 min-h-[28px]">
                            <div class="flex flex-wrap gap-2">
                                ${tags}
                            </div>
                            <div class="flex items-center gap-2 text-gray-400">
                                <time datetime="${element.publishedAt}">${_convertPublishDate(element.publishedAt)}</time>
                                <div class="flex items-center gap-1 text-nowrap">
                                    <span>${element.viewCount}</span> lượt xem
                                </div>
                            </div>
                        </div>
                        <div class="relative group">
                            <h3 class="mt-3 text-lg font-semibold leading-6 text-zinc-700 dark:text-gray-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">
                                <a data-discover="true" href="/pages/view-article?id=${element.id}"><span class="absolute inset-0"></span>${element.title}</a>
                            </h3>
                            <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-gray-300 line-clamp-3">
                                ${element.description}
                            </p>
                        </div>
                        <div class="relative flex items-center mt-4 gap-x-3">
                            <span class="relative flex shrink-0 overflow-hidden rounded bg-black w-8 h-8">
                                <img class="aspect-square h-full w-full m-0" alt="${element.authorName}" src="${element.authorAvatarURL ?? fallbackAvatar}">
                            </span>
                            <div class="text-sm leading-4">
                                <p class="font-semibold text-zinc-800 dark:text-gray-200">
                                    <a data-discover="true" href="/profile/Christine Vallaure de la Paz">
                                        ${element.authorName}
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
            toast.error('Hệ thống', messageState.error?.message ?? 'Lỗi khi truy cập bài viết')
            return;
        }
        _drawArticlesTable(articles);
    }

    function init (plugins) {
        plugins.forEach(plugin => plugin.init());
        _loadArticles();
        _loadProfile();
    }

    return {
        init,
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const plugins = [ sidebar, theme ];
    app.init(plugins);
});