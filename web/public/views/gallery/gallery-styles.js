/**
 * Gallery 视图的CSS 样式
 *
 * 由 views/gallery.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/gallery.js 顶部。
 */

export const galleryStyles = `      /* hidden 属性兜底：避免类选择器里的 display 覆盖 UA 的 [hidden]{display:none} */
      [hidden] { display: none !important; }

      :root {
        --bg: #faf5ef;
        --surface: #ffffff;
        --surface-2: #efe9e0;
        --text: #3b342c;
        --text-muted: #6b5f50;
        --text-faint: #b0a697;
        --text-report: #8c7f6b;
        --border: #efe7da;
        --border-strong: #e0d3c0;
        --ring: #ffffff;
        --shadow: rgba(80, 60, 40, 0.08);
        --shadow-hover: rgba(80, 60, 40, 0.14);
        --accent: #5b8def;
        --like: #e5574b;
        --like-bg: #fff1ee;
        --like-border: #eec9c2;
        --art-bg: #ffffff;
        --overlay: rgba(20, 15, 10, 0.8);
      }
      [data-mood="dark"] {
        --bg: #181512;
        --surface: #262220;
        --surface-2: #332e29;
        --text: #ece5da;
        --text-muted: #b8ac9b;
        --text-faint: #7d7266;
        --text-report: #968a78;
        --border: #3a342f;
        --border-strong: #4a433c;
        --ring: #262220;
        --shadow: rgba(0, 0, 0, 0.4);
        --shadow-hover: rgba(0, 0, 0, 0.55);
        --accent: #6f9fff;
        --like: #ff7a6d;
        --like-bg: #3a221f;
        --like-border: #5a332c;
        --art-bg: #ffffff;
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
        max-width: 760px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 24px;
      }

      .back {
        flex: 0 0 auto;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-muted);
        text-decoration: none;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 999px;
        padding: 8px 16px;
        transition: border-color 0.2s;
      }

      .back:hover { border-color: var(--border-strong); }

      .header-text { flex: 1; min-width: 0; }

      .header-text h1 {
        font-size: 20px;
        font-weight: 800;
        color: var(--text);
      }

      #count {
        font-size: 13px;
        color: var(--text-faint);
        margin-top: 6px;
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
        /* 用 flex 居中而不是 line-height：emoji 字形基线偏低，
           line-height:1 会让它看起来偏下 */
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        text-decoration: none;
        padding: 0;
      }

      .theme-btn:active { transform: scale(0.9); }

      .featured {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 22px;
        box-shadow: 0 4px 14px var(--shadow);
      }

      .featured[hidden] { display: none; }

      .finder {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .search-row { position: relative; display: flex; align-items: center; }

      .search-input {
        flex: 1;
        min-width: 0;
        height: 40px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        padding: 0 38px 0 16px;
        font-size: 14px;
        color: var(--text);
        outline: none;
      }
      .search-input:focus { border-color: var(--accent); }

      .search-clear {
        position: absolute;
        right: 6px;
        width: 28px; height: 28px;
        border: none; border-radius: 50%;
        background: var(--surface-3);
        color: var(--text-muted);
        font-size: 13px; cursor: pointer;
      }

      .chip-row, .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .chip {
        border: 1px solid var(--border-strong);
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }
      .chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }

      .daily {
        background: var(--surface);
        border: 1px solid rgba(219, 138, 74, 0.45);
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 16px;
      }
      .daily-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
      .daily-title { font-size: 15px; font-weight: 800; color: var(--text); }
      .daily-day { font-size: 11px; color: var(--text-faint); font-family: ui-monospace, Menlo, monospace; }
      .daily-theme { font-size: 14px; font-weight: 700; color: var(--text); }
      .daily-theme b { color: #d9823e; }
      .daily-prompt { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
      .daily-cta-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
      .daily-cta {
        display: inline-flex; align-items: center;
        background: #d9823e; color: #fff;
        border-radius: 999px; padding: 7px 16px;
        font-size: 13px; font-weight: 700; text-decoration: none;
      }
      .daily-cta:active { transform: scale(0.95); }
      .daily-tip { font-size: 12px; color: var(--text-faint); }
      .daily-top { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 8px; margin-top: 12px; }
      .daily-top img { width: 100%; aspect-ratio: 1; image-rendering: pixelated; border-radius: 10px; background: var(--art-bg); border: 1px solid var(--border); display: block; }

      .author-page {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 14px;
        margin-bottom: 16px;
      }
      .author-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
      .author-back {
        border: 1px solid var(--border-strong); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 5px 12px;
        font-size: 12px; font-weight: 700; cursor: pointer;
      }
      .author-name { font-size: 16px; font-weight: 800; color: var(--text); }
      .author-count { font-size: 12px; color: var(--text-faint); }
      .author-id { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
      .author-id-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .author-av {
        width: 40px; height: 40px; flex: 0 0 40px; border-radius: 10px; overflow: hidden;
        background: var(--art-bg); border: 1px solid var(--border-strong);
        display: flex; align-items: center; justify-content: center;
      }
      .author-av canvas { width: 100%; height: 100%; image-rendering: pixelated; display: block; }
      .author-av-ph { font-size: 15px; font-weight: 800; color: var(--text-faint); }
      .author-bio {
        font-size: 12px; color: var(--text-muted); line-height: 1.5;
        overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
        -webkit-line-clamp: 2; -webkit-box-orient: vertical; word-break: break-word;
      }
      .author-works { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; }
      .author-works img { width: 100%; aspect-ratio: 1; image-rendering: pixelated; border-radius: 10px; background: var(--art-bg); border: 1px solid var(--border); display: block; }

      /* 卡片上的标签与来源标记 */
      .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
      .card-tag {
        font-size: 10px; font-weight: 700; color: var(--text-muted);
        background: var(--surface-2); border: 1px solid var(--border);
        border-radius: 999px; padding: 1px 7px; cursor: pointer;
      }
      .img-badge {
        flex: 0 0 auto; font-size: 10px; font-weight: 800; color: #fff;
        background: linear-gradient(135deg, #8aa4c8, #5b6b8c);
        border-radius: 999px; padding: 2px 8px; white-space: nowrap;
      }

      .contest {
        background: linear-gradient(135deg, #fff7e0, #ffeded);
        border: 1px solid var(--border-strong);
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 18px;
      }

      [data-mood="dark"] .contest {
        background: linear-gradient(135deg, #2b2620, #34261f);
      }

      .contest-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
        font-weight: 800;
        color: var(--text);
      }

      .contest-badge {
        background: #e5484d;
        color: #fff;
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 700;
      }

      .contest-theme {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 900;
      }

      .contest-theme b { color: var(--accent); }

      .contest-prompt {
        margin-top: 4px;
        font-size: 13px;
        color: var(--text-muted);
      }

      .contest-meta {
        margin-top: 4px;
        font-size: 12px;
        color: var(--text-faint);
      }

      .contest-cta-row {
        margin-top: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .contest-cta {
        background: var(--accent);
        color: #fff;
        border-radius: 999px;
        padding: 9px 18px;
        font-size: 14px;
        font-weight: 800;
        text-decoration: none;
        transition: transform 0.12s;
      }

      .contest-cta:active { transform: scale(0.95); }

      .contest-tip { font-size: 12px; color: var(--text-muted); }

      .contest-top {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
      }

      .ct-card {
        position: relative;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 10px;
        cursor: pointer;
        transition: transform 0.12s, box-shadow 0.15s;
      }

      .ct-card:active { transform: scale(0.96); }

      .ct-rank {
        position: absolute;
        top: 6px;
        left: 6px;
        z-index: 1;
        width: 22px;
        height: 22px;
        border-radius: 7px;
        background: #8a7f6f;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ct-rank.r1 { background: #f6c343; }
      .ct-rank.r2 { background: #aeb6c2; }
      .ct-rank.r3 { background: #d18b5f; }

      .ct-art {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        object-fit: cover;
        image-rendering: pixelated;
        background: #fff;
        display: block;
      }

      .ct-name {
        margin-top: 6px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ct-votes {
        margin-top: 2px;
        font-size: 11px;
        font-weight: 700;
        color: var(--accent);
      }

      .contest-empty {
        font-size: 13px;
        color: var(--text-muted);
        padding: 4px 0;
      }

      .vote-btn {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid var(--accent);
        background: rgba(91, 141, 239, 0.12);
        color: var(--accent);
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.12s;
        line-height: 1.3;
      }

      .vote-btn:active { transform: scale(0.92); }

      .vote-btn.voted {
        border-color: #5bb883;
        background: rgba(91, 184, 131, 0.16);
        color: #3f9c68;
      }

      .featured-head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 800;
        color: var(--text);
        margin-bottom: 12px;
      }

      .featured-sub {
        font-size: 11px;
        font-weight: 500;
        color: var(--text-faint);
        margin-bottom: 12px;
      }

      .range-tabs {
        display: flex;
        gap: 4px;
        background: var(--surface-2);
        border-radius: 999px;
        padding: 3px;
      }

      .range-tabs button {
        border: none;
        background: transparent;
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 700;
        border-radius: 999px;
        padding: 4px 12px;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .range-tabs button.active {
        background: var(--surface);
        color: var(--text);
      }

      .featured-row {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 6px;
        scrollbar-width: none;
      }

      .featured-row::-webkit-scrollbar { display: none; }

      .f-card {
        flex: 0 0 96px;
        text-align: center;
        cursor: pointer;
        position: relative;
      }

      .f-rank {
        position: absolute;
        top: -6px;
        left: -6px;
        z-index: 2;
        min-width: 22px;
        height: 22px;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 800;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
      }

      .f-rank.r1 { background: #f6c343; }
      .f-rank.r2 { background: #aeb6c2; }
      .f-rank.r3 { background: #d18b5f; }
      .f-rank.rn { background: #8a7f6f; }

      .f-art {
        width: 96px;
        height: 96px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 2px solid var(--border);
        background: var(--art-bg);
        display: block;
        box-shadow: 0 3px 10px var(--shadow);
        transition: transform 0.12s ease;
      }

      .f-card:active .f-art { transform: scale(0.94); }

      .f-name {
        margin-top: 6px;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 96px;
      }

      .f-meta {
        margin-top: 2px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .f-author {
        font-size: 10px;
        color: var(--text-faint);
      }

      .f-like {
        font-size: 10px;
        color: var(--like);
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 14px;
      }

      .card {
        /* 审核员的「下架」按钮是绝对定位的，卡片必须是定位上下文，
           否则按钮会跑到整个页面左上角去 */
        position: relative;
        background: var(--surface);
        border: 1px solid transparent;
        border-radius: 16px;
        padding: 10px;
        box-shadow: 0 4px 14px var(--shadow);
        cursor: pointer;
        text-align: left;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        color: inherit;
        font: inherit;
      }

      .card:hover { box-shadow: 0 8px 22px var(--shadow-hover); }
      .card:active { transform: scale(0.97); }

      /* 不同作品类型用不同描边颜色区分：参赛=蓝 · 动画=紫 · 多人=青 */
      .card.t-contest { border-color: rgba(91, 141, 239, 0.55); }
      .card.t-anim { border-color: rgba(146, 122, 255, 0.55); }
      .card.t-room { border-color: rgba(56, 196, 160, 0.55); }
      [data-mood="dark"] .card.t-contest { border-color: rgba(118, 163, 255, 0.6); }
      [data-mood="dark"] .card.t-anim { border-color: rgba(166, 145, 255, 0.6); }
      [data-mood="dark"] .card.t-room { border-color: rgba(72, 214, 178, 0.6); }

      .card.hl {
        box-shadow: 0 0 0 3px var(--accent), 0 8px 22px var(--shadow-hover);
        animation: hlPulse 1.6s ease 2;
      }

      @keyframes hlPulse {
        0%, 100% { box-shadow: 0 0 0 3px var(--accent), 0 8px 22px var(--shadow-hover); }
        50% { box-shadow: 0 0 0 7px rgba(91, 141, 239, 0.45), 0 8px 22px var(--shadow-hover); }
      }

      .anim-badge {
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, #7ce0c0, #5b8def);
        border-radius: 999px;
        padding: 2px 8px;
        white-space: nowrap;
      }

      .room-badge {
        flex: 0 0 auto;
        font-size: 10px;
        font-weight: 800;
        color: #fff;
        background: linear-gradient(135deg, #7ce0c0, #2fae8c);
        border-radius: 999px;
        padding: 2px 8px;
        white-space: nowrap;
      }

      .art {
        width: 100%;
        aspect-ratio: 1;
        image-rendering: pixelated;
        border-radius: 10px;
        border: 2px solid var(--border);
        background: var(--art-bg);
        display: block;
      }

      .card-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        font-size: 12px;
        color: var(--text-muted);
        flex-wrap: wrap;
      }

      .card-name {
        font-weight: 600;
        word-break: break-all;
        min-width: 60px;
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card-av {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        image-rendering: pixelated;
        flex: none;
        border: 1px solid var(--border);
        background: var(--surface-2);
      }
      .card-sub {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        font-size: 11px;
        color: var(--text-faint);
        flex-wrap: wrap;
      }

      .card-author {
        font-size: 11px;
        min-width: 40px;
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* 审核员勋章：挂在作者名旁边 */
      .mod-badge {
        font-size: 10px; font-weight: 700; color: #2f6b3f;
        background: #e8f5ec; border: 1px solid #cbe6d4;
        border-radius: 999px; padding: 1px 6px; margin-left: 4px;
        white-space: nowrap; flex: none;
      }
      /* 审核员的「暂时下架」按钮：卡片左上角，只有审核员看得见 */
      .mod-hide {
        position: absolute; left: 6px; top: 6px; z-index: 3;
        border: 0; border-radius: 999px; cursor: pointer;
        background: rgba(60, 48, 36, .82); color: #fff;
        font-family: inherit; font-size: 11px; font-weight: 700;
        padding: 4px 9px; backdrop-filter: blur(2px);
      }
      .mod-hide:active { transform: scale(.94); }

      .card-size {
        flex: 0 0 auto;
        margin-left: auto;
        font-size: 10px;
        color: var(--text-faint);
        border: 1px solid var(--border-strong);
        border-radius: 999px;
        padding: 1px 7px;
      }

      .f-size {
        font-size: 10px;
        color: var(--text-faint);
        border: 1px solid var(--border);
        border-radius: 999px;
        padding: 1px 6px;
      }

      .like-btn {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
        border: 1px solid var(--like-border);
        background: var(--like-bg);
        color: var(--like);
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.12s, background 0.15s;
        line-height: 1.3;
      }

      .like-btn:active { transform: scale(0.9); }
      .like-btn.liked { background: var(--like); color: #fff; border-color: var(--like); }
      /* 相机作品不能收光尘/投票：置灰但仍可读，不能完全藏起来让人以为没人送过 */
      .like-btn.no-dust, .like-btn.no-dust.liked,
      .vote-btn.no-vote, .vote-btn.no-vote.voted {
        opacity: 0.42; cursor: not-allowed; filter: grayscale(1);
      }
      .like-btn.no-dust:active, .vote-btn.no-vote:active { transform: none; }

      .card-time {
        margin-top: 4px;
        font-size: 10px;
        color: var(--text-faint);
      }

      .status {
        text-align: center;
        color: var(--text-faint);
        font-size: 14px;
        padding: 40px 0;
      }

      #sentinel { cursor: pointer; }

      .retry {
        margin-top: 12px;
        padding: 8px 20px;
        border: 2px solid var(--border);
        background: var(--surface);
        color: var(--text-muted);
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      

      .disclaimer {
        margin-top: 28px;
        padding: 14px 16px;
        background: var(--surface);
        border-radius: 14px;
        box-shadow: 0 4px 14px var(--shadow);
        font-size: 12px;
        line-height: 1.7;
        color: var(--text-faint);
        text-align: justify;
      }

      .disclaimer-report {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--border);
        color: var(--text-report);
      }

      .copyright {
        margin-top: 16px;
        text-align: center;
        font-size: 12px;
        color: var(--text-faint);
      }

      .preview-overlay {
        position: fixed;
        inset: 0;
        z-index: 90;
        background: var(--overlay);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: var(--text);
      }

      .preview-overlay[hidden] { display: none; }

      /* 弹窗整体不能超过屏幕：以前没限高，评论一多内容就撑到视口外面，
         而遮罩是 fixed + overflow:visible，超出去的部分既滑不到也点不到
         （实测 47 条评论时「下拉加载更多」按钮 top=857、视口只有 844，
         elementFromPoint 直接是 null）。
         改成：头部固定在弹窗顶端，下面 .preview-body 自己滚动。 */
      .preview-box {
        width: 100%;
        max-width: 380px;
        max-height: calc(100vh - 32px);
        max-height: calc(100dvh - 32px);
        display: flex;
        flex-direction: column;
        background: var(--surface);
        border-radius: 18px;
        padding: 20px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        text-align: center;
      }
      .preview-body {
        flex: 1 1 auto;
        min-height: 0; /* flex 子项默认 min-height:auto，不写这行就不会收缩、不会滚 */
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        scrollbar-width: thin;
      }
      .preview-body::-webkit-scrollbar { width: 4px; }
      .preview-body::-webkit-scrollbar-thumb {
        background: var(--border-strong); border-radius: 4px;
      }

      /* 头部吸顶：评论一多内容变长，头部跟着滚出去就够不着「关闭」了
         （反馈是「评论 3 个就关不掉作品」）。吸顶后按钮永远在。 */
      /* 头部在 .preview-body 外面，本身就永远可见，不需要 sticky 了 */
      .preview-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
        flex: none;
        padding: 8px 0;
        margin-top: -8px;
      }
      /* 下滑关闭：按住预览往下一拖，松手就关。手指按住的地方会跟手。
         注意：JS 里是给 #previewBox 加 .swiping，类名必须对上 ——
         之前这两条写的是 .preview-card，markup 里根本没有这个元素，
         于是拖动时 transition 一直生效，手感是飘的而不是跟手的。 */
      #previewBox {
        transition: transform 0.18s ease-out;
      }
      #previewBox.swiping { transition: none; }
      .preview-art {
        touch-action: none; /* 这块由手势处理，别让浏览器拿去滚 */
        cursor: grab;
        /* 关掉系统自带的长按菜单（iOS Safari / 安卓 Chrome 都有）：
           它们是浏览器级弹层，出现时机不受我们控制，会盖在我们的
           作品菜单上面，点「转发给朋友」会点穿到它去。
           touch-action: none 挡不住它，只有 -webkit-touch-callout 能。 */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      #previewBox.swiping .preview-art { cursor: grabbing; }
      .preview-grab {
        width: 38px; height: 4px; border-radius: 999px;
        background: var(--border-strong);
        margin: -2px auto 8px;
        flex: none;
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
        width: 240px;
        height: 240px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 2px solid var(--border);
        background: var(--art-bg);
        margin: 0 auto;
        display: block;
      }

      #previewCanvas[hidden],
      #previewImg[hidden] { display: none; }

      #previewImg {
        width: 240px;
        height: 240px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 2px solid var(--border);
        background: var(--art-bg);
        margin: 0 auto;
        display: block;
        object-fit: cover;
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
      /* 作者行：头像 + 名字，点名字进作者主页 */
      .preview-who { display: flex; align-items: center; gap: 8px; }
      .preview-av {
        width: 30px; height: 30px; flex: 0 0 30px; border-radius: 9px; overflow: hidden;
        background: var(--art-bg); border: 1px solid var(--border-strong);
      }
      .preview-av canvas { width: 100%; height: 100%; image-rendering: pixelated; display: block; }
      .preview-author-btn {
        background: none; border: 0; padding: 0; cursor: pointer;
        font: inherit; color: inherit; text-align: left;
      }
      .preview-author-btn:hover { text-decoration: underline; }
      .preview-report {
        margin-left: auto; flex: none;
        border: 1px solid var(--border-strong); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 4px 10px;
        font-size: 11px; font-weight: 700; font-family: inherit; cursor: pointer;
      }
      .preview-report:active { background: var(--border); }
      .preview-bio {
        font-size: 12px; font-weight: 500; color: var(--text-muted); line-height: 1.5;
        padding: 6px 10px; border-radius: 10px; background: var(--surface-2);
        white-space: pre-wrap; word-break: break-word;
      }

      .preview-time {
        font-size: 12px;
        color: var(--text-faint);
        font-weight: 400;
      }

      /* 举报入口刻意做小做灰，避免误触：需长按 1.5 秒才会真正提交 */
      .report-hold {
        position: relative;
        padding: 6px 10px;
        font-size: 12px;
        color: var(--text-faint);
        background: transparent;
        border: 1px dashed var(--border-strong);
        border-radius: 999px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        touch-action: manipulation;
      }
      .report-hold:active { background: var(--surface-2); }
      .report-progress {
        height: 3px;
        border-radius: 999px;
        background: var(--surface-3);
        overflow: hidden;
        margin-top: 8px;
      }
      .report-progress i {
        display: block;
        height: 100%;
        width: 0;
        background: var(--like);
        border-radius: 999px;
      }

      /* ---------- 用色色板 ---------- */

      /* ---------- 过滤器 ---------- */
      .filter-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        margin-top: 8px;
        padding: 9px 12px;
        border: 1px solid var(--border);
        border-radius: 10px;
        background: var(--surface);
        color: var(--text);
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        text-align: left;
      }
      .filter-toggle[aria-expanded='true'] { border-color: var(--accent); color: var(--accent); }
      .filter-toggle .ft-badge {
        min-width: 17px;
        padding: 1px 5px;
        border-radius: 999px;
        background: var(--accent);
        color: #fff;
        font-size: 11px;
        text-align: center;
      }
      .filter-toggle .ft-caret { margin-left: auto; transition: transform .2s; }
      .filter-toggle[aria-expanded='true'] .ft-caret { transform: rotate(180deg); }

      .filter-panel {
        margin-top: 8px;
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--surface);
        display: flex;
        flex-direction: column;
        gap: 13px;
        animation: lwa-fade .2s ease-out both;
      }
      .fp-group { display: flex; align-items: flex-start; gap: 10px; }
      .fp-label {
        flex: none;
        width: 34px;
        padding-top: 7px;
        font-size: 12px;
        color: var(--text-faint);
      }
      .fp-chips { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
      .fp-chips button {
        padding: 5px 11px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface-2);
        color: var(--text-muted);
        font-family: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .fp-chips button.on {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
        font-weight: 700;
      }
      .fp-chips button:active { transform: scale(.94); }
      .fp-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 9px;
        border-top: 1px solid var(--border);
      }
      .fp-count { font-size: 11.5px; color: var(--text-faint); }
      .fp-reset {
        padding: 4px 12px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: none;
        color: var(--text-faint);
        font-family: inherit;
        font-size: 11.5px;
        cursor: pointer;
      }

      /* ---------- 分区标题 ---------- */
      .sec-bar {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        margin-top: 14px;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .sec-bar::-webkit-scrollbar { display: none }
      .sec-bar button {
        flex: none;
        padding: 5px 13px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface);
        color: var(--text-muted);
        font-family: inherit;
        font-size: 12.5px;
        white-space: nowrap;
        cursor: pointer;
      }
      .sec-bar button.on {
        background: var(--text);
        border-color: var(--text);
        color: var(--surface);
        font-weight: 700;
      }
      .sec-bar button i { font-style: normal; opacity: .6; margin-left: 3px; }
      /* 卡片上标出它是哪种画布 */
      .card .card-method {
        position: absolute;
        left: 6px;
        bottom: 6px;
        padding: 1px 6px;
        border-radius: 999px;
        background: rgba(0,0,0,.5);
        color: #fff;
        font-size: 10px;
        line-height: 1.5;
        backdrop-filter: blur(2px);
        pointer-events: none;
      }

      /* 被过滤掉的卡片直接不占位 */
      .card.f-off { display: none !important; }

      /* 用色占比条：按比例横向铺开，一眼看出主色调。
         比一串色块直观 —— 光看色块不知道哪个是主色。
         ★ .pal-grid 是 flex-wrap 容器，插进去的元素默认都是 flex item，
         会被同行的色块挤扁。这三块都要独占整行。 */
      .pal-bar, .pal-sum, .pal-chips { flex: 0 0 100%; width: 100%; }
      .pal-bar {
        display: flex;
        height: 12px;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 10px;
        border: 1px solid var(--border);
      }
      .pal-bar i { display: block; min-width: 2px; }
      .pal-sum {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 11.5px;
        color: var(--text-faint);
        margin-bottom: 10px;
      }
      .pal-sum b { color: var(--text); font-weight: 700; }
      .pal-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .pal-chip span em {
        font-style: normal;
        font-size: 9.5px;
        color: var(--text-faint);
        margin-left: 4px;
      }

      .share-btn.on {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--surface-2);
      }

      .pal-box {
        margin-top: 10px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 11px 12px 9px;
        text-align: left;
      }
      .pal-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 9px;
      }
      .pal-title { font-size: 13px; font-weight: 600; color: var(--text); }
      .pal-count { font-size: 12px; color: var(--text-faint); margin-left: auto; }
      .pal-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        max-height: 190px;
        overflow-y: auto;
      }
      .pal-grid::-webkit-scrollbar { display: none; }

      /* ---------- 发现 ---------- */
      .discover {
        width: 100%;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 14px;
        margin-bottom: 16px;
      }
      .discover-head {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .discover-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
      .discover-text b { font-size: 14px; color: var(--text); }
      .discover-text i {
        font-size: 12px;
        font-style: normal;
        color: var(--text-faint);
        line-height: 1.5;
      }
      .discover-btn {
        margin-left: auto;
        flex-shrink: 0;
        padding: 9px 16px;
        border-radius: 999px;
        border: none;
        background: var(--accent);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.12s ease;
      }
      .discover-btn:active { transform: scale(0.94); }
      .discover-btn:disabled { opacity: 0.55; }
      .discover-empty {
        font-size: 13px;
        color: var(--text-faint);
        text-align: center;
        padding: 18px 8px 6px;
      }
      .discover-card {
        margin-top: 12px;
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 11px;
        border-radius: 13px;
        background: var(--surface-2);
        border: 1px solid var(--border);
        cursor: pointer;
      }
      .discover-card canvas {
        width: 76px;
        height: 76px;
        flex-shrink: 0;
        border-radius: 10px;
        image-rendering: pixelated;
        background: var(--art-bg);
        border: 1px solid var(--border);
      }
      .discover-info { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
      .discover-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .discover-meta { font-size: 12px; color: var(--text-muted); }
      .discover-ago { font-size: 11px; color: var(--text-faint); }

      .pal-chip {
        width: 46px;
        border-radius: 9px;
        overflow: hidden;
        border: 1px solid var(--border-strong);
        background: var(--surface);
        padding: 0;
        cursor: pointer;
        transition: transform 0.12s ease;
      }
      .pal-chip:active { transform: scale(0.9); }
      .pal-chip i {
        display: block;
        height: 26px;
        width: 100%;
      }
      .pal-chip span {
        display: block;
        font-size: 9px;
        line-height: 1.5;
        color: var(--text-muted);
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        text-align: center;
        padding-bottom: 1px;
      }
      .pal-tip {
        margin-top: 8px;
        font-size: 11px;
        color: var(--text-faint);
        text-align: center;
      }

      .report-box { max-width: 340px; }
      .report-reasons { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
      .report-reason {
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid var(--border-input);
        background: var(--surface);
        color: var(--text-muted);
        font-size: 13px;
        cursor: pointer;
      }
      .report-reason.on {
        border-color: var(--like);
        color: var(--like);
        background: var(--like-bg);
      }
      .report-note {
        width: 100%;
        min-height: 64px;
        padding: 9px 11px;
        border-radius: 10px;
        border: 1px solid var(--border-input);
        background: var(--bg);
        color: var(--text);
        font-size: 13px;
        font-family: inherit;
        resize: vertical;
      }

      /* ---------- 评论 ---------- */
      .cmt-box {
        margin-top: 14px; padding-top: 12px;
        border-top: 1px solid var(--border);
      }
      .cmt-head {
        display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
      }
      .cmt-title { font-size: 13px; font-weight: 800; color: var(--text); flex: 1; }
      .cmt-in {
        width: 100%; border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text); border-radius: 11px; padding: 9px 11px;
        font-size: 13px; font-family: inherit; resize: none; min-height: 40px;
        line-height: 1.5;
      }
      .cmt-in:focus { outline: 2px solid var(--accent); outline-offset: -1px; }
      .cmt-act { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
      .cmt-count { flex: 1; font-size: 11px; color: var(--text-faint); }
      .cmt-send {
        border: 0; border-radius: 10px; padding: 8px 15px;
        font-size: 12px; font-weight: 800; font-family: inherit;
        background: var(--accent); color: #fff; cursor: pointer;
      }
      .cmt-send[disabled] {
        background: var(--surface-2); color: var(--text-faint);
        cursor: default; box-shadow: none;
      }
      /* 展开后评论区自己可以滑动，不用拖动整个弹窗。
         高度卡住，评论再多也只占这么大一块。
         「下拉加载更多」放在这个滚动区里面，滑到底才碰得到。 */
      .cmt-scroll {
        margin-top: 10px;
        max-height: min(46vh, 320px);
        overflow-y: auto; overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain; /* 滑到头了不要把滚动传给弹窗 */
        scrollbar-width: thin;
      }
      .cmt-scroll[hidden] { display: none; }
      .cmt-scroll::-webkit-scrollbar { width: 4px; }
      .cmt-scroll::-webkit-scrollbar-thumb {
        background: var(--border-strong); border-radius: 4px;
      }
      .cmt-list { display: flex; flex-direction: column; gap: 8px; }
      /* 评论区下拉：默认收起成一行，评论再多也不会把作品弹窗撑到关不掉。
         展开后如果还没显示完，底部给一个「下拉加载更多」。 */
      .cmt-fold {
        display: flex; align-items: center; gap: 7px; width: 100%;
        margin-top: 10px; padding: 9px 11px;
        border: 1px solid var(--border); background: var(--surface-2);
        border-radius: 11px; cursor: pointer;
        font-family: inherit; font-size: 12px; font-weight: 700; color: var(--text-muted);
        text-align: left;
      }
      .cmt-fold:active { background: var(--surface); }
      .cmt-fold-ico {
        font-size: 9px; line-height: 1; color: var(--text-faint);
        transition: transform .18s ease;
      }
      .cmt-fold[aria-expanded='true'] .cmt-fold-ico { transform: rotate(180deg); }
      .cmt-fold-num { margin-left: auto; font-size: 11px; font-weight: 400; color: var(--text-faint); }
      .cmt-more {
        display: block; width: 100%; margin-top: 2px; padding: 9px;
        border: 1px dashed var(--border-strong); background: transparent;
        border-radius: 11px; color: var(--text-faint);
        font-family: inherit; font-size: 12px; cursor: pointer;
      }
      .cmt-more:active { background: var(--surface-2); }
      .cmt-item {
        display: flex; gap: 8px; background: var(--surface-2);
        border-radius: 11px; padding: 8px 10px;
      }
      /* 自己的评论整条镜像到右边：头像在右、文字右对齐。
         全都靠左排在一起，分不清哪条是自己的，看着很乱。 */
      .cmt-item.mine {
        flex-direction: row-reverse;
        background: color-mix(in srgb, var(--accent) 9%, var(--surface-2));
      }
      .cmt-item.mine .cmt-main { text-align: right; }
      .cmt-item.mine .cmt-row { flex-direction: row-reverse; }
      .cmt-item.owner { background: color-mix(in srgb, var(--accent) 10%, var(--surface-2)); }
      .cmt-av {
        width: 24px; height: 24px; flex: 0 0 24px; border-radius: 7px; overflow: hidden;
        background: var(--surface); border: 1px solid var(--border-strong);
      }
      .cmt-av canvas { width: 100%; height: 100%; image-rendering: pixelated; display: block; }
      .cmt-main { flex: 1; min-width: 0; }
      .cmt-row { display: flex; align-items: baseline; gap: 6px; }
      .cmt-name { font-size: 12px; font-weight: 800; color: var(--text); }
      .cmt-name .mod-badge { font-size: 9px; padding: 0 5px; vertical-align: 1px; }
      .cmt-item.owner .cmt-name { color: var(--accent); }
      .cmt-time { font-size: 10px; color: var(--text-faint); }
      .cmt-row { display: flex; align-items: baseline; gap: 6px; }
      .cmt-del {
        margin-left: auto; border: 0; background: none; padding: 0;
        font-size: 11px; font-family: inherit; color: var(--text-faint); cursor: pointer;
        flex: none;
      }
      .cmt-item.mine .cmt-del { margin-left: 0; margin-right: auto; }
      .cmt-text {
        font-size: 13px; color: var(--text); line-height: 1.6;
        margin-top: 2px; word-break: break-word; white-space: pre-wrap;
      }
      .cmt-tip { font-size: 12px; color: var(--text-faint); text-align: center; padding: 14px 0; }

      .preview-like {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--border);
      }

      /* 详情页底部操作条：细身胶囊 · 透明底 · 1px 描边 */
      .preview-like .like-btn,
      .preview-like .vote-btn,
      .preview-like .share-btn {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        background: transparent;
        cursor: pointer;
        transition: transform 0.12s, background 0.15s, border-color 0.15s, color 0.15s;
      }

      .preview-like .like-btn { border: 1px solid var(--like-border); color: var(--like); }
      .preview-like .like-btn:hover { background: var(--like-bg); }
      .preview-like .like-btn:active { transform: scale(0.94); }
      .preview-like .like-btn.liked { background: var(--like); border-color: var(--like); color: #fff; }

      /* 收藏按钮：描边小胶囊，收藏后变蓝底白字，跟全站主色一致 */
      .preview-like .fav-btn {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 24px;
        padding: 0 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        background: transparent;
        border: 1px solid var(--border-strong);
        color: var(--text-muted);
        cursor: pointer;
        transition: transform 0.12s, background 0.15s, border-color 0.15s, color 0.15s;
      }
      .preview-like .fav-btn:hover { background: var(--surface-2); }
      .preview-like .fav-btn:active { transform: scale(0.94); }
      .preview-like .fav-btn.fav-on {
        background: var(--accent, #5b8def);
        border-color: var(--accent, #5b8def);
        color: #fff;
      }

      .preview-like .vote-btn { border: 1px solid rgba(91, 141, 239, 0.45); color: var(--accent); }
      .preview-like .vote-btn:hover { background: rgba(91, 141, 239, 0.1); }
      .preview-like .vote-btn:active { transform: scale(0.94); }
      .preview-like .vote-btn.voted {
        border-color: rgba(91, 184, 131, 0.55);
        color: #3f9c68;
        background: rgba(91, 184, 131, 0.12);
      }

      .preview-like .share-btn { border: 1px solid transparent; color: var(--text-faint); }
      .preview-like .share-btn:hover { background: var(--surface-2); color: var(--text-muted); }
      .preview-like .share-btn:active { transform: scale(0.94); }

      .share-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px solid var(--border-strong);
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        padding: 3px 14px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.12s;
        line-height: 1.5;
      }

      .share-btn:active { transform: scale(0.93); }
      .share-btn.copied { background: var(--ok-bg, #e8f5e9); color: var(--ok, #43a047); border-color: var(--ok, #43a047); }

      .preview-note {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--border);
        font-size: 12px;
        color: var(--text-faint);
        line-height: 1.6;
      }

      #previewCanvas {
        width: 240px;
        height: 240px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 2px solid var(--border);
        background: var(--art-bg);
        margin: 0 auto;
        display: block;
      }

      #previewCanvas[hidden],
      #previewImg[hidden] { display: none; }

      #previewImg {
        width: 240px;
        height: 240px;
        image-rendering: pixelated;
        border-radius: 12px;
        border: 2px solid var(--border);
        background: var(--art-bg);
        margin: 0 auto;
        display: block;
        object-fit: cover;
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

      /* ---------- 朋友圈卡片弹层 ---------- */
      .card-overlay {
        position: fixed;
        inset: 0;
        z-index: 95;
        background: var(--overlay);
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

      #cardImg {
        width: 100%;
        height: auto;
        border-radius: 14px;
        display: block;
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
`
