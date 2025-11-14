import * as datasync from '@lamlib/data-sync';
// ============== Cấu hình ứng dụng ================

const SERVICE_URL = "/api/v1";

// ============== Xử lý middleware ================
/**
 * Trước mỗi khi gọi tới API thì kiểu tra xem có thông tin người dùng lưu trước đó hay không
 *  -> Yes: 
 *  -> No: Báo rằng không tìm thấy mã truy cập
 * 
 * @param {*} request 
 */
datasync.interceptors.before = async function (request) {
    let store = localStorage.getItem('lamlib_clover');
    if(store) {
        store = JSON.parse(store);
        if(store?.accessToken) {
            if(new Date(store.accessTokenExpire).getTime() < Date.now()) {
                const headers = new Headers();
                headers.append('Accept', 'application/json')
                headers.append('Content-Type', 'application/json')
                const res = await fetch('/api/v1/auth/refresh', {
                    method: 'POST',
                    body: JSON.stringify({
                        refreshToken: store.refreshToken,
                    }),
                    headers
                });
                if(!res.ok && location.pathname != '/pages/login') { // Refresh đã hết hạn, bắt bộc phải login lại.
                    location.href = '/pages/login';
                } else {
                    const { data } = await res.json();
                    store = data;
                    localStorage.setItem('lamlib_clover', JSON.stringify(store));
                }
            }
            request.headers.append('Authorization', 'Bearer ' + store.accessToken);
        } else {
            console.log('Access token is not found, can not retrieve access token!');    
        }
    } else {
        console.log('Local storage is not found, can not retrieve access token!');
    }
}

datasync.interceptors.after = async function(response) {
    if(response.status == 401 && location.pathname != '/pages/login') {
        location.href = '/pages/login';
    }
}

datasync.registerPostEndpoint('postRegister', `${SERVICE_URL}/auth/register`);
datasync.registerPostEndpoint('postLogin', `${SERVICE_URL}/auth/login`);
datasync.registerGetEndpoint('getProfile', `${SERVICE_URL}/auth/profile`);
datasync.registerPostEndpoint('postArticle', `${SERVICE_URL}/articles`);
datasync.registerPostEndpoint('postImage', `${SERVICE_URL}/files/byFile`);
datasync.registerGetEndpoint('getArticles', `${SERVICE_URL}/articles`);
datasync.registerGetEndpoint('getArticleById', `${SERVICE_URL}/articles/:id`);
datasync.registerDeleteEndpoint('deleteArticleById', `${SERVICE_URL}/articles/:id`);
datasync.registerPatchEndpoint('patchArticleById', `${SERVICE_URL}/articles/:id`);
