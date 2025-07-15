import { requestHandlers as articlesService } from'@lamlib/data-sync';
import { getSearchParams } from './utils';
import MonacoCodeBlock from "../plugin/code";

const app = (function () {
    function _setupEditor(data = {}) {
        return new EditorJS({
            holder: 'editorjs',
            tools: {
                 monacoCode: MonacoCodeBlock,
            },
            onChange: () => { console.log('Nội dung đã thay đổi') },
            onReady: () => { console.log('Editor sẵn sàng hoạt động!') },
            autofocus: true,
            placeholder: 'Viết blog tại đây!',
            logLevel: 'VERBOSE',
            readOnly: true,
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

    async function init() {
        const article = await _loadArticle();
        _setupEditor(JSON.parse(article.content));
    }

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', app.init);