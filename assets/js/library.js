// Existing library metadata; source assets are unchanged.
const libraryConfig = [
    {
        "name": "VisionAssembly",
        "folder": "VisionAssembly",
        "icon": "fas fa-book",
        "files": [
            {
                "title": "GvGluePathAOI",
                "filename": "GvGluePathAOI.py"
            },
            {
                "title": "ScImageShow",
                "filename": "ScImageShow.py"
            },
            {
                "title": "ScFile",
                "filename": "ScFile.py"
            },
            {
                "title": "ScMsgReport",
                "filename": "ScMsgReport.py"
            },
            {
                "title": "ScProtocol",
                "filename": "ScProtocol.py"
            },
            {
                "title": "ScShape",
                "filename": "ScShape.py"
            },
            {
                "title": "GvAsyncLog",
                "filename": "GvAsyncLog.py"
            }
        ]
    },
    {
        "name": "H820的脚本",
        "folder": "H820-M03",
        "icon": "fas fa-cogs",
        "files": [
            {
                "title": "接收通信",
                "filename": "接收通信.py"
            },
            {
                "title": "起始点-发送",
                "filename": "起始点-发送.py"
            },
            {
                "title": "定位计算",
                "filename": "定位计算.py"
            },
            {
                "title": "复检ROI生成",
                "filename": "复检ROI生成.py"
            },
            {
                "title": "生成Blob的ROI",
                "filename": "生成Blob的ROI.py"
            },
            {
                "title": "防呆显示",
                "filename": "防呆显示.py"
            },
            {
                "title": "复检结果显示",
                "filename": "复检结果显示.py"
            },
            {
                "title": "发送存储脚本",
                "filename": "发送存储脚本.py"
            },
            {
                "title": "补偿缺胶FOF",
                "filename": "补偿缺胶FOF.py"
            }
        ]
    },
    {
        "name": "校针脚本",
        "folder": "校针",
        "icon": "fas fa-bullseye",
        "files": [
            {
                "title": "校针计算",
                "filename": "校针计算.py"
            },
            {
                "title": "校针计算偏差",
                "filename": "校针计算偏差.py"
            },
            {
                "title": "校针BLOB状态",
                "filename": "校针BLOB状态.py"
            },
            {
                "title": "校针记录",
                "filename": "校针记录.py"
            },
            {
                "title": "校针判断",
                "filename": "校针判断.py"
            }
        ]
    },
    {
        "name": "H510脚本",
        "folder": "H510脚本",
        "icon": "fas fa-cogs",
        "files": [
            {
                "title": "分割ROI生成_054",
                "filename": "分割ROI生成_054.py"
            },
            {
                "title": "分割ROI生成_287",
                "filename": "分割ROI生成_287.py"
            },
            {
                "title": "排线_555",
                "filename": "排线_555.py"
            },
            {
                "title": "排线_558",
                "filename": "排线_558.py"
            },
            {
                "title": "标定_脚本102",
                "filename": "标定_脚本102.py"
            },
            {
                "title": "标定_脚本122",
                "filename": "标定_脚本122.py"
            },
            {
                "title": "标定_脚本123",
                "filename": "标定_脚本123.py"
            },
            {
                "title": "校针计算3D",
                "filename": "校针计算3D.py"
            },
            {
                "title": "椭圆点_574",
                "filename": "椭圆点_574.py"
            },
            {
                "title": "灰度图点位显示",
                "filename": "灰度图点位显示.py"
            },
            {
                "title": "胶路计算_140",
                "filename": "胶路计算_140.py"
            },
            {
                "title": "胶路计算_272",
                "filename": "胶路计算_272.py"
            },
            {
                "title": "结果判断",
                "filename": "结果判断.py"
            },
            {
                "title": "胶重判断",
                "filename": "胶重判断.py"
            }
        ]
    },
    {
        "name": "Code học tập",
        "folder": "Code_Learning",
        "icon": "fas fa-graduation-cap",
        "files": [
            {
                "title": "Code học tập",
                "filename": "code.py"
            },
            {
                "title": "Code tạo ROI 360 độ",
                "filename": "360deg.py"
            },
            {
                "title": "Blob2LineSeg",
                "filename": "Blob2LineSeg.py"
            },
            {
                "title": "关联标定",
                "filename": "关联显示.py"
            },
            {
                "title": "标定显示",
                "filename": "标定显示.py"
            }
        ]
    }
];

(() => {
    "use strict";
    const { normalize, copyText } = window.Lucian;
    const folderList = document.getElementById("folder-list");
    const codeArea = document.getElementById("code-display-area");
    const search = document.getElementById("code-search");
    const cache = new Map();
    const descriptions = [
        "Thư viện cho hệ thống Machine Vision.",
        "Các script cho dự án H820-M03.",
        "Các script hiệu chuẩn và kiểm tra kim.",
        "Các script xử lý cho dự án H510.",
        "Ví dụ và bài thực hành Python."
    ];
    const labels = ["VisionAssembly", "H820-M03", "Hiệu chuẩn kim", "H510", "Code học tập"];
    function icon(name) {
        const paths = {
            folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
            code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
            copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
            download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>'
        };
        return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
    }
    const escape = value => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

    async function loadCode(details, url) {
        if (details.dataset.loaded || details.dataset.loading) return;
        details.dataset.loading = "true";
        const code = details.querySelector("code");
        const button = details.querySelector("button");
        code.textContent = "Đang tải mã nguồn…";
        code.classList.remove("load-error");
        code.setAttribute("aria-busy", "true");
        try {
            let source = cache.get(url);
            if (source === undefined) {
                const response = await fetch(url);
                if (!response.ok) throw new Error("HTTP " + response.status);
                source = await response.text();
                cache.set(url, source);
            }
            code.textContent = source;
            details.dataset.loaded = "true";
            button.disabled = false;
            button.addEventListener("click", () => copyText(source, "mã nguồn"));
            if (window.hljs) {
                try { window.hljs.highlightElement(code); } catch { /* Plain text remains readable. */ }
            }
        } catch {
            code.textContent = location.protocol === "file:"
                ? "Để xem code trực tiếp, hãy mở trang bằng Live Server hoặc máy chủ HTTP.\nBạn vẫn có thể mở file bằng nút Tải file phía trên."
                : "Chưa tải được file. Hãy kiểm tra kết nối rồi đóng và mở lại mục này để thử lại.";
            code.classList.add("load-error");
        } finally {
            code.removeAttribute("aria-busy");
            delete details.dataset.loading;
        }
    }

    function filterFiles() {
        const query = normalize(search.value);
        let count = 0;
        codeArea.querySelectorAll(".code-file").forEach(details => {
            const visible = normalize(details.dataset.search).includes(query);
            details.hidden = !visible;
            if (visible) count += 1;
        });
        document.getElementById("code-count").textContent = count + " files";
        document.getElementById("code-empty").hidden = count > 0;
    }

    function renderFolder(index) {
        const group = libraryConfig[index];
        document.getElementById("current-folder-title").textContent = labels[index];
        document.getElementById("folder-description").textContent = descriptions[index];
        folderList.querySelectorAll("button").forEach((button, buttonIndex) => {
            button.classList.toggle("active", index === buttonIndex);
            button.setAttribute("aria-pressed", String(index === buttonIndex));
        });
        search.value = "";
        codeArea.replaceChildren();
        group.files.forEach(file => {
            const url = ["assets", "docs", "code", group.folder, file.filename].map(encodeURIComponent).join("/");
            const details = document.createElement("details");
            details.className = "code-file";
            details.dataset.search = file.title + " " + file.filename;
            details.innerHTML = [
                '<summary>', icon("code"), '<span class="code-file-name"><strong>', escape(file.title),
                '</strong><small>', escape(file.filename), '</small></span><span class="code-file-ext">.py</span></summary>',
                '<div class="code-content"><div class="code-actions"><span>Python</span>',
                '<a class="code-action" href="', escape(url), '" download aria-label="Tải file ', escape(file.filename), '">',
                icon("download"), ' Tải file</a><button class="code-action" type="button" disabled aria-label="Sao chép ',
                escape(file.filename), '">', icon("copy"), ' Sao chép</button></div>',
                '<pre tabindex="0" aria-label="Mã nguồn ', escape(file.filename),
                '"><code class="language-python">Đang tải mã nguồn…</code></pre></div>'
            ].join("");
            details.addEventListener("toggle", () => {
                if (details.open) loadCode(details, url);
            });
            codeArea.append(details);
        });
        filterFiles();
    }

    libraryConfig.forEach((group, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "folder-item";
        button.title = group.name;
        button.setAttribute("aria-controls", "code-display-area");
        button.innerHTML = icon("folder") + '<span>' + escape(labels[index]) + '</span><span class="folder-count">' + group.files.length + '</span>';
        button.addEventListener("click", () => renderFolder(index));
        folderList.append(button);
    });
    search.addEventListener("input", filterFiles);
    renderFolder(0);
})();
