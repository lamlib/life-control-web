export const theme = (function () {
    const _ui = {
        get toggle() {
            return document.getElementById("darkToggle");
        },
    };

    function _handleChangeToggle(e) {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", e.target.checked ? "dark" : "light");
    }

    function _setupEventListeners() {
        if (_ui.toggle) {
            _ui.toggle.addEventListener('change', _handleChangeToggle);
        }
    }

    function isDark() {
        if(localStorage.getItem("theme") === "dark") {
            return true;
        }
        return false;
    }

    function init() {
        // Skip dark mode initialization if toggle doesn't exist (dark mode removed from design)
        if (!_ui.toggle) {
            console.log('[Theme] Dark mode toggle not found, skipping initialization');
            return;
        }
        if(localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.add("dark");
            _ui.toggle.checked = true;
        }
        _setupEventListeners();
    }

    return {
        init,
        isDark,
    };
})();