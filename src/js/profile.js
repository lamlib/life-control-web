import { requestHandlers } from "@lamlib/data-sync";

const app = (function() {
    const { getProfile } = requestHandlers;

    async function _loadProfile () {
        const profile = await getProfile();
    }

    function init () {
        _loadProfile();
    }

    return {
        init,
    }
})();

document.addEventListener('DOMContentLoaded', app.init)