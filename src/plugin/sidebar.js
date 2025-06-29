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
        const button = e.target;
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
        _ui.toggle.addEventListener('click', _handleChangeToggle);
        _ui.listSubmenuToggle.forEach(button => {
            button.addEventListener('click', _handleSubmenuToggle);
        });
    }

    function init() {
        _setupEventListeners();
    }

    return { init };
})();