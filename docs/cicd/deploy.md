# Deploy

**Trigger (on)**: Workflow chạy khi push lên nhánh `main` hoặc `develop`, và khi tạo pull request vào `main`. 

**Job `build`:** Kiểm tra và xây dựng dự án
- Checkout code
- Setup Node.js(test với 2 phiên bản)
- Cài dependencies
- Chạy linter và tests
- Build dự án
- Lưu artifact (thư mục dist/)

**Job `deploy`:** Triển khai lên server
- Chỉ chạy khi push vào `main` (không chạy cho PR)
- Download artifact từ job build 
- Upload code lên server qua SSH
- Restart service
- Gửi thông báo kết quả

**Những điều cần chú ý:**
1. **Secrets:** Bạn cần setup 3 secrets trên Github (Settings -> Secrets):
- `DEPLOY_KEY`: SSH private key
- `DEPLOY_HOST`: IP/domain server
- `DEPLOY_USER`: SSH username

2. **Thay đổi theo dự án:** Điều chỉnh các lệnh `npm run` theo package.json của bạn (lint, test, build)

3. **Đường dẫn deploy:** Thay `/var/www/blog` thành đường dẫn thực tế trên server


**Refference**
*Cấu hình CICD Variable Github and Server*
- Tạo một cặp SSH Key
- Copy private key lên Github secrets
- Đăng ký public key vào Server đích
- Tham khảo [tài liệu ssh](./ssh.md) sau để hỗ trợ
