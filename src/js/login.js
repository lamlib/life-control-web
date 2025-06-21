import { requestHandlers, messageState, hasError } from "@lamlib/data-sync";

import { setError, clearError } from "./utils.js";

const app = (function() {
    const { postLogin, postRegister } = requestHandlers;

    async function _isLoginFormValid(loginForm) {
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

    async function _handleSubmitLoginForm (registerForm) {
            const formData = new FormData(registerForm);
            
            const data = await postLogin({
                emailAddress: formData.get('emailAddress'),
                password: formData.get('password'),
            });

            if(hasError()) {
                throw new Error(messageState.error.message);
            } else {
                localStorage.setItem('lamlib_clover', JSON.stringify(data));
                location.href = '/pages/profile';
            }
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
                document.getElementById('msg-error').textContent = error.message;
            }
        });

        document.forms.register.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(e.target);

            let isFormInvalid = false;

            const { emailAddress, password, passwordConfirm} = document.forms.register;

            clearError(emailAddress);
            clearError(password);
            clearError(passwordConfirm);

            // Kiểm tra mật khẩu và mật khẩu xác nhận khớp
            if (formData.get('password') !== formData.get('passwordConfirm')) {
                setError(password, 'Mật khẩu không khớp');
                setError(passwordConfirm, 'Mật khẩu không khớp');
                isFormInvalid = true;
            }

            // Kiểm tra mật khẩu đủ mạnh
            if (!validator.isStrongPassword(formData.get('password'))) {
                setError(password, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
                isFormInvalid = true;
            }

            // Kiểm tra mật khẩu có
            if (validator.isEmpty(formData.get('password'))) {
                setError(password, 'Vui lòng nhập mật khẩu');
                isFormInvalid = true;
            }

            // Kiểm tra mật khẩu xác nhận có
            if (validator.isEmpty(formData.get('passwordConfirm'))) {
                setError(passwordConfirm, 'Vui lòng nhập lại mật khẩu');
                isFormInvalid = true;
            }

            // Kiểm tra email hợp lệ
            if (!validator.isEmail(formData.get('emailAddress'))) {
                setError(emailAddress, 'Địa chỉ email không hợp lệ');
                isFormInvalid = true;
            } 

            // Kiểm tra địa chỉ email có
            if (validator.isEmpty(formData.get('emailAddress'))) {
                setError(emailAddress, 'Vui lòng nhập địa chỉ email');
                isFormInvalid = true;
            }

            // Kiểm tra checkbox đồng ý
            if(formData.get('userAgree') !== 'agree') { 
                document.forms.register.userAgree.classList.add('border-1', 'outline-red-500', 'outline-offset-1', 'outline-dotted');
                isFormInvalid = true;
            }

            if (isFormInvalid) {
                return;
            }
            
            const data = await postRegister({
                emailAddress: formData.get('emailAddress'),
                password: formData.get('password'),
            })

            e.target.reset();
        });

        document.forms.login.querySelector('a[name="notHaveAccount"]').addEventListener('click', async e => {
            e.preventDefault();
            document.forms.login.classList.add('hidden');
            document.forms.register.classList.remove('hidden');
        });

        document.forms.register.querySelector('a[name="haveAccount"]').addEventListener('click', async e => {
            e.preventDefault();
            document.forms.login.classList.remove('hidden');
            document.forms.register.classList.add('hidden');
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