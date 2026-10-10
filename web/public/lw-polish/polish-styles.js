// 视觉打磨层 · 样式
//
// 由 lw-polish.js 拆分而来（内容原样搬移，未做任何改动，缩进也保持原样）。
// 引擎 ../lw-polish.js 在启动时把这段 CSS 注入成 <style id="lw-polish-style">。

var CSS = `
/* ============ 1. 设计令牌 ============
   原来阴影写死了 5 种不同数值，层级感是乱的。
   收成一套，以后改一处就全站生效。 */
:root {
  --lwp-sh-1: 0 1px 2px rgba(60, 48, 36, .06);
  --lwp-sh-2: 0 2px 8px rgba(60, 48, 36, .08);
  --lwp-sh-3: 0 4px 16px rgba(60, 48, 36, .10);
  --lwp-sh-4: 0 10px 32px rgba(60, 48, 36, .14);
  --lwp-sh-5: 0 18px 52px rgba(60, 48, 36, .20);
  --lwp-r-xs: 6px;
  --lwp-r-sm: 9px;
  --lwp-r: 13px;
  --lwp-r-lg: 17px;
  --lwp-r-xl: 22px;
  --lwp-dur-1: .12s;
  --lwp-dur-2: .2s;
  --lwp-dur-3: .32s;
  --lwp-ease: cubic-bezier(.2, .9, .3, 1);
  --lwp-ease-back: cubic-bezier(.2, 1.3, .4, 1);
}
html[data-theme='dark'] {
  --lwp-sh-1: 0 1px 2px rgba(0, 0, 0, .3);
  --lwp-sh-2: 0 2px 8px rgba(0, 0, 0, .34);
  --lwp-sh-3: 0 4px 16px rgba(0, 0, 0, .38);
  --lwp-sh-4: 0 10px 32px rgba(0, 0, 0, .44);
  --lwp-sh-5: 0 18px 52px rgba(0, 0, 0, .55);
}

/* ============ 2. 文字渲染 ============ */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
/* 数字等宽：倒计时、光尘、天数这类数字变化时不会左右抖 */
.num, .lwp-num, .in-num, .ml-num, .mc-dust, .dust-bal,
[data-lwa-count], .tk-num, .aw-num {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}
/* 标点不要在行首 */
body { line-break: strict; }
h1, h2, .card-title, .group-title, .ver-title {
  text-wrap: balance;   /* 标题不再出现孤字 */
}
p, .cp-card p, .lwd-msg, .entry-desc {
  text-wrap: pretty;
}

/* ============ 3. 选中文字的颜色 ============ */
::selection { background: rgba(91, 141, 239, .24); color: inherit; }
::-moz-selection { background: rgba(91, 141, 239, .24); color: inherit; }

/* ============ 4. 统一的焦点态（键盘导航要看得到） ============ */
/* 用 :focus-visible 而不是 :focus —— 鼠标点击不该出现焦点圈 */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
[tabindex]:focus-visible,
[role='button']:focus-visible {
  outline: 2px solid var(--accent, #5b8def);
  outline-offset: 2px;
  border-radius: var(--lwp-r-xs);
}
/* 鼠标点击时去掉那圈 */
:focus:not(:focus-visible) { outline: none; }

/* ============ 5. 全站自定义滚动条 ============ */
* { scrollbar-width: thin; scrollbar-color: rgba(140, 127, 107, .38) transparent; }
*::-webkit-scrollbar { width: 9px; height: 9px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: rgba(140, 127, 107, .34);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
*::-webkit-scrollbar-thumb:hover { background: rgba(140, 127, 107, .55); background-clip: content-box; }
*::-webkit-scrollbar-corner { background: transparent; }
html[data-theme='dark'] *::-webkit-scrollbar-thumb { background: rgba(197, 186, 167, .3); background-clip: content-box; }

/* ============ 6. 卡片悬浮抬升 ============ */
/* 只对桌面加：触屏没有 hover，加了反而在点按时闪一下 */
@media (hover: hover) and (pointer: fine) {
  .card, .entry, .in-card, .tw-item, .li-tag, .mp-row, .mod-row {
    transition: transform var(--lwp-dur-2) var(--lwp-ease),
                box-shadow var(--lwp-dur-2) var(--lwp-ease),
                border-color var(--lwp-dur-2) var(--lwp-ease);
  }
  .card:hover, .entry:hover, .in-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--lwp-sh-3);
    border-color: var(--border-input);
  }
  .tw-item:hover, .mp-row:hover, .mod-row:hover {
    transform: translateX(2px);
    box-shadow: var(--lwp-sh-2);
  }
}

/* ============ 7. 圆角统一 ============ */
.card, .in-card, .entry, .mp-row, .mod-row { border-radius: var(--lwp-r); }
.mine-item, .tw-item, .gallery-item, .bg-item { border-radius: var(--lwp-r-sm); }
img, canvas { border-radius: inherit; }

/* ============ 8. 画布与缩略图的质感 ============ */
canvas { image-rendering: pixelated; image-rendering: crisp-edges; }
/* 像素画放大后边缘干净，加一层极淡的内描边让它和背景分得开 */
canvas[data-thumb], .mine-item canvas, .gallery-item canvas, .bg-item canvas, .mp-row canvas {
  box-shadow: inset 0 0 0 1px rgba(60, 48, 36, .07);
}

/* ============ 9. 渐变色标题 ============ */
.page > h1, .mp-head h1, .u-name, .fn-box h2 {
  background: linear-gradient(100deg,
    var(--text, #3b342c) 0%,
    var(--text, #3b342c) 42%,
    var(--accent, #5b8def) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--text);
}
/* 深色下换成更亮的渐变，不然尾部会糊 */
html[data-theme='dark'] .page > h1,
html[data-theme='dark'] .mp-head h1,
html[data-theme='dark'] .u-name,
html[data-theme='dark'] .fn-box h2 {
  background: linear-gradient(100deg, #f1ead9 0%, #f1ead9 40%, #96b9ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ============ 10. 像素风装饰 ============ */
/* 区块分隔用棋盘格，比一条灰线有味道 */
.lwp-dither {
  height: 4px;
  margin: 14px 0;
  background-image:
    linear-gradient(45deg, var(--border) 25%, transparent 25%, transparent 75%, var(--border) 75%),
    linear-gradient(45deg, var(--border) 25%, transparent 25%, transparent 75%, var(--border) 75%);
  background-size: 8px 8px;
  background-position: 0 0, 4px 4px;
  opacity: .7;
}
/* 卡片左上角两个像素小方块，呼应像素画主题 */
.lwp-corner { position: relative; }
.lwp-corner::before,
.lwp-corner::after {
  content: '';
  position: absolute;
  width: 4px; height: 4px;
  background: var(--accent, #5b8def);
  opacity: .5;
  border-radius: 1px;
}
.lwp-corner::before { left: 8px; top: 8px; }
.lwp-corner::after { left: 15px; top: 8px; opacity: .28; }

/* ============ 11. 玻璃拟态（浮层用） ============ */
.lwp-glass {
  background: color-mix(in srgb, var(--surface, #fff) 82%, transparent);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  backdrop-filter: blur(14px) saturate(150%);
}

/* ============ 12. 返回顶部 ============ */
#lwpTop {
  position: fixed;
  right: 16px;
  bottom: 92px;
  z-index: 110;
  width: 42px; height: 42px;
  border: 0;
  border-radius: 50%;
  background: var(--surface, #fff);
  color: var(--text-muted, #6b5f50);
  box-shadow: var(--lwp-sh-3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  opacity: 0;
  transform: translateY(14px) scale(.9);
  pointer-events: none;
  transition: opacity var(--lwp-dur-2) var(--lwp-ease),
              transform var(--lwp-dur-3) var(--lwp-ease-back);
}
#lwpTop.on {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
#lwpTop:active { transform: scale(.92); }

/* ============ 13. 顶部滚动进度条 ============ */
#lwpProg {
  position: fixed;
  top: 0; left: 0;
  height: 2.5px;
  width: 0;
  z-index: 9999;
  background: linear-gradient(90deg, var(--accent, #5b8def), #96b9ff);
  border-radius: 0 2px 2px 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--lwp-dur-2);
}
#lwpProg.on { opacity: 1; }

/* ============ 14. 骨架屏（自动替换「加载中…」） ============ */
.lwp-skel-wrap { display: flex; flex-direction: column; gap: 10px; padding: 8px 0; }
.lwp-skel-row {
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(90deg,
    rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
.lwp-skel-row.w40 { width: 40% }
.lwp-skel-row.w60 { width: 60% }
.lwp-skel-row.w80 { width: 80% }
.lwp-skel-card { height: 72px; border-radius: var(--lwp-r-sm) }
html[data-theme='dark'] .lwp-skel-row,
html[data-theme='dark'] .lwp-skel-card {
  background: linear-gradient(90deg,
    rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}
@keyframes lwp-shimmer {
  0%   { background-position: -340px 0 }
  100% { background-position: 340px 0 }
}

/* ============ 14b. 加载时预留空间（防布局跳动） ============
   组件「先空后填」时页面会往下跳，读起来很难受。
   解决办法不是加动画，而是**按真实内容的高度把位置先占住** ——
   加载完成后内容填进同样大小的框里，位置一点不动。

   高度按各类内容的真实尺寸给的，不是瞎写的：
     作品卡  约 190px（图 1:1 + 标题 + 作者行）
     精选卡  约 96px
     数据格  约 74px
     评论条  约 58px
     邮件行  约 72px
     家具格  约 84px  */
.lwp-hold { min-height: 12px; }

/* 作品网格：占两行卡位。加载完填进去正好，不会把下面的内容顶走 */
#gallery.lwp-hold,
.mine-grid.lwp-hold,
.u-grid.lwp-hold,
.tw-grid.lwp-hold,
.bag-grid.lwp-hold { min-height: 400px; }
/* 精选那一排（横滑） */
#featuredRow.lwp-hold,
.featured-row.lwp-hold { min-height: 96px; }

/* 统计格：2×2 */
#statGrid.lwp-hold { min-height: 150px; }

/* 评论列表 */
#cmtList.lwp-hold, .cmt-list.lwp-hold { min-height: 180px; }

/* 聊天消息区（本身是 flex 撑满，不用管，但首屏那条占位要有高度） */
#chMsgs.lwp-hold { min-height: 200px; }

/* 邮件 / 通知列表：占三行 */
#mailList.lwp-hold, .adm-mail-list.lwp-hold, #banList.lwp-hold,
.mod-list.lwp-hold, .tk-list.lwp-hold, .u-ach-list.lwp-hold {
  min-height: 220px;
}

/* 小镇地图（已经有 max-height，这里给 min 免得加载时是 0 高） */
#twBody.lwp-hold { min-height: 340px; }

/* 成就 / 背包 / 图鉴这类格子墙 */
#achBody.lwp-hold, #bgBody.lwp-hold { min-height: 320px; }

/* ============ 14c. 按内容类型配骨架形状 ============
   骨架不该千篇一律都是三条灰杠 —— 形状和真实内容对不上，
   填进去的时候还是会觉得「跳了一下」。
   给几种预设，用 data-skel 指定。 */
.lwp-sk { display: flex; flex-direction: column; gap: 10px; }
.lwp-sk-row {
  height: 14px; border-radius: 7px;
  background: linear-gradient(90deg, rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
html[data-theme='dark'] .lwp-sk-row {
  background: linear-gradient(90deg, rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}

/* 卡片网格：两列，每张卡都是「方形图 + 两行字」 */
.lwp-sk-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.lwp-sk-card { display: flex; flex-direction: column; gap: 7px; }
.lwp-sk-card .pic {
  aspect-ratio: 1;
  border-radius: var(--lwp-r-sm, 9px);
  background: linear-gradient(90deg, rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
html[data-theme='dark'] .lwp-sk-card .pic {
  background: linear-gradient(90deg, rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}
.lwp-sk-card .t1 { height: 13px; width: 78%; border-radius: 6px }
.lwp-sk-card .t2 { height: 11px; width: 46%; border-radius: 6px }

/* 列表行：左边一个方块（头像/缩略图）+ 右边两行字 */
.lwp-sk-rows { display: flex; flex-direction: column; gap: 10px; }
.lwp-sk-rowitem { display: flex; align-items: center; gap: 10px; }
.lwp-sk-rowitem .av {
  width: 42px; height: 42px; flex: none;
  border-radius: var(--lwp-r-sm, 9px);
  background: linear-gradient(90deg, rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
html[data-theme='dark'] .lwp-sk-rowitem .av {
  background: linear-gradient(90deg, rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}
.lwp-sk-rowitem .ln { flex: 1; display: flex; flex-direction: column; gap: 7px }
.lwp-sk-rowitem .ln i {
  display: block; height: 12px; border-radius: 6px;
  background: linear-gradient(90deg, rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
html[data-theme='dark'] .lwp-sk-rowitem .ln i {
  background: linear-gradient(90deg, rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}
.lwp-sk-rowitem .ln i:first-child { width: 62% }
.lwp-sk-rowitem .ln i:last-child { width: 38% }

/* 数据格 2×2 */
.lwp-sk-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.lwp-sk-stat {
  height: 74px; border-radius: var(--lwp-r, 13px);
  background: linear-gradient(90deg, rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
html[data-theme='dark'] .lwp-sk-stat {
  background: linear-gradient(90deg, rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}

/* 精选横滑：五张窄卡 */
.lwp-sk-feat { display: flex; gap: 8px; overflow: hidden }
.lwp-sk-feat div {
  width: 72px; height: 88px; flex: none;
  border-radius: var(--lwp-r-sm, 9px);
  background: linear-gradient(90deg, rgba(60,48,36,.06) 25%, rgba(60,48,36,.12) 37%, rgba(60,48,36,.06) 63%);
  background-size: 340px 100%;
  animation: lwp-shimmer 1.3s linear infinite;
}
html[data-theme='dark'] .lwp-sk-feat div {
  background: linear-gradient(90deg, rgba(255,255,255,.07) 25%, rgba(255,255,255,.15) 37%, rgba(255,255,255,.07) 63%);
  background-size: 340px 100%;
}

@media (prefers-reduced-motion: reduce) {
  .lwp-sk-row, .lwp-sk-card .pic, .lwp-sk-rowitem .av,
  .lwp-sk-rowitem .ln i, .lwp-sk-stat, .lwp-sk-feat div { animation: none }
}

/* ============ 15. 像素风空状态 ============ */
.lwp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 34px 20px 30px;
  text-align: center;
}
.lwp-empty svg {
  width: 68px; height: 68px;
  opacity: .85;
  animation: lwp-bob 3s ease-in-out infinite;
}
@keyframes lwp-bob {
  0%, 100% { transform: translateY(0) }
  50%      { transform: translateY(-6px) }
}
.lwp-empty-t {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted, #6b5f50);
}
.lwp-empty-d {
  font-size: 12.5px;
  color: var(--text-faint, #b0a697);
  line-height: 1.7;
  max-width: 260px;
}
.lwp-empty a, .lwp-empty button {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent, #5b8def);
  background: none;
  border: 0;
  cursor: pointer;
  text-decoration: none;
}

/* ============ 16. 悬浮提示 ============ */
#lwpTip {
  position: fixed;
  z-index: 99997;
  max-width: 250px;
  padding: 7px 11px;
  border-radius: var(--lwp-r-sm);
  background: var(--toast-bg, #3b342c);
  color: #f5f0e6;
  font-size: 12px;
  line-height: 1.55;
  pointer-events: none;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--lwp-dur-1), transform var(--lwp-dur-1);
  box-shadow: var(--lwp-sh-3);
  text-align: center;
}
#lwpTip.on { opacity: 1; transform: none; }

/* ============ 17. 表单校验反馈 ============ */
input.lwp-bad, textarea.lwp-bad {
  border-color: #e5574b !important;
  background: rgba(229, 87, 75, .05);
  animation: lwp-nudge .42s cubic-bezier(.36,.07,.19,.97);
}
@keyframes lwp-nudge {
  0%, 100% { transform: translateX(0) }
  20% { transform: translateX(-6px) }
  40% { transform: translateX(5px) }
  60% { transform: translateX(-3px) }
  80% { transform: translateX(2px) }
}
input.lwp-good, textarea.lwp-good { border-color: #4caf7d !important; }

/* ============ 18. 密码强度条 ============ */
.lwp-pw {
  height: 3px;
  border-radius: 2px;
  margin-top: 6px;
  background: var(--border, #efe7da);
  overflow: hidden;
}
.lwp-pw i {
  display: block;
  height: 100%;
  width: 0;
  border-radius: 2px;
  transition: width var(--lwp-dur-3) var(--lwp-ease), background var(--lwp-dur-3);
}

/* ============ 19. 加载失败的重试 ============ */
.lwp-retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 16px;
  border: 1px solid var(--border-input, #e0d8d0);
  border-radius: 999px;
  background: var(--surface, #fff);
  color: var(--text-muted, #6b5f50);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.lwp-retry:active { transform: scale(.96) }

/* ============ 20. 图片淡入 ============ */
img.lwp-fadein { opacity: 0; transition: opacity var(--lwp-dur-3) ease-out }
img.lwp-fadein.lwp-on { opacity: 1 }

/* ============ 21. 长按进度环 ============ */
.lwp-hold {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: conic-gradient(var(--accent, #5b8def) var(--p, 0turn), transparent 0);
  opacity: .28;
  transition: opacity var(--lwp-dur-1);
}

/* ============ 22. 页脚 ============ */
.copyright {
  margin-top: 26px !important;
  padding-top: 14px;
  border-top: 1px dashed var(--border, #efe7da);
  letter-spacing: .4px;
}
/* 支持一下 Safari 的旧写法 */
@supports not (background: color-mix(in srgb, red 50%, transparent)) {
  .lwp-glass { background: var(--surface, #fff) }
}

@media (prefers-reduced-motion: reduce) {
  .lwp-skel-row, .lwp-skel-card, .lwp-empty svg { animation: none !important }
  #lwpTop { transition: opacity .01s }
  * { scroll-behavior: auto !important }
}
`

export { CSS as polishStyles }
