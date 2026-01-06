import { requestHandlers, messageState, hasError } from "@lamlib/data-sync";

import { setError, clearError, getOneElementOrFail } from "./utils.js";

const app = (function() {
    const { postLogin, postRegister, getProviderEnabled } = requestHandlers;

    function _isLoginFormValid(loginForm) {
        let isFormValid = true;
        const formData = new FormData(loginForm);
        const { emailAddress, password } = loginForm;

        clearError(emailAddress);
        clearError(password);

        // Kiểm tra mật khẩu có
        if (validator.isEmpty(formData.get('password'))) {
            setError(password, 'Vui lòng nhập mật khẩu');
            isFormValid = false;
        }
        // Kiểm tra địa chỉ email có
        if (validator.isEmpty(formData.get('emailAddress'))) {
            setError(emailAddress, 'Vui lòng nhập địa chỉ email');
            isFormValid = false;
        }
        // Kiểm tra email hợp lệ
        if (!validator.isEmail(formData.get('emailAddress'))) {
            setError(emailAddress, 'Địa chỉ email không hợp lệ');
            isFormValid = false;
        }
        return isFormValid;
    }

    function _isRegisterFormValid(registerForm) {
        let isFormValid = true;
        const formData = new FormData(registerForm);

        const { emailAddress, password, passwordConfirm, userAgree} = registerForm;

        clearError(emailAddress);
        clearError(password);
        clearError(passwordConfirm);

        // Kiểm tra mật khẩu và mật khẩu xác nhận khớp
        if (formData.get('password') !== formData.get('passwordConfirm')) {
            setError(password, 'Mật khẩu không khớp');
            setError(passwordConfirm, 'Mật khẩu không khớp');
            isFormValid = false;
        }

        // Kiểm tra mật khẩu đủ mạnh
        if (!validator.isStrongPassword(formData.get('password'))) {
            setError(password, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
            isFormValid = false;
        }

        // Kiểm tra mật khẩu có
        if (validator.isEmpty(formData.get('password'))) {
            setError(password, 'Vui lòng nhập mật khẩu');
            isFormValid = false;
        }

        // Kiểm tra mật khẩu xác nhận có
        if (validator.isEmpty(formData.get('passwordConfirm'))) {
            setError(passwordConfirm, 'Vui lòng nhập lại mật khẩu');
            isFormValid = false;
        }

        // Kiểm tra email hợp lệ
        if (!validator.isEmail(formData.get('emailAddress'))) {
            setError(emailAddress, 'Địa chỉ email không hợp lệ');
            isFormValid = false;
        } 

        // Kiểm tra địa chỉ email có
        if (validator.isEmpty(formData.get('emailAddress'))) {
            setError(emailAddress, 'Vui lòng nhập địa chỉ email');
            isFormValid = false;
        }

        // Kiểm tra checkbox đồng ý
        if(formData.get('userAgree') !== 'agree') { 
            userAgree.classList.add('border-1', 'outline-red-500', 'outline-offset-1', 'outline-dotted');
            isFormValid = false;
        }
        return isFormValid;
    }

    async function _handleSubmitLoginForm (loginForm) {
        const formData = new FormData(loginForm);
        
        const data = await postLogin({
            emailAddress: formData.get('emailAddress'),
            password: formData.get('password'),
        });

        if(hasError()) {
            throw new Error(messageState.error.message);
        } else {
            localStorage.setItem('lamlib_clover', JSON.stringify(data));
            location.href = '/';
        }
    }

    async function _handleSubmitRegisterForm(registerForm) {
        const formData = new FormData(registerForm);
        const data = await postRegister({
            emailAddress: formData.get('emailAddress'),
            password: formData.get('password'),
        });

        if(hasError()) {
            throw new Error(messageState.error.message);
        } else {
            localStorage.setItem('lamlib_clover', JSON.stringify(data));
            location.href = '/';
        }
    }

    /** Hiển thị biểu mẫu đăng nhập */
    function _switchToLoginForm() {
        document.forms.login.classList.remove('hidden');
        document.forms.register.classList.add('hidden');
    }

    /** Hiển thị biểu mẫu đăng ký */
    function _switchToRegisterForm() {
        document.forms.login.classList.add('hidden');
        document.forms.register.classList.remove('hidden');
    }

    function _setupEventListener () {
        document.forms.login.addEventListener('submit', async e => {
            e.preventDefault();
            const loginForm = e.target;
            if(!_isLoginFormValid(loginForm)) {
                return;
            }
            try {
                await _handleSubmitLoginForm(loginForm);
                loginForm.reset();
            } catch (error) {
                document.getElementById('msg-error-login').textContent = error.message;
            }
        });

        document.forms.register.addEventListener('submit', async e => {
            e.preventDefault();
            const registerForm = e.target;
            if(!_isRegisterFormValid(registerForm)) {
                return;
            }
            try {
                await _handleSubmitRegisterForm(registerForm);
                registerForm.reset();
            } catch (error) {
                document.getElementById('msg-error-register').textContent = error.message;
            }
        });

        document.forms.login.querySelector('a[name="notHaveAccount"]').addEventListener('click', async e => {
            e.preventDefault();
            _switchToRegisterForm();
        });

        document.forms.register.querySelector('a[name="haveAccount"]').addEventListener('click', async e => {
            e.preventDefault();
            _switchToLoginForm();
        });
    }

    function _deleteLocalStorage() {
        localStorage.removeItem('lamlib_clover');
    }

    function init () {
        _deleteLocalStorage();
        _setupEventListener();
    }

    return {
        init,
    }
})();

document.addEventListener('DOMContentLoaded', app.init);