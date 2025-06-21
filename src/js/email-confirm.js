import { getSearchParams, handleErr } from "./utils";

const app = (function() {
    function _setupEventListener() {

    }

    /**
     * @param {string} message 
     */
    function _showError(message) {
    }
    /**
     * @returns {void}
     */
    function _showLoading() {

    }
    /**
     * 
     * @param {string} message 
     * @returns {void} 
     */
    function _showSuccess(message) {

    }
    /**
     * 
     * @param {string} message 
     * @returns {void}
     */
    function _showExpired(message) {

    }

    /**
     * @param {string} confirmationToken 
     * @returns {void}
     */
    function _verifyConfirmationToken (confirmationToken) {

    }

    const init = handleErr(() => {
        _setupEventListener();
        const confirmationToken = getSearchParams('confirmationToken');
        _verifyConfirmationToken(confirmationToken);
    }, error => _showError(error))

    return {
        init,
    }
})();

document.addEventListener('DOMContentLoaded', app.init);