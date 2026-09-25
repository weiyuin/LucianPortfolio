(() => {
    "use strict";
    document.querySelectorAll("[data-enhance]").forEach(element => { element.hidden = false; });
    document.querySelectorAll("[data-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
    const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim();
    let toastTimer;

    function showToast(message) {
        const toast = document.getElementById("copyToast");
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.querySelector(".toast-message").textContent = message;
        toast.hidden = false;
        toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
    }

    async function copyText(value, label) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(value);
            } else {
                const field = document.createElement("textarea");
                const previousFocus = document.activeElement;
                field.value = value;
                field.setAttribute("readonly", "");
                field.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
                document.body.append(field);
                try {
                    field.select();
                    if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
                } finally {
                    field.remove();
                    previousFocus?.focus({ preventScroll: true });
                }
            }
            showToast("Đã sao chép " + label + ".");
            return true;
        } catch {
            showToast("Chưa thể sao chép. Hãy chọn và sao chép nội dung thủ công.");
            return false;
        }
    }

    window.Lucian = Object.freeze({ normalize, copyText, showToast });
    document.querySelectorAll("[data-copy]").forEach(button => {
        button.addEventListener("click", () => copyText(button.dataset.copy, button.dataset.copyLabel));
    });

    const search = document.getElementById("document-search");
    if (!search) return;
    const cards = Array.from(document.querySelectorAll("[data-document]"));
    const filters = Array.from(document.querySelectorAll("[data-filter]"));
    const searchableCards = cards.map(card => ({ card, text: normalize(card.textContent) }));
    let category = "all";

    function filterDocuments() {
        const query = normalize(search.value);
        let count = 0;
        searchableCards.forEach(({ card, text }) => {
            const visible = (category === "all" || category === card.dataset.category) && text.includes(query);
            card.hidden = !visible;
            if (visible) count += 1;
        });
        document.getElementById("document-count").textContent = count + " tài liệu";
        document.getElementById("document-empty").hidden = count > 0;
        filters.forEach(button => {
            const selected = button.dataset.filter === category;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
    }

    search.addEventListener("input", filterDocuments);
    filters.forEach(button => button.addEventListener("click", () => {
        category = button.dataset.filter;
        filterDocuments();
    }));
    document.getElementById("reset-documents").addEventListener("click", () => {
        search.value = "";
        category = "all";
        filterDocuments();
        search.focus();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey &&
            !event.target.closest("input, textarea, select, [contenteditable]")) {
            event.preventDefault();
            search.focus();
        }
    });
})();
