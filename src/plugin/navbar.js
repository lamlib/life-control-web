import DOMPurify from 'dompurify';
import { deleteDataOnLocalStorage } from '../js/helpers';
export const navbar = (function () {
    const _state = {
        userPublicData: null,
    }

    const _ui = {
        get accountPanel() {
            return document.getElementById("account-panel");
        },
        get accountGroupButton() {
            return this.accountPanel?.parentElement.parentElement;
        },
        get loginBtn() {
            return document.getElementById("nav-login");
        },
    };

    function _setupEventListeners() {
        _ui.accountPanel.addEventListener('click', (event) => {
            const isLogout = event.target.closest('#navbar-logout');
            if(isLogout) {
                deleteDataOnLocalStorage();
                location.reload();
            }
        })
    }

    function _showAccountGroupButton() {
        _ui.accountGroupButton.classList.replace('hidden', 'flex');
    }

    function _showLoginBtn() {
        _ui.loginBtn.classList.remove('hidden');
    }

    function _renderAccountPanelItem(username) {
        _ui.accountPanel.innerHTML = `
        <div class="transition-colors flex items-center gap-2 w-full px-4 py-3 cursor-pointer hover:bg-red-50 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 13.077q1.258 0 2.129-.871T15 10.077t-.871-2.129T12 7.077t-2.129.871T9 10.077t.871 2.129t2.129.871M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm-.193-1h13.154q.212-.133.289-.354t.134-.412q-1.35-1.325-3.137-2.087T12 15.385t-3.863.762T5 18.235q.058.19.134.411t.289.354"/></svg>
            <span>${DOMPurify.sanitize(username)}</span>
        </div>
        <a href="/pages/profile.html" class="transition-colors flex items-center gap-2 w-full px-4 py-3 cursor-pointer hover:bg-red-50 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M14.654 21.846q-.529 0-.9-.37t-.37-.899v-5.923q0-.529.37-.9t.9-.37h5.923q.529 0 .899.37t.37.9v5.923q0 .529-.37.899t-.899.37zM10.134 21l-.361-2.892q-.479-.145-1.035-.454q-.557-.31-.947-.664l-2.668 1.135l-1.865-3.25l2.306-1.739q-.045-.27-.073-.558q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626L3.258 9.126l1.865-3.212L7.771 7.03q.448-.373.97-.673q.52-.3 1.013-.464L10.134 3h3.732l.361 2.912q.575.202 1.016.463t.909.654l2.725-1.115l1.865 3.211l-2.278 1.721q0 .038.009.077q.01.039.01.077h-4.237q-.292-.652-.894-1.076T11.973 9.5q-1.046 0-1.773.727T9.473 12q0 .796.416 1.408q.415.611 1.111.904V21zm4.635-.538h5.693v-.69q-.53-.633-1.275-.972q-.746-.338-1.571-.338t-1.572.338t-1.275.971zm2.846-2.846q.53 0 .9-.37q.37-.371.37-.9t-.37-.899t-.9-.37q-.528 0-.899.37q-.37.37-.37.9q0 .528.37.898t.9.37"/></svg>
            <span>Quản Lý Tài Khoản</span>
        </a>
        <div id="navbar-logout" class="transition-colors flex items-center gap-2 w-full px-4 py-3 cursor-pointer hover:bg-red-50 hover:text-red-500 border-t border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M11 12V4q0-.425.288-.712T12 3t.713.288T13 4v8q0 .425-.288.713T12 13t-.712-.288T11 12m1 9q-1.85 0-3.488-.712T5.65 18.35t-1.937-2.863T3 12q0-1.725.638-3.312T5.425 5.85q.275-.3.7-.3t.725.3q.275.275.25.688t-.3.737q-.85.95-1.325 2.163T5 12q0 2.9 2.05 4.95T12 19q2.925 0 4.963-2.05T19 12q0-1.35-.475-2.588t-1.35-2.187q-.275-.3-.288-.7t.263-.675q.3-.3.725-.3t.7.3q1.175 1.25 1.8 2.838T21 12q0 1.85-.712 3.488t-1.925 2.862t-2.85 1.938T12 21"/></svg>
            <span>Đăng Xuất</span>
        </div>`;
    }

    function init(userPublicData) {
        if (!_ui.accountGroupButton || !_ui.accountPanel || !_ui.loginBtn) {
            console.log('[Navbar] Navbar elements not found, skipping initialization');
            return;
        }
        _state.userPublicData = userPublicData;
        if(userPublicData) {
            _renderAccountPanelItem(userPublicData.username);
            _showAccountGroupButton();
        } else {
            _showLoginBtn();
        }
        _setupEventListeners();
    }

    return { init };
})();