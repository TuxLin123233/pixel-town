/**
 * Mine 视图的CSS 样式
 *
 * 由 views/mine.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/mine.js 顶部。
 */

export const mineStyles = `
      .mine-wrap { width: 100%; max-width: 460px; }

      .m-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 14px;
      }
      .m-card-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 12px;
      }
      .m-card-title .m-tip {
        margin-left: auto;
        font-size: 11px;
        font-weight: 500;
        color: var(--text-faint);
      }

      /* ---------- 签到 ---------- */
      .dust-got {
        margin-left: auto;
        font-size: 11px;
        color: var(--text-faint);
        flex: none;
      }
      .dust-bar {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 13px;
        padding: 10px 13px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--accent) 10%, var(--surface-2));
        border: 1px solid color-mix(in srgb, var(--accent) 32%, transparent);
      }
      .dust-ico { font-size: 15px; }
      .dust-label { font-size: 13px; color: var(--text-muted); }
      .dust-num {
        margin-left: auto;
        font-size: 20px;
        font-weight: 800;
        color: var(--accent);
        font-variant-numeric: tabular-nums;
      }
      .dust-num small { font-size: 11px; font-weight: 600; color: var(--text-muted); margin-left: 3px; }

      .sign-top {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .sign-streak { display: flex; flex-direction: column; gap: 2px; }
      .sign-num {
        font-size: 30px;
        font-weight: 800;
        line-height: 1.1;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }
      .sign-num small { font-size: 13px; font-weight: 600; color: var(--text-muted); }
      .sign-sub { font-size: 11px; color: var(--text-faint); }
      .sign-btn {
        margin-left: auto;
        flex-shrink: 0;
        padding: 11px 20px;
        border-radius: 999px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.12s ease;
      }
      .sign-btn:active { transform: scale(0.94); }
      .sign-btn.done {
        background: var(--surface-2);
        color: var(--text-faint);
        cursor: default;
      }

      .sign-week {
        display: flex;
        justify-content: space-between;
        gap: 4px;
        margin-top: 14px;
      }
      .sign-day {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .sign-dot {
        width: 100%;
        aspect-ratio: 1;
        max-width: 34px;
        border-radius: 10px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: var(--text-faint);
      }
      .sign-dot.on {
        background: color-mix(in srgb, var(--accent) 22%, var(--surface));
        border-color: var(--accent);
        color: var(--accent);
      }
      .sign-dot.today { box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 45%, transparent); }
      .sign-lab { font-size: 10px; color: var(--text-faint); }

      .medals {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 13px;
        padding-top: 13px;
        border-top: 1px solid var(--border);
      }
      .medal {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 11px;
        border-radius: 999px;
        font-size: 12px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        color: var(--text-faint);
      }
      .medal.got {
        background: color-mix(in srgb, var(--accent) 16%, var(--surface));
        border-color: var(--accent);
        color: var(--accent);
        font-weight: 600;
      }

      /* ---------- 创作数据 ---------- */
      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
        gap: 9px;
      }
      .stat {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 13px;
        padding: 12px 10px;
        text-align: center;
      }
      .stat-num {
        font-size: 20px;
        font-weight: 800;
        color: var(--text);
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
      }
      .stat-num small { font-size: 11px; font-weight: 600; color: var(--text-muted); }
      .stat-lab { font-size: 11px; color: var(--text-muted); margin-top: 3px; }

      .size-bars { margin-top: 13px; }
      .size-bar {
        display: flex;
        align-items: center;
        gap: 9px;
        margin-bottom: 7px;
        font-size: 12px;
        color: var(--text-muted);
      }
      .size-bar .sb-lab { width: 46px; flex-shrink: 0; }
      /* span 默认是 inline，不加 display:block 的话高度/宽度都不生效，进度条会看不见 */
      .size-bar .sb-track {
        display: block;
        flex: 1;
        height: 8px;
        border-radius: 999px;
        background: var(--surface-3);
        overflow: hidden;
      }
      .size-bar .sb-fill {
        display: block;
        height: 100%;
        min-width: 0;
        border-radius: 999px;
        background: var(--accent);
        transition: width 0.3s ease;
      }
      .size-bar .sb-num { width: 26px; text-align: right; flex-shrink: 0; color: var(--text-faint); }

      .best-work {
        margin-top: 13px;
        padding-top: 13px;
        border-top: 1px solid var(--border);
        font-size: 12px;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .best-work b { color: var(--text); }

      /* ---------- 我的作品 ---------- */
      .mine-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
        gap: 10px;
      }
      /* 「⋯」按钮（绝对定位，贴卡片右上角）。
       原来这里是靠长按弹菜单，滑动时手指一停就误触，所以改成显式按钮。
       定位上下文用 .mine-item 自带的 position: relative，不用重复声明。 */
    .mine-more {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 26px;
      height: 26px;
      border: 0;
      border-radius: 50%;
      background: rgba(60, 48, 36, .55);
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0 6px;
      z-index: 2;
      -webkit-tap-highlight-color: transparent;
    }
    .mine-more:active { background: rgba(60, 48, 36, .8); }

    .mine-item {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        position: relative; /* 「⋯」按钮要贴着卡片右上角 */
      }
      /* 缩略图。LWThumb 会按整数倍缩放并水平居中，
         这里不写死 width:100% —— 那样会把整数倍缩放的好处（不切出白条纹）毁掉，
         宽高由 LWThumb 写内联，margin:auto 保证居中。 */
      .mine-item canvas {
        display: block;
        margin: 0 auto;
        image-rendering: pixelated;
        background: var(--art-bg);
        max-width: 100%;
      }
      /* 作品卡片标题。
         之前是 white-space:nowrap + overflow:hidden：文字比卡片宽时
         text-align:center 会从两边同时裁掉，看上去就是「贴着左边」，
         其实并没居中。改成最多两行 + 省略号，长短都能真正居中。 */
      /* 作品卡片标题：竖排两段 —— 标题最多两行，光尘徽标单独一行。
         之前徽标跟在标题后面，长标题被两行截断时正好把徽标切一半。 */
      .mine-cap {
        padding: 6px 7px;
        font-size: 11px;
        line-height: 1.45;
        color: var(--text-muted);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        min-height: 34px;
      }
      .mc-title {
        max-width: 100%;
        overflow: hidden;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      /* 收到的光尘单独一个徽标，粘在标题后面会让整行的重心看着偏 */
      .mc-dust {
        flex: none;
        padding: 0 6px;
        border-radius: 999px;
        background: var(--surface);
        border: 1px solid var(--border-input);
        color: var(--text-faint);
        font-size: 10px;
        font-weight: 700;
        line-height: 16px;
        white-space: nowrap;
      }

      .m-empty {
        text-align: center;
        font-size: 13px;
        color: var(--text-faint);
        padding: 20px 10px;
        line-height: 1.9;
      }
      .m-empty a { color: var(--accent); }

      .back-bar {
        display: inline-flex;
        align-items: center;
        align-self: flex-start;
        margin-bottom: 12px;
        padding: 8px 15px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 13px;
        text-decoration: none;
      }
      /* 入口从 7 个挤成一行会溢出（作品/送出/信箱/排行榜/每日任务/成就），
         手机宽度下每个只剩 40px 出头，文字被压得换行。
         改成 4 列 × 2 行的网格，格子宽度固定，正好两行，不再溢出。 */
      .m-links {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      button.m-link { font-family: inherit; cursor: pointer; }

      /* 屏蔽手机上的长按菜单/选中/拖放：
         不加这些，按住画布超过半秒浏览器会启动自己的长按行为，
         我们的作品菜单就抢不到了（它的系统菜单是浏览器级弹层，
         弹出来会盖在我们的菜单上面）。 */
      .mine-item {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .mine-item canvas, .mine-item .mine-cap { -webkit-touch-callout: none; user-select: none; }
      .mine-del-tip {
        font-size: 11px; color: var(--text-faint);
        margin: -2px 0 8px;
      }
      .mine-filter {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }
      .mf-label { font-size: 12px; color: var(--text-faint); flex-shrink: 0; }
      .mf-chips { display: flex; flex-wrap: wrap; gap: 7px; }
      .mf-chip {
        padding: 5px 12px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 12px;
        cursor: pointer;
      }
      .mf-chip.on {
        border-color: var(--accent);
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, var(--surface));
        font-weight: 600;
      }
      /* 件数徽标：跟尺寸文字用不同字重和底色，避免和「16」混在一起看 */
      .mf-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: inherit;
      }
      .mf-lab { font-weight: 600; }
      .mf-n {
        min-width: 20px;
        padding: 1px 6px;
        border-radius: 999px;
        background: var(--surface);
        border: 1px solid var(--border-input);
        color: var(--text-faint);
        font-size: 11px;
        font-weight: 700;
        line-height: 1.5;
        text-align: center;
      }
      .mf-chip.on .mf-n {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }
      .mine-load {
        width: 100%;
        margin-top: 12px;
        padding: 11px;
        border-radius: 12px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }
      .m-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 13px 6px;
        min-width: 0;
        border-radius: 13px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        text-decoration: none;
        color: var(--text);
        font-size: 12px;
      }
      .m-link .ml-ico { font-size: 18px; }
      .m-link .ml-num { font-size: 14px; font-weight: 800; color: var(--accent); line-height: 1.3; }
      /* 4 列时格子更窄，字号跟着收一档，避免「每日任务」这类四字标签换行 */
      .m-link span:not(.ml-ico):not(.ml-num) { font-size: 11px; white-space: nowrap; }

      .cloudhu-btn {
        display: block;
        text-align: center;
        margin: 14px 0 4px;
        padding: 12px 16px;
        border-radius: 14px;
        background: var(--accent);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        border: 1px solid transparent;
        box-shadow: 0 4px 14px var(--shadow1);
      }
      .cloudhu-btn:active { opacity: 0.85; transform: scale(0.98); }

      .portal-btn {
        display: block;
        text-align: center;
        margin: 8px 0 4px;
        padding: 12px 16px;
        border-radius: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        border: 1px solid transparent;
        box-shadow: 0 4px 14px var(--shadow1);
      }
      .portal-btn:active { opacity: 0.85; transform: scale(0.98); }

      /* 头部：头像 + 用户名，整体水平居中 */
      .me-hero {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 6px 0 16px;
      }
      .me-av {
        position: relative;
        flex: none;
        display: block;
        width: 72px;
        height: 72px;
        text-decoration: none;
      }
      .me-av canvas {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 20px;
        border: 2px solid var(--border);
        image-rendering: pixelated;
        background: var(--surface-2);
        box-shadow: 0 3px 12px var(--shadow2, rgba(0, 0, 0, 0.08));
      }
      .me-av-edit {
        position: absolute;
        right: -5px;
        bottom: -5px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--accent, #5b8def);
        font-size: 12px;
        line-height: 24px;
        text-align: center;
        border: 2.5px solid var(--surface);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
      }
      .me-hero-txt {
        min-width: 0;
        text-align: left;
      }
      .me-hero-name {
        font-size: 20px;
        font-weight: 800;
        color: var(--text);
        line-height: 1.3;
        margin: 0;
        max-width: 46vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .me-hero-name.guest { color: var(--text-muted2); font-weight: 700; }
      .me-hero-sub {
        font-size: 12px;
        color: var(--text-faint);
        line-height: 1.5;
        margin-top: 3px;
      }
      .me-hero-bio {
        font-size: 12.5px;
        color: var(--text-muted);
        line-height: 1.55;
        margin-top: 4px;
        max-width: 46vw;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-decoration: underline dotted;
        text-underline-offset: 3px;
      }
      .me-hero-bio.empty { color: var(--text-faint); }

      /* 邀请好友卡片：沿用全站米白 + 蓝的语言，不做跳色渐变 */
      .invite-rules {
        background: var(--surface-2);
        border-radius: 10px;
        padding: 10px 13px;
        font-size: 12.5px;
        color: var(--text-muted);
        line-height: 1.7;
        margin-bottom: 14px;
      }
      .invite-rules b { color: var(--accent); font-weight: 800; }
      .invite-code-label {
        font-size: 11px;
        color: var(--text-faint);
        letter-spacing: 1.5px;
        text-align: center;
        margin-bottom: 7px;
      }
      .invite-code {
        display: block;
        background: var(--surface-2);
        border: 1.5px dashed var(--border-strong);
        border-radius: 12px;
        padding: 15px 8px;
        text-align: center;
        font-size: 27px;
        font-weight: 800;
        letter-spacing: 6px;
        color: var(--accent);
        font-variant-numeric: tabular-nums;
        user-select: all;
      }
      .invite-copy {
        width: 100%;
        margin-top: 10px;
        height: 44px;
        border-radius: 999px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.12s ease;
      }
      .invite-copy:active { transform: scale(0.97); }
      /* 战绩：三格小数据，和创作账本同一套观感 */
      .invite-stat {
        display: flex;
        margin-top: 14px;
        background: var(--surface-2);
        border-radius: 10px;
        padding: 11px 0;
      }
      .invite-stat .is-cell { flex: 1; text-align: center; position: relative; }
      .invite-stat .is-cell + .is-cell::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 22px;
        background: var(--border-strong);
      }
      .invite-stat .is-num { font-size: 17px; font-weight: 800; color: var(--text); line-height: 1.2; }
      .invite-stat .is-lab { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
      .invite-bind {
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px dashed var(--border-strong, rgba(128,128,128,0.3));
      }
      .invite-bind-tip { font-size: 12px; color: var(--text-muted); margin-bottom: 9px; line-height: 1.6; }
      .invite-bind-row { display: flex; gap: 8px; }
      .invite-bind-input {
        flex: 1;
        min-width: 0;
        height: 42px;
        padding: 0 13px;
        border-radius: 999px;
        border: 1px solid var(--border-strong, rgba(128,128,128,0.35));
        background: var(--surface-2);
        color: var(--text);
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .invite-bind-btn {
        flex: none;
        padding: 0 20px;
        height: 42px;
        border-radius: 999px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      .invite-bind-btn:active { transform: scale(0.96); }
      .invite-bind-btn:disabled { opacity: 0.5; }
  `
