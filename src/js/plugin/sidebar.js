export const sidebar = (function () {
    const _ui = {
        get bar() {
            return document.getElementById("sidebar");
        },
        get toggle() {
            return document.getElementById("sidebarToggle");
        },
        get listSubmenuToggle() {
            return document.querySelectorAll(".submenu-toggle");
        }
    };

    function _handleChangeToggle(e) {
         _ui.bar.classList.toggle("hidden");
    }
    
    function _handleSubmenuToggle(e) {
        const button = e.currentTarget;
        const submenu = button.nextElementSibling;
        const svg = button.querySelector('svg');
        if (submenu && submenu.classList.contains('hidden')) {
          submenu.classList.remove('hidden');
          svg.style.transform = 'rotate(180deg)';
        } else if (submenu) {
          submenu.classList.add('hidden');
          svg.style.transform = 'rotate(0deg)';
        }
    }

    function _setupEventListeners() {
        if (_ui.toggle) {
            _ui.toggle.addEventListener('click', _handleChangeToggle);
        }
        _ui.listSubmenuToggle.forEach(button => {
            button.addEventListener('click', _handleSubmenuToggle);
        });
    }

    function init() {
        // Skip initialization if sidebar elements don't exist
        if (!_ui.bar || !_ui.toggle) {
            console.log('[Sidebar] Sidebar elements not found, skipping initialization');
            return;
        }
        _setupEventListeners();
    }

    return { init };
})();