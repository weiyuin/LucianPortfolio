/* ==========================================================================
   Phần dùng chung cho cả ba trang: đầu trang, điều hướng, hai nút Vision
   và các hàm tiện ích (tạo phần tử, xử lý đường dẫn, sao chép, chuẩn hóa chữ).
   Nội dung hiển thị lấy từ assets/js/data.js.
   ========================================================================== */

(function () {
  "use strict";

  const data = window.SITE_DATA;

  /* Danh sách trang trên thanh điều hướng (đường dẫn tương đối, cùng cấp). */
  const PAGES = [
    { id: "library", href: "index.html", label: "Tài liệu" },
    { id: "software", href: "software.html", label: "Phần mềm" },
    { id: "connections", href: "connections.html", label: "Kết nối" }
  ];

  /* ---------- Tạo phần tử DOM an toàn (chỉ dùng textContent) ---------- */

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === false) continue;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? "" : String(value));
      }
    }
    for (const child of children) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child);
    }
    return node;
  }

  function hasText(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  /* ---------- Đường dẫn và URL ---------- */

  /* Chỉ chấp nhận URL http/https đầy đủ; mọi giá trị khác trả về null. */
  function safeExternalUrl(value) {
    if (!hasText(value)) return null;
    try {
      const url = new URL(value.trim());
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch (error) {
      return null;
    }
  }

  function decodeSegment(segment) {
    try {
      return decodeURIComponent(segment);
    } catch (error) {
      return segment; // có ký tự % không phải mã hóa, ví dụ "50%.py"
    }
  }

  /* Mã hóa từng đoạn của đường dẫn đúng một lần.
     Nếu đoạn đã ở dạng %20, %E5... thì giải mã trước để không mã hóa hai lần. */
  function encodePath(path) {
    return String(path)
      .replace(/\\/g, "/")
      .split("/")
      .filter((segment) => segment !== "" && segment !== ".")
      .map((segment) => encodeURIComponent(decodeSegment(segment)))
      .join("/");
  }

  /* Ghép thư mục gốc + đường dẫn file thành URL tuyệt đối, tính từ thư mục
     của trang hiện tại nên chạy được ở cả username.github.io và /repository/. */
  function resolveAssetUrl(path, rootKey) {
    if (!hasText(path)) return null;
    const external = safeExternalUrl(path);
    if (external) return external;
    const roots = (data && data.assetRoots) || {};
    const root = rootKey && hasText(roots[rootKey]) ? roots[rootKey] : "";
    const encoded = encodePath(root + "/" + path);
    return new URL(encoded, document.baseURI).href;
  }

  /* Đường dẫn để hiển thị cho người đọc (dạng chữ thật, không phải %E5...). */
  function displayPath(path) {
    return String(path).replace(/\\/g, "/").split("/").filter(Boolean).map(decodeSegment).join("/");
  }

  function fileNameFromPath(path) {
    const parts = String(path).replace(/\\/g, "/").split("/").filter(Boolean);
    return parts.length ? decodeSegment(parts[parts.length - 1]) : "";
  }

  /* ---------- Chuẩn hóa chữ để tìm kiếm ----------
     Bỏ dấu tiếng Việt, đổi đ → d, về chữ thường. Chữ Trung giữ nguyên. */
  function normalizeText(value) {
    return String(value === null || value === undefined ? "" : value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d");
  }

  /* ---------- Sao chép vào clipboard: trả về true/false đúng kết quả ---------- */

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        /* thử cách dự phòng bên dưới */
      }
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "-9999px";
    document.body.append(area);
    area.select();
    area.setSelectionRange(0, text.length);
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    area.remove();
    return copied;
  }

  /* ---------- Đầu trang ---------- */

  function renderVisionLink(guide) {
    const label = el("span", { text: guide.label, lang: hasText(guide.lang) ? guide.lang : null });
    const url = safeExternalUrl(guide.url);
    if (!url) {
      return el("span", { class: "vision-link is-unset" }, label, el("span", { class: "vision-note", text: "Chưa cấu hình" }));
    }
    return el("a", { class: "vision-link", href: url, target: "_blank", rel: "noopener noreferrer" },
      label, el("span", { class: "visually-hidden", text: " (mở trong tab mới)" }));
  }

  function renderHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const profile = data.profile || {};
    const currentPage = document.body.dataset.page;

    const brand = el("a", { class: "brand", href: "index.html" },
      el("span", { class: "brand-name", text: profile.name || "" }),
      hasText(profile.role) ? el("span", { class: "brand-role", text: profile.role }) : null);

    const nav = el("nav", { class: "site-nav", "aria-label": "Điều hướng chính" });
    for (const page of PAGES) {
      nav.append(el("a", { href: page.href, text: page.label, "aria-current": page.id === currentPage ? "page" : null }));
    }

    const vision = el("div", { class: "vision-links", role: "group", "aria-label": "Hướng dẫn phần mềm Vision" });
    for (const guide of data.visionGuides || []) vision.append(renderVisionLink(guide));

    header.replaceChildren(el("div", { class: "wrap header-inner" }, brand, nav, vision));

    const page = PAGES.find((item) => item.id === currentPage);
    if (page && hasText(profile.name)) document.title = page.label + " – " + profile.name;
  }

  /* ---------- Khởi động ---------- */

  if (!data || typeof data !== "object") {
    // data.js lỗi cú pháp hoặc chưa tải được: báo rõ thay vì để trang trống.
    const main = document.getElementById("main");
    if (main) {
      main.prepend(el("p", {
        class: "notice",
        role: "alert",
        text: "Không đọc được dữ liệu trong assets/js/data.js. Hãy kiểm tra lỗi cú pháp (thiếu dấu phẩy, dấu ngoặc hoặc dấu ngoặc kép) rồi tải lại trang."
      }));
    }
    return;
  }

  window.Site = { data, el, hasText, safeExternalUrl, resolveAssetUrl, encodePath, displayPath, fileNameFromPath, normalizeText, copyText };

  renderHeader();
})();
