/* ==========================================================================
   Trang phần mềm (software.html): hiển thị danh sách "software" trong data.js.
   Trường nào để trống thì không hiển thị.
   ========================================================================== */

(function () {
  "use strict";

  const Site = window.Site;
  if (!Site) return;
  const { data, el, hasText, safeExternalUrl } = Site;

  const list = document.getElementById("software-list");
  const empty = document.getElementById("software-empty");

  const META_FIELDS = [
    { key: "version", label: "Phiên bản" },
    { key: "os", label: "Hệ điều hành" },
    { key: "updated", label: "Cập nhật" }
  ];

  function renderItem(item) {
    const driveUrl = safeExternalUrl(item.driveUrl);
    const newTabNote = () => el("span", { class: "visually-hidden", text: " (mở trong tab mới)" });

    const name = el("h2", { class: "item-name" });
    if (driveUrl) {
      name.append(el("a", { href: driveUrl, target: "_blank", rel: "noopener noreferrer" }, item.name, newTabNote()));
    } else {
      name.textContent = item.name;
    }

    const meta = el("dl", { class: "item-meta" });
    for (const field of META_FIELDS) {
      if (!hasText(item[field.key])) continue;
      meta.append(el("div", null, el("dt", { text: field.label + ": " }), el("dd", { text: item[field.key] })));
    }

    const action = driveUrl
      ? el("a", { class: "btn btn-primary", href: driveUrl, target: "_blank", rel: "noopener noreferrer" },
          "Mở Google Drive", el("span", { class: "visually-hidden", text: ": " + item.name + " (tab mới)" }))
      : el("span", { class: "item-unset", text: "Chưa có link Google Drive" });

    return el("li", { class: "item" },
      el("div", { class: "item-info" },
        name,
        hasText(item.description) ? el("p", { class: "item-desc", text: item.description }) : null,
        meta.childElementCount ? meta : null),
      el("div", { class: "item-actions" }, action));
  }

  const items = (data.software || []).filter((item) => item && hasText(item.name));
  for (const item of items) list.append(renderItem(item));
  empty.hidden = items.length > 0;
})();
