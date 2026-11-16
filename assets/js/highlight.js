/* ==========================================================================
   Tô màu cú pháp gọn nhẹ (không dùng thư viện ngoài).
   Chỉ tạo phần tử bằng DOM + textContent, không dùng innerHTML.
   Tùy chọn: nếu file này lỗi hoặc không tải được, khung xem code vẫn hiển thị
   code dạng văn bản thường.
   ========================================================================== */

(function () {
  "use strict";

  const MAX_LENGTH = 300000; // file lớn hơn thì bỏ tô màu để trang không chậm

  function words(list) {
    return new Set(list.split(" "));
  }

  const C_LIKE = { line: ["//"], block: [["/*", "*/"]], strings: ['"', "'"] };

  const LANGUAGES = {
    python: {
      line: ["#"], block: [], strings: ['"""', "'''", '"', "'"], multiline: ['"""', "'''"],
      keywords: words("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield self")
    },
    csharp: Object.assign({}, C_LIKE, {
      keywords: words("abstract as async await base bool break byte case catch char class const continue decimal default delegate do double else enum event false finally float for foreach get if in int interface internal is lock long namespace new null object out override private protected public readonly ref return sealed set short static string struct switch this throw true try typeof uint ulong using var virtual void while")
    }),
    cpp: Object.assign({}, C_LIKE, {
      keywords: words("auto bool break case catch char class const constexpr continue default delete do double else enum explicit extern false float for friend if include inline int long namespace new nullptr operator private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void while define")
    }),
    java: Object.assign({}, C_LIKE, {
      keywords: words("abstract boolean break byte case catch char class const continue default do double else enum extends false final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch this throw throws true try void while")
    }),
    javascript: {
      line: ["//"], block: [["/*", "*/"]], strings: ['"', "'", "`"], multiline: ["`"],
      keywords: words("async await break case catch class const continue default delete do else export extends false finally for from function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while yield")
    },
    json: { line: [], block: [], strings: ['"'], keywords: words("true false null") },
    ini: { line: [";", "#"], block: [], strings: [], keywords: new Set() },
    shell: {
      line: ["#"], block: [], strings: ['"', "'"],
      keywords: words("if then else elif fi for in do done while case esac function return exit echo export local")
    }
  };

  const ALIASES = {
    py: "python", "c#": "csharp", cs: "csharp", c: "cpp", "c++": "cpp", h: "cpp", hpp: "cpp",
    js: "javascript", ts: "javascript", typescript: "javascript", bash: "shell", sh: "shell",
    cfg: "ini", conf: "ini", toml: "ini"
  };

  function resolveLanguage(name) {
    const key = String(name || "").trim().toLowerCase();
    return LANGUAGES[ALIASES[key] || key] || null;
  }

  const WORD_START = /[A-Za-z_$]/;
  const WORD_PART = /[A-Za-z0-9_$]/;
  const DIGIT = /[0-9]/;
  const NUMBER_PART = /[0-9a-fA-FxX._]/;

  /* Trả về DocumentFragment đã tô màu, hoặc null nếu không hỗ trợ / quá dài. */
  function highlight(text, languageName) {
    const language = resolveLanguage(languageName);
    if (!language || text.length > MAX_LENGTH) return null;

    const fragment = document.createDocumentFragment();
    let plain = "";

    function flushPlain() {
      if (plain) {
        fragment.append(document.createTextNode(plain));
        plain = "";
      }
    }
    function pushToken(kind, value) {
      flushPlain();
      const span = document.createElement("span");
      span.className = "tok-" + kind;
      span.textContent = value;
      fragment.append(span);
    }

    const length = text.length;
    let i = 0;

    scan:
    while (i < length) {
      const ch = text[i];

      for (const [open, close] of language.block) {
        if (text.startsWith(open, i)) {
          const end = text.indexOf(close, i + open.length);
          const stop = end === -1 ? length : end + close.length;
          pushToken("comment", text.slice(i, stop));
          i = stop;
          continue scan;
        }
      }

      for (const marker of language.line) {
        if (text.startsWith(marker, i)) {
          let stop = text.indexOf("\n", i);
          if (stop === -1) stop = length;
          pushToken("comment", text.slice(i, stop));
          i = stop;
          continue scan;
        }
      }

      for (const quote of language.strings) {
        if (text.startsWith(quote, i)) {
          const multiline = (language.multiline || []).includes(quote);
          let j = i + quote.length;
          while (j < length) {
            if (text[j] === "\\") { j += 2; continue; }
            if (text.startsWith(quote, j)) { j += quote.length; break; }
            if (!multiline && text[j] === "\n") break;
            j += 1;
          }
          j = Math.min(j, length);
          pushToken("string", text.slice(i, j));
          i = j;
          continue scan;
        }
      }

      if (WORD_START.test(ch)) {
        let j = i + 1;
        while (j < length && WORD_PART.test(text[j])) j += 1;
        const word = text.slice(i, j);
        if (language.keywords.has(word)) pushToken("keyword", word);
        else plain += word;
        i = j;
        continue;
      }

      if (DIGIT.test(ch)) {
        let j = i + 1;
        while (j < length && NUMBER_PART.test(text[j])) j += 1;
        pushToken("number", text.slice(i, j));
        i = j;
        continue;
      }

      plain += ch;
      i += 1;
    }

    flushPlain();
    return fragment;
  }

  window.SiteHighlight = { highlight };
})();
