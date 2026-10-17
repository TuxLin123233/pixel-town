/**
 * Mine 视图的 HTML 模板 —— Instagram 风格的个人主页
 *
 * 结构（自上而下）：
 *   顶栏（用户名 + 通知/设置）→ 头像 + 四项数据 → 简介
 *   → 两个描边按钮 → 高光圆入口 → 作品 / 点赞 / 收藏 三个标签
 *   → 三份 3 列网格（#mineGrid / #likedGrid / #favGrid，点标签原地切换）
 *
 * 说明：views/mine.js 会按 id 取元素，模板里所有 id 必须保留。
 *       主页用不到的旧块（创作账本、等级条、签到周条等）留在隐藏容器里，
 *       只保留 id 给脚本读写，不参与版面。
 */

export const mineTemplate = `<div class="container mine-wrap">

  <!-- 过滤页（/mine/works 等）的返回入口，主页由脚本 hidden。
       箭头直接写站内的扁平图标（Pixelarticons arrow-left），不要再靠 "←" 让
       emoji 替换生成 —— 那条路生成的是 22×14 的画布，再被 CSS 缩到 14×9，
       像素被插值糊掉，看着像细线图标，跟本页其他扁平图标不是一套。 -->
  <router-link class="back-bar" id="mineBack" to="/mine" hidden><svg class="bb-ico" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11v2H4v-2zM8 13v2H6v-2zm2 2v2H8v-2zm2 2v2h-2v-2zm-4-6V9H6v2z"/><path d="M10 15V7H8v8zm2 2V5h-2v12z"/></svg> 返回我的</router-link>

  <!-- ============ 1. 顶栏 ============ -->
  <header class="ig-top">
    <h1 class="ig-user" id="meName">未登录</h1>
    <div class="ig-top-actions">
      <router-link class="ig-ico-btn" to="/notifications" title="通知" aria-label="通知">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M9 2h6v2H9zM7 4h2v2H7zm8 0h2v2h-2zM5 6h2v7H5zm12 0h2v7h-2zM3 13h2v4H3zm16 0h2v4h-2z"/><path d="M3 15h18v2H3zm5 3h2v2H8zm6 0h2v2h-2zm-4 2h4v2h-4z"/></svg>
        <span class="ig-dot" id="lnkNotify"></span>
      </router-link>
      <router-link class="ig-ico-btn" to="/settings" title="设置" aria-label="设置">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 14H7v6H5v-6H2v-2h6v2Zm5 6h-2V10h2v10Zm9-2h-3v2h-2v-2h-1v-2h6v2Zm-3-4h-2V4h2v10ZM7 10H5V4h2v6Zm6-4h2v2H9V6h2V4h2v2Z"/></svg>
      </router-link>
    </div>
  </header>

  <!-- ============ 2. 头像 + 四项数据 ============ -->
  <section class="ig-hero">
    <router-link class="me-av" to="/avatar" id="meAv" title="画头像">
      <canvas id="meAvCanvas"></canvas>
    </router-link>

    <div class="ig-stats">
      <div class="stat-grid" id="statGrid">
        <div class="stat"><div class="stat-num">—</div><div class="stat-lab">加载中</div></div>
      </div>

      <!-- signCard 用 display:contents 展开，光尘 / 天数 / 等级直接排进数据行 -->
      <div class="m-card" id="signCard">
        <div class="ig-stat ig-stat-dust">
          <span class="dust-num" id="dustNum">0</span>
          <span class="dust-got" id="dustGot" hidden></span>
        </div>
        <div class="ig-stat ig-stat-days">
          <span id="signTotal">0</span>
        </div>
        <div class="ig-stat ig-stat-lv" id="lvBarHost"></div>

        <!-- 主页不展示、但脚本仍在读写的签到细节 -->
        <div class="ig-sign-hidden">
          <div class="sign-top">
            <div class="sign-streak">
              <div class="sign-num"><span id="signStreak">0</span> <small>天连续</small></div>
            </div>
            <span class="m-tip" id="signTip"></span>
          </div>
          <div class="sign-week" id="signWeek"></div>
          <div class="medals" id="medals"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ 3. 简介 ============ -->
  <section class="ig-bio">
    <div class="me-hero-bio" id="meBio">点此写简介</div>
    <div class="me-hero-sub" id="meHeroSub">登录后同步光尘与成就</div>
  </section>

  <!-- ============ 4. 两个等宽描边按钮 ============ -->
  <div class="ig-actions">
    <button class="sign-btn" id="signBtn" type="button">签到</button>
    <router-link class="ig-edit" to="/intro">编辑资料</router-link>
  </div>

  <!-- ============ 5. 高光圆入口（横向滑动） ============ -->
  <section class="ig-highlights">
    <div class="m-card" id="linkCard">
      <div class="m-links">

        <router-link class="m-link" to="/mine/works">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/><path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/></svg></span>
          <span class="ml-num" id="lnkWorks">0</span>
          <span>作品</span>
        </router-link>

        <router-link class="m-link" to="/mine/fav">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/></svg></span>
          <span class="ml-num" id="lnkFav"></span>
          <span>收藏</span>
        </router-link>

        <router-link class="m-link" to="/mine/gifted" id="lnkLikedBtn">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/><path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/></svg></span>
          <span class="ml-num" id="lnkLiked"></span>
          <span>送出</span>
        </router-link>

        <router-link class="m-link" to="/achieve">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/></svg></span>
          <span class="ml-num" id="lnkAch"></span>
          <span>成就</span>
        </router-link>

        <router-link class="m-link" to="/dustlog">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h14v2H6zm0 18h14v2H6zM20 4h2v16h-2zM4 4h2v16H4z"/><path d="M2 7h6v2H2zm0 4h6v2H2zm0 4h6v2H2zM16 4h2v16h-2z"/></svg></span>
          <span class="ml-num"></span>
          <span>光尘</span>
        </router-link>

        <router-link class="m-link" to="/mail">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 8h2v2H6zm2 2h2v2H8zm10-2h-2v2h2zm-2 2h-2v2h2zm-6 2h4v2h-4zM2 6h2v12H2zm18 0h2v12h-2zM4 4h16v2H4zm0 14h16v2H4z"/></svg></span>
          <span class="ml-num" id="lnkMail"></span>
          <span>信箱</span>
        </router-link>

        <router-link class="m-link" to="/chat">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4v2h16zm0 14H6v2h14zm2-12h-2v12h2zM4 4H2v18h2zm2 14H4v2h2z"/></svg></span>
          <span class="ml-num" id="lnkChat"></span>
          <span>好友</span>
        </router-link>

        <router-link class="m-link" to="/tasks">
          <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h2v14H4zm2 14h12v2H6zM18 6h2v14h-2zM6 4h2v2H6zm10 0h2v2h-2zm-6-2h4v2h-4zm0 4h4v2h-4zM8 2h2v6H8zm6 0h2v6h-2z"/></svg></span>
          <span class="ml-num" id="lnkTask"></span>
          <span>任务</span>
        </router-link>

      </div>
    </div>
  </section>

  <!-- ============ 6/7. 标签页 + 三份网格 ============ -->
  <!-- 三个标签是按钮不是链接：点它在**原地**换网格（作品 / 点赞 / 收藏），
       不改 URL、不走路由。子路由 /mine/works、/mine/gifted、/mine/fav
       仍然可以单独打开，那时这排标签由脚本隐藏。 -->
  <section class="ig-works">
    <nav class="ig-tabs" id="mineTabs" role="tablist" aria-label="我的内容">
      <button class="ig-tab on" id="mineTabWorks" type="button" role="tab" aria-selected="true" aria-controls="mineGrid" title="作品" aria-label="作品">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/><path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/></svg>
      </button>
      <button class="ig-tab" id="mineTabLiked" type="button" role="tab" aria-selected="false" aria-controls="likedGrid" title="点赞" aria-label="点赞">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/><path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/></svg>
      </button>
      <button class="ig-tab" id="mineTabFav" type="button" role="tab" aria-selected="false" aria-controls="favGrid" title="收藏" aria-label="收藏">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/></svg>
      </button>
    </nav>

    <!-- 过滤页用（/mine/works）；主页由脚本隐藏，只留 id -->
    <div class="m-card" id="mineCard">
      <div class="m-card-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/><path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/></svg>
        <span class="m-tip" id="mineTip"></span>
        <button class="lw-refresh" id="mineRefresh" type="button" data-label="刷新"></button>
      </div>
      <div class="mine-del-tip">右键（手机长按）任意一幅可以转发、保存或删掉它（删了找不回来）</div>
      <div class="mine-filter" id="mineFilter" hidden>
        <span class="mf-label">筛选</span>
        <div class="mf-chips" id="mineChips"></div>
      </div>
    </div>

    <div class="mine-grid" id="mineGrid"></div>
    <div class="ig-empty" id="mineEmpty"></div>
  </section>

  <!-- 点赞（送出过光尘的）/ 收藏：主页点标签切换时才显示，
       其余时候脚本给卡片加 hidden（高度为 0）；过滤页单独打开时也一样用这两块 -->
  <div id="likedSlot">
    <div class="m-card" id="likedCard">
      <div class="m-card-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/><path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/></svg>
        <span class="m-tip" id="likedTip"></span>
      </div>
      <div class="mine-grid" id="likedGrid"></div>
      <div class="ig-empty" id="likedEmpty"></div>
    </div>
    <div class="m-card" id="favCard">
      <div class="m-card-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/></svg>
        <span class="m-tip" id="favTip"></span>
      </div>
      <div class="mine-grid" id="favGrid"></div>
      <div class="ig-empty" id="favEmpty"></div>
    </div>
  </div>

  <!-- ============ 主页不用的旧块：只留 id，不参与版面 ============ -->
  <div class="ig-unused" hidden>
    <div class="m-card" id="statCard">
      <div class="m-card-title">创作账本</div>
      <div class="size-bars" id="sizeBars" hidden></div>
      <div class="best-work" id="bestWork" hidden></div>
    </div>
    <button id="mineMore" type="button" hidden>加载更多</button>
  </div>

</div>`
