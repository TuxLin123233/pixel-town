/**
 * Admin 视图的CSS 样式
 *
 * 由 views/admin.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/admin.js 顶部。
 */

export const adminStyles = `      /* hidden 属性兜底：避免类选择器里的 display 覆盖 UA 的 [hidden]{display:none} */
      [hidden] { display: none !important; }

      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 16px 48px;
        color: var(--text);
      }

      /* 顶部标题区：做成和下面一致的卡片，不再是一段裸文字 */
      .page-head {
        width: 100%;
        max-width: 460px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 18px 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 10px var(--shadow2, rgba(0, 0, 0, 0.06));
      }

      .back {
        display: inline-block;
        text-decoration: none;
        color: var(--text-muted);
        font-size: 14px;
        margin-bottom: 12px;
      }

      h1 { font-size: 22px; font-weight: 800; margin: 4px 0 4px; letter-spacing: 1px; }

      .sub { font-size: 13px; color: var(--text-faint); margin-bottom: 20px; line-height: 1.6; }

      .card {
        width: 100%;
        max-width: 460px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 20px;
        margin-bottom: 16px;
      }

      .rp-count {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-faint);
        margin-left: 6px;
      }
      /* 封号 */
      .ban-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        flex-wrap: wrap;
      }
      .ban-row:last-child { border-bottom: 0; }
      .ban-name {
        font-weight: 700;
        color: var(--text);
        font-size: 14px;
      }
      .ban-uid {
        font-size: 11px;
        color: var(--text-faint);
        font-family: ui-monospace, monospace;
      }
      .ban-when {
        font-size: 11px;
        color: var(--text-faint);
      }
      .ban-tag {
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        background: #d9534f;
        border-radius: 999px;
        padding: 2px 9px;
      }
      .ban-reason {
        font-size: 12px;
        color: var(--text-muted);
        flex-basis: 100%;
        line-height: 1.6;
      }
      .ban-btn {
        margin-left: auto;
        border: 1px solid var(--border);
        background: var(--surface-2);
        color: var(--text);
        border-radius: 999px;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
      }
      .ban-btn.warn { background: #d9534f; color: #fff; border-color: #d9534f; }
      .ban-lookup {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .ban-lookup input {
        flex: 1;
        border: 1px solid var(--border-input);
        background: var(--surface);
        color: var(--text);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 14px;
        font-family: inherit;
      }
      .ban-lookup button {
        border: 0;
        border-radius: 10px;
        padding: 9px 16px;
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        background: var(--accent, #5b8def);
        cursor: pointer;
        font-family: inherit;
        flex: none;
      }
      .ban-hint {
        font-size: 12px;
        line-height: 1.7;
        color: var(--text-faint);
        margin: 10px 0 0;
      }
      /* ---------- 信箱发布 ---------- */
      .mail-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      .mail-form .mail-row {
        display: flex;
        gap: 8px;
      }
      .mail-form input,
      .mail-form textarea {
        flex: 1;
        min-width: 0;
        border: 1px solid var(--border-input);
        background: var(--surface);
        color: var(--text);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 14px;
        font-family: inherit;
      }
      .mail-form textarea {
        resize: vertical;
        line-height: 1.6;
      }
      .mail-form button {
        border: 0;
        border-radius: 10px;
        padding: 9px 16px;
        font-size: 13px;
        font-weight: 700;
        color: #fff;
        background: var(--accent, #5b8def);
        cursor: pointer;
        font-family: inherit;
        flex: none;
      }
      .mail-form button[disabled] { opacity: 0.6; cursor: default; }
      #mailOut {
        font-size: 13px;
        line-height: 1.7;
        color: var(--text-muted);
        margin-bottom: 10px;
      }
      #mailOut:empty { display: none; }
      .adm-mail-list { margin-top: 4px; }
      .adm-mail {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 9px 11px;
        margin-bottom: 8px;
        font-size: 13px;
        line-height: 1.6;
      }
      .adm-mail-ico { font-size: 20px; flex: none; line-height: 1.2; }
      .adm-mail-b { flex: 1; min-width: 0; }
      .adm-mail-t { font-weight: 700; color: var(--text); }
      .adm-mail-d { color: var(--text-faint); font-size: 11px; margin-top: 3px; }
      .adm-mail-dust { color: #b8860b; font-weight: 700; }
      .adm-mail-x {
        flex: none;
        border: 1px solid var(--border-strong);
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 8px;
        padding: 5px 9px;
        font-size: 12px;
        cursor: pointer;
        font-family: inherit;
      }
      .ban-target {
        margin-top: 10px;
        padding: 10px 12px;
        border: 1px dashed var(--border);
        border-radius: 10px;
        font-size: 13px;
        color: var(--text);
        line-height: 1.7;
      }
      .ban-reason-input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid var(--border-input);
        background: var(--surface);
        color: var(--text);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 13px;
        font-family: inherit;
        margin-top: 8px;
      }

      .rp-item {
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 11px 12px;
        margin-bottom: 10px;
      }
      .rp-top {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        font-size: 13px;
      }
      .rp-tag {
        padding: 2px 9px;
        border-radius: 999px;
        background: var(--surface-2);
        border: 1px solid var(--border-strong);
        font-size: 12px;
        color: var(--like);
      }
      .rp-title { color: var(--text); font-weight: 500; }
      .rp-meta { font-size: 12px; color: var(--text-muted2); margin-top: 5px; }
      .rp-note {
        margin-top: 7px;
        font-size: 12px;
        color: var(--text-muted);
        background: var(--surface-2);
        border-radius: 8px;
        padding: 7px 9px;
        word-break: break-all;
      }
      .rp-actions { display: flex; gap: 8px; margin-top: 10px; }
      .rp-btn {
        flex: 1;
        padding: 8px 10px;
        font-size: 13px;
        border-radius: 10px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text);
        cursor: pointer;
      }
      .rp-btn.danger { border-color: var(--like); color: var(--like); background: var(--like-bg); }

      .card-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .card-text { font-size: 13px; color: var(--text-muted); line-height: 1.8; text-align: justify; }

      .card-text b { color: var(--text); }

      .roles { padding-left: 18px; margin: 0; }

      .roles li { font-size: 13px; color: var(--text-muted); line-height: 1.9; }

      .steps { list-style: none; padding: 0; margin: 0; counter-reset: step; }

      .steps li {
        counter-increment: step;
        position: relative;
        padding: 2px 0 2px 34px;
        font-size: 13px;
        color: var(--text-muted);
        line-height: 1.8;
        text-align: justify;
      }

      .steps li::before {
        content: counter(step);
        position: absolute;
        left: 0;
        top: 2px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--accent);
        color: var(--surface);
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* ---------- 审核员管理 ---------- */
      .mod-list { display: flex; flex-direction: column; margin-top: 10px; }
      .mod-row {
        display: flex; align-items: center; gap: 8px;
        padding: 10px 0; border-bottom: 1px solid var(--border);
        font-size: 13px;
      }
      .mod-row:last-child { border-bottom: 0; }
      .mod-row .mi { flex: 1; min-width: 0; }
      .mod-row .mi b { display: block; color: var(--text); font-weight: 700; }
      .mod-row .mi span { display: block; color: var(--text-faint); font-size: 11.5px; margin-top: 2px; }
      .mod-row button {
        flex: none; border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 5px 11px;
        font-family: inherit; font-size: 12px; font-weight: 700; cursor: pointer;
      }
      .mod-row button.danger { color: #c0392b; border-color: #eec9c2; background: #fff1ee; }
      .mod-row button.ok { color: #2f6b3f; border-color: #cbe6d4; background: #e8f5ec; }
      .mod-row .tag-banned {
        font-size: 11px; font-weight: 700; color: #c0392b;
        background: #fff1ee; border: 1px solid #eec9c2; border-radius: 999px; padding: 2px 7px;
      }
      .mod-add { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
      .mod-add input {
        flex: 1; min-width: 120px; border: 1px solid var(--border-input);
        border-radius: 10px; padding: 10px; font-family: inherit; font-size: 13px;
        background: var(--surface); color: var(--text);
      }
      .mod-add button {
        flex: none; border: 0; border-radius: 10px; padding: 10px 16px;
        background: var(--accent); color: #fff;
        font-family: inherit; font-size: 13px; font-weight: 800; cursor: pointer;
      }
      .hint { font-size: 12px; color: var(--text-faint); line-height: 1.7; margin-top: 10px; }
      .hint b { color: var(--text-muted); }

      .mail-go {
        display: block;
        margin-top: 14px;
        text-align: center;
        padding: 12px;
        border-radius: 14px;
        background: var(--accent);
        color: var(--surface);
        text-decoration: none;
        font-size: 15px;
        font-weight: 600;
      }

      .contact { font-size: 12px; color: var(--text-faint); margin-top: 10px; text-align: center; }

      .login input {
        width: 100%;
        height: 48px;
        border-radius: 14px;
        border: 1px solid var(--border-strong);
        padding: 0 14px;
        font-size: 15px;
        background: var(--surface-2);
        outline: none;
        color: var(--text);
      }

      .login input:focus { border-color: var(--accent); }

      .login .enter {
        width: 100%;
        height: 48px;
        margin-top: 12px;
        border-radius: 14px;
        border: none;
        background: var(--accent);
        color: var(--surface);
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
      }

      .login .enter:disabled { opacity: 0.6; }

      .latest { display: flex; align-items: center; gap: 16px; }

      .latest canvas {
        width: 110px;
        height: 110px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 1px solid var(--border-strong);
        background: var(--surface);
      }

      .latest-info { flex: 1; min-width: 0; }

      .latest-info .author { font-size: 17px; font-weight: 700; color: var(--text); }

      .latest-info .time { font-size: 13px; color: var(--text-faint); margin-top: 4px; }

      .entry { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--surface-3); }

      .entry:last-child { border-bottom: none; }

      .entry canvas {
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        image-rendering: pixelated;
        border-radius: 8px;
        border: 1px solid var(--border-strong);
        background: var(--surface);
      }

      .entry .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }

      .entry .author {
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .entry .time { font-size: 11px; color: var(--text-faint); }

      .del {
        border: none;
        border-radius: 999px;
        background: #fdeceb;
        color: #d34b3f;
        font-size: 13px;
        font-weight: 600;
        padding: 8px 16px;
        cursor: pointer;
      }

      .empty { font-size: 13px; color: var(--text-faint); padding: 6px 2px; }

      .clear {
        width: 100%;
        height: 50px;
        border-radius: 16px;
        border: none;
        background: #d34b3f;
        color: var(--surface);
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
      }

      .logout {
        margin-top: 12px;
        width: 100%;
        height: 44px;
        border-radius: 14px;
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }

      .foot { font-size: 12px; color: var(--text-faint); text-align: center; margin-top: 6px; line-height: 1.7; }

      #toast {
        position: fixed;
        left: 50%;
        bottom: 96px;
        transform: translate(-50%, 16px);
        background: var(--text);
        color: var(--surface);
        padding: 12px 22px;
        border-radius: 999px;
        font-size: 15px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        max-width: 86vw;
        text-align: center;
        z-index: 120;
      }

      #toast.show { opacity: 1; transform: translate(-50%, 0); }

      button:active { transform: scale(0.97); }

      /* 深色模式补充：危险色在暗背景上需提亮，否则红底红字糊成一片 */
      [data-mood="dark"] .del { background: #3a1f1d; color: #ff8577; }
      [data-mood="dark"] .clear { background: #b03a2e; color: #fff; }
`
