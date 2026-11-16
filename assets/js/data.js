/* ==========================================================================
   DỮ LIỆU CỦA WEBSITE — chỉ cần sửa file này để cập nhật nội dung.
   Không cần sửa HTML khi thêm tài liệu, danh mục, phần mềm hay liên kết.

   Lưu ý khi sửa:
   - Chuỗi đặt trong dấu ngoặc kép "..."; mỗi mục cách nhau bằng dấu phẩy.
   - Trường nào chưa có thông tin thì để chuỗi rỗng "" (website tự ẩn
     hoặc ghi "Chưa cập nhật" / "Chưa cấu hình").
   - Lưu file ở bảng mã UTF-8 để giữ đúng tiếng Việt và tiếng Trung.
   ========================================================================== */

window.SITE_DATA = {

  /* ---------- 1. Thông tin cá nhân ---------- */
  profile: {
    name: "Lucian",
    role: "Machine Vision – Software Engineer",
    // Giới thiệu ở trang Kết nối — tối đa hai câu.
    intro: "Mình là Lucian, Machine Vision – Software Engineer. Trang này lưu tài liệu Machine Vision, IT, lập trình và học tiếng Anh, tiếng Trung của mình."
  },

  /* ---------- 2. Hai nút hướng dẫn phần mềm Vision ----------
     Điền URL đầy đủ (bắt đầu bằng https://). Để "" thì nút hiện "Chưa cấu hình". */
  visionGuides: [
    { id: "vision-vi", label: "Vision · Tiếng Việt", lang: "vi", url: "https://weiyuin.github.io/Website-for-Vision-usage-instructions/" },
    { id: "vision-zh", label: "Vision · 中文", lang: "zh-Hans", url: "https://weiyuin.github.io/Luster-MachineVision/" }
  ],

  /* ---------- 3. Thư mục gốc của tài liệu ----------
     Đường dẫn tính từ thư mục chứa index.html, KHÔNG có dấu / ở đầu.
     Đổi nơi lưu tài liệu thì chỉ sửa ở đây, ví dụ: code: "docs/code".
     Mỗi tài liệu dùng thư mục gốc trùng với "type" của nó
     (hoặc theo trường "root" nếu tài liệu có khai báo riêng). */
  assetRoots: {
    code: "assets/docs/code",
    pdf: "doc/pdf"
  },

  /* ---------- 4. Loại tài liệu ----------
     view: "code" → có khung xem code ngay trên trang.
     view: "file" → có nút mở trong tab mới và nút tải về. */
  documentTypes: {
    code: { label: "Code", view: "code" },
    pdf: { label: "PDF", view: "file", openLabel: "Mở PDF" }
  },

  /* ---------- 5. Danh mục (nhiều cấp) ----------
     id: mã duy nhất, không dấu, không đổi sau khi đã dùng.
     title: tên hiển thị, đổi tự do.
     children: danh mục con, lồng bao nhiêu cấp cũng được. */
  categories: [
    {
      id: "code",
      title: "Code",
      children: [
        { id: "code-learning", title: "Code_Learning" },
        { id: "code-h510", title: "H510脚本" },
        { id: "code-h820-m03", title: "H820-M03" },
        { id: "code-math", title: "Math" },
        { id: "code-vision-assembly", title: "VisionAssembly" },
        { id: "code-jiaozhen", title: "校针" },
        { id: "code-jilu", title: "记录" }
      ]
    },
    { id: "vision-theory", title: "Lý thuyết Vision" },
    { id: "it", title: "IT & Lập trình" },
    {
      id: "languages",
      title: "Học tiếng",
      children: [
        { id: "lang-english", title: "Tiếng Anh" },
        { id: "lang-chinese", title: "Tiếng Trung" }
      ]
    }
  ],

  /* ---------- 6. Tài liệu ----------
     id          mã duy nhất, ổn định.
     title       tên hiển thị, KHÔNG cần giống tên file.
     type        khóa trong documentTypes ("code" hoặc "pdf").
     categoryId  id của danh mục chứa tài liệu.
     path        đường dẫn file thật, tính từ thư mục gốc của loại tài liệu.
                 Viết đúng tên thật của file (giữ khoảng trắng, tiếng Việt,
                 tiếng Trung); không cần tự đổi sang dạng %20, %E5...
     language    ngôn ngữ lập trình (chỉ cho code): python, csharp, cpp,
                 javascript, html, json, ini, markdown, text...
     tags        từ khóa phục vụ tìm kiếm.
     description mô tả ngắn, có thể để "".
     Tùy chọn:
     root        dùng thư mục gốc khác (khóa trong assetRoots).
     encoding    ép bảng mã khi file không phải UTF-8, ví dụ "gb18030".

     CÁC MỤC DƯỚI ĐÂY LÀ FILE MẪU để kiểm tra chức năng — xóa hoặc thay
     bằng tài liệu thật của bạn. */
  
     // Python
  documents: [
    {
      id: "GvGluePathAOI",
      title: "Thư viện kiểm tra đường keo GvGluePathAOI",
      type: "code",
      categoryId: "code-vision-assembly",
      path: "VisionAssembly/GvGluePathAOI.py",
      language: "python",
      tags: ["python", "VisionAssembly"],
      description: "Thư viện kiểm tra đường keo GvGluePathAOI, dùng trong dự án Machine Vision."
    },
    {
      id: "ScImageShow",
      title: "Thư viện hiển thị ảnh ScImageShow",
      type: "code",
      categoryId: "code-vision-assembly",
      path: "VisionAssembly/ScImageShow.py",
      language: "python",
      tags: ["python", "VisionAssembly"],
      description: "Thư viện hiển thị ảnh ScImageShow, dùng trong dự án Machine Vision."
    },
    {
      id: "ScFile",
      title: "Thư viện đọc ghi file ScFile",
      type: "code",
      categoryId: "code-vision-assembly",
      path: "VisionAssembly/ScFile.py",
      language: "python",
      tags: ["python", "VisionAssembly"],
      description: "Thư viện đọc ghi file ScFile, dùng trong dự án Machine Vision."
    },
    {
      id: "ScMsgReport",
      title: "Thư viện ScMsgReport",
      type: "code",
      categoryId: "code-vision-assembly",
      path: "VisionAssembly/ScMsgReport.py",
      language: "python",
      tags: ["python", "VisionAssembly"],
      description: "Thư viện ScMsgReport, dùng trong dự án Machine Vision."
    },
    {
      id: "ScShape",
      title: "Thư viện ScShape",
      type: "code",
      categoryId: "code-vision-assembly",
      path: "VisionAssembly/ScShape.py",
      language: "python",
      tags: ["python", "VisionAssembly"],
      description: "Thư viện ScShape, dùng trong dự án Machine Vision."
    },
    {
      id: "mau-file-dai",
      title: "Mẫu: File rất dài và có dòng rất dài",
      type: "code",
      categoryId: "code-vision-assembly",
      path: "VisionAssembly/mau_file_dai.py",
      language: "python",
      tags: ["mẫu", "VisionAssembly", "cuộn"],
      description: "Dùng để thử cuộn dọc và cuộn ngang bên trong khung code."
    },
    {
      id: "mau-ghi-chu-debug",
      title: "Mẫu: Ghi chú debug",
      type: "code",
      categoryId: "code-jilu",
      path: "记录/调试记录_mau.md",
      language: "markdown",
      tags: ["mẫu", "记录", "ghi chú"],
      description: ""
    },



    //PDF
    {
      id: "Python-Level0-Middle",
      title: "Python thực chiến từ Level 0 đến Middle",
      type: "pdf",
      categoryId: "it",
      path: "IT/Python_Thuc_Chien_Level_0_den_Middle_High.pdf",
      tags: ["IT", "Python", "lý thuyết"],
      description: "Hướng dẫn thực chiến Python từ cơ bản đến trung cấp."
    },
    {
      id: "Python-Level0",
      title: "Tài liệu Python Level 0",
      type: "pdf",
      categoryId: "it",
      path: "IT/PythonLevel0.pdf",
      tags: ["Python", "IT", "lập trình"],
      description: ""
    },
    {
      id: "CSharp-Level0-Middle",
      title: "C# thực chiến từ Level 0 đến Middle",
      type: "pdf",
      categoryId: "it",
      path: "IT/CSharp_PhongVan_Zero_Middle_WinForms.pdf",
      tags: ["C#", "IT", "lập trình"],
      description: ""
    },
    {
      id: "mau-pdf-tieng-trung",
      title: "Mẫu: Tài liệu tiếng Trung",
      type: "pdf",
      categoryId: "lang-chinese",
      path: "hoctieng/mẫu tiếng Trung 中文.pdf",
      tags: ["mẫu", "tiếng Trung", "中文"],
      description: "Tên file có khoảng trắng, tiếng Việt và chữ Trung."
    }
  ],

  /* ---------- 7. Phần mềm tự phát triển ----------
     name, description: nên có. driveUrl: link Google Drive đầy đủ.
     version, os, updated: chỉ điền khi có; để "" thì không hiển thị.
     Mục dưới đây là MẪU — sửa lại hoặc xóa. Ví dụ một mục đầy đủ:
     {
       id: "ten-phan-mem",
       name: "Tên phần mềm",
       description: "Phần mềm dùng để làm gì.",
       version: "1.0.0",
       os: "Windows 10/11",
       updated: "2026-11-16",
       driveUrl: "https://drive.google.com/..."
     } */
  software: [
    {
      id: "phan-mem-lucian",
      name: "Phần mềm LUCIAN",
      description: "Phân mềm truyền, nhận thông tin giữa server và client, tạo file Calibration 9 steps dùng trong các dự án Machine Vision.",
      version: "1.0.0",
      os: "",
      updated: "16/11/2026",
      driveUrl: "https://drive.google.com/file/d/1rU5vVySZKCFi-18LdzeBBHEzUMGbNO8u/view"
    }
  ],

  /* ---------- 8. Nền tảng kết nối ----------
     url     link đầy đủ (https://...) — có thì hiện nút mở trong tab mới.
     handle  tên tài khoản / ID — nếu không có url sẽ có nút "Sao chép".
     qr      đường dẫn ảnh QR, ví dụ "assets/img/qr/wechat.png".
     Website không tự suy ra URL từ tên tài khoản. */
  platforms: [
    { id: "github", name: "GitHub", url: "https://github.com/weiyuin", handle: "", qr: "" },
    { id: "leetcode", name: "LeetCode", url: "https://leetcode.com/u/weiyuin/", handle: "", qr: "" },
    { id: "facebook", name: "Facebook", url: "https://www.facebook.com/WeiYuin.VN", handle: "", qr: "" },
    { id: "instagram", name: "Instagram", url: "https://www.instagram.com/_.weiyuin/", handle: "", qr: "" },
    { id: "threads", name: "Threads", url: "https://www.threads.com/@_.weiyuin", handle: "", qr: "" },
    { id: "wechat", name: "WeChat", url: "https://wechat.com/weiyuin", handle: "", qr: "" },
    { id: "zalo", name: "Zalo", url: "https://zalo.com/weiyuin", handle: "", qr: "" }
  ],

  /* ---------- 9. Tùy chọn ---------- */
  settings: {
    // true: ẩn nền tảng chưa có thông tin; false: hiện "Chưa cập nhật".
    hideEmptyPlatforms: false
  }
};
