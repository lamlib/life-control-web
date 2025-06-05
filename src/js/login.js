import { requestHandlers } from "../plugin/datasync/datasync.min.js";
import { setError, clearError } from "./utils.js";

document.addEventListener('DOMContentLoaded',  _ => {
    const { postLogin, postRegister } = requestHandlers;

    document.forms.login.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let isFormInvalid = false;
        const { userLoginEmailAddress, userLoginPassword } = document.forms.login;

        clearError(userLoginEmailAddress);
        clearError(userLoginPassword);

        // Kiểm tra mật khẩu có
        if (validator.isEmpty(formData.get('userLoginPassword'))) {
            setError(userLoginPassword, 'Vui lòng nhập mật khẩu');
            isFormInvalid = true;
        }
        // Kiểm tra địa chỉ email có
        if (validator.isEmpty(formData.get('userLoginEmailAddress'))) {
            setError(userLoginEmailAddress, 'Vui lòng nhập địa chỉ email');
            isFormInvalid = true;
        }
        // Kiểm tra email hợp lệ
        if (!validator.isEmail(formData.get('userLoginEmailAddress'))) {
            setError(userLoginEmailAddress, 'Địa chỉ email không hợp lệ');
            isFormInvalid = true;
        }
        if (isFormInvalid) {
            return;
        }
        

        const data = await postLogin({
            userLoginEmailAddress: formData.get('userLoginEmailAddress'),
            userLoginPassword: formData.get('userLoginPassword'),
        })

        e.target.reset();
    });

    document.forms.register.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let isFormInvalid = false;

        const { userLoginEmailAddress, userLoginPassword, userLoginPasswordConfirm} = document.forms.register;

        clearError(userLoginEmailAddress);
        clearError(userLoginPassword);
        clearError(userLoginPasswordConfirm);

        // Kiểm tra mật khẩu và mật khẩu xác nhận khớp
        if (formData.get('userLoginPassword') !== formData.get('userLoginPasswordConfirm')) {
            setError(userLoginPassword, 'Mật khẩu không khớp');
            setError(userLoginPasswordConfirm, 'Mật khẩu không khớp');
            isFormInvalid = true;
        }

        // Kiểm tra mật khẩu đủ mạnh
        if (!validator.isStrongPassword(formData.get('userLoginPassword'))) {
            setError(userLoginPassword, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
            isFormInvalid = true;
        }

        // Kiểm tra mật khẩu có
        if (validator.isEmpty(formData.get('userLoginPassword'))) {
            setError(userLoginPassword, 'Vui lòng nhập mật khẩu');
            isFormInvalid = true;
        }

        // Kiểm tra mật khẩu xác nhận có
        if (validator.isEmpty(formData.get('userLoginPasswordConfirm'))) {
            setError(userLoginPasswordConfirm, 'Vui lòng nhập lại mật khẩu');
            isFormInvalid = true;
        }

        // Kiểm tra email hợp lệ
        if (!validator.isEmail(formData.get('userLoginEmailAddress'))) {
            setError(userLoginEmailAddress, 'Địa chỉ email không hợp lệ');
            isFormInvalid = true;
        } 

        // Kiểm tra địa chỉ email có
        if (validator.isEmpty(formData.get('userLoginEmailAddress'))) {
            setError(userLoginEmailAddress, 'Vui lòng nhập địa chỉ email');
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
            userLoginEmailAddress: formData.get('userLoginEmailAddress'),
            userLoginPassword: formData.get('userLoginPassword'),
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
})