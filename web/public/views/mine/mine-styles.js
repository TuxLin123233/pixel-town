/**
 * Mine 视图的 CSS 样式 —— 个人主页风格（信息前置）
 *
 * 结构（自上而下）：
 *   头像 + 四项数据 → 名字/简介 → 签到一行 → 入口高光圆 → 作品 3 列网格
 *
 * 设计原则和全站一致：透明底、1px 分隔线、单一强调色、图标走 currentColor。
 */

export const mineStyles = `
      /* ============ 页面骨架 ============ */
      .mine-wrap {
        width: 100%;
        max-width: 460px;
        padding: 0 16px 8px;
      }

      /* ============ 1. 头部：头像 + 四项数据 ============ */
      .me-hero {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 14px 18px;
        padding: 16px 0 12px;
      }
      .me-av {
        order: 1;
        flex: none;
        display: block;
        width: 78px;
        height: 78px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid var(--border);
        background: var(--surface);
        text-decoration: none;
      }
      .me-av canvas {
        display: block;
        width: 100% !important;
        height: 100% !important;
        image-rendering: pixelated;
        border-radius: 50%;
      }
      .me-av-edit { display: none; }

      .me-hero .stat-grid {
        order: 2;
        flex: 1;
        min-width: 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        text-align: center;
      }
      .me-hero .stat { padding: 0; }
      .me-hero .stat-num {
        font-size: 18px;
        font-weight: 800;
        line-height: 1.2;
        color: var(--text);
      }
      .me-hero .stat-lab {
        margin-top: 2px;
        font-size: 10.5px;
        color: var(--text-muted);
      }

      .me-hero-txt {
        order: 3;
        flex: 0 0 100%;
      }
      .me-hero-name {
        font-size: 14px;
        font-weight: 800;
        line-height: 1.3;
      }
      .me-hero-bio {
        margin-top: 3px;
        font-size: 12px;
        line-height: 1.6;
        color: var(--text-muted);
      }

      /* 空简介不再让打磨层塞一张大插图进去 */
      .me-hero-bio > * { display: none !important; }
      .me-hero-bio { min-height: 0 !important; }
      .me-hero-bio.empty { color: var(--text-faint); }
      .me-hero-sub {
        margin-top: 2px;
        font-size: 11px;
        color: var(--text-faint);
      }

      /* ============ 2. 签到：压成一行 ============ */
      .m-card {
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        padding: 0;
      }
      #signCard {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
      }
      #signCard > .m-card-title { display: none; }
      /* 光尘余额已经在数据行里了，这里不再重复显示 */
      #signCard .dust-bar,
      #signCard #lvBarHost,
      #signCard .sign-week,
      #signCard .medals { display: none; }

      #signCard .sign-top {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
      }
      #signCard .sign-streak {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }
      #signCard .sign-num {
        font-size: 15px;
        font-weight: 800;
        color: var(--text);
      }
      #signCard .sign-num small {
        font-size: 11px;
        font-weight: 500;
        color: var(--text-muted);
      }
      #signCard .sign-sub {
        font-size: 11px;
        color: var(--text-faint);
      }
      #signCard .sign-btn {
        flex: none;
        height: 32px;
        padding: 0 16px;
        border-radius: 6px;
        border: 1px solid var(--accent);
        background: transparent;
        color: var(--accent);
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
      }
      #signCard .sign-btn:active { opacity: .8; }
      #signCard .sign-btn.done {
        border-color: var(--border);
        color: var(--text-faint);
        cursor: default;
      }

      /* ============ 3. 入口：一排高光圆 ============ */
      #linkCard {
        padding: 14px 0;
        border-bottom: 1px solid var(--border);
      }
      #linkCard > .m-card-title { display: none; }
      #linkCard .m-links {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      #linkCard .m-links::-webkit-scrollbar { display: none; }
      #linkCard .m-link {
        flex: none;
        width: 58px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 0;
        border: 0;
        background: transparent;
        text-decoration: none;
        color: var(--text-muted);
      }
      #linkCard .m-link .ml-ico {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: 1px solid var(--border);
        background: var(--surface);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #linkCard .m-link .ml-ico svg {
        width: 21px;
        height: 21px;
        color: var(--text-muted);
      }
      #linkCard .m-link .ml-num { display: none; }
      #linkCard .m-link > span:not(.ml-ico):not(.ml-num) {
        font-size: 10px;
        text-align: center;
        white-space: nowrap;
      }

      /* ============ 4. 作品：3 列方格 ============ */
      #mineCard { padding: 14px 0 0; }
      #mineCard > .m-card-title {
        font-size: 12px;
        font-weight: 700;
        color: var(--text-muted);
        letter-spacing: .02em;
        margin-bottom: 4px;
      }
      #mineCard .m-card-title .m-tip {
        font-size: 10.5px;
        font-weight: 400;
        color: var(--text-faint);
        margin-left: 6px;
      }
      #mineCard .mine-del-tip {
        font-size: 11px;
        color: var(--text-faint);
        margin: 0 0 8px;
      }
      #mineCard .mine-filter {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
        margin: 0 0 10px;
      }
      #mineCard .mf-label { display: none; }
      #mineCard .mf-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
      #mineCard .mf-chip {
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid var(--border);
        background: transparent;
        color: var(--text-muted);
        font-size: 11px;
        cursor: pointer;
      }
      #mineCard .mf-chip.on {
        border-color: var(--accent);
        color: var(--accent);
      }

      #mineCard .mine-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
      }
      #mineCard .mine-item {
        position: relative;
        margin: 0;
        border: 0;
        border-radius: 0;
        background: var(--surface);
        overflow: hidden;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      #mineCard .mine-item canvas,
      #mineCard .mine-item img {
        display: block;
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1;
        object-fit: cover;
        image-rendering: pixelated;
      }
      #mineCard .mine-cap { display: none; }
      #mineCard .mine-empty,
      #mineEmpty { font-size: 12px; color: var(--text-faint); padding: 14px 0; }

      /* 统计卡里的次要东西不再显示（数据行已经挪到头部） */
      #statCard { display: none; }

      /* ============ 5. 底部两个外链：做小、做成文字链 ============ */
      .cloudhu-btn,
      .portal-btn {
        display: block;
        margin: 12px 0 0;
        padding: 10px 0;
        text-align: center;
        font-size: 11.5px;
        font-weight: 500;
        color: var(--text-faint);
        background: transparent;
        border: 0;
        border-top: 1px solid var(--border);
        text-decoration: none;
      }
      .cloudhu-btn + .portal-btn { border-top: 0; padding-top: 0; }

      .back-bar { display: none; }

      /* ============ 深色模式微调 ============ */
      [data-mood="dark"] .me-av,
      [data-mood="dark"] #linkCard .m-link .ml-ico { background: var(--surface-2); }
      [data-mood="dark"] #mineCard .mine-item { background: var(--surface-2); }
    `
