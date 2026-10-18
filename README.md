# UTxanh

Website UTxanh — Nhóm 35, Trường Đại học Công nghệ Giao thông vận tải.

## Cấu trúc

- `index.html` — nội dung và cấu trúc trang.
- `video.html` — trang phát riêng cho video Nhóm 35.
- `styles.css` — kiểu dáng và bố cục.
- `script.js` — menu và chức năng tạo mã QR.
- `assets/video-player.mp4` — video H.264 1080p đã nén, âm thanh MP3 tương thích với trình phát trên trang.

## Đăng website bằng GitHub Pages

Trang chủ đã được chuẩn bị tại `index.html`. Để xuất bản:

1. Đẩy các thay đổi lên nhánh `main`.
2. Mở **Settings → Pages** của repository.
3. Trong **Build and deployment**, chọn **Deploy from a branch**, nhánh `main` và thư mục `/(root)`, rồi lưu.
4. Sau khi GitHub Pages hoàn tất triển khai, website sẽ ở địa chỉ:
   <https://ndptgth-cloud.github.io/UTXanh/>

Mã QR trên website luôn dẫn đến địa chỉ công khai này. Đường dẫn `UTxanh.html` cũ tự chuyển đến trang chủ.

Video đã được chuyển mã còn khoảng 83 MB, dưới giới hạn 100 MB cho mỗi tệp của GitHub. Khi thay video, hãy xuất MP4 dùng H.264 với bitrate video khoảng 6.200 kbps và âm thanh MP3, rồi kiểm tra kích thước tệp dưới 100 MB trước khi đẩy lên GitHub Pages.
