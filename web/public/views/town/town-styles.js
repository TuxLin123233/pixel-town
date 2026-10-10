/**
 * Town 视图的CSS 样式
 *
 * 由 views/town.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/town.js 顶部。
 */

export const townStyles = `
      [hidden] { display: none !important; }
      .tw-wrap { width: 100%; max-width: 460px; margin: 0 auto; padding: 0 0 20px; }
      .tw-bar { display: flex; align-items: center; margin-bottom: 10px; }
      .tw-bar > * + * { margin-left: 10px; }
      .tw-back {
        display: inline-flex; align-items: center; flex: none;
        border: 1px solid var(--border-strong); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 6px 13px;
        font-size: 12px; font-weight: 700; text-decoration: none;
      }
      .tw-bar-main { flex: 1; min-width: 0; }
      .tw-title { font-size: 17px; font-weight: 800; color: var(--text); }
      .tw-sub { font-size: 11px; color: var(--text-faint); }

      /* ---------- 地图 ---------- */
      .tw-map {
        position: relative; border-radius: 16px; overflow: hidden;
        border: 1px solid #6f9e53;
        background-color: #8fc46b;
        /* 草地：斜纹打底，再压一层深浅相间的横向「田垄」 */
        background-image:
          repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 6px, transparent 6px 12px),
          repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 14px, transparent 14px 28px);
        box-shadow: inset 0 0 34px rgba(40,80,20,.22);
        /* ★ 地图不能无限往下长。
           原来 3 列住户网格，30 户就是 10 行 ≈ 900px，
           一进小镇页要滑好几屏才看到底下的按钮。
           现在整个地图限高，住户区在内部自己滚，
           村口土路和底下的提示牌固定不动 —— 这才像个「地图」而不是「长列表」。 */
        display: flex; flex-direction: column;
        max-height: 340px;
        padding: 0;
      }
      /* 住户区：唯一的滚动容器 */
      .tw-map-scroll {
        flex: 1; min-height: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: 8px 10px 4px;
      }
      /* 村口那条土路：贴在地图顶部，不随住户区滚动 */
      .tw-road {
        flex: none; height: 12px;
        background: repeating-linear-gradient(90deg, #c9a870 0 7px, #be9c64 7px 14px);
        border-top: 1px solid #a9884f; border-bottom: 1px solid #a9884f;
      }
            /* 4 列而不是 3 列：同样的户数少三分之一的行数。
         窄屏下用容器查询不行（兼容性），所以给个下限保护。 */
      .tw-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
      @media (max-width: 340px) {
        .tw-grid { grid-template-columns: repeat(3, 1fr); }
      }
      /* 收起 / 展开住户区。默认只显示前 8 户 ——
         镇上人多了以后，一屏全是房子，往下滑半天看不到「回我的小屋」。 */
      .tw-fold {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        width: 100%; margin-top: 8px; padding: 9px;
        border: 1px dashed rgba(255,255,255,.45);
        border-radius: 10px;
        background: rgba(255,255,255,.16);
        color: #2f4a20; font-family: inherit; font-size: 12.5px; font-weight: 700;
        cursor: pointer;
      }
      .tw-fold:active { transform: scale(.98); }
      .tw-fold .tw-fold-caret { transition: transform .2s }
      .tw-fold.open .tw-fold-caret { transform: rotate(180deg) }
      .tw-plot.hidden-by-fold { display: none }

      .tw-plot {
        border: 0; background: transparent; padding: 5px 2px 3px;
        display: flex; flex-direction: column; align-items: center;
        cursor: pointer; font-family: inherit; border-radius: 12px;
      }
      .tw-plot:active { background: rgba(255,255,255,.2); }
      .tw-plot canvas { display: block; width: 58px; height: 50px; image-rendering: pixelated; }
      .tw-plot-name {
        margin-top: 2px; max-width: 100%;
        font-size: 11px; font-weight: 800; color: #22401a;
        text-shadow: 0 1px 0 rgba(255,255,255,.55);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .tw-plot-top { font-size: 10px; color: #3a5a2a; }
      .tw-empty {
        font-size: 13px; line-height: 1.95; color: #2f4a22; text-align: center;
        padding: 30px 14px; font-weight: 600;
      }
      .tw-sign {
        flex: none;
        margin-top: 8px; padding: 8px 10px;
        background: #7a5a34; border: 2px solid #5d431f; border-radius: 8px;
        color: #f6ecd8; font-size: 11px; line-height: 1.7; text-align: center;
      }

      /* ---------- 小屋 ---------- */
      .tw-room-wrap { position: relative; max-width: 340px; margin: 0 auto; }
      .tw-room {
        display: block; width: 100%; image-rendering: pixelated;
        border-radius: 14px; border: 1px solid var(--border-strong);
        background: var(--surface-2);
        touch-action: manipulation;
      }
      /* 自己家的屋子要能拖着挪家具，必须给 touch-action: none。

         manipulation 只是禁掉双击缩放、**仍然允许平移**：手指在画布上一划，
         浏览器会判成「滚动页面」，手势一旦被它接管就不会再发 pointermove，
         改发 pointercancel —— 于是 endDrag(true) 把刚拖起来的家具原样弹回去，
         手感就是「按下去家具跟着动，一划就弹回来，等于拖不动」。
         鼠标没这个毛病（鼠标没有平移手势），所以是「电脑上能拖、手机上拖不动」。

         touch-action 必须在手势**开始前**声明，中途改是来不及的，
         这也是 pointerdown 里 preventDefault 救不了的原因，只能提前声明 none。
         代价是在这块画布上没法用手指滑页面；不过屋子下面还有家具栏和商店，
         页面照样滚得动。来串门（不是自己的屋子）保持 manipulation，不受影响。 */
      .tw-room.mine { touch-action: none; }
      .tw-room.editing { cursor: crosshair; }
      .tw-room.dragging { cursor: grabbing; }
      .tw-acts { display: flex; justify-content: center; margin-top: 12px; }
      .tw-acts > * + * { margin-left: 8px; }

      /* ---------- 入口：大卡片 + 像素动画 ----------
         原来是四个小圆按钮，字挤在一起，也看不出点进去是什么。
         现在每个入口一张卡片：大像素动画 + 名字 + 一句说明。
         仍然用 <button>（键盘和读屏要靠它），只是长得像卡片。 */
      .tw-entries { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 14px; }
      @media (max-width: 340px) { .tw-entries { grid-template-columns: 1fr } }
      .tw-entry {
        position: relative;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        padding: 14px 10px 12px;
        border: 0; border-radius: 16px;
        background: linear-gradient(180deg, #fffaf1, #f6ecdb);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 3px 0 #e2d0b4, 0 6px 16px rgba(120,90,50,.12);
        font-family: inherit; cursor: pointer; text-align: center;
        overflow: hidden; -webkit-tap-highlight-color: transparent;
        transition: transform .12s, box-shadow .12s;
      }
      html[data-mood='dark'] .tw-entry {
        background: linear-gradient(180deg, #38312a, #2f2922);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 3px 0 #221d18;
      }
      .tw-entry:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #e2d0b4, 0 10px 22px rgba(120,90,50,.18) }
      .tw-entry:active { transform: translateY(0) scale(.98) }
      .tw-entry::before {
        content: ''; position: absolute; inset: 0;
        background:
          repeating-linear-gradient(90deg, rgba(140,110,70,.05) 0 1px, transparent 1px 12px),
          repeating-linear-gradient(0deg, rgba(140,110,70,.05) 0 1px, transparent 1px 12px);
        pointer-events: none;
      }
      .tw-entry-art { display: flex; align-items: flex-end; justify-content: center; height: 86px; width: 100% }
      .tw-entry-art canvas { display: block; image-rendering: pixelated }
      .tw-entry b { font-size: 14px; color: #4a3a24; position: relative }
      .tw-entry i { font-style: normal; font-size: 11px; line-height: 1.6; color: #8a7458; position: relative }
      html[data-mood='dark'] .tw-entry b { color: #f2e7d5 }
      html[data-mood='dark'] .tw-entry i { color: #b3a58d }
      .tw-btn {
        border: 0; border-radius: 999px; padding: 10px 18px;
        font-size: 13px; font-weight: 800; font-family: inherit;
        background: var(--accent); color: #fff; cursor: pointer;
      }
      .tw-btn.ghost {
        background: var(--surface-2); color: var(--text-muted);
        border: 1px solid var(--border-input);
      }
      .tw-btn[disabled] { opacity: .55; cursor: default; }
      .tw-note {
        margin: 12px 2px 0; font-size: 12px; line-height: 1.75; color: var(--text-faint);
      }

      /* ---------- 家具铺 ---------- */
      .tw-tray {
        margin-top: 14px; padding: 12px;
        background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
      }
      .tw-tray-h { font-size: 13px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
      .tw-tray-h span { font-weight: 600; color: var(--text-faint); font-size: 11px; }
      .tw-items { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .tw-item {
        border: 1px solid var(--border-input); background: var(--surface-2);
        border-radius: 10px; padding: 7px 2px; cursor: pointer;
        display: flex; flex-direction: column; align-items: center; font-family: inherit;
      }
      .tw-item canvas { width: 34px; height: 34px; image-rendering: pixelated; display: block; }
      .tw-item span { font-size: 10px; color: var(--text-muted); margin-top: 4px; text-align: center; }
      .tw-item.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, var(--surface)); }
      .tw-item[disabled] { opacity: .45; cursor: default; }
      .tw-item-price { font-size: 10px; font-weight: 800; color: #b8860b; }
      /* 「窗外的天气」那一栏 */
      .tw-weather { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
      .tw-weather-h { font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 7px; }

      .tw-tabs { display: flex; flex-wrap: wrap; margin: 0 0 9px; }
      .tw-tab {
        border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 5px 11px;
        font-size: 11px; font-weight: 700; font-family: inherit;
        cursor: pointer; margin: 0 6px 6px 0;
      }
      .tw-tab.on { background: var(--accent); border-color: var(--accent); color: #fff; }
      .tw-hint { font-size: 12px; color: var(--text-faint); line-height: 1.8; padding: 2px 0; }

      /* ---------- 留言板 ---------- */
      .tw-gift { display: flex; align-items: center; margin-top: 12px; }
      .tw-gift .tw-btn { flex: 1; }
      .tw-gift .tw-btn.on { background: var(--surface-2); color: #2e7d32; border: 1px solid var(--border-input); }
      .tw-board {
        margin-top: 14px; padding: 12px;
        background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
      }
      .tw-board-h { font-size: 13px; font-weight: 800; color: var(--text); margin-bottom: 9px; }
      .tw-board-h span { font-weight: 600; color: var(--text-faint); font-size: 11px; }
      .tw-post { display: flex; margin-bottom: 10px; }
      .tw-post input {
        flex: 1; min-width: 0; border: 1px solid var(--border-input);
        background: var(--surface-2); color: var(--text);
        border-radius: 10px; padding: 9px 11px; font-size: 13px; font-family: inherit;
      }
      .tw-post button {
        flex: none; margin-left: 8px; border: 0; border-radius: 10px;
        padding: 9px 14px; background: var(--accent); color: #fff;
        font-size: 12px; font-weight: 800; font-family: inherit; cursor: pointer;
      }
      .tw-post button[disabled] { background: var(--surface-2); color: var(--text-faint); cursor: default; }
      .tw-msg {
        display: flex; align-items: flex-start; padding: 7px 0;
        border-top: 1px solid var(--border); font-size: 12px; line-height: 1.7;
      }
      .tw-msg:first-of-type { border-top: 0; }
      .tw-msg-n { flex: none; font-weight: 800; color: var(--text-muted); margin-right: 7px; }
      .tw-msg-t { flex: 1; min-width: 0; color: var(--text); word-break: break-word; }
      .tw-msg-x {
        flex: none; border: 0; background: transparent; color: var(--text-faint);
        font-size: 12px; cursor: pointer; font-family: inherit; padding: 0 0 0 8px;
      }
    `
