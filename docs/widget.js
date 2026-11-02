/**
 * GENBA AI CORE — AI受付ウィジェット
 *
 * クライアントサイトへの導入はこの1行だけ:
 *   <script src="https://YOUR-WORKER-PAGES.example/widget.js"
 *           data-site="lumiere-nail"
 *           data-endpoint="https://genba-ai-core.YOUR-SUBDOMAIN.workers.dev"
 *           data-name="AI受付"
 *           data-accent="#8a6d4f" defer></script>
 *
 * - Shadow DOM採用: クライアントサイトのCSSと絶対に干渉しない
 * - 履歴はsessionStorage（タブを閉じたら消える。個人情報を端末に残さない）
 * - reduced-motion対応 / モバイルファースト
 */
(function () {
  const script = document.currentScript;
  const SITE = script.dataset.site;
  const ENDPOINT = (script.dataset.endpoint || "").replace(/\/$/, "");
  if (!SITE || !ENDPOINT) return console.warn("[genba-ai] data-site / data-endpoint が未設定");

  const NAME = script.dataset.name || "AI受付";
  const ACCENT = script.dataset.accent || "#2f5d50";
  const GREETING =
    script.dataset.greeting ||
    "こんにちは。ご予約・メニュー・営業時間など、24時間お答えします。";
  const KEY = "genba-ai-" + SITE;

  /* ===== GenbaFAQ v1 — FAQ先行応答層（AI呼び出し前・課金ゼロ） ===== */
  const GenbaFAQ = (() => {
    const cfg = { endpoint: "", site: "", faq: [], escalate: [] };
    const norm = (s) => (s || "").normalize("NFKC").toLowerCase().replace(/[\s　、。，．!?！？~〜ー・]/g, "");

    async function init({ endpoint, site }) {
      cfg.endpoint = (endpoint || "").replace(/\/$/, "");
      cfg.site = site;
      const ck = `genba-faq:${site}`;
      try {
        const cached = sessionStorage.getItem(ck);
        if (cached) { const d = JSON.parse(cached); cfg.faq = d.faq || []; cfg.escalate = d.escalate || []; return cfg.faq; }
      } catch (_) {}
      try {
        const r = await fetch(`${cfg.endpoint}/v1/faq?site=${encodeURIComponent(site)}`);
        if (r.ok) {
          const d = await r.json();
          cfg.faq = d.faq || []; cfg.escalate = d.escalate || [];
          try { sessionStorage.setItem(ck, JSON.stringify({ faq: cfg.faq, escalate: cfg.escalate })); } catch (_) {}
        }
      } catch (_) { /* FAQ取得失敗時は全部AIへ（機能劣化のみ、故障しない） */ }
      return cfg.faq;
    }

    function chips() { return cfg.faq.filter((f) => f.chip).slice(0, 6).map((f) => f.chip); }

    function tryAnswer(text) {
      const t = norm(text);
      if (!t || t.length > 25) return null; // 25字超=文脈のある自由質問（誤答防止の安全弁）
      if (cfg.escalate.some((p) => norm(p) && t.includes(norm(p)))) return null; // 予約等は必ずAIへ
      for (const f of cfg.faq) {
        if ((f.patterns || []).some((p) => norm(p) && t.includes(norm(p)))) { track("faq_hit"); return f.a; }
      }
      return null;
    }

    function answerChip(label) {
      const f = cfg.faq.find((x) => x.chip === label);
      if (!f) return null;
      track("faq_hit");
      return f.a;
    }

    function track(event) {
      try { fetch(`${cfg.endpoint}/v1/track`, { method: "POST", body: JSON.stringify({ site: cfg.site, event }), keepalive: true }); } catch (_) {}
    }

    return { init, chips, tryAnswer, answerChip, track };
  })();

  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: "closed" });

  root.innerHTML = `
  <style>
    :host { all: initial; }
    * { box-sizing: border-box; font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, sans-serif; }
    .fab {
      position: fixed; right: 18px; bottom: 18px; z-index: 2147483000;
      display: flex; align-items: center; gap: 8px;
      background: ${ACCENT}; color: #fff; border: 0; border-radius: 999px;
      padding: 13px 18px; font-size: 14px; font-weight: 600; letter-spacing: .04em;
      box-shadow: 0 6px 24px rgba(0,0,0,.22); cursor: pointer;
    }
    .fab:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
    .panel {
      position: fixed; right: 14px; bottom: 14px; z-index: 2147483001;
      width: min(380px, calc(100vw - 28px)); height: min(560px, calc(100dvh - 28px));
      background: #fff; border-radius: 18px; overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,.28);
      display: none; flex-direction: column;
    }
    .panel.open { display: flex; }
    @media (prefers-reduced-motion: no-preference) {
      .panel.open { animation: up .18s ease-out; }
      @keyframes up { from { transform: translateY(12px); opacity: 0; } }
    }
    header {
      background: ${ACCENT}; color: #fff; padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    header .t { font-size: 15px; font-weight: 700; }
    header .s { font-size: 11px; opacity: .85; margin-top: 2px; }
    header button { background: none; border: 0; color: #fff; font-size: 20px; cursor: pointer; padding: 4px 8px; }
    .log { flex: 1; overflow-y: auto; padding: 14px; background: #f7f6f3; }
    .msg { max-width: 85%; margin-bottom: 10px; padding: 10px 13px; border-radius: 14px;
           font-size: 13.5px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
    .msg.ai   { background: #fff; border: 1px solid #e7e4dd; border-bottom-left-radius: 4px; }
    .msg.user { background: ${ACCENT}; color: #fff; margin-left: auto; border-bottom-right-radius: 4px; }
    .msg.wait { color: #999; background: #fff; border: 1px dashed #ddd; }
    form { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #eee; background: #fff; }
    textarea {
      flex: 1; resize: none; border: 1px solid #ddd; border-radius: 10px;
      padding: 9px 11px; font-size: 16px; line-height: 1.4; height: 42px; outline-color: ${ACCENT};
    }
    .send {
      background: ${ACCENT}; color: #fff; border: 0; border-radius: 10px;
      padding: 0 16px; font-size: 14px; font-weight: 700; cursor: pointer;
    }
    .send:disabled { opacity: .5; cursor: default; }
    .note { font-size: 10px; color: #999; text-align: center; padding: 4px 0 8px; background: #fff; }
    .chips { display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px 2px; background: #fff; -webkit-overflow-scrolling: touch; }
    .chips:empty { display: none; }
    .chip { flex: 0 0 auto; border: 1px solid ${ACCENT}; color: ${ACCENT}; background: #fff;
            border-radius: 999px; padding: 6px 12px; font-size: 12px; white-space: nowrap; cursor: pointer; }
    .chip.book { background: ${ACCENT}; color: #fff; }
  </style>
  <button class="fab" part="fab">✦ ${NAME}</button>
  <div class="panel" role="dialog" aria-label="${NAME}">
    <header>
      <div><div class="t">${NAME}</div><div class="s">24時間ご案内 · 予約のご相談もどうぞ</div></div>
      <button class="close" aria-label="閉じる">×</button>
    </header>
    <div class="log"></div>
    <div class="chips"></div>
    <form>
      <textarea placeholder="ご質問をどうぞ" rows="1" aria-label="メッセージ"></textarea>
      <button class="send" type="submit">送信</button>
    </form>
    <div class="note">AIが応答します · 確定のご予約は担当者から折り返します</div>
  </div>`;

  const fab = root.querySelector(".fab");
  const panel = root.querySelector(".panel");
  const log = root.querySelector(".log");
  const form = root.querySelector("form");
  const ta = root.querySelector("textarea");
  const sendBtn = root.querySelector(".send");
  const chipsEl = root.querySelector(".chips");

  let messages = [];
  try { messages = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (_) {}

  function render() {
    log.innerHTML = "";
    if (!messages.length) add("ai", GREETING, false);
    messages.forEach((m) => add(m.role === "user" ? "user" : "ai", m.content, false));
    log.scrollTop = log.scrollHeight;
  }
  function add(cls, text, scroll = true) {
    const d = document.createElement("div");
    d.className = "msg " + cls;
    d.textContent = text;
    log.appendChild(d);
    if (scroll) log.scrollTop = log.scrollHeight;
    return d;
  }

  // FAQチップの描画。「予約・お問い合わせ」だけはAI直行の特別扱い（リード獲得経路）。
  function renderChips(labels) {
    chipsEl.innerHTML = "";
    labels.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (label === "予約・お問い合わせ" ? " book" : "");
      b.textContent = label;
      b.addEventListener("click", () => {
        if (label === "予約・お問い合わせ") {
          add("ai", "ご予約・お問い合わせですね。ご希望の日時やご用件を、続けてこちらにご入力ください。");
          ta.focus();
          return;
        }
        const a = GenbaFAQ.answerChip(label);
        if (a) { add("user", label); add("ai", a); } // FAQ即答: 履歴(messages)には積まない=API入力を増やさない
      });
      chipsEl.appendChild(b);
    });
  }

  let faqReady = false;
  fab.addEventListener("click", async () => {
    panel.classList.add("open"); fab.style.display = "none"; render(); ta.focus();
    if (!faqReady) {
      faqReady = true;
      await GenbaFAQ.init({ endpoint: ENDPOINT, site: SITE });
      GenbaFAQ.track("widget_open");
      renderChips([...GenbaFAQ.chips(), "予約・お問い合わせ"]);
    }
  });
  root.querySelector(".close").addEventListener("click", () => { panel.classList.remove("open"); fab.style.display = "flex"; });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = ta.value.trim();
    if (!text || sendBtn.disabled) return;
    ta.value = "";
    // v3.1: FAQ先行応答。定型質問はAPIを呼ばず即答（履歴にも積まない=入力トークンを増やさない）。
    const localFaq = GenbaFAQ.tryAnswer(text);
    if (localFaq) {
      add("user", text);
      add("ai", localFaq + "\n\nその他のご質問もどうぞ。ご予約の方は「予約」とお送りください。");
      ta.focus();
      return;
    }
    messages.push({ role: "user", content: text });
    add("user", text);
    const wait = add("wait", "…考えています");
    sendBtn.disabled = true;

    try {
      const r = await fetch(ENDPOINT + "/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site: SITE, messages }),
      });
      const data = await r.json();
      wait.remove();
      const reply = data.reply || "申し訳ありません、うまく応答できませんでした。お電話またはLINEでお問い合わせください。";
      messages.push({ role: "assistant", content: reply });
      add("ai", reply);
      sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-12)));
    } catch (_) {
      wait.textContent = "通信エラーが発生しました。時間をおいてお試しください。";
    } finally {
      sendBtn.disabled = false;
      ta.focus();
    }
  });

  ta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
})();
