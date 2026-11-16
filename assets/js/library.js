/* ==========================================================================
   Trang thư viện (index.html): cây danh mục, tìm kiếm, lọc và khung xem code.
   Toàn bộ nội dung lấy từ assets/js/data.js.
   ========================================================================== */

(function () {
  "use strict";

  const Site = window.Site;
  if (!Site) return; // common.js đã hiển thị thông báo lỗi dữ liệu
  const { data, el, hasText, resolveAssetUrl, displayPath, fileNameFromPath, normalizeText, copyText } = Site;

  const UNCATEGORIZED_ID = "__uncategorized__";
  const ALL_LABEL = "Tất cả tài liệu";

  const LANGUAGE_LABELS = {
    python: "Python", py: "Python", csharp: "C#", cs: "C#", "c#": "C#", cpp: "C++", "c++": "C++", c: "C",
    java: "Java", javascript: "JavaScript", js: "JavaScript", typescript: "TypeScript", ts: "TypeScript",
    html: "HTML", css: "CSS", xml: "XML", json: "JSON", ini: "INI", sql: "SQL", shell: "Shell", bash: "Shell",
    markdown: "Markdown", md: "Markdown", text: "Text", txt: "Text", halcon: "HALCON", hdevelop: "HALCON"
  };

  const dom = {
    tree: document.getElementById("category-tree"),
    toggle: document.getElementById("category-toggle"),
    panel: document.getElementById("category-panel"),
    current: document.getElementById("category-current"),
    search: document.getElementById("search-input"),
    typeFilter: document.getElementById("type-filter"),
    count: document.getElementById("result-count"),
    list: document.getElementById("doc-list"),
    empty: document.getElementById("empty-state"),
    emptyText: document.getElementById("empty-text"),
    reset: document.getElementById("reset-filters")
  };

  /* ====================================================================
     1. Chuẩn bị dữ liệu
     ==================================================================== */

  const categories = new Map(); // id → { id, title, parentId, depth, pathTitles, childIds, count }
  const categoryOrder = [];     // thứ tự duyệt cây, dùng để xếp nhóm tài liệu

  function indexCategories(nodes, parentId, depth, trail) {
    for (const node of nodes || []) {
      if (!node || !hasText(node.id)) continue;
      if (categories.has(node.id)) {
        console.warn("[data.js] Trùng id danh mục:", node.id);
        continue;
      }
      const title = hasText(node.title) ? node.title : node.id;
      const pathTitles = trail.concat(title);
      categories.set(node.id, { id: node.id, title, parentId, depth, pathTitles, childIds: [], count: 0 });
      categoryOrder.push(node.id);
      if (parentId) categories.get(parentId).childIds.push(node.id);
      indexCategories(node.children, node.id, depth + 1, pathTitles);
    }
  }
  indexCategories(data.categories, null, 0, []);

  const typeConfigs = data.documentTypes || {};
  const docs = [];

  (function indexDocuments() {
    const seen = new Set();
    for (const raw of data.documents || []) {
      if (!raw || !hasText(raw.id) || !hasText(raw.path)) {
        console.warn("[data.js] Bỏ qua tài liệu thiếu id hoặc path:", raw);
        continue;
      }
      if (seen.has(raw.id)) {
        console.warn("[data.js] Trùng id tài liệu:", raw.id);
        continue;
      }
      seen.add(raw.id);

      const type = hasText(raw.type) ? raw.type : "file";
      const typeConfig = typeConfigs[type] || { label: type, view: "file" };

      let categoryId = raw.categoryId;
      if (!categories.has(categoryId)) {
        console.warn("[data.js] Tài liệu", raw.id, "có categoryId chưa khai báo:", raw.categoryId);
        categoryId = UNCATEGORIZED_ID;
        if (!categories.has(UNCATEGORIZED_ID)) {
          categories.set(UNCATEGORIZED_ID, {
            id: UNCATEGORIZED_ID, title: "Chưa phân loại", parentId: null, depth: 0,
            pathTitles: ["Chưa phân loại"], childIds: [], count: 0
          });
          categoryOrder.push(UNCATEGORIZED_ID);
        }
      }

      // Chuỗi danh mục: danh mục chứa tài liệu và mọi danh mục cha của nó.
      const chain = new Set();
      for (let id = categoryId; id; id = categories.get(id).parentId) {
        chain.add(id);
        categories.get(id).count += 1;
      }

      const title = hasText(raw.title) ? raw.title : fileNameFromPath(raw.path);
      const languageKey = String(raw.language || "").trim().toLowerCase();
      const languageLabel = languageKey ? (LANGUAGE_LABELS[languageKey] || raw.language) : "";
      const tags = Array.isArray(raw.tags) ? raw.tags : [];
      const fileName = fileNameFromPath(raw.path);

      docs.push({
        raw, id: raw.id, title, type, typeConfig, categoryId, chain, fileName, languageLabel,
        url: resolveAssetUrl(raw.path, hasText(raw.root) ? raw.root : type),
        searchText: normalizeText([title, displayPath(raw.path), fileName, tags.join(" "), raw.description, raw.language, languageLabel, typeConfig.label].join("\n")),
        row: null,
        view: { open: false, status: "idle", text: "", scrollTop: 0, scrollLeft: 0, panel: null, body: null, scroller: null }
      });
    }
  })();

  /* ====================================================================
     2. Trạng thái bộ lọc (đồng bộ lên thanh địa chỉ để tải lại vẫn giữ)
     ==================================================================== */

  const state = { categoryId: null, type: null, query: "" };
  const expanded = new Set(); // id các danh mục đang mở trong cây

  (function readStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    const type = params.get("type");
    if (cat && categories.has(cat)) state.categoryId = cat;
    if (type && docs.some((doc) => doc.type === type)) state.type = type;
    state.query = params.get("q") || "";
  })();

  function writeStateToUrl() {
    const params = new URLSearchParams();
    if (state.categoryId) params.set("cat", state.categoryId);
    if (state.type) params.set("type", state.type);
    if (state.query.trim()) params.set("q", state.query.trim());
    const query = params.toString();
    try {
      window.history.replaceState(null, "", query ? "?" + query : window.location.pathname);
    } catch (error) {
      /* một số trình duyệt chặn khi mở bằng file:// — không ảnh hưởng chức năng */
    }
  }

  // Mặc định mở các danh mục cấp một; mở thêm nhánh chứa danh mục đang chọn.
  for (const category of categories.values()) {
    if (category.depth === 0 && category.childIds.length) expanded.add(category.id);
  }
  function expandAncestors(categoryId) {
    for (let id = categoryId; id; id = categories.get(id).parentId) {
      if (categories.get(id).childIds.length) expanded.add(id);
    }
  }
  if (state.categoryId) expandAncestors(state.categoryId);

  /* ====================================================================
     3. Cây danh mục
     ==================================================================== */

  const treeNodes = new Map(); // id → { selectButton, toggleButton, childList }
  let allButton = null;

  function chevronIcon() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "chevron");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M4 6l4 4 4-4");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
    return svg;
  }

  function renderTreeItem(category, index) {
    const hasChildren = category.childIds.length > 0;
    const childListId = "tree-children-" + index;

    const selectButton = el("button", { type: "button", class: "tree-select", onclick: () => selectCategory(category.id) },
      el("span", { class: "tree-name", text: category.title }),
      el("span", { class: "tree-count", text: String(category.count) }));

    let toggleButton = null;
    let childList = null;
    if (hasChildren) {
      toggleButton = el("button", {
        type: "button", class: "tree-toggle", "aria-controls": childListId,
        onclick: () => {
          if (expanded.has(category.id)) expanded.delete(category.id);
          else expanded.add(category.id);
          updateTree();
        }
      }, chevronIcon());
      childList = el("ul", { id: childListId });
      for (const childId of category.childIds) {
        childList.append(renderTreeItem(categories.get(childId), categoryOrder.indexOf(childId)));
      }
    }

    treeNodes.set(category.id, { selectButton, toggleButton, childList });

    const row = el("div", { class: "tree-row", style: "--depth: " + category.depth },
      toggleButton || el("span", { class: "tree-spacer" }), selectButton);
    return el("li", null, row, childList);
  }

  function renderTree() {
    allButton = el("button", { type: "button", class: "tree-select", onclick: () => selectCategory(null) },
      el("span", { class: "tree-name", text: ALL_LABEL }),
      el("span", { class: "tree-count", text: String(docs.length) }));
    dom.tree.append(el("li", null, el("div", { class: "tree-row" }, el("span", { class: "tree-spacer" }), allButton)));

    categoryOrder.forEach((id, index) => {
      const category = categories.get(id);
      if (category.parentId === null) dom.tree.append(renderTreeItem(category, index));
    });
  }

  function updateTree() {
    allButton.setAttribute("aria-current", state.categoryId === null ? "true" : "false");
    for (const [id, node] of treeNodes) {
      node.selectButton.setAttribute("aria-current", state.categoryId === id ? "true" : "false");
      if (node.toggleButton) {
        const isOpen = expanded.has(id);
        const title = categories.get(id).title;
        node.toggleButton.setAttribute("aria-expanded", String(isOpen));
        node.toggleButton.setAttribute("aria-label", (isOpen ? "Thu gọn danh mục " : "Mở rộng danh mục ") + title);
        node.childList.hidden = !isOpen;
      }
    }
    dom.current.textContent = state.categoryId ? categories.get(state.categoryId).pathTitles.join(" / ") : ALL_LABEL;
  }

  function selectCategory(categoryId) {
    state.categoryId = categoryId;
    if (categoryId) expandAncestors(categoryId);
    const menuWasUsed = isMobileMenu() && dom.panel.classList.contains("is-open");
    applyFilters();
    if (menuWasUsed) {
      setMenuOpen(false);
      dom.toggle.focus();
    }
  }

  /* Menu danh mục trên màn hình hẹp (nút chỉ hiện khi CSS chuyển sang một cột). */
  function isMobileMenu() {
    return dom.toggle.offsetParent !== null;
  }
  function setMenuOpen(open) {
    dom.panel.classList.toggle("is-open", open);
    dom.toggle.setAttribute("aria-expanded", String(open));
  }
  dom.toggle.addEventListener("click", () => setMenuOpen(!dom.panel.classList.contains("is-open")));
  dom.panel.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMobileMenu() && dom.panel.classList.contains("is-open")) {
      setMenuOpen(false);
      dom.toggle.focus();
    }
  });

  /* ====================================================================
     4. Bộ lọc theo loại tài liệu
     ==================================================================== */

  const typeButtons = new Map(); // type (hoặc null = tất cả) → button

  function renderTypeFilter() {
    const usedTypes = [];
    for (const type of Object.keys(typeConfigs)) {
      if (docs.some((doc) => doc.type === type)) usedTypes.push(type);
    }
    for (const doc of docs) {
      if (!usedTypes.includes(doc.type)) usedTypes.push(doc.type);
    }
    if (usedTypes.length < 2) {
      dom.typeFilter.hidden = true; // chỉ có một loại thì không cần lọc
      return;
    }
    const addButton = (type, label) => {
      const button = el("button", {
        type: "button", class: "btn", text: label,
        onclick: () => { state.type = type; applyFilters(); }
      });
      typeButtons.set(type, button);
      dom.typeFilter.append(button);
    };
    addButton(null, "Tất cả");
    for (const type of usedTypes) addButton(type, (typeConfigs[type] && typeConfigs[type].label) || type);
  }

  /* ====================================================================
     5. Khung xem code
     ==================================================================== */

  /* Giải mã nội dung file. Mặc định UTF-8; nếu không hợp lệ thì thử GB18030
     (hay gặp ở file script từ máy Trung Quốc). Có thể ép bằng trường "encoding". */
  function decodeBytes(buffer, forcedEncoding) {
    const bytes = new Uint8Array(buffer);
    if (hasText(forcedEncoding)) {
      return { text: new TextDecoder(forcedEncoding).decode(bytes), encoding: forcedEncoding.toLowerCase() };
    }
    if (bytes[0] === 0xff && bytes[1] === 0xfe) return { text: new TextDecoder("utf-16le").decode(bytes), encoding: "utf-16le" };
    if (bytes[0] === 0xfe && bytes[1] === 0xff) return { text: new TextDecoder("utf-16be").decode(bytes), encoding: "utf-16be" };
    try {
      return { text: new TextDecoder("utf-8", { fatal: true }).decode(bytes), encoding: "utf-8" };
    } catch (error) {
      try {
        return { text: new TextDecoder("gb18030", { fatal: true }).decode(bytes), encoding: "gb18030" };
      } catch (fallbackError) {
        return { text: new TextDecoder("utf-8").decode(bytes), encoding: "utf-8" };
      }
    }
  }

  function describeLoadError(error) {
    if (error && error.httpStatus === 404) {
      return "Không tìm thấy file (HTTP 404). Kiểm tra lại đường dẫn và tên file trong assets/js/data.js.";
    }
    if (error && error.httpStatus) {
      return "Máy chủ trả về lỗi HTTP " + error.httpStatus + " khi tải file.";
    }
    if (window.location.protocol === "file:") {
      return "Trang đang mở trực tiếp từ ổ đĩa (file://) nên trình duyệt chặn việc đọc file. Hãy chạy qua HTTP server theo hướng dẫn trong README.md.";
    }
    return "Không tải được file. Kiểm tra kết nối mạng rồi thử lại.";
  }

  function restoreScroll(doc) {
    const view = doc.view;
    if (!view.scroller || !view.open) return;
    view.scroller.scrollTop = view.scrollTop;
    view.scroller.scrollLeft = view.scrollLeft;
  }

  function showLoading(doc) {
    doc.view.scroller = null;
    doc.view.body.replaceChildren(el("div", { class: "code-msg", role: "status", text: "Đang tải code…" }));
  }

  function showError(doc, message, moveFocus) {
    const retry = el("button", { type: "button", class: "btn", text: "Thử lại", onclick: () => loadCode(doc, true) });
    doc.view.scroller = null;
    doc.view.body.replaceChildren(el("div", { class: "code-msg", role: "alert" },
      el("p", { text: message }),
      el("p", { class: "code-msg-detail", text: displayPath(doc.raw.path) }),
      retry));
    if (moveFocus) retry.focus();
  }

  function showCode(doc, encoding, moveFocus) {
    const view = doc.view;
    // Chỉ chuẩn hóa xuống dòng để hiển thị; nút "Sao chép" vẫn dùng nội dung gốc.
    const display = view.text.replace(/\r\n?/g, "\n");
    let lineCount = display.split("\n").length;
    if (display.endsWith("\n")) lineCount -= 1;
    lineCount = Math.max(lineCount, 1);

    const numbers = new Array(lineCount);
    for (let i = 0; i < lineCount; i += 1) numbers[i] = i + 1;
    const gutter = el("pre", { class: "code-gutter", "aria-hidden": "true", text: numbers.join("\n") });

    const code = el("code");
    let highlighted = null;
    try {
      if (window.SiteHighlight) highlighted = window.SiteHighlight.highlight(display, doc.raw.language);
    } catch (error) {
      highlighted = null; // lỗi tô màu không được làm hỏng việc đọc code
    }
    if (highlighted) code.append(highlighted);
    else code.textContent = display;

    const scroller = el("div", { class: "code-scroll", tabindex: "0", role: "region", "aria-label": "Mã nguồn: " + doc.title },
      gutter, el("pre", { class: "code-pre" }, code));
    scroller.addEventListener("scroll", () => {
      if (scroller.offsetParent === null) return; // đang bị ẩn: giữ vị trí đã lưu
      view.scrollTop = scroller.scrollTop;
      view.scrollLeft = scroller.scrollLeft;
    }, { passive: true });

    view.scroller = scroller;
    view.body.replaceChildren(scroller);
    view.info.textContent = lineCount + " dòng" + (encoding !== "utf-8" ? ", bảng mã " + encoding.toUpperCase() : "");
    view.copyButton.disabled = false;
    if (moveFocus) scroller.focus();
  }

  async function loadCode(doc, isRetry) {
    const view = doc.view;
    if (view.status === "loading") return;
    view.status = "loading";
    view.copyButton.disabled = true;
    view.info.textContent = "";
    showLoading(doc);
    try {
      const response = await fetch(doc.url);
      if (!response.ok) {
        const httpError = new Error("HTTP " + response.status);
        httpError.httpStatus = response.status;
        throw httpError;
      }
      const decoded = decodeBytes(await response.arrayBuffer(), doc.raw.encoding);
      view.text = decoded.text;      // cache: lần mở sau không tải lại
      view.status = "loaded";
      showCode(doc, decoded.encoding, Boolean(isRetry));
    } catch (error) {
      view.status = "error";
      showError(doc, describeLoadError(error), Boolean(isRetry));
    }
  }

  function setCodeOpen(doc, open) {
    const view = doc.view;
    view.open = open;
    view.panel.hidden = !open;
    view.toggleButton.setAttribute("aria-expanded", String(open));
    view.toggleButton.textContent = open ? "Đóng code" : "Xem code";
    if (!open) return;
    if (view.status === "idle") loadCode(doc, false);
    else restoreScroll(doc);
  }

  function setCopyStatus(view, message, isError) {
    view.copyStatus.textContent = message;
    view.copyStatus.classList.toggle("is-error", Boolean(isError));
    window.clearTimeout(view.statusTimer);
    view.statusTimer = window.setTimeout(() => { view.copyStatus.textContent = ""; }, isError ? 6000 : 2500);
  }

  function renderCodeParts(doc, index) {
    const view = doc.view;
    const panelId = "code-panel-" + index;

    view.toggleButton = el("button", {
      type: "button", class: "btn", "aria-expanded": "false", "aria-controls": panelId, text: "Xem code",
      onclick: () => setCodeOpen(doc, !view.open)
    });

    view.info = el("span", { class: "code-status" });
    view.copyStatus = el("span", { class: "code-status", role: "status", "aria-live": "polite" });
    view.copyButton = el("button", {
      type: "button", class: "btn", text: "Sao chép", disabled: true,
      onclick: async () => {
        const copied = await copyText(view.text);
        if (copied) setCopyStatus(view, "Đã sao chép toàn bộ code", false);
        else setCopyStatus(view, "Không sao chép được. Hãy bôi chọn code rồi sao chép thủ công.", true);
      }
    });
    const download = el("a", { class: "btn", href: doc.url, download: doc.fileName, text: "Tải file" });

    view.body = el("div", { class: "code-body" });
    view.panel = el("div", { class: "code-panel", id: panelId, hidden: true },
      el("div", { class: "code-bar" },
        el("span", { class: "code-path", text: displayPath(doc.raw.path) }),
        view.info,
        view.copyStatus,
        el("div", { class: "code-tools" }, view.copyButton, download)),
      view.body);

    return { actions: [view.toggleButton], panel: view.panel };
  }

  /* ====================================================================
     6. Danh sách tài liệu
     ==================================================================== */

  const groups = []; // { element, docs }

  function renderFileActions(doc) {
    const openLabel = hasText(doc.typeConfig.openLabel) ? doc.typeConfig.openLabel : "Mở file";
    return [
      el("a", { class: "btn", href: doc.url, target: "_blank", rel: "noopener noreferrer" },
        openLabel, el("span", { class: "visually-hidden", text: " (tab mới): " + doc.title })),
      el("a", { class: "btn", href: doc.url, download: doc.fileName },
        "Tải về", el("span", { class: "visually-hidden", text: ": " + doc.title }))
    ];
  }

  function renderDocRow(doc, index) {
    const isCode = doc.typeConfig.view === "code";
    const parts = isCode ? renderCodeParts(doc, index) : { actions: renderFileActions(doc), panel: null };
    const kind = isCode && doc.languageLabel ? doc.languageLabel : (doc.typeConfig.label || doc.type);

    const info = el("div", { class: "doc-info" },
      el("h3", { class: "doc-title", text: doc.title }),
      el("p", { class: "doc-meta" },
        el("span", { class: "doc-kind", text: kind }),
        el("span", { class: "doc-file", text: doc.fileName })),
      hasText(doc.raw.description) ? el("p", { class: "doc-desc", text: doc.raw.description }) : null);

    doc.row = el("li", { class: "doc" },
      el("div", { class: "doc-head" }, info, el("div", { class: "doc-actions" }, ...parts.actions)),
      parts.panel);
    return doc.row;
  }

  function renderDocList() {
    let index = 0;
    for (const categoryId of categoryOrder) {
      const groupDocs = docs.filter((doc) => doc.categoryId === categoryId);
      if (!groupDocs.length) continue;
      const list = el("ul", { class: "doc-group-list" });
      for (const doc of groupDocs) {
        list.append(renderDocRow(doc, index));
        index += 1;
      }
      const element = el("section", { class: "doc-group" },
        el("h2", { class: "doc-group-title", text: categories.get(categoryId).pathTitles.join(" / ") }), list);
      groups.push({ element, docs: groupDocs });
      dom.list.append(element);
    }
  }

  /* ====================================================================
     7. Áp dụng tìm kiếm + bộ lọc
     ==================================================================== */

  function applyFilters() {
    const terms = normalizeText(state.query).split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    for (const group of groups) {
      let firstVisible = true;
      for (const doc of group.docs) {
        const visible =
          (!state.categoryId || doc.chain.has(state.categoryId)) &&
          (!state.type || doc.type === state.type) &&
          terms.every((term) => doc.searchText.includes(term));
        const wasHidden = doc.row.hidden;
        doc.row.hidden = !visible;
        doc.row.classList.toggle("is-first-visible", visible && firstVisible);
        if (visible) {
          firstVisible = false;
          visibleCount += 1;
          if (wasHidden) restoreScroll(doc); // hàng vừa hiện lại: trả đúng vị trí cuộn
        }
      }
      group.element.hidden = firstVisible;
    }

    const total = docs.length;
    const filtered = Boolean(state.categoryId || state.type || terms.length);
    dom.count.textContent = total === 0 ? "" : (filtered ? visibleCount + " / " + total + " tài liệu" : total + " tài liệu");

    dom.empty.hidden = visibleCount > 0;
    if (visibleCount === 0) {
      if (total === 0) {
        dom.emptyText.textContent = "Chưa có tài liệu nào được khai báo trong assets/js/data.js.";
        dom.reset.hidden = true;
      } else {
        const conditions = [];
        if (terms.length) conditions.push("từ khóa “" + state.query.trim() + "”");
        if (state.categoryId) conditions.push("danh mục “" + categories.get(state.categoryId).title + "”");
        if (state.type) conditions.push("loại “" + ((typeConfigs[state.type] && typeConfigs[state.type].label) || state.type) + "”");
        dom.emptyText.textContent = "Không có tài liệu nào khớp với " + conditions.join(", ") + ".";
        dom.reset.hidden = false;
      }
    }

    for (const [type, button] of typeButtons) {
      button.setAttribute("aria-pressed", String(state.type === type));
    }
    updateTree();
    writeStateToUrl();
  }

  dom.search.addEventListener("input", () => {
    state.query = dom.search.value;
    applyFilters();
  });

  dom.reset.addEventListener("click", () => {
    state.categoryId = null;
    state.type = null;
    state.query = "";
    dom.search.value = "";
    applyFilters();
    dom.search.focus();
  });

  /* ====================================================================
     8. Khởi động
     ==================================================================== */

  renderTree();
  renderTypeFilter();
  renderDocList();
  dom.search.value = state.query;
  applyFilters();
})();
