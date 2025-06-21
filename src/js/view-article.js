import { requestHandlers as articlesService } from'@lamlib/data-sync';
import { getSearchParams } from './utils';

const app = (function () {
    function _setupEditor(data = {}) {
        return new EditorJS({
            holder: 'editorjs',
            placeholder: 'Hãy bắt đầu viết nội dung của bạn...',
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Nhập tiêu đề...',
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: EditorjsList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                    config: {
                        placeholder: 'Nhập đoạn văn...'
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Nhập trích dẫn...',
                        captionPlaceholder: 'Tác giả'
                    }
                },
                delimiter: Delimiter,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    }
                },
                code: {
                    class: CodeTool,
                    config: {
                        placeholder: 'Nhập code...'
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: 'http://localhost:3000/api/v1/files/byFile',
                            byUrl: 'http://localhost:3000/api/v1/files/byUrl', 
                        }
                    }
                },
                warning: Warning,
            },
            onChange: function () {
                console.log('Nội dung đã thay đổi');
            },
            data,
            readOnly: true,
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