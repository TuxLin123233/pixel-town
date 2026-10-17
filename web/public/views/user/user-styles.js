/**
 * 画师主页的 CSS —— 和「我的」页同一套 IG 版式
 *
 * 顶栏 → 78px 圆头像 + 三项数据 → 粗体名字 + 两行简介
 * → 等宽描边按钮 → 作品 / 收藏 标签 → 通栏 3 列作品墙
 *
 * 设计原则和全站一致：透明底、1px 分隔线、单一强调色 var(--accent)，
 * 图标一律 currentColor；不画卡片、不叠阴影。
 */

export const userStyles = `
      /* ============ 页面骨架 ============ */
      .u-wrap {
        width: 100%;
        max-width: 460px;
        margin: 0 auto;
        padding: 0 0 calc(10px + env(safe-area-inset-bottom, 0px));
        color: var(--text);
        background: transparent;
      }
      .u-wrap [hidden] { display: none !important; }

      .u-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }

      /* ============ 1. 顶栏 ============ */
      .ig-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 2px 0 6px;
      }
      .ig-user {
        margin: 0;
        min-width: 0;
        max-width: 68%;
        font-size: 22px;
        font-weight: 800;
        line-height: 1.25;
        letter-spacing: .01em;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ig-user.guest { color: var(--text-muted); }

      .ig-top-actions {
        flex: none;
        display: flex;
        align-items: center;
        gap: 18px;
      }
      .ig-ico-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--text);
        font-family: inherit;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      .ig-ico-btn svg { width: 22px; height: 22px; display: block; }
      .ig-ico-btn:active { opacity: .65; }
      .ig-ico-btn[disabled] { opacity: .55; cursor: default; }
      .ig-ico-btn.busy svg { animation: u-spin .8s linear infinite; }
      @keyframes u-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        .ig-ico-btn.busy svg { animation: none; }
      }

      /* ============ 2. 头像 + 三项数据 ============ */
      .ig-hero {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 0 14px;
      }
      .me-av {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 78px;
        height: 78px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text-faint);
        font-size: 26px;
        font-weight: 800;
      }
      .me-av canvas {
        display: block;
        width: 100% !important;
        height: 100% !important;
        image-rendering: pixelated;
        border-radius: 50%;
      }

      .ig-stats {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ig-stat {
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .ig-stat .stat-num {
        font-size: 22px;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -.01em;
        color: var(--text);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .ig-stat .stat-lab {
        margin-top: 4px;
        font-size: 11px;
        line-height: 1.2;
        color: var(--text-muted);
        white-space: nowrap;
      }

      /* ============ 3. 简介 ============ */
      .ig-bio { padding: 2px 0 14px; }
      .u-bio-name {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.4;
        color: var(--text);
      }
      .u-bio-name > span:first-child {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .mod-badge {
        flex: none;
        padding: 1px 6px;
        border: 1px solid var(--accent);
        border-radius: 999px;
        font-size: 10px;
        font-weight: 700;
        line-height: 1.5;
        color: var(--accent);
        white-space: nowrap;
      }

      .u-bio {
        margin-top: 5px;
        font-size: 12.5px;
        line-height: 1.65;
        color: var(--text-muted);
        white-space: pre-wrap;
        word-break: break-word;
        /* 「两行简介」：多了就收起来，别把版面推长 */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .u-bio.empty { color: var(--text-faint); }

      .u-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 5px;
        font-size: 11px;
        line-height: 1.7;
        color: var(--text-faint);
      }
      .u-meta > span {
        display: inline-flex;
        align-items: center;
        min-width: 0;
      }
      .u-meta > span + span::before {
        content: '·';
        margin: 0 7px;
        color: var(--text-faint);
      }
      .u-meta .u-friend-tip {
        color: var(--accent);
        font-weight: 700;
      }

      /* ============ 4. 两三个等宽描边按钮 ============ */
      .ig-actions {
        display: flex;
        gap: 10px;
        padding: 0 0 12px;
      }
      .ig-actions > .u-act {
        flex: 1 1 0;
        min-width: 0;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: transparent;
        color: var(--text);
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      .ig-actions > .u-act:active { opacity: .75; }
      .ig-actions > .u-act[disabled] { opacity: .55; cursor: default; }
      #uGiveBtn {
        border-color: var(--accent);
        color: var(--accent);
      }
      #uGiveBtn.done {
        border-color: var(--border);
        color: var(--text-faint);
      }
      #uFollowBtn.on {
        border-color: var(--border);
        color: var(--text-muted);
      }

      /* ============ 5. 标签页 ============ */
      .ig-works { display: block; }
      .ig-tabs {
        display: flex;
        margin: 0 -16px;
        border-top: 1px solid var(--border);
      }
      .ig-tab {
        flex: 1 1 0;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0;
        border: 0;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--text-faint);
        font-family: inherit;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      .ig-tab svg { width: 22px; height: 22px; display: block; }
      .ig-tab.on {
        color: var(--text);
        border-bottom-color: var(--text);
      }
      .ig-tab:active { opacity: .65; }

      /* ============ 6. 作品墙：3 列方格，通栏，无文字 ============ */
      .u-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
        width: calc(100% + 32px);
        margin: 0 -16px;
      }
      .u-grid[hidden] { display: none !important; }
      .u-work {
        position: relative;
        display: block;
        aspect-ratio: 1 / 1;
        min-width: 0;
        overflow: hidden;
        background: var(--art-bg);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;
      }
      .u-work.u-hidden { display: none; }
      .u-work img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        image-rendering: pixelated;
        border-radius: 0;
      }
      /* 每幅画上原本的「送光尘」小按钮：IG 版式里方格上不写字，
         按钮留在 DOM 里（id / class / 事件都不动），只是不参与版面。 */
      .u-work .u-give { display: none; }

      .u-empty {
        padding: 22px 0 24px;
        font-size: 12px;
        line-height: 1.8;
        text-align: center;
        color: var(--text-faint);
      }
      .u-empty:empty { display: none; padding: 0; }
      .u-empty[hidden] { display: none !important; }
      .u-empty .lw-load { vertical-align: -3px; }

      .u-more {
        display: block;
        width: 100%;
        margin: 10px 0 0;
        padding: 11px;
        border: 0;
        background: transparent;
        color: var(--accent);
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 700;
        text-align: center;
        cursor: pointer;
      }
      .u-more:active { opacity: .7; }
      .u-more[hidden] { display: none !important; }

      /* ============ 提示条：浮在导航上方，不占版面 ============ */
      .u-msg {
        position: fixed;
        left: 50%;
        bottom: calc(96px + env(safe-area-inset-bottom, 0px));
        z-index: 90;
        max-width: min(360px, calc(100% - 48px));
        transform: translateX(-50%);
        padding: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.6;
        text-align: center;
        pointer-events: none;
      }
      .u-msg.bad { color: var(--like, #c0392b); }
      .u-msg[hidden] { display: none !important; }

      /* ============ 深色模式 ============ */
      [data-mood="dark"] .me-av { background: var(--surface-2); }
      [data-mood="dark"] .u-work { background: var(--surface-2); }
    `
