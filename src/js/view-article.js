import { requestHandlers as articlesService } from'@lamlib/data-sync';
import { getSearchParams } from './utils';
import MonacoCodeBlock from "../plugin/code";
import Delimiter from '../plugin/delimiter';
import Heading from '../plugin/heading';
import List from '../plugin/list';
import Note from '../plugin/note';
import EditorJS from '@editorjs/editorjs';
import { sidebar } from '../plugin/sidebar';
import { theme } from '../plugin/theme';
import InlineCodeTool from '../plugin/code-inline';

const app = (function () {
    function _setupEditor(data = {}) {
        return new EditorJS({
            holder: 'editorjs',
            tools: {
                monacoCode: MonacoCodeBlock,
                delimiter: Delimiter,
                heading: Heading,
                list: List,
                note: Note,
                inlineCode: InlineCodeTool
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

    async function init(plugins) {
        plugins.forEach(plugin => plugin.init());
        const article = await _loadArticle();
        const content = JSON.parse(article.content);
        console.log(content); 
        _setupEditor(content);
    }

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const plugins = [sidebar, theme];
    app.init(plugins);
});