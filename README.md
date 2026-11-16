# Portfolio + thư viện tài liệu của Lucian

Website tĩnh (HTML, CSS, JavaScript thuần) chạy trên GitHub Pages. Không có backend, database hay bước build.

- `index.html` — thư viện tài liệu (trang mặc định)
- `software.html` — phần mềm tự phát triển
- `connections.html` — giới thiệu ngắn và các nền tảng

**Mọi nội dung nằm trong một file: `assets/js/data.js`.** Thêm tài liệu, danh mục, phần mềm, liên kết đều chỉ cần sửa file này và thêm file vào thư mục, không sửa HTML.

## Cây thư mục

```
portfolio/
├── index.html
├── software.html
├── connections.html
├── README.md
├── .nojekyll                      ← để GitHub Pages phục vụ file nguyên trạng
├── assets/
│   ├── css/style.css              ← giao diện, responsive, biến màu/font
│   ├── js/
│   │   ├── data.js                ← DỮ LIỆU: sửa ở đây
│   │   ├── common.js              ← đầu trang, nút Vision, hàm dùng chung
│   │   ├── library.js             ← danh mục, tìm kiếm, lọc, khung xem code
│   │   ├── highlight.js           ← tô màu cú pháp (tùy chọn)
│   │   ├── software.js
│   │   └── connections.js
│   ├── img/
│   │   ├── favicon.svg
│   │   └── qr/                    ← đặt ảnh QR WeChat/Zalo ở đây
│   └── docs/code/                 ← thư mục gốc của code (đổi được)
│       ├── Code_Learning/mau_hello.py            (mẫu)
│       ├── H510脚本/坐标转换.py                    (mẫu)
│       ├── H820-M03/mau_tinh_offset.cpp          (mẫu)
│       ├── Math/mau ma tran xoay.cs              (mẫu)
│       ├── VisionAssembly/mau_giao_dien.html     (mẫu)
│       ├── 校针/mẫu file dài.py                   (mẫu)
│       └── 记录/调试记录_mau.md                    (mẫu)
└── doc/pdf/                       ← thư mục gốc của PDF (đổi được)
    ├── lythuyetvision/mau-ly-thuyet-vision.pdf   (mẫu)
    ├── IT/mau-tai-lieu-it.pdf                    (mẫu)
    └── hoctieng/
        ├── mau-tieng-anh.pdf                     (mẫu)
        └── mẫu tiếng Trung 中文.pdf                (mẫu)
```

Tất cả file có chữ `mau` / `mẫu` trong tên là **file mẫu** để thử chức năng. Khi đưa tài liệu thật vào, xóa các file này và các mục tương ứng trong `data.js`.

## 1. Chạy local bằng HTTP server

Khung xem code dùng `fetch`, nên **không mở trực tiếp bằng cách bấm đúp `index.html`** (`file://` bị trình duyệt chặn). Chạy một HTTP server trong thư mục dự án:

```powershell
cd duong-dan\toi\portfolio
py -m http.server 8000
```

Mở <http://localhost:8000/>. Dừng server bằng `Ctrl + C`.

Cách khác: trong VS Code cài extension **Live Server**, bấm chuột phải vào `index.html` → *Open with Live Server*.

Sau khi sửa `data.js`, tải lại trang bằng `Ctrl + F5` để bỏ cache.

## 2. Deploy GitHub Pages từ branch `main`, thư mục root

1. Tạo repository trên GitHub.
   - Tên `username.github.io` → site ở `https://username.github.io/`
   - Tên bất kỳ, ví dụ `portfolio` → site ở `https://username.github.io/portfolio/`

   Website dùng đường dẫn tương đối nên chạy được ở cả hai dạng, không cần sửa gì.
2. Đẩy toàn bộ nội dung thư mục này lên branch `main` (các file `index.html`, `.nojekyll`… nằm ngay ở gốc repository):

   ```powershell
   git init
   git branch -M main
   git config core.quotepath false
   git add .
   git commit -m "Portfolio"
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

   `core.quotepath false` chỉ để `git status` hiện đúng tên file tiếng Trung/tiếng Việt.
3. Trên GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, thư mục `/ (root)` → Save**.
4. Chờ khoảng một hai phút rồi mở địa chỉ site.

Lưu ý khi dùng GitHub Pages:

- **Phân biệt chữ hoa/thường.** Trên Windows `Math/Abc.py` và `math/abc.py` là một, trên GitHub Pages là hai. `path` trong `data.js` phải khớp chính xác tên thật.
- Giữ file `.nojekyll`. Thiếu file này, GitHub Pages bỏ qua file/thư mục có tên bắt đầu bằng dấu gạch dưới `_`.
- GitHub từ chối file lớn hơn 100 MB; PDF quá nặng nên nén lại hoặc để trên Google Drive.

## 3. Thêm tài liệu

1. Chép file vào thư mục tài liệu, giữ nguyên tên gốc. Ví dụ: `assets/docs/code/H510脚本/坐标转换.py`.
2. Mở `assets/js/data.js`, thêm một mục vào mảng `documents`:

```js
{
  id: "h510-chuyen-doi-toa-do",          // mã duy nhất, không đổi về sau
  title: "Chuyển đổi tọa độ máy H510",   // tên hiển thị, đặt tùy ý
  type: "code",                          // "code" hoặc "pdf"
  categoryId: "code-h510",               // id của danh mục
  path: "H510脚本/坐标转换.py",            // tính từ thư mục gốc của loại "code"
  language: "python",                    // chỉ cần cho code
  tags: ["tọa độ", "坐标", "H510"],       // từ khóa tìm kiếm
  description: ""                        // mô tả ngắn, có thể bỏ trống
},
```

Ví dụ với PDF:

```js
{
  id: "vision-quang-hoc-co-ban",
  title: "Quang học cơ bản cho Machine Vision",
  type: "pdf",
  categoryId: "vision-theory",
  path: "lythuyetvision/quang-hoc-co-ban.pdf",
  tags: ["quang học", "lens"],
  description: ""
},
```

Quy tắc viết `path`:

- Viết đúng tên thật, giữ nguyên khoảng trắng, tiếng Việt, tiếng Trung. **Không** tự đổi sang `%20`, `%E5…` (nếu lỡ dán dạng đã mã hóa thì website vẫn xử lý được).
- Dùng dấu `/`; dấu `\` kiểu Windows cũng được chấp nhận.
- `language` hỗ trợ tô màu: `python`, `csharp`, `cpp`, `java`, `javascript`, `json`, `ini`, `shell`. Ngôn ngữ khác (`html`, `markdown`, `text`…) vẫn xem được, chỉ không tô màu.

File code không phải UTF-8: website tự thử UTF-8 trước, không hợp lệ thì đọc bằng GB18030 (hay gặp ở script từ máy Trung Quốc). Nếu vẫn sai chữ, thêm `encoding: "gb18030"` (hoặc bảng mã khác) vào mục tài liệu đó.

Website không tự quét thư mục: file nào chưa khai báo trong `documents` sẽ không xuất hiện.

## 4. Thêm danh mục và danh mục con

Trong `data.js`, mảng `categories` là một cây. Thêm danh mục con bằng `children`, lồng bao nhiêu cấp cũng được:

```js
{
  id: "code",
  title: "Code",
  children: [
    { id: "code-h510", title: "H510脚本" },
    {
      id: "code-moi", title: "Thư mục mới",
      children: [{ id: "code-moi-con", title: "Cấp ba" }]
    }
  ]
},
```

- `id` phải duy nhất và không nên đổi sau khi đã dùng (tài liệu trỏ tới danh mục bằng `categoryId`).
- `title` đổi thoải mái; không cần trùng tên thư mục trên ổ đĩa.
- Danh mục và thư mục thật độc lập với nhau: danh mục chỉ để sắp xếp trên website.
- Tài liệu có `categoryId` chưa khai báo sẽ hiện trong nhóm “Chưa phân loại”.

## 5. Đặt tên hiển thị khác tên file

Tên hiển thị là trường `title`, file thật là trường `path`. Hai trường không liên quan nhau:

```js
title: "Chuyển đổi tọa độ máy H510",
path: "H510脚本/坐标转换.py",
```

Đổi `title` bất cứ lúc nào, không cần đổi tên file. Tìm kiếm vẫn tìm được theo cả tên hiển thị, tên file và `tags`.

## 6. Đổi thư mục gốc của tài liệu

Sửa `assetRoots` trong `data.js`, **một chỗ duy nhất**:

```js
assetRoots: {
  code: "assets/docs/code",   // ví dụ đổi thành "docs/code"
  pdf: "doc/pdf"
},
```

Đường dẫn tính từ thư mục chứa `index.html`, không có `/` ở đầu. Mỗi tài liệu dùng thư mục gốc trùng với `type` của nó.

Nếu có thêm một nơi lưu khác, khai báo thêm khóa mới rồi chỉ định bằng trường `root` ở tài liệu:

```js
assetRoots: { code: "assets/docs/code", pdf: "doc/pdf", codeCu: "docs/code" },
...
{ id: "...", title: "...", type: "code", root: "codeCu", path: "Math/abc.py", ... }
```

## 7. Thêm phần mềm và link Google Drive

Thêm một mục vào mảng `software` trong `data.js`:

```js
{
  id: "ten-phan-mem",
  name: "Tên phần mềm",
  description: "Phần mềm dùng để làm gì.",
  version: "1.0.0",            // để "" nếu không muốn hiện
  os: "Windows 10/11",         // để "" nếu không muốn hiện
  updated: "2026-11-16",       // để "" nếu không muốn hiện
  driveUrl: "https://drive.google.com/..."
},
```

- Bấm tên phần mềm hoặc nút “Mở Google Drive” đều mở `driveUrl` trong tab mới.
- `driveUrl` phải là link đầy đủ bắt đầu bằng `https://`. Nhớ bật chia sẻ “Bất kỳ ai có đường liên kết” trên Google Drive.
- Chưa có link thì hiện “Chưa có link Google Drive”.

## 8. Sửa liên kết cá nhân và ảnh QR

Trong `data.js`:

- `profile`: tên, dòng nghề nghiệp, câu giới thiệu (tối đa hai câu).
- `visionGuides`: hai nút “Vision · Tiếng Việt” và “Vision · 中文”. Điền `url`; để `""` thì nút hiện “Chưa cấu hình”.
- `platforms`: mỗi nền tảng có ba trường tùy chọn.

```js
{ id: "github", name: "GitHub", url: "https://github.com/ten-tai-khoan", handle: "", qr: "" },
{ id: "wechat", name: "WeChat", url: "", handle: "id_wechat", qr: "assets/img/qr/wechat.png" },
{ id: "zalo",   name: "Zalo",   url: "", handle: "",          qr: "assets/img/qr/zalo.png" },
```

| Trường | Tác dụng |
| --- | --- |
| `url` | Có thì hiện nút mở trong tab mới. Chỉ nhận link `http://` hoặc `https://`. |
| `handle` | Tên tài khoản / ID. Nếu không có `url` thì có nút “Sao chép”. |
| `qr` | Đường dẫn ảnh QR. Có thì hiện nút “Xem QR” mở ảnh lớn, đóng bằng nút Đóng, phím Esc hoặc bấm ra ngoài. |

Website không tự tạo URL từ tên tài khoản. Nền tảng chưa có gì hiện “Chưa cập nhật”; muốn ẩn hẳn thì đặt `settings.hideEmptyPlatforms: true`. Thêm nền tảng mới bằng cách thêm một dòng vào `platforms`.

## 9. Đổi màu, font, kích thước

Sửa các biến ở khối `:root` đầu file `assets/css/style.css`, ví dụ `--color-accent` (màu nhấn), `--color-bg` (nền), `--font-sans`, `--font-mono`, `--code-max-height` (chiều cao tối đa khung code), `--sidebar-width`.

## 10. Khi có sự cố

| Hiện tượng | Nguyên nhân thường gặp |
| --- | --- |
| Trang báo “Không đọc được dữ liệu trong assets/js/data.js” | Lỗi cú pháp trong `data.js`: thiếu dấu phẩy, ngoặc hoặc ngoặc kép. Mở DevTools (F12) → Console để xem dòng lỗi. |
| Khung code báo HTTP 404 | `path` không khớp tên file thật (sai chữ hoa/thường, thiếu thư mục), hoặc file chưa được push lên. |
| Khung code báo đang mở bằng `file://` | Chưa chạy qua HTTP server (mục 1). |
| Sửa `data.js` mà site không đổi | Cache trình duyệt: `Ctrl + F5`. GitHub Pages cần một hai phút để cập nhật sau khi push. |
| Chữ Trung trong code bị lỗi font | Thêm `encoding: "gb18030"` cho tài liệu đó (mục 3). |
