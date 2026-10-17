/**
 * 画师主页的 HTML 模板 —— Instagram 风格的个人主页
 *
 * 结构（自上而下）：
 *   顶栏（画师名 + 分享 / 刷新）→ 78px 圆头像 + 三项数据
 *   → 粗体名字 + 两行简介 + 小字资料 → 两三个等宽描边按钮
 *   → 作品 / 收藏 两个标签 → 通栏 3 列作品墙
 *
 * 说明：views/user.js 会按 id 取元素，模板里所有 id 必须保留：
 *   uBody / uHint / uRefresh / uMsg / uAv / uAvCanvas /
 *   uWorks / uMoreBtn / uChatBtn / uVisitBtn / uFollowBtn
 * 新增的 id 只是给新的静态结构用，旧的读写路径一个都没动。
 */

export const userTemplate = `<div class="u-wrap">

  <!-- ============ 1. 顶栏：左边画师名，右边分享 / 刷新 ============ -->
  <header class="ig-top">
    <h1 class="ig-user guest" id="uName">画师主页</h1>
    <div class="ig-top-actions">
      <button class="ig-ico-btn" id="uShareBtn" type="button" title="分享主页" aria-label="分享主页">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2h2v8h-2zM9 4h2v2H9zm4 0h2v2h-2zM7 6h2v2H7zm8 0h2v2h-2z"/><path d="M6 10h3v2H8v8h8v-8h-1v-2h3v12H6z"/></svg>
      </button>
      <button class="ig-ico-btn" id="uRefresh" type="button" data-label="刷新" title="刷新" aria-label="刷新">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 3h8v2H8zM6 5h2v2H6zM4 7h2v2H4zM2 9h2v6H2zM4 15h2v2H4zM6 17h2v2H6zM8 19h8v2H8zM16 17h2v2h-2zM18 15h2v2h-2zM20 9h2v6h-2z"/><path d="M14 1h7v2h-7zm5 2h2v2h-2zm0 4h2v2h-2zM14 9h5v2h-5zM12 7h2v4h-2z"/></svg>
      </button>
    </div>
  </header>

  <!-- 屏幕阅读器用的一句话说明；不占版面 -->
  <p class="u-hint u-sr-only" id="uHint">画师主页</p>

  <div id="uBody">

    <!-- ============ 2. 头像 + 三项数据 ============ -->
    <section class="ig-hero">
      <div class="me-av" id="uAv"><canvas id="uAvCanvas"></canvas></div>
      <div class="ig-stats">
        <div class="ig-stat">
          <span class="stat-num" id="uStatWorks">—</span>
          <span class="stat-lab">作品</span>
        </div>
        <div class="ig-stat">
          <span class="stat-num" id="uStatDust">—</span>
          <span class="stat-lab">收到的光尘</span>
        </div>
        <div class="ig-stat">
          <span class="stat-num" id="uStatDays">—</span>
          <span class="stat-lab">创作天数</span>
        </div>
      </div>
    </section>

    <!-- ============ 3. 粗体名字 + 简介 ============ -->
    <section class="ig-bio">
      <div class="u-bio-name">
        <span id="uBioName">…</span>
        <span class="mod-badge" id="uModBadge" hidden>审核员</span>
      </div>
      <div class="u-bio" id="uBio">正在读取…</div>
      <div class="u-meta" id="uMeta"></div>
    </section>

    <!-- ============ 4. 等宽描边按钮 ============ -->
    <div class="ig-actions" id="uActions" hidden>
      <button class="u-act" id="uGiveBtn" type="button" hidden>送光尘</button>
      <button class="u-act" id="uChatBtn" type="button" hidden>与他聊天</button>
      <button class="u-act" id="uVisitBtn" type="button" hidden>逛他家</button>
      <button class="u-act u-follow" id="uFollowBtn" type="button" hidden>＋ 加好友</button>
    </div>

    <!-- ============ 5/6. 标签页 + 3 列作品墙 ============ -->
    <section class="ig-works">
      <nav class="ig-tabs" aria-label="画师内容">
        <button class="ig-tab on" id="uTabWorks" type="button" title="作品" aria-label="作品">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/><path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/></svg>
        </button>
        <button class="ig-tab" id="uTabFav" type="button" title="收藏" aria-label="收藏">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/></svg>
        </button>
      </nav>

      <div class="u-grid" id="uWorks"></div>
      <div class="u-empty" id="uEmpty"><span class="lw-load"></span>正在读取…</div>
      <div class="u-empty" id="uFavEmpty" hidden></div>
      <button class="u-more" id="uMoreBtn" type="button" hidden>查看更多</button>
    </section>

  </div>

  <!-- 送光尘 / 关注 / 网络错误等一次性提示（浮在导航上方，不占版面） -->
  <div class="u-msg" id="uMsg" hidden></div>

</div>`
