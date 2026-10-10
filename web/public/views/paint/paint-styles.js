/**
 * 画板样式模块
 * 
 * 包含所有画板相关的 CSS 样式，按功能分区：
 * - 基础变量与主题
 * - 像素喷漆样式
 * - 像素重力样式
 * - 画布与工具栏
 * - 颜色选择器
 * - 小地图
 * - 模式选择
 * - 帧动画
 * - Pixel Studio 外壳
 */

export const paintStyles = `
      /* hidden 属性兜底：避免类选择器里的 display 覆盖 UA 的 [hidden]{display:none} */
      [hidden] { display: none !important; }

      :root {
        --bg: linear-gradient(160deg, #fdf8f2 0%, #f2ece2 100%);
        --surface: #fff;
        --surface-2: #efe9e0;
        --surface-3: #f0ece4;
        --art-bg: #fff;
        --text: #3b342c;
        --text-muted: #6b5f50;
        --text-muted2: #9a8c7a;
        --text-faint: #b0a697;
        --text-report: #8c7f6b;
        --border: #efe7da;
        --border-strong: #e0d3c0;
        --border-input: #e0d8d0;
        --ring: #fff;
        --shadow1: rgba(80, 60, 40, 0.15);
        --shadow2: rgba(80, 60, 40, 0.10);
        --shadow3: rgba(80, 60, 40, 0.06);
        --accent: #5b8def;
        --toast-bg: #3b342c;
        --tip-text: #d1944d;
        --tip-btn-border: #f0e2cf;
        --blacktip-bg: #fff8ef;
        --blacktip-border: #f0e2cf;
        --blacktip-text: #b97f3a;
        --like: #e5574b;
        --like-bg: #fff1ee;
        --like-border: #eec9c2;
      }
      [data-mood="dark"] {
        --bg: linear-gradient(160deg, #211c17 0%, #18140f 100%);
        --surface: #2a251f;
        --surface-2: #38312a;
        --surface-3: #322c25;
        --art-bg: #f6f2ea;
        --text: #f1ead9;
        --text-muted: #c5baa7;
        --text-muted2: #a39582;
        --text-faint: #857b68;
        --text-report: #97896d;
        --border: #4a4238;
        --border-strong: #5e5448;
        --border-input: #554b3e;
        --ring: #2a251f;
        --shadow1: rgba(0, 0, 0, 0.30);
        --shadow2: rgba(0, 0, 0, 0.22);
        --shadow3: rgba(0, 0, 0, 0.16);
        --accent: #76a3ff;
        --toast-bg: #3e372e;
        --tip-text: #e8b970;
        --tip-btn-border: #4e3a20;
        --blacktip-bg: #2b2316;
        --blacktip-border: #4e3a20;
        --blacktip-text: #eec27d;
        --like: #ff8577;
        --like-bg: #3d231f;
        --like-border: #5e352c;
      }

      [data-mood="dark"] .board-wrap,
      [data-mood="dark"] .prompt-card,
      [data-mood="dark"] .pick-wrap {
        border: 1px solid rgba(255, 255, 255, 0.07);
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.30);
      }

      [data-mood="dark"] .mini-wrap {
        border: 1px solid rgba(255, 255, 255, 0.07);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.30);
      }

      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 16px 112px;
      }

      h1 {
        font-size: 22px;
        font-weight: 700;
        color: var(--text);
        margin: 8px 0 16px;
        letter-spacing: 1px;
      }

      .page-head {
        width: 100%;
        max-width: 460px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .head-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .theme-btn {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid var(--border);
        background: var(--surface);
        color: var(--text-muted);
        font-size: 18px;
        cursor: pointer;
        transition: border-color 0.2s, transform 0.12s;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .theme-btn.pill {
        width: auto;
        padding: 0 18px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .theme-btn:active { transform: scale(0.9); }

      /* ---------- 像素喷漆（与像素画完全独立） ---------- */
      #sprayBoard {
        display: block;
        width: 100%;
        max-width: 512px;
        margin: 0 auto;
        aspect-ratio: 1;
        image-rendering: pixelated;
        touch-action: none;
        border-radius: 12px;
        cursor: crosshair;
        background: #fff;
      }
      .spray-bar {
        width: 100%;
        max-width: 460px;
        margin: 12px auto 0;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .spray-pal {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 5px;
      }
      .spray-sw {
        aspect-ratio: 1;
        border-radius: 6px;
        border: 2px solid transparent;
        padding: 0;
        cursor: pointer;
      }
      .spray-sw.on {
        border-color: var(--text);
        transform: scale(1.08);
      }
      .spray-pal-foot {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .spray-tool.wide {
        width: auto;
        padding: 0 12px;
        font-size: 13px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .spray-cur {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text-muted2);
      }
      .spray-cur-sw {
        width: 18px; height: 18px; border-radius: 5px;
        border: 1px solid var(--border-input); flex: none;
      }
      .spray-cur-tx { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      .spray-tools {
        display: flex;
        gap: 8px;
      }
      .spray-tool {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text);
        font-size: 17px;
        cursor: pointer;
        font-family: inherit;
      }
      .spray-tool:active { transform: scale(0.95); }
      .spray-tool[aria-pressed='true'] {
        background: var(--accent, #5b8def);
        color: #fff;
        border-color: var(--accent, #5b8def);
      }

      /* ---------- 工具按钮：图标在上、文字在下 ---------- */
      .spray-tools .gtool,
      .gravity-tools .gtool {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        line-height: 1;
        padding: 5px 4px 4px;
        min-width: 46px;
        background: var(--surface-2);
        border: 1px solid var(--border-input);
        border-radius: 12px;
        color: var(--text);
        font-family: inherit;
        cursor: pointer;
      }
      .spray-tools .gtool:active,
      .gravity-tools .gtool:active { transform: scale(0.95); }
      .spray-tools .gtool[aria-pressed='true'],
      .gravity-tools .gtool[aria-pressed='true'] {
        background: var(--accent, #5b8def);
        color: #fff;
        border-color: var(--accent, #5b8def);
      }
      .spray-tools .gtool-ico,
      .gravity-tools .gtool-ico { font-size: 17px; line-height: 1; display: block; height: 17px; }
      .spray-tools .gtool-tx,
      .gravity-tools .gtool-tx {
        font-size: 10px;
        font-weight: 700;
        color: var(--text-muted2);
        white-space: nowrap;
      }
      .spray-tools .gtool[aria-pressed='true'] .gtool-tx,
      .gravity-tools .gtool[aria-pressed='true'] .gtool-tx { color: #fff; }
      .spray-tools, .gravity-tools { display: flex; gap: 6px; flex-wrap: wrap; }
      .spray-size {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 160px;
      }
      .spray-size-label {
        font-size: 13px;
        color: var(--text-muted2);
        flex: none;
      }
      .spray-size input[type='range'] {
        flex: 1;
        min-width: 70px;
        accent-color: var(--accent, #5b8def);
      }
      .spray-size-num {
        font-size: 13px;
        font-weight: 700;
        color: var(--text);
        width: 18px;
        text-align: right;
        flex: none;
      }
      .spray-sym-btn {
        padding: 5px 10px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 700;
        font-family: inherit;
        cursor: pointer;
        white-space: nowrap;
      }
      .spray-sym-btn.active {
        background: var(--accent, #5b8def);
        color: #fff;
        border-color: var(--accent, #5b8def);
      }

      /* ---------- 像素重力（落沙，与像素画/喷漆并列的第三套） ---------- */
      #gravityBoard {
        display: block;
        width: 100%;
        max-width: 512px;
        margin: 0 auto;
        aspect-ratio: 1;
        image-rendering: pixelated;
        touch-action: none;
        border-radius: 12px;
        cursor: crosshair;
        background: #fff;
      }
      .gravity-bar {
        width: 100%;
        max-width: 460px;
        margin: 12px auto 0;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .gravity-pal {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 5px;
      }
      .gravity-sw {
        aspect-ratio: 1;
        border-radius: 6px;
        border: 2px solid transparent;
        padding: 0;
        cursor: pointer;
      }
      .gravity-sw.on {
        border-color: var(--text);
        transform: scale(1.08);
      }
      .gravity-pal-foot {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .gravity-tools { display: flex; gap: 8px; }
      body.gravity-on .size-row,
      body.gravity-on .tools,
      body.gravity-on .hint,
      body.gravity-on #miniWrap,
      body.gravity-on .anim-wrap { display: none; }

      body.spray-on #undoBtn,
      body.spray-on #clearBtn,
      body.spray-on #imgBtn,
      body.spray-on #mirrorBtn,
      body.gravity-on #undoBtn,
      body.gravity-on #clearBtn,
      body.gravity-on #imgBtn,
      body.gravity-on #mirrorBtn { display: none; }

      body.gravity-on #joinCard { display: none; }

      body.spray-on .size-row,
      body.spray-on .tools,
      body.spray-on .hint,
      body.spray-on #miniWrap,
      body.spray-on .anim-wrap { display: none; }

      .board-wrap {
        width: 100%;
        max-width: 460px;
        background: var(--surface);
        border-radius: 20px;
        box-shadow: 0 10px 30px var(--shadow1);
        padding: 12px;
      }

      #board {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        cursor: crosshair;
        background: var(--art-bg);
      }

      .size-row {
        width: 100%;
        max-width: 460px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
      }

      .size-label {
        font-size: 13px;
        color: var(--text-muted2);
        font-weight: 600;
        white-space: nowrap;
      }

      .size-btn {
        flex: 1;
        height: 38px;
        border-radius: 999px;
        background: var(--surface);
        border: 2px solid var(--border);
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
        line-height: 1;
      }

      .size-btn.active {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }

      .zoom-row {
        width: 100%;
        max-width: 460px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }

      .zoom-btn {
        flex: 0 0 auto;
        width: 44px;
        height: 38px;
        border-radius: 999px;
        background: var(--surface);
        border: 2px solid var(--border);
        color: var(--text-muted);
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease, transform 0.12s ease;
        line-height: 1;
      }

      .zoom-btn:active { transform: scale(0.92); }

      .zoom-level {
        flex: 1;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-muted2);
        font-variant-numeric: tabular-nums;
      }

      .zoom-tip {
        font-size: 12px;
        color: var(--text-faint);
      }

      .prompt-card {
        width: 100%;
        max-width: 460px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        margin: 12px 0 16px;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 14px;
      }

      .prompt-card[hidden] { display: none; }

      .prompt-roll {
        flex: 0 0 auto;
        width: 42px;
        height: 42px;
        border-radius: 999px;
        background: var(--accent);
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        transition: transform 0.15s ease;
        line-height: 1;
      }

      .prompt-roll:active { transform: rotate(120deg) scale(0.94); }

      .prompt-body {
        flex: 1;
        min-width: 0;
      }

      .prompt-text {
        font-size: 15px;
        font-weight: 600;
        color: var(--text);
        line-height: 1.4;
        word-break: break-all;
      }

      .prompt-meta {
        font-size: 12px;
        color: var(--text-faint);
        margin-top: 2px;
      }

      .prompt-cat {
        flex: 0 0 auto;
        max-width: 120px;
        height: 38px;
        border-radius: 10px;
        background: var(--surface);
        border: 2px solid var(--border);
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 600;
        padding: 0 6px;
        cursor: pointer;
      }

      /* 小地图悬浮在画布右上角 */
      .mini-wrap {
        position: fixed;
        z-index: 40;
        pointer-events: none;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 4px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        touch-action: none;
      }
      .mini-wrap.dragging {
        cursor: grabbing;
        box-shadow: 0 8px 22px rgba(0, 0, 0, .26);
        opacity: .94;
      }
      .mini-wrap::before {
        content: '';
        position: absolute;
        left: 50%; top: 3px;
        width: 18px; height: 3px;
        margin-left: -9px;
        border-radius: 2px;
        background: var(--border-input, #ddd);
        opacity: .7;
      }

      #miniCanvas {
        display: block;
        border-radius: 8px;
        touch-action: none;
      }

      .mini-hide {
        position: absolute;
        top: -9px;
        left: -9px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid var(--border);
        background: var(--surface);
        color: var(--text-muted);
        font-size: 13px;
        line-height: 1;
        cursor: pointer;
        pointer-events: auto;
        z-index: 2;
        padding: 0;
      }
      .mini-size {
        position: absolute;
        bottom: -9px;
        right: -9px;
        width: 22px; height: 22px;
        border-radius: 50%;
        border: 2px solid var(--border);
        background: var(--surface);
        color: var(--text-muted);
        font-size: 11px;
        line-height: 1;
        cursor: pointer;
        pointer-events: auto;
        z-index: 2;
        padding: 0;
      }

      .mini-show {
        position: fixed;
        top: 74px;
        right: 12px;
        z-index: 40;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        min-width: 34px;
        max-width: 34px;
        flex: none;
        border-radius: 11px;
        border: 2px solid var(--border);
        background: var(--surface);
        color: var(--text-muted);
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        padding: 0;
        box-sizing: border-box;
      }

      .tools {
        width: 100%;
        max-width: 460px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 18px;
      }

      #board.grabbing { cursor: grabbing; }
      #toolPan { cursor: grab; }

      #board.drop-hint { outline: 3px dashed var(--accent); outline-offset: -3px; }
      #imgBtn.active { background: var(--accent); color: #fff; }

      #mirrorBtn.active {
        background: var(--accent);
        color: #fff;
      }

      .tool-swatch {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: inset 0 0 0 2px var(--surface), 0 0 0 1px var(--border-strong);
        display: block;
      }

      #toolColor { padding: 0; }
      #toolColor .tool-swatch { width: 26px; height: 26px; }

      .tool {
        flex: 1;
        min-width: 0;
        height: 44px;
        border-radius: 999px;
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 22px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
      }

      .tool:hover { background: var(--surface); }

      .tool.active {
        background: var(--accent);
        color: #fff;
        box-shadow: 0 4px 14px rgba(91, 141, 239, 0.35);
      }

      .pick-wrap {
        width: 100%;
        max-width: 460px;
        margin-top: 14px;
        background: var(--surface);
        border-radius: 20px;
        border: 1px solid var(--border);
        padding: 16px;
      }

      .pick-wrap[hidden] { display: none; }

      .preset-row {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 7px;
        margin-bottom: 16px;
      }

      .custom-toggle {
        display: flex;
        justify-content: center;
        margin: 14px 0 12px;
      }

      #customBtn {
        height: 40px;
        padding: 0 26px;
        border-radius: 999px;
        background: var(--surface-3);
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 600;
        transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
      }

      #customBtn.active {
        background: var(--accent);
        color: #fff;
      }

      .swatch {
        width: 100%;
        aspect-ratio: 1;
        min-height: 26px;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.08);
        cursor: pointer;
        transition: transform 0.12s ease, box-shadow 0.12s ease;
        padding: 0;
      }

      .swatch:active { transform: scale(0.9); }

      .swatch.selected {
        box-shadow: 0 0 0 3px var(--ring), 0 0 0 6px var(--accent);
        transform: scale(1.08);
      }

      .pick-main {
        display: grid;
        grid-template-columns: 1fr 28px;
        gap: 12px;
        align-items: stretch;
      }

      .sv-box {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        touch-action: none;
      }

      .hue-box {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        touch-action: none;
        cursor: pointer;
      }

      #svCanvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: crosshair; }
      #svMarker { position: absolute; inset: 0; width: 100%; height: 100%; display: block; pointer-events: none; }
      #hueCanvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
      #hueMarker { position: absolute; inset: 0; width: 100%; height: 100%; display: block; pointer-events: none; }

      .cur {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
        font-size: 15px;
        color: var(--text);
        font-weight: 600;
      }

      .cur-label { font-size: 13px; color: var(--text-muted); font-weight: 500; white-space: nowrap; }

      .cur-swatch {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.1);
        background: #e53935;
      }

      .hex-input {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.5px;
        height: 32px;
        width: 92px;
        border-radius: 8px;
        border: 2px solid var(--border-input);
        background: var(--surface);
        outline: none;
        color: var(--text);
        padding: 0 8px;
        text-transform: uppercase;
      }

      .hex-input:focus { border-color: var(--accent); }

      #curHex { letter-spacing: 0.5px; }

      .records {
        width: 100%;
        max-width: 460px;
        margin-top: 14px;
        background: var(--surface);
        border-radius: 20px;
        border: 1px solid var(--border);
        padding: 16px;
      }

      .records-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-muted2);
        margin-bottom: 10px;
      }

      .record-list {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
        scrollbar-width: none;
      }

      .record-list::-webkit-scrollbar { display: none; }

      .tile {
        flex: 0 0 auto;
        width: 64px;
        padding: 0;
        background: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .thumb {
        width: 56px;
        height: 56px;
        image-rendering: pixelated;
        border-radius: 8px;
        box-shadow: 0 2px 8px var(--shadow3);
        background: var(--art-bg);
      }

      .tile-meta {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        color: var(--text-muted);
        line-height: 1.3;
        max-width: 64px;
        word-break: break-all;
        text-align: center;
      }

      .tile-del {
        color: var(--like);
        font-weight: 700;
        cursor: pointer;
        padding: 0 2px;
      }
      .tile-del:active { opacity: 0.6; }

      .tile-meta-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        flex-wrap: wrap;
        max-width: 100%;
      }

      .tile-time {
        font-size: 10px;
        color: var(--text-faint);
      }

      .tile-like {
        font-size: 10px;
        color: var(--like);
        background: var(--like-bg);
        border-radius: 999px;
        padding: 1px 8px;
        margin-top: 4px;
        line-height: 1.5;
        cursor: pointer;
        user-select: none;
      }

      .tile-like.liked {
        background: var(--like);
        color: #fff;
      }

      .tile-load {
        font-size: 10px;
        color: var(--accent);
        background: var(--surface-2);
        border-radius: 999px;
        padding: 1px 8px;
        margin-top: 4px;
        line-height: 1.5;
        cursor: pointer;
        user-select: none;
      }

      .tile-load:hover {
        background: var(--accent);
        color: #fff;
      }

      .record-empty {
        font-size: 13px;
        color: var(--text-faint);
        padding: 8px 2px;
      }

      .more-btn {
        display: block;
        width: 100%;
        max-width: 460px;
        margin-top: 12px;
        padding: 12px;
        border-radius: 14px;
        background: var(--surface);
        border: 1px solid var(--border-strong);
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
      }

      .more-btn:hover { border-color: var(--border-strong); }
      .more-btn[hidden] { display: none; }

      .tag-row {
        width: 100%;
        max-width: 460px;
        margin-top: 10px;
        display: flex;
        gap: 8px;
      }

      .tag-row input {
        flex: 1;
        min-width: 0;
        height: 40px;
        border-radius: 12px;
        border: 2px solid var(--border-input);
        padding: 0 12px;
        font-size: 13px;
        background: var(--surface);
        outline: none;
        color: var(--text);
      }
      .tag-row input:focus { border-color: var(--accent); }

      .name-row {
        width: 100%;
        max-width: 460px;
        margin-top: 14px;
        display: flex;
        gap: 8px;
      }

      .author-tag {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 46px;
        padding: 0 14px;
        max-width: 46%;
        border-radius: 14px;
        border: 1px dashed var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .author-tag.need {
        color: #d9534f;
        border-color: #d9534f;
        border-style: solid;
      }

      .name-row input {
        flex: 1;
        min-width: 0;
        height: 46px;
        border-radius: 14px;
        border: 2px solid var(--border-input);
        padding: 0 14px;
        font-size: 15px;
        background: var(--surface);
        outline: none;
        color: var(--text);
      }

      .name-row input:focus { border-color: var(--accent); }

      .name-row input:disabled {
        border-color: var(--accent);
        background: color-mix(in srgb, var(--accent) 10%, var(--surface));
        opacity: 1;
        cursor: default;
      }

      .actions {
        width: 100%;
        max-width: 460px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 18px;
      }

      .actions button {
        flex: 1;
        min-width: 0;
        height: 52px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text);
        font-size: 17px;
        font-weight: 600;
        box-shadow: 0 1px 3px var(--shadow1);
        transition: transform 0.12s ease, opacity 0.15s ease,
          background 0.15s ease, box-shadow 0.15s ease;
      }
      .actions button:active {
        transform: scale(0.96);
        box-shadow: 0 1px 2px var(--shadow1);
      }
      .actions button:disabled {
        opacity: 0.45;
        box-shadow: none;
      }

      .actions button.abtn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        line-height: 1;
        padding: 4px 6px;
      }
      .actions .abtn-ico {
        font-size: 17px;
        line-height: 1;
        display: block;
        height: 17px;
      }
      .actions .abtn-tx {
        font-size: 10px;
        font-weight: 600;
        color: var(--text-muted2);
        letter-spacing: 0.2px;
        line-height: 1;
        white-space: nowrap;
      }
      .actions button.abtn.active .abtn-tx { color: #fff; }

      #undoBtn, #clearBtn {
        flex: 0 0 52px;
        background: var(--surface-2);
        color: var(--text-muted);
      }

      #uploadBtn {
        flex: 1.2;
        background: var(--accent);
        border-color: transparent;
        color: #fff;
      }

      #toast {
        position: fixed;
        left: 50%;
        bottom: 96px;
        transform: translate(-50%, 16px);
        background: var(--toast-bg);
        color: #fff;
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

      .hint {
        margin-top: 12px;
        font-size: 13px;
        color: var(--text-muted2);
        text-align: center;
        min-height: 18px;
      }

      /* ---------- 最近取色 / 草稿槽 ---------- */
      .recent-row, .draft-row {
        width: 100%;
        max-width: 460px;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 10px 12px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .recent-row::-webkit-scrollbar, .draft-row::-webkit-scrollbar { display: none; }

      .recent-label {
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-muted2);
      }

      .recent-swatches, .draft-slots {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .recent-swatch {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        border: 1px solid var(--border-strong);
        cursor: pointer;
        padding: 0;
      }
      .recent-swatch:active { transform: scale(0.9); }

      .draft-slot {
        position: relative;
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px 4px 4px;
        border: 1px dashed var(--border-strong);
        border-radius: 12px;
        min-width: 84px;
        min-height: 40px;
        cursor: default;
      }
      .draft-slot.filled { border-style: solid; cursor: pointer; }
      .draft-no { font-size: 11px; color: var(--text-muted2); }
      .draft-thumb {
        width: 32px; height: 32px;
        image-rendering: pixelated;
        border-radius: 6px;
        background: var(--art-bg);
      }
      .draft-add {
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 8px;
        font-size: 11px;
        font-weight: 700;
        padding: 6px 8px;
        cursor: pointer;
      }
      .draft-del {
        position: absolute;
        top: -6px; right: -6px;
        width: 18px; height: 18px;
        border-radius: 50%;
        border: none;
        background: var(--like);
        color: #fff;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
      }

      .disclaimer {
        width: 100%;
        max-width: 460px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 0 14px;
        font-size: 12px;
        color: var(--text-muted);
        line-height: 1.7;
      }

      .disclaimer summary {
        cursor: pointer;
        padding: 11px 0;
        font-weight: 600;
        color: var(--text-muted2);
        list-style: none;
        text-align: center;
      }

      .disclaimer summary::-webkit-details-marker { display: none; }
      .disclaimer summary::after { content: ' ▾'; }
      .disclaimer[open] summary::after { content: ' ▴'; }
      .disclaimer p { margin: 0 0 12px; }

      .disclaimer-report {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--border);
        color: var(--text-report);
      }

      .copyright {
        width: 100%;
        max-width: 460px;
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
        color: var(--text-faint);
      }

      .tip-btn {
        width: 100%;
        max-width: 460px;
        margin-top: 10px;
        height: 42px;
        border-radius: 999px;
        background: var(--surface);
        color: var(--tip-text);
        font-size: 14px;
        font-weight: 600;
        border: 2px solid var(--tip-btn-border);
      }

      .tip-overlay {
        position: fixed;
        inset: 0;
        z-index: 90;
        background: rgba(20, 15, 10, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .tip-overlay[hidden] { display: none; }

      .tip-box {
        width: 100%;
        max-width: 330px;
        background: var(--surface);
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        text-align: center;
      }

      .tip-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .tip-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text);
      }

      .tip-close {
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .tip-qrs {
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      .tip-qr-item {
        flex: 1;
        max-width: 47%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .tip-qr-item + .tip-qr-item { margin-left: 12px; }
      .tip-qr-item img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 12px;
        border: 2px solid rgba(0, 0, 0, 0.08);
        background: var(--art-bg);
      }
      .tip-qr-item b {
        margin-top: 7px;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-muted);
      }

      .tip-note {
        margin-top: 12px;
        font-size: 13px;
        color: var(--text-muted2);
        line-height: 1.6;
      }

      .consent-overlay {
        position: fixed;
        inset: 0;
        z-index: 100;
        background: rgba(20, 15, 10, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .consent-overlay[hidden] { display: none; }

      .consent-box {
        width: 100%;
        max-width: 420px;
        max-height: 86vh;
        overflow-y: auto;
        background: var(--surface);
        border-radius: 18px;
        padding: 24px 22px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      }

      .consent-box h2 {
        margin: 0 0 14px;
        font-size: 19px;
        font-weight: 800;
        text-align: center;
        color: #b33a2e;
        letter-spacing: 1px;
      }

      .consent-box .text {
        font-size: 14px;
        line-height: 1.9;
        color: var(--text);
        text-align: justify;
      }

      .consent-box .text a {
        color: var(--accent);
      }

      .consent-actions {
        display: flex;
        gap: 12px;
        margin-top: 22px;
      }

      .consent-actions button {
        flex: 1;
        height: 48px;
        border-radius: 14px;
        border: none;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
      }

      #consentYes {
        background: var(--accent);
        color: #fff;
      }

      #consentNo {
        background: var(--surface-2);
        color: var(--text-muted);
      }

      /* ---------- 创作模式选择 ---------- */
      .mode-overlay {
        position: fixed;
        inset: 0;
        z-index: 110;
        background: rgba(20, 15, 10, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .mode-overlay[hidden] { display: none; }

      .mode-box {
        width: 100%;
        max-width: 380px;
        max-height: 86vh;
        overflow-y: auto;
        background: var(--surface);
        border-radius: 20px;
        padding: 22px 18px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        max-width: min(380px, 100%);
      }

      .mode-box h2 {
        margin: 0 0 6px;
        font-size: 21px;
        font-weight: 800;
        text-align: center;
      }

      .mode-sub {
        font-size: 13px;
        color: var(--text-faint);
        text-align: center;
        margin-bottom: 16px;
      }

      .mode-opt {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        width: 100%;
        text-align: left;
        border: 1px solid var(--border-strong);
        border-radius: 16px;
        background: var(--surface);
        padding: 14px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: border-color 0.15s, transform 0.12s;
      }

      .mode-opt:active { transform: scale(0.98); }

      .mode-opt.anim { border-color: var(--accent); }

      .mode-ico { flex: 0 0 auto; font-size: 26px; }

      .mode-name {
        flex: 0 0 auto;
        font-size: 16px;
        font-weight: 800;
        color: var(--text);
      }

      .mode-desc { 
        flex: 1; 
        font-size: 12px; 
        color: var(--text-faint); 
        line-height: 1.5;
        min-width: 0;
        flex: 1 1 100%;
      }

      .mode-bar {
        width: 100%;
        max-width: 460px;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        max-width: min(460px, 100%);
      }

      .mode-bar[hidden] { display: none; }

      .mode-chip {
        flex: 1;
        font-size: 13px;
        font-weight: 700;
        color: var(--text-muted);
        background: var(--surface-2);
        border: 1px solid var(--border-strong);
        border-radius: 999px;
        padding: 8px 14px;
        text-align: center;
      }

      #switchModeBtn {
        flex: 0 0 auto;
        border: 1px solid var(--border-strong);
        background: var(--surface);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .preview-overlay {
        position: fixed;
        inset: 0;
        z-index: 90;
        background: rgba(20, 15, 10, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .preview-overlay[hidden] { display: none; }

      .preview-box {
        width: 100%;
        max-width: 380px;
        background: var(--surface);
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        text-align: center;
      }

      .preview-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .preview-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text);
      }

      .preview-close {
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      #previewCanvas {
        width: 220px;
        height: 220px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 2px solid rgba(0, 0, 0, 0.08);
        background: var(--art-bg);
      }

      .preview-info {
        margin-top: 12px;
        font-size: 14px;
        color: var(--text);
        font-weight: 600;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .preview-time {
        font-size: 12px;
        color: var(--text-faint);
        font-weight: 400;
      }

      .preview-note {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--border);
        font-size: 12px;
        color: var(--text-faint);
        line-height: 1.6;
      }

      button:active { transform: scale(0.96); }
      button:disabled { opacity: 0.55; cursor: not-allowed; }

      /* ---------- 底部导航 ---------- */
      .bottom-nav {
        position: fixed;
        left: 50%;
        bottom: 16px;
        transform: translateX(-50%);
        z-index: 80;
        display: flex;
        align-items: center;
        gap: 2px;
        width: min(420px, calc(100% - 36px));
        padding: 8px 12px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 999px;
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
      }

      .bottom-nav a {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 7px 0 6px;
        border-radius: 14px;
        text-decoration: none;
        color: color-mix(in srgb, var(--text-faint) calc(var(--nav-op, 0.66) * 100%), var(--text));
        background: transparent;
        text-shadow: 0 0 calc((1 - var(--nav-op, 0.66)) * 5px)
          rgba(var(--nav-halo, 255, 255, 255), calc((1 - var(--nav-op, 0.66)) * 0.95));
        font-size: 10px;
        font-weight: 700;
        transition: color 0.2s, background 0.2s;
      }

      .bottom-nav a .nav-icon { font-size: 18px; line-height: 1; }

      .bottom-nav a.active {
        color: var(--accent);
        background: transparent;
        box-shadow: inset 0 -2.5px 0 var(--accent);
      }

      .imgmode-overlay {
        position: fixed;
        inset: 0;
        z-index: 130;
        background: rgba(20, 15, 10, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .imgmode-box {
        width: 100%;
        max-width: 360px;
        background: var(--surface);
        border-radius: 20px;
        padding: 20px 18px 16px;
        box-shadow: 0 16px 44px rgba(0, 0, 0, 0.3);
      }

      .imgmode-warn {
        font-size: 12px;
        line-height: 1.7;
        color: #b4762a;
        background: #fdf5e6;
        border: 1px solid #f0e0c0;
        border-radius: 10px;
        padding: 9px 11px;
        margin-bottom: 14px;
        text-align: left;
      }
      .imgmode-warn b { color: #8a5a1a; }

      .imgmode-title {
        font-size: 15px;
        font-weight: 800;
        color: var(--text);
        text-align: center;
        margin-bottom: 14px;
        line-height: 1.5;
      }

      .imgmode-opt {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        text-align: left;
        border: 1px solid var(--border);
        background: var(--surface-2);
        border-radius: 14px;
        padding: 12px 14px;
        margin-bottom: 8px;
        cursor: pointer;
      }

      .imgmode-name { font-size: 14px; font-weight: 700; color: var(--text); }
      .imgmode-desc { font-size: 12px; color: var(--text-muted); }

      .imgmode-cancel {
        width: 100%;
        border: none;
        background: transparent;
        color: var(--text-faint);
        font-size: 13px;
        font-weight: 700;
        padding: 10px;
        margin-top: 4px;
        cursor: pointer;
      }

      .start-box {
        max-width: 400px;
        max-height: 88vh;
        overflow-y: auto;
      }

      .start-sec { margin-top: 16px; }

      .start-label {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-faint);
        margin-bottom: 8px;
      }

      .start-tip { font-weight: 400; color: var(--text-faint); opacity: 0.8; }

      .start-dirs {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .start-dir {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 12px 13px;
        border-radius: 13px;
        border: 1.5px solid var(--border-input);
        background: var(--surface-2);
        font-family: inherit;
        text-align: left;
        cursor: pointer;
      }
      .start-dir.on {
        border-color: var(--accent, #5b8def);
        background: color-mix(in srgb, var(--accent, #5b8def) 10%, var(--surface));
      }
      .start-dir .start-ico { font-size: 21px; flex: none; }
      .start-dir .start-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
      .start-dir b { font-size: 15px; font-weight: 700; color: var(--text); }
      .start-dir i { font-size: 12px; font-style: normal; color: var(--text-muted2); line-height: 1.5; }
      .start-spray {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 2px 10px;
      }
      .start-spray input[type='range'] { flex: 1; accent-color: var(--accent, #5b8def); }
      .start-spray-num {
        font-size: 13px;
        font-weight: 700;
        color: var(--text);
        width: 18px;
        text-align: right;
      }
      .start-note {
        margin: 2px 0 0;
        font-size: 12px;
        line-height: 1.7;
        color: var(--text-faint);
      }

      .start-sizes, .start-modes, .start-joins {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .start-sizes { flex-direction: row; gap: 8px; }

      .start-size {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        border: 1px solid var(--border);
        background: var(--surface-2);
        color: var(--text);
        border-radius: 12px;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }
      .start-size em { font-style: normal; font-size: 10px; color: var(--text-faint); font-weight: 400; }
      .start-size.on, .start-mode.on, .start-join.on {
        border-color: var(--accent);
        border-width: 2px;
        background: color-mix(in srgb, var(--accent) 12%, var(--surface));
      }

      .start-mode, .start-join {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
        text-align: left;
        border: 1px solid var(--border);
        background: var(--surface-2);
        border-radius: 14px;
        padding: 11px 13px;
        cursor: pointer;
      }

      .start-ico { flex: 0 0 auto; font-size: 18px; line-height: 1.3; }
      .start-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .start-body b { font-size: 14px; font-weight: 700; color: var(--text); }
      .start-body i { font-style: normal; font-size: 11px; color: var(--text-muted); }

      .start-toggle {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        border: 1px solid var(--border);
        background: var(--surface-2);
        border-radius: 14px;
        padding: 11px 13px;
        cursor: pointer;
      }
      .start-toggle input { margin-top: 2px; width: 18px; height: 18px; accent-color: var(--accent); }
      .start-toggle:has(input:checked) {
        border-color: var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, var(--surface));
      }

      .start-go {
        width: 100%;
        margin-top: 20px;
        height: 50px;
        border: none;
        border-radius: 16px;
        background: var(--accent);
        color: #fff;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
      }
      .start-go:active { transform: scale(0.98); }

      .start-cancel {
        width: 100%;
        margin-top: 8px;
        border: none;
        background: transparent;
        color: var(--text-faint);
        font-size: 13px;
        font-weight: 700;
        padding: 10px;
        cursor: pointer;
      }

      .join-card {
        width: 100%;
        max-width: 460px;
        margin-top: 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .join-title {
        font-size: 12px;
        font-weight: 700;
        color: var(--text-faint);
      }

      .join-opt {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 11px 12px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--surface-2);
        cursor: pointer;
        min-width: 0;
      }

      .join-opt input {
        flex: 0 0 auto;
        margin: 2px 0 0;
        width: 18px;
        height: 18px;
        accent-color: var(--accent);
      }

      .join-ico { flex: 0 0 auto; font-size: 18px; line-height: 1.2; }

      .join-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }

      .join-name {
        font-size: 13px;
        font-weight: 700;
        color: var(--text);
        word-break: break-all;
      }

      .join-desc { font-size: 11px; color: var(--text-faint); }

      .join-opt.on {
        border-color: var(--accent);
        border-width: 2px;
        background: color-mix(in srgb, var(--accent) 14%, var(--surface));
      }

      /* ---------- 帧动画 ---------- */
      .anim-editor {
        width: 100%;
        max-width: 460px;
        margin-top: 16px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 16px;
        box-shadow: var(--shadow3);
      }

      .anim-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }

      .anim-title { font-size: 15px; font-weight: 800; }

      .anim-count-group {
        display: flex;
        background: var(--surface-2);
        border-radius: 999px;
        padding: 3px;
        gap: 2px;
      }

      .anim-count-btn {
        border: none;
        background: transparent;
        color: var(--text-muted);
        border-radius: 999px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .anim-count-btn.active {
        background: var(--accent);
        color: #fff;
      }

      .anim-speed-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 10px 0 0;
        flex-wrap: wrap;
      }

      .anim-speed-label {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-muted);
        margin-right: 2px;
      }

      .anim-speed-btn {
        border: 1px solid var(--border-strong);
        background: var(--surface);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .anim-speed-btn.active {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }

      .anim-close {
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 6px 14px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .anim-frames {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 6px;
      }

      .anim-frame {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        border: 2px solid var(--border-strong);
        background: var(--surface-2);
        border-radius: 12px;
        padding: 6px;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 700;
      }

      .anim-frame.active {
        border-color: var(--accent);
        background: var(--surface);
        color: var(--accent);
      }

      .anim-frame canvas {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        display: block;
      }

      .anim-actions {
        display: flex;
        gap: 10px;
        margin-top: 12px;
      }

      .anim-actions button {
        flex: 1;
        height: 44px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid var(--border-strong);
        background: var(--surface-3);
        color: var(--text);
      }

      #animExport {
        background: linear-gradient(135deg, #7ce0c0, #5b8def);
        color: #fff;
        border: none;
      }

      .anim-note { margin-top: 10px; font-size: 12px; color: var(--text-faint); }

      #animImg {
        width: 100%;
        height: auto;
        border-radius: 14px;
        display: block;
      }

      /* ---------- 朋友圈卡片弹层 ---------- */
      .card-overlay {
        position: fixed;
        inset: 0;
        z-index: 95;
        background: rgba(20, 15, 10, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: var(--text);
      }

      .card-overlay[hidden] { display: none; }

      .card-box {
        width: 100%;
        max-width: 440px;
        max-height: 92vh;
        overflow-y: auto;
        background: var(--surface);
        border-radius: 20px;
        padding: 18px;
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.45);
        text-align: center;
      }

      .card-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .card-title { font-size: 16px; font-weight: 800; }

      .card-close {
        border: none;
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .card-actions { margin-top: 14px; display: flex; justify-content: center; gap: 10px; }

      .card-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--accent);
        color: #fff;
        border: none;
        border-radius: 999px;
        padding: 10px 24px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
      }

      .card-note { margin-top: 12px; font-size: 12px; color: var(--text-faint); }
    
      /* ---------- 导航栏毛玻璃（苹果 Liquid Glass） ---------- */
      .bottom-nav {
        background: rgba(var(--nav-base, 255, 253, 250), var(--nav-op, 0.66)) !important;
        -webkit-backdrop-filter: blur(calc(6px + var(--nav-op, 0.66) * 22px)) saturate(180%);
        backdrop-filter: blur(calc(6px + var(--nav-op, 0.66) * 22px)) saturate(180%);
        border-color: rgba(180, 168, 150, 0.30) !important;
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.35);
      }
      [data-mood="dark"] .bottom-nav {
        background: rgba(var(--nav-base, 42, 38, 33), var(--nav-op, 0.62)) !important;
        border-color: rgba(255, 255, 255, 0.10) !important;
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      html.glass-off .bottom-nav,
      html.glass-off [data-mood="dark"] .bottom-nav {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      /* ============================================================
         Pixel Studio 风格画板外壳
         ============================================================ */
      .studio {
        position: relative;
        width: 100%;
        max-width: 520px;
        margin-top: 4px;
        margin-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
        background: var(--surface);
        border: 1px solid var(--border-strong, var(--border));
        border-radius: 20px;
        padding: 10px;
        box-shadow: 0 10px 30px var(--shadow1);
      }
      [data-mood="dark"] .studio {
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.38);
      }

      /* ---------- 顶部色板坞 ---------- */
      .studio-pal {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 8px;
      }
      .studio-pal .preset-row {
        grid-template-columns: repeat(16, 1fr);
        gap: 4px;
        margin: 0;
      }
      .studio-pal .swatch {
        min-height: 0;
        border-radius: 4px;
        border-width: 1px;
      }
      .studio-pal .swatch.selected {
        box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
        transform: scale(1.12);
      }
      body.spray-on #pixelDock,
      body.gravity-on #pixelDock { display: none; }

      /* ---------- 喷漆 / 重力条 ---------- */
      .studio .spray-bar,
      .studio .gravity-bar {
        max-width: none;
        margin: 0 0 2px;
        gap: 8px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 8px;
      }
      .studio .spray-pal,
      .studio .gravity-pal {
        grid-template-columns: repeat(16, 1fr);
        gap: 4px;
      }
      .studio .spray-sw,
      .studio .gravity-sw { border-radius: 4px; border-width: 1px; }
      .studio .spray-tool.wide { border-radius: 9px; }
      .studio .spray-tools {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .studio .gravity-tools {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .studio .spray-tools .gtool,
      .studio .gravity-tools .gtool {
        min-width: 0;
        padding: 6px 2px 5px;
        border-radius: 10px;
      }
      .studio .spray-tools .gtool-tx,
      .studio .gravity-tools .gtool-tx {
        font-size: 9px;
        letter-spacing: -0.2px;
      }
      .studio .spray-tools .gtool-ico,
      .studio .gravity-tools .gtool-ico { font-size: 16px; }
      .studio .spray-sym-btn { border-radius: 8px; padding: 5px 8px; }

      /* ---------- 外壳内画布 ---------- */
      .studio .board-wrap {
        max-width: none;
        background: transparent;
        box-shadow: none;
        padding: 10px 2px 4px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
      }
      [data-mood="dark"] .studio .board-wrap {
        border: none;
        box-shadow: none;
      }
      .studio .board-wrap #board,
      .studio .board-wrap #sprayBoard,
      .studio .board-wrap #gravityBoard {
        width: auto;
        margin: 0 auto;
        max-width: 100%;
        aspect-ratio: 1;
        max-height: max(190px, calc(100dvh - 470px));
      }
      body.spray-on .studio .board-wrap #sprayBoard,
      body.gravity-on .studio .board-wrap #gravityBoard {
        max-height: max(190px, calc(100dvh - 530px));
      }

      /* ---------- 底部方块工具坞 ---------- */
      .studio-dock {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px solid var(--border);
      }
      .pico {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        line-height: 0;
      }
      .pico svg { width: 100%; height: 100%; display: block; }

      .studio .size-row,
      .studio .zoom-row {
        max-width: none;
        margin: 0;
        gap: 6px;
        width: 100%;
        justify-content: center;
      }
      .studio .size-label { font-size: 12px; flex: 0 0 auto; }
      .studio .size-btn {
        height: 30px;
        border-radius: 8px;
        border-width: 1px;
        font-size: 12px;
        flex: 0 1 84px;
      }
      .studio .zoom-row { justify-content: center; }

      .studio .tools {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin: 0;
        max-width: none;
      }
      .studio .tools .tool {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid var(--border-strong, var(--border));
        padding: 0;
      }
      .studio .tools .tool:hover { background: var(--surface-3); }
      .studio .tools .tool.active {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
        box-shadow: none;
      }
      .studio .tools .tool:disabled { opacity: 0.45; }
      .studio #toolColor .tool-swatch {
        width: 20px;
        height: 20px;
        border-radius: 5px;
      }

      .studio .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin: 0;
        max-width: none;
      }
      .studio .actions > button {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        box-shadow: none;
        padding: 0;
        border: 1px solid var(--border-strong, var(--border));
      }
      .studio .actions > button:hover { background: var(--surface-3); }
      .studio .actions > button:disabled { opacity: 0.45; }
      .studio .actions #undoBtn,
      .studio .actions #clearBtn { flex: 0 0 auto; width: 40px; }
      .studio #uploadBtn {
        width: auto;
        padding: 0 16px;
        gap: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--accent);
        border-color: transparent;
        color: #fff;
      }
      .studio #uploadBtn .pico { width: 18px; height: 18px; }
      .studio #uploadBtn .abtn-tx {
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
      }
      body.spray-on .studio .actions > button:not(#savePngBtn):not(#uploadBtn),
      body.gravity-on .studio .actions > button:not(#savePngBtn):not(#uploadBtn) {
        display: none;
      }

      .studio .spray-tools .gtool,
      .studio .gravity-tools .gtool {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        min-width: 0;
        padding: 0;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
      }
      .studio .gravity-tools { max-width: none; }

      .studio .pick-wrap {
        position: absolute;
        z-index: 50;
        top: 84px;
        left: 10px;
        right: 10px;
        margin: 0;
        max-width: none;
        border-radius: 14px;
        padding: 14px;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.22);
      }
      body.spray-on .studio .pick-wrap,
      body.gravity-on .studio .pick-wrap { top: 122px; }
      [data-mood="dark"] .studio .pick-wrap {
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
      }
      .studio .pick-wrap .cur { margin-top: 0; }

      .studio ~ .more-btn,
      .studio ~ .join-card,
      .studio ~ .tag-row,
      .studio ~ .name-row,
      .studio ~ .recent-row,
      .studio ~ .draft-row { max-width: 520px; }
`
