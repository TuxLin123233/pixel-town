/**
 * Settings 视图的CSS 样式
 *
 * 由 views/settings.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/settings.js 顶部。
 */

export const settingsStyles = `
      /* 返回键：以前这三个页面既没有底部导航、也没有返回按钮，
         进去了只能按浏览器的后退。齿轮按钮删掉之后更是彻底出不去。 */
      .st-back {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--border-strong);
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 6px 13px;
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
        margin-bottom: 12px;
      }
      /* hidden 属性兜底：避免类选择器里的 display 覆盖 UA 的 [hidden]{display:none} */
      [hidden] { display: none !important; }

      :root {
        --bg: #faf5ef;
        --surface: #ffffff;
        --surface-2: #efe9e0;
        --text: #3b342c;
        --text-muted: #6b5f50;
        --text-faint: #b0a697;
        --border: #efe7da;
        --border-strong: #e0d3c0;
        --shadow: rgba(80, 60, 40, 0.08);
        --shadow-hover: rgba(80, 60, 40, 0.14);
        --accent: #5b8def;
        --overlay: rgba(20, 15, 10, 0.8);
      }
      [data-mood="dark"] {
        --bg: #181512;
        --surface: #262220;
        --surface-2: #332e29;
        --text: #ece5da;
        --text-muted: #b8ac9b;
        --text-faint: #7d7266;
        --border: #3a342f;
        --border-strong: #4a433c;
        --shadow: rgba(0, 0, 0, 0.4);
        --shadow-hover: rgba(0, 0, 0, 0.55);
        --accent: #6f9fff;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        padding: 24px 16px 116px;
        transition: background 0.25s ease, color 0.25s ease;
      }

      .container {
        width: 100%;
        max-width: 560px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }

      .header-text { flex: 1; min-width: 0; }

      .header-text h1 {
        font-size: 20px;
        font-weight: 800;
        color: var(--text);
      }

      .header-sub {
        font-size: 13px;
        color: var(--text-faint);
        margin-top: 4px;
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
      }

      .theme-btn:active { transform: scale(0.9); }

      .group {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 4px 14px var(--shadow);
      }

      .group-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-faint);
        margin-bottom: 12px;
      }

      .fold { padding: 4px 14px; }

      .fold-head {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        border: none;
        background: transparent;
        padding: 12px 0;
        cursor: pointer;
        text-align: left;
      }

      .fold-title { flex: 1; font-size: 15px; font-weight: 800; color: var(--text); }
      .fold-count {
        flex: 0 0 auto;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-faint);
        background: var(--surface-2);
        border-radius: 999px;
        padding: 3px 10px;
      }
      .fold-arrow { flex: 0 0 auto; font-size: 15px; color: var(--text-faint); transition: transform 0.2s; }
      .fold-head.open .fold-arrow { transform: rotate(180deg); }
      .fold-body { padding-bottom: 14px; }

      .lay-row, .lay-child-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 9px 0;
        cursor: pointer;
      }
      .lay-row {
        border-bottom: 1px dashed var(--border);
        padding-bottom: 12px;
        margin-bottom: 4px;
      }
      .lay-row input, .lay-child-row input {
        margin-top: 2px;
        width: 18px; height: 18px;
        accent-color: var(--accent);
        flex: 0 0 auto;
      }
      .lay-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .lay-body b { font-size: 14px; font-weight: 700; color: var(--text); }
      .lay-body i { font-style: normal; font-size: 11px; color: var(--text-faint); }
      .lay-child { display: flex; flex-direction: column; }

      .group-hint {
        font-size: 12px;
        color: var(--text-faint);
        line-height: 1.6;
        margin-bottom: 4px;
      }

      .feat-all { display: flex; gap: 10px; padding-top: 12px; }

      .feat-btn {
        flex: 1;
        border: 1px solid var(--border-strong);
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 9px 0;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      /* ---------- 动画强度 ---------- */
      .anim-lv-tip {
        font-size: 11.5px;
        color: var(--text-faint);
        line-height: 1.7;
        margin-top: 8px;
      }
      .anim-lv-tip b { color: var(--text-muted); }

      .guide {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        margin-bottom: 14px;
        overflow: hidden;
      }
      .guide summary {
        list-style: none;
        cursor: pointer;
        padding: 14px 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .guide summary::-webkit-details-marker { display: none; }
      .guide-hero { display: flex; flex-direction: column; gap: 3px; }
      .guide-hero b { font-size: 14px; color: var(--text); line-height: 1.5; }
      .guide-hero i { font-size: 12px; color: var(--text-muted2); font-style: normal; }
      .guide-arrow { margin-left: auto; color: var(--text-faint); transition: transform 0.2s; }
      .guide[open] .guide-arrow { transform: rotate(180deg); }
      .guide-body { padding: 0 15px 15px; }
      .guide-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
      }
      .g-item {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 13px;
        padding: 11px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .g-ico { font-size: 19px; }
      .g-item b { font-size: 13px; color: var(--text); }
      .g-item i {
        font-size: 12px;
        font-style: normal;
        color: var(--text-muted);
        line-height: 1.7;
      }
      .guide-tips {
        margin-top: 12px;
        background: var(--surface-2);
        border-left: 3px solid var(--accent);
        border-radius: 0 12px 12px 0;
        padding: 11px 13px;
      }
      .guide-tips b { font-size: 13px; color: var(--text); }
      .guide-tips ul { margin: 7px 0 0; padding-left: 18px; }
      .guide-tips li { font-size: 12px; color: var(--text-muted); line-height: 1.9; }
      .guide-tips kbd {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 6px;
        border: 1px solid var(--border-strong);
        background: var(--surface);
        font-size: 11px;
        color: var(--text);
      }
      .an-p {
        margin: 0 0 11px;
        font-size: 13px;
        line-height: 1.9;
        color: var(--text-muted);
      }
      .an-p b { color: var(--text); }
      .an-quote {
        background: var(--surface-2);
        border-left: 3px solid var(--accent);
        border-radius: 0 12px 12px 0;
        padding: 11px 13px;
      }
      .an-last { margin-bottom: 0; }

      .guide-close {
        width: 100%;
        margin-top: 12px;
        padding: 11px;
        border-radius: 12px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }


      /* ---------- 联系与社区：不透明的一张卡 ---------- */
      .contact-card {
        /* 用不透明的 surface，不跟导航栏那套透明度联动 */
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 4px 14px;
        box-shadow: 0 2px 10px var(--shadow2, rgba(0, 0, 0, 0.06));
        opacity: 1;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }
      .contact-card .entry {
        background: transparent;
        padding: 13px 0;
      }
      .contact-card .entry:hover { background: var(--surface-2); }
      .entry-sep {
        height: 1px;
        background: var(--border);
        margin: 0 -14px;
      }

      /* ---------- 可折叠分组（外观 / 启动与导航） ---------- */
      /* 用独立的 .foldx，不复用 .fold —— 否则会连原有的
         「画板布局」「进阶功能」左右内边距一起清掉 */
      .group.foldx { padding: 0; overflow: hidden; }
      .group-fold {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: 0;
        margin: 0;
        padding: 14px;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: pointer;
        text-align: left;
        -webkit-appearance: none;
        appearance: none;
      }
      .group-fold .group-title {
        flex: 1;
        min-width: 0;
        margin: 0;
        /* 原样式是分组小标题的浅色小字，折叠头上要更醒目 */
        font-size: 15px;
        font-weight: 800;
        color: var(--text);
      }
      .fold-caret {
        font-size: 12px;
        color: var(--text-faint);
        transition: transform 0.2s ease;
        flex: none;
        line-height: 1;
      }
      .group-fold[aria-expanded='false'] .fold-caret { transform: rotate(-90deg); }
      .group-fold:active { opacity: 0.7; }
      .group.foldx .fold-body { padding: 0 14px 4px; }
      .group-fold[aria-expanded='false'] + .fold-body { display: none; }

      /* ---------- 致谢：与联系卡同风格 ---------- */
      .credit-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 4px 14px;
        box-shadow: 0 2px 10px var(--shadow2, rgba(0, 0, 0, 0.06));
        opacity: 1;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }
      .credit-card .entry {
        background: transparent;
        padding: 13px 0;
      }
      .credit-card .entry:hover { background: var(--surface-2); }
      .credit-note {
        margin: 10px 4px 0;
        font-size: 12px;
        line-height: 1.6;
        color: var(--text-muted, #6b5f50);
      }

      /* ---------- 单选组（启动页 / 导航位置） ---------- */
      .radio-row { display: flex; flex-wrap: wrap; gap: 8px; }
      /* 「启动时打开」四个一排太窄(每格只剩 ~85px, 文字被挤),
         改两列，每格宽一倍 */
      #entranceRow {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      #entranceRow .radio-chip {
        flex-direction: column;
        gap: 2px;
        padding: 8px 2px;
        min-width: 0;
      }
      #entranceRow .radio-chip .rc-ico { font-size: 16px; }
      #entranceRow .radio-chip .rc-txt {
        font-size: 12px;
        white-space: nowrap;
      }
      .radio-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 9px 14px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 13px;
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
      }
      .radio-chip.on {
        border-color: var(--accent);
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, var(--surface));
        font-weight: 600;
      }
      .radio-chip .rc-ico { font-size: 15px; }

      /* ---------- 导航排序 ---------- */
      /* 6 款导航样式：三列每格太窄，预览条和标签都挤，改两列 */
      .nav-style-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      .ns-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 9px 4px 7px;
        border-radius: 12px;
        border: 2px solid var(--border);
        background: var(--surface-2);
        cursor: pointer;
        transition: border-color 0.15s, transform 0.12s;
      }
      .ns-item:active { transform: scale(0.94); }
      .ns-item.on { border-color: var(--accent); }
      .ns-bar {
        width: 100%;
        height: 16px;
        border-radius: 999px;
        border: 1px solid var(--border-strong);
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        overflow: hidden;
      }
      .ns-bar i { width: 4px; height: 4px; border-radius: 50%; background: var(--text-faint); }
      .ns-item.on .ns-bar i.on { background: var(--accent); width: 12px; border-radius: 999px; }
      .ns-name { font-size: 11px; color: var(--text-muted); }
      .ns-item.on .ns-name { color: var(--accent); font-weight: 600; }

      .order-list { display: flex; flex-direction: column; gap: 8px; }
      .order-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--border);
        background: var(--surface-2);
        font-size: 14px;
        color: var(--text);
      }
      .order-item .oi-ico { font-size: 17px; }
      .order-item .oi-name { font-weight: 600; }
      .order-item .oi-pos { margin-left: auto; font-size: 11px; color: var(--text-faint); }
      .order-btns { display: flex; gap: 5px; margin-left: auto; }
      .order-btns button {
        width: 30px;
        height: 30px;
        border-radius: 9px;
        border: 1px solid var(--border-input);
        background: var(--surface);
        color: var(--text-muted);
        font-size: 13px;
        cursor: pointer;
      }
      .order-btns button:disabled { opacity: 0.35; cursor: default; }

      /* ---------- 底部导航透明度 ---------- */
      .slider-head { display: flex; align-items: flex-start; gap: 10px; }
      .slider-val {
        margin-left: auto;
        font-size: 13px;
        font-weight: 700;
        color: var(--accent);
        font-variant-numeric: tabular-nums;
        flex-shrink: 0;
      }
      .slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 26px;
        background: transparent;
        cursor: pointer;
        margin: 0;
      }
      .slider::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 999px;
        background: var(--surface-3);
        border: 1px solid var(--border);
      }
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 22px;
        height: 22px;
        margin-top: -8px;
        border-radius: 50%;
        background: var(--accent);
        border: 2px solid var(--surface);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
      }
      .slider::-moz-range-track {
        height: 8px;
        border-radius: 999px;
        background: var(--surface-3);
        border: 1px solid var(--border);
      }
      .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--accent);
        border: 2px solid var(--surface);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
      }
      .slider-presets { display: flex; flex-wrap: wrap; gap: 7px; }
      .slider-presets button {
        padding: 5px 11px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 12px;
        cursor: pointer;
      }
      .slider-presets button.on {
        border-color: var(--accent);
        color: var(--accent);
      }
      .nav-preview {
        margin-top: 2px;
        padding: 14px 12px 10px;
        border-radius: 12px;
        background: var(--bg);
        border: 1px dashed var(--border-strong);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        overflow: hidden;
      }
      .np-bar {
        display: flex;
        align-items: center;
        gap: 2px;
        width: min(240px, 100%);
        padding: 8px 12px;
        border-radius: 999px;
        /* 预览条复用真实导航的观感 */
        background: rgba(255, 253, 250, var(--nav-op, 0.66));
        border: 1px solid rgba(180, 168, 150, 0.3);
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
        -webkit-backdrop-filter: blur(calc(6px + var(--nav-op, 0.66) * 22px));
        backdrop-filter: blur(calc(6px + var(--nav-op, 0.66) * 22px));
      }
      [data-theme='dark'] .np-bar { background: rgba(42, 38, 33, var(--nav-op, 0.62)); }
      [data-theme='midnight'] .np-bar { background: rgba(33, 34, 58, var(--nav-op, 0.62)); }
      .np-dot {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: color-mix(in srgb, var(--surface-3) calc(var(--nav-op, 0.66) * 100%), var(--surface-2));
        color: color-mix(in srgb, var(--text-faint) calc(var(--nav-op, 0.66) * 100%), var(--text));
        border: 1px solid color-mix(in srgb, var(--border) calc((1 - var(--nav-op, 0.66)) * 70%), transparent);
      }
      .np-dot:first-child { background: var(--accent); opacity: 0.85; }
      .np-note { font-size: 11px; color: var(--text-faint); }

      .theme-groups { display: flex; flex-direction: column; gap: 12px; }
      .theme-group-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 7px;
      }
      .theme-group-label .tgl-ico { font-size: 13px; }
      .theme-picks { display: flex; flex-wrap: wrap; gap: 8px; }

      .theme-pick {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        border: 2px solid transparent;
        border-radius: 12px;
        padding: 4px 6px 5px;
        background: var(--surface-2);
        cursor: pointer;
        transition: border-color 0.15s, transform 0.12s;
      }
      .theme-pick:active { transform: scale(0.93); }
      .theme-pick.on { border-color: var(--accent); }
      .tp-bar { display: flex; border-radius: 999px; overflow: hidden; }
      .tp-dot { width: 15px; height: 15px; display: block; }
      .tp-name { font-size: 10px; color: var(--text-muted2); line-height: 1.3; white-space: nowrap; }
      .theme-pick.on .tp-name { color: var(--accent); font-weight: 600; }
      .theme-hint { font-size: 12px; color: var(--text-faint); text-align: center; padding-top: 2px; }
      .theme-hint b { color: var(--accent); }

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
      }

      /* 竖排分组。必须写在 .row 之后：两者优先级相同（同为单类选择器），
         后写的赢。之前这条写在 .row 前面，被 .row 的 align-items:center
         覆盖掉，父级就变成「按内容收缩」，
         里面的 grid 用 1fr 分宽度却分不到（容器缩成 68px、每格只剩 30px），
         表现就是「启动页四个按钮太窄」「导航样式六个按钮太窄」。 */
      .row-col {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }

      .row + .row { border-top: 1px solid var(--border); }

      .row-label { font-size: 14px; font-weight: 600; }

      .row-desc { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

      .switch {
        flex: 0 0 auto;
        appearance: none;
        width: 52px;
        height: 30px;
        border-radius: 999px;
        background: var(--border-strong);
        position: relative;
        cursor: pointer;
        transition: background 0.2s;
        outline: none;
        border: none;
      }

      .switch::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fff;
        transition: left 0.2s;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }

      .switch:checked {
        background: var(--accent);
      }

      .switch:checked::after { left: 25px; }

      .entry {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 0;
        text-decoration: none;
        color: var(--text);
        border-bottom: 1px solid var(--border);
      }

      .entry:last-child { border-bottom: none; }

      .entry-ico { font-size: 18px; }

      .entry-body { flex: 1; min-width: 0; }

      .entry-label { font-size: 14px; font-weight: 600; }

      .entry-desc { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

      .entry-arrow { color: var(--text-faint); }
      /* ---------- 版本与更新 ---------- */
      .upd-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14px;
      }
      .upd-top { display: flex; align-items: center; }
      .upd-top > .upd-main { flex: 1; min-width: 0; }
      .upd-label { font-size: 12px; color: var(--text-faint); }
      .upd-ver { font-size: 15px; font-weight: 800; color: var(--text); margin-top: 2px; }
      .upd-btn {
        flex: none;
        margin-left: 12px;
        border: 0;
        border-radius: 999px;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 800;
        font-family: inherit;
        color: #fff;
        background: var(--accent);
        cursor: pointer;
      }
      .upd-btn[disabled] { opacity: 0.6; cursor: default; }
      .upd-note { margin-top: 10px; font-size: 12px; line-height: 1.7; color: var(--text-faint); }
      .upd-note.fresh { color: #b8860b; font-weight: 700; }

      /* 两张收款码并排。两边都用**宽度**自适应、高度 auto ——
         支付宝那张是 1080×1620 的竖版海报，写死成正方形会把它压扁。
         不用 flex 的 gap：微信 X5 内核不支持，间距会整个塌成 0。 */
      .qr-row { display: flex; align-items: flex-start; justify-content: center; }
      .qr-item { flex: 1; max-width: 47%; display: flex; flex-direction: column; align-items: center; }
      .qr-item + .qr-item { margin-left: 12px; }
      .qr-item img { width: 100%; height: auto; display: block; border-radius: 12px; border: 2px solid var(--border); }
      .qr-item b { margin-top: 6px; font-size: 12px; font-weight: 700; color: var(--text-muted); }

      .notice {
        font-size: 12px;
        color: var(--text-faint);
        line-height: 1.7;
        text-align: justify;
      }

      .copyright {
        margin-top: 18px;
        text-align: center;
        font-size: 12px;
        color: var(--text-faint);
      }

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
        box-shadow: 0 14px 40px var(--shadow-hover);
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
        /* 导航越透明，文字反而越清晰、每个图标越自带底衬，保证任何内容上都能看清 */
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
        background: color-mix(in srgb, rgb(var(--nav-base, 255, 253, 250)) 82%, var(--accent));
      }
    
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

      /* ---------- 毛玻璃切换动画（果冻惯性） ---------- */
      @keyframes glassJelly {
        0%   { transform: translateX(-50%) scale(1, 0.98) translateY(5px); }
        30%  { transform: translateX(-50%) scale(1.04, 0.99) translateY(-4px); }
        55%  { transform: translateX(-50%) scale(0.985, 1.012) translateY(3px); }
        78%  { transform: translateX(-50%) scale(1.01, 0.997) translateY(-1px); }
        100% { transform: translateX(-50%) scale(1, 1) translateY(0); }
      }
      .bottom-nav.jelly {
        animation: glassJelly 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      @keyframes switchWobble {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.18) rotate(-5deg); }
        70%  { transform: scale(0.94) rotate(2deg); }
        100% { transform: scale(1) rotate(0); }
      }
      .switch.jelly { animation: switchWobble 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

                  `
