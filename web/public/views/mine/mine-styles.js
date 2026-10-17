/**
 * Mine 视图的 CSS —— Instagram 风格的个人主页
 *
 * 版面：顶栏 → 头像 + 四项数据 → 简介 → 两个描边按钮
 *       → 高光圆横滑 → 作品 / 收藏 / 送出 标签 → 3 列作品墙
 *
 * 设计原则和全站一致：透明底、1px 分隔线、单一强调色 var(--accent)，
 * 图标一律 currentColor；不画卡片、不叠阴影。
 */

export const mineStyles = `
      /* ============ 页面骨架 ============ */
      .mine-wrap {
        width: 100%;
        max-width: 460px;
        margin: 0 auto;
        padding: 0 0 10px;
        color: var(--text);
        background: transparent;
      }
      .mine-wrap [hidden] { display: none !important; }

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
        color: var(--text);
        text-decoration: none;
      }
      .ig-ico-btn svg { width: 22px; height: 22px; display: block; }
      .ig-ico-btn:active { opacity: .65; }

      .ig-dot { display: none; }
      .ig-dot:not(:empty) {
        display: block;
        position: absolute;
        top: -4px;
        right: -6px;
        min-width: 15px;
        height: 15px;
        padding: 0 3px;
        border-radius: 8px;
        background: var(--accent);
        color: #fff;
        font-size: 9px;
        font-weight: 700;
        line-height: 15px;
        text-align: center;
        box-sizing: border-box;
      }

      /* ============ 2. 头像 + 四项数据 ============ */
      .ig-hero {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 0 14px;
      }
      .me-av {
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

      .ig-stats {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      /* 数据行本身不生成盒子，把子项直接让给 .ig-stats 排 */
      #statGrid,
      #signCard { display: contents; }

      .ig-stats .stat {
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      /* 作品数已经是第一项；光尘 / 天数 / 等级由 signCard 展开接在后面 */
      .ig-stats .stat:nth-child(n + 2) { display: none; }

      .ig-stats .stat-num,
      #dustNum,
      #signTotal,
      #lvBarHost .lwdeco-lv-badge {
        font-size: 22px;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -.01em;
        color: var(--text);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .ig-stats .stat-lab {
        margin-top: 4px;
        font-size: 0;
        line-height: 1.2;
        color: var(--text-muted);
      }
      .ig-stats .stat-lab::after {
        content: '作品';
        font-size: 11px;
        font-weight: 400;
        color: var(--text-muted);
      }
      .ig-stats .m-empty {
        flex: 1 1 0;
        font-size: 11px;
        line-height: 1.35;
        text-align: center;
        color: var(--text-faint);
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
      .ig-stat-dust::after,
      .ig-stat-days::after,
      .ig-stat-lv::after {
        margin-top: 4px;
        font-size: 11px;
        line-height: 1.2;
        color: var(--text-muted);
        white-space: nowrap;
      }
      .ig-stat-dust::after { content: '光尘'; }
      .ig-stat-days::after { content: '天数'; }
      .ig-stat-lv::after { content: '等级'; }

      #dustNum small { display: none; }
      #dustGot { display: none !important; }

      /* 等级条只留大数字，标题 / 经验条都不在这个版面上出现 */
      #lvBarHost .lwdeco-lv {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        padding: 0;
        background: none;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }
      #lvBarHost .lwdeco-lv-badge::before { content: 'Lv.'; }
      #lvBarHost .lwdeco-lv-badge {
        width: auto;
        height: auto;
        min-width: 0;
        padding: 0;
        border-radius: 0;
        background: none;
        box-shadow: none;
        color: var(--text);
      }
      #lvBarHost .lwdeco-lv-body { display: none; }

      /* ============ 3. 简介 ============ */
      .ig-bio { padding: 2px 0 16px; }
      .me-hero-bio {
        min-height: 0;
        font-size: 12.5px;
        line-height: 1.65;
        color: var(--text-muted);
      }
      /* 置灰插图不参与这个干净版式 */
      .me-hero-bio > * { display: none !important; }
      .me-hero-bio.empty { color: var(--text-muted); }
      .me-hero-bio.empty::before {
        content: '喜欢画像素画 · 小镇常驻民';
        display: block;
      }
      .me-hero-bio.empty::after {
        content: '今天也在努力画点东西';
        display: block;
      }
      /* 打磨层会给 .empty 套 .lwp-empty（居中 + 34px 内边距），这里按主页版式收回 */
      #meBio.lwp-empty {
        display: block;
        padding: 0;
        gap: 0;
        text-align: left;
      }
      /* 未登录时不冒充已填写的简介 */
      .mine-wrap:has(#meName.guest) #meBio.empty::before { content: '登录后可写简介'; }
      .mine-wrap:has(#meName.guest) #meBio.empty::after { content: none; }
      .me-hero-sub { display: none; }

      /* ============ 4. 两个等宽描边按钮 ============ */
      .ig-actions {
        display: flex;
        gap: 10px;
        padding: 0 0 12px;
      }
      .ig-actions > * {
        flex: 1 1 0;
        min-width: 0;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 0 10px;
        border-radius: 6px;
        background: transparent;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      #signBtn {
        border: 1px solid var(--accent);
        color: var(--accent);
      }
      #signBtn:active { opacity: .75; }
      #signBtn.done {
        border-color: var(--border);
        color: var(--text-faint);
        cursor: default;
      }
      .ig-edit {
        border: 1px solid var(--border);
        color: var(--text);
      }
      .ig-edit:active { opacity: .75; }

      /* ============ 5. 高光圆入口 ============ */
      .ig-highlights { margin: 0 -16px; }
      #linkCard { padding: 0; }
      #linkCard .m-links {
        display: flex;
        gap: 18px;
        padding: 14px 24px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;
      }
      #linkCard .m-links::-webkit-scrollbar { display: none; }
      #linkCard .m-link {
        flex: none;
        width: 56px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--text-muted);
        text-decoration: none;
      }
      #linkCard .ml-ico {
        width: 52px;
        height: 52px;
        box-sizing: border-box;
        border: 1px solid var(--border);
        border-radius: 50%;
        background: var(--surface);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #linkCard .ml-ico svg {
        width: 22px;
        height: 22px;
        display: block;
        color: var(--text);
      }
      #linkCard .ml-num { display: none; }
      #linkCard .m-link > span:last-child {
        max-width: 100%;
        font-size: 10px;
        line-height: 1.2;
        color: var(--text-muted);
        text-align: center;
        white-space: nowrap;
      }
      #linkCard .m-link:active { opacity: .7; }

      /* ============ 6. 标签页 ============ */
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
        border-bottom: 2px solid transparent;
        color: var(--text-faint);
        text-decoration: none;
      }
      .ig-tab svg { width: 22px; height: 22px; display: block; }
      .ig-tab.on {
        color: var(--text);
        border-bottom-color: var(--text);
      }
      .ig-tab:active { opacity: .65; }

      /* ============ 7. 作品墙：3 列方格，通栏，无文字 ============ */
      .mine-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
        width: calc(100% + 32px);
        margin: 0 -16px;
      }
      .mine-grid .mine-item {
        position: relative;
        display: block;
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: var(--surface);
        overflow: hidden;
        min-width: 0;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;
      }
      .mine-grid .mine-item canvas {
        display: block;
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        image-rendering: pixelated;
        border-radius: 0;
      }
      .mine-grid .mine-cap,
      .mine-grid .mine-more { display: none; }

      .ig-empty {
        font-size: 12px;
        line-height: 1.7;
        color: var(--text-faint);
      }
      .ig-empty:empty { display: none; }
      #mineEmpty { padding: 14px 0; }
      #mineEmpty:empty { padding: 0; }
      #mineEmpty a { color: var(--accent); text-decoration: none; }
      .ig-empty .mine-load {
        display: inline-block;
        padding: 8px 14px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: transparent;
        color: var(--text-muted);
        font-family: inherit;
        font-size: 11.5px;
        cursor: pointer;
      }

      /* 空的收藏 / 送出块在主页不占高度；过滤页填进内容后再出现 */
      #likedSlot { padding: 0; }
      #likedCard,
      #favCard { padding: 0; }
      #likedCard .m-card-title,
      #favCard .m-card-title { display: none; }
      #likedGrid.lwp-hold,
      #favGrid.lwp-hold { min-height: 0 !important; }
      #likedGrid:empty,
      #favGrid:empty { display: none; }
      #likedEmpty,
      #favEmpty { padding: 14px 0; }
      #likedEmpty:empty,
      #favEmpty:empty { display: none; padding: 0; }

      /* ============ /mine/works 过滤页的小工具条 ============ */
      #mineCard { padding: 12px 0 8px; }
      #mineCard .m-card-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-muted);
      }
      #mineCard .m-card-title svg { width: 16px; height: 16px; display: block; }
      #mineCard .m-card-title .m-tip {
        font-size: 11px;
        font-weight: 400;
        color: var(--text-faint);
      }
      #mineCard .lw-refresh { margin-left: auto; }
      #mineCard .mine-del-tip {
        margin: 6px 0 8px;
        font-size: 11px;
        color: var(--text-faint);
      }
      #mineCard .mine-filter {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 10px;
      }
      #mineCard .mf-label { display: none; }
      #mineCard .mf-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      #mineCard .mf-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: transparent;
        color: var(--text-muted);
        font-family: inherit;
        font-size: 11px;
        cursor: pointer;
      }
      #mineCard .mf-chip.on {
        border-color: var(--accent);
        color: var(--accent);
      }
      #mineCard .mf-n {
        min-width: 15px;
        height: 15px;
        padding: 0 3px;
        border-radius: 8px;
        background: var(--surface-2);
        font-size: 9.5px;
        line-height: 15px;
        text-align: center;
      }

      /* ============ 主页不用的旧块 ============ */
      .m-card {
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        padding: 0;
      }
      .ig-unused { display: none !important; }
      .ig-sign-hidden { display: none !important; }

      .back-bar {
        display: block;
        padding: 12px 0 0;
        font-size: 12px;
        color: var(--accent);
        text-decoration: none;
      }

      /* 过滤页（/mine/fav、/mine/gifted）只留对应列表，不再重复主页作品墙 */
      .mine-wrap:has(#mineBack:not([hidden])):has(#favCard:not([hidden])) .ig-works,
      .mine-wrap:has(#mineBack:not([hidden])):has(#likedCard:not([hidden])) .ig-works {
        display: none;
      }

      /* ============ 深色模式 ============ */
      [data-mood="dark"] .me-av,
      [data-mood="dark"] #linkCard .ml-ico { background: var(--surface-2); }
      [data-mood="dark"] .mine-grid .mine-item { background: var(--surface-2); }
    `
