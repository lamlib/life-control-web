# Sử dụng SSH truy cập máy chủ từ xa

## Sử dụng password
Bạn có thể truy cập bằng ssh với password:
1. Kết nối bằng lệnh:
Mở terminal và gõ:
```bash
ssh user@server_ip
```
Sau đó hệ thống yêu cầu nhập password của user đó
2. Cấu hình server để cho phép password:
- Trên server, mở cấu hình SSH:
```bash
sudo nano /etc/ssh/sshd_config
```

- Tìm dòng:
```bash
PasswordAnthentication no
```

- Đổi thành:
```bash
PasswordAnthentication yes
```

- Lưu file và khởi động lại dịch vụ SSH:
```bash
sudo systemctl restart ssh
```
3. Đảm bảo user có password
- Nếu bạn dùng root, cần đặt password:
```bash
sudo passwd root
```
- Nếu là user khác:
```bash
sudo passwd username
```

## Sử dụng SSH key
- Trên máy bạn chạy:
```bash
ssh-keygen -t ed25519 -C "your_ssh_key_name"
```
- Sau khi chạy:
    + **Private key:** ~/.ssh/id_ed25519 (giữ bí mật, không chia sẻ)
    + **Public key:** ~/.ssh/id_ed25519.pub (Dùng để đăng ký vào địa điểm đích mà bạn muốn ssh tới, chẳng hạn Github, Digital Ocean, v.v.).
- Khi kết nối SSH, hệ thống sẽ dùng private key trên máy bạn để chứng minh bạn là chủ của public key đã đăng ký

## Đăng ký thủ công SSH key tới địa điểm đích (nếu địa điểm đích không hỗ trợ đăng ký trên giao diện hỗ trợ)
- Mở public key trên máy:
```bash
cat ~/.ssh/id_ed25519.pub
```
- Copy toàn bộ nội dung.
- Đăng nhập server bằng password
```bash
ssh user@server_ip
```
- Tạo thư mục ssh nếu chưa có
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```
- Mở file `authorized_keys`
```bash
nano ~/.ssh/authorized_keys
```
- Dán public key vào lưu lại.
- Set quyền:
```bash
chmod 600 ~/.ssh/authorized_keys
```

