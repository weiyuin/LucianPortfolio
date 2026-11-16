/* ==========================================================================
   Trang kết nối (connections.html): giới thiệu ngắn + danh sách nền tảng.
   Mỗi nền tảng có thể có url, handle (tên tài khoản) và qr (ảnh QR).
   Không tự suy ra URL từ tên tài khoản.
   ========================================================================== */

(function () {
  "use strict";

  const Site = window.Site;
  if (!Site) return;
  const { data, el, hasText, safeExternalUrl, resolveAssetUrl, copyText } = Site;

  const intro = document.getElementById("profile-intro");
  const list = document.getElementById("platform-list");
  const empty = document.getElementById("platform-empty");

  const dialog = document.getElementById("qr-dialog");
  const qrTitle = document.getElementById("qr-title");
  const qrImage = document.getElementById("qr-image");
  const qrError = document.getElementById("qr-error");
  const qrHandle = document.getElementById("qr-handle");
  const qrClose = document.getElementById("qr-close");

  /* ---------- Giới thiệu ---------- */

  const profile = data.profile || {};
  if (hasText(profile.intro)) intro.textContent = profile.intro;
  else intro.hidden = true;

  /* ---------- Cửa sổ QR ----------
     Dùng <dialog>: trình duyệt tự giữ focus bên trong, đóng bằng phím Esc
     và trả focus về nút đã mở. */

  function openQr(platform, qrUrl) {
    if (typeof dialog.showModal !== "function") {
      window.open(qrUrl, "_blank", "noopener"); // trình duyệt quá cũ: mở ảnh ở tab mới
      return;
    }
    qrTitle.textContent = "Mã QR " + platform.name;
    qrError.hidden = true;
    qrImage.hidden = false;
    qrImage.alt = "Mã QR " + platform.name;
    qrImage.src = qrUrl;
    qrHandle.hidden = !hasText(platform.handle);
    qrHandle.textContent = hasText(platform.handle) ? platform.handle : "";
    dialog.showModal();
    qrClose.focus();
  }

  qrImage.addEventListener("error", () => {
    qrImage.hidden = true;
    qrError.hidden = false;
  });
  qrClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close(); // bấm ra vùng nền tối để đóng
  });

  /* ---------- Danh sách nền tảng ---------- */

  function renderPlatform(platform) {
    const url = safeExternalUrl(platform.url);
    const handle = hasText(platform.handle) ? platform.handle.trim() : "";
    const qrUrl = hasText(platform.qr) ? resolveAssetUrl(platform.qr, null) : null;
    const isEmpty = !url && !handle && !qrUrl;

    const actions = el("div", { class: "item-actions" });

    if (isEmpty) {
      actions.append(el("span", { class: "item-unset", text: "Chưa cập nhật" }));
    }
    if (url) {
      actions.append(el("a", { class: "btn", href: url, target: "_blank", rel: "noopener noreferrer" },
        "Mở " + platform.name, el("span", { class: "visually-hidden", text: " (tab mới)" })));
    }
    if (qrUrl) {
      const qrButton = el("button", { type: "button", class: "btn", "aria-haspopup": "dialog" },
        "Xem QR", el("span", { class: "visually-hidden", text: " " + platform.name }));
      qrButton.addEventListener("click", () => openQr(platform, qrUrl));
      actions.append(qrButton);
    }
    if (handle && !url) {
      const status = el("span", { class: "item-status", role: "status", "aria-live": "polite" });
      let timer = 0;
      const copyButton = el("button", { type: "button", class: "btn" },
        "Sao chép", el("span", { class: "visually-hidden", text: " tên tài khoản " + platform.name }));
      copyButton.addEventListener("click", async () => {
        const copied = await copyText(handle);
        status.textContent = copied ? "Đã sao chép" : "Không sao chép được";
        status.classList.toggle("is-error", !copied);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => { status.textContent = ""; }, 2500);
      });
      actions.append(status, copyButton);
    }

    return el("li", { class: "item" },
      el("div", { class: "item-info" },
        el("h3", { class: "item-name", text: platform.name }),
        handle ? el("p", { class: "item-desc", text: handle }) : null),
      actions);
  }

  const hideEmpty = Boolean(data.settings && data.settings.hideEmptyPlatforms);
  let shown = 0;
  for (const platform of data.platforms || []) {
    if (!platform || !hasText(platform.name)) continue;
    const isEmpty = !safeExternalUrl(platform.url) && !hasText(platform.handle) && !hasText(platform.qr);
    if (isEmpty && hideEmpty) continue;
    list.append(renderPlatform(platform));
    shown += 1;
  }
  empty.hidden = shown > 0;
})();
