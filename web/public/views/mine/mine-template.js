/**
 * Mine 视图的HTML 模板
 *
 * 由 views/mine.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/mine.js 顶部。
 */

export const mineTemplate = `<div class="container mine-wrap">
    <div class="me-hero">
      <router-link class="me-av" to="/avatar" id="meAv" title="画头像">
        <canvas id="meAvCanvas"></canvas>
 <span class="me-av-edit"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16H6V18H8V20H10V22H2V14H4V16ZM12 20H10V18H12V20ZM14 18H12V16H14V18ZM10 16H8V14H10V16ZM16 16H14V14H16V16ZM6 14H4V12H6V14ZM12 14H10V12H12V14ZM18 14H16V12H18V14ZM8 12H6V10H8V12ZM14 12H12V10H14V12ZM20 12H18V10H20V12ZM10 10H8V8H10V10ZM18 10H16V8H18V10ZM22 10H20V8H22V10ZM12 8H10V6H12V8ZM16 8H14V6H16V8ZM20 8H18V6H20V8ZM14 6H12V4H14V6ZM18 6H16V4H18V6ZM16 4H14V2H16V4Z"/></svg> </span>
      </router-link>
      <div class="me-hero-txt">
        <h1 class="me-hero-name" id="meName">未登录</h1>
        <div class="me-hero-bio" id="meBio">点此写简介</div>
        <div class="me-hero-sub" id="meHeroSub">登录后同步光尘与成就</div>
      </div>
    </div>

    <router-link class="back-bar" id="mineBack" to="/mine" hidden>← 返回我的</router-link>

    <!-- 签到 -->
    <div class="m-card" id="signCard">
 <div class="m-card-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14v2H5zm0 16h14v2H5zM3 10h2v10H3zm0-4h2v2H3zm16 0h2v2h-2zm0 4h2v10h-2zM3 8h18v2H3zm12-6h2v2h-2zM7 2h2v2H7z"/></svg> 今日报到<span class="m-tip" id="signTip">存在本机 · 登录可同步</span></div>
      <div class="dust-bar" id="dustBar">
 <span class="dust-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/><path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/></svg> </span>
        <span class="dust-label">我的光尘</span>
        <span class="dust-num" id="dustNum">0</span>
        <span class="dust-got" id="dustGot" hidden></span>
      </div>
      <!-- 小镇等级条。数据来自 renderStats 拿到的统计，纯前端算，不改后端 -->
      <div id="lvBarHost" style="margin-top:12px"></div>

      <div class="sign-top">
        <div class="sign-streak">
          <div class="sign-num"><span id="signStreak">0</span> <small>天连续</small></div>
          <div class="sign-sub">累计报到 <span id="signTotal">0</span> 天</div>
        </div>
        <button class="sign-btn" id="signBtn" type="button">报到</button>
      </div>
      <div class="sign-week" id="signWeek"></div>
      <div class="medals" id="medals"></div>
    </div>

      </div>
    </div>

    <!-- 创作数据 -->
    <div class="m-card" id="statCard">
 <div class="m-card-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM7 11h2v6H7zm4-4h2v10h-2zm4 6h2v4h-2z"/></svg> 创作账本</div>
      <div class="stat-grid" id="statGrid">
        <div class="stat"><div class="stat-num">—</div><div class="stat-lab">加载中</div></div>
      </div>
      <div class="size-bars" id="sizeBars" hidden></div>
      <div class="best-work" id="bestWork" hidden></div>
    </div>

    <!-- 快捷入口 -->
    <div class="m-card" id="linkCard">
 <div class="m-card-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h7v2H4zm0 10h7v2H4zM2 8h2v8H2zm18-2h-7v2h7zm0 10h-7v2h7zm2-8h-2v8h2zM7 11h10v2H7z"/></svg> 常去的地方</div>
      <div class="m-links">
        <router-link class="m-link" to="/notifications">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M9 2h6v2H9zM7 4h2v2H7zm8 0h2v2h-2zM5 6h2v7H5zm12 0h2v7h-2zM3 13h2v4H3zm16 0h2v4h-2z"/><path d="M3 15h18v2H3zm5 3h2v2H8zm6 0h2v2h-2zm-4 2h4v2h-4z"/></svg> </span>
          <span class="ml-num" id="lnkNotify"></span>
          <span>通知</span>
        </router-link>
        <router-link class="m-link" to="/mine/fav">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/></svg> </span>
          <span class="ml-num" id="lnkFav"></span>
          <span>收藏</span>
        </router-link>
        <router-link class="m-link" to="/mine/works">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/><path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/></svg> </span>
          <span class="ml-num" id="lnkWorks">0</span>
          <span>我的作品</span>
        </router-link>
        <router-link class="m-link" to="/mine/gifted">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/><path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/></svg> </span>
          <span class="ml-num" id="lnkLiked"></span>
          <span>送出的</span>
        </router-link>
        <router-link class="m-link" to="/dustlog">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h14v2H6zm0 18h14v2H6zM20 4h2v16h-2zM4 4h2v16H4z"/><path d="M2 7h6v2H2zm0 4h6v2H2zm0 4h6v2H2zM16 4h2v16h-2z"/></svg> </span>
          <span class="ml-num"></span>
          <span>光尘明细</span>
        </router-link>
        <router-link class="m-link" to="/mail">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 8h2v2H6zm2 2h2v2H8zm10-2h-2v2h2zm-2 2h-2v2h2zm-6 2h4v2h-4zM2 6h2v12H2zm18 0h2v12h-2zM4 4h16v2H4zm0 14h16v2H4z"/></svg> </span>
          <span class="ml-num" id="lnkMail"></span>
          <span>信箱</span>
        </router-link>
        <router-link class="m-link" to="/chat">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4v2h16zm0 14H6v2h14zm2-12h-2v12h2zM4 4H2v18h2zm2 14H4v2h2z"/></svg> </span>
          <span class="ml-num" id="lnkChat"></span>
          <span>好友</span>
        </router-link>
        <router-link class="m-link" to="/rank">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/></svg> </span>
          <span class="ml-num" id="lnkRank"></span>
          <span>排行榜</span>
        </router-link>
        <router-link class="m-link" to="/tasks">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h2v14H4zm2 14h12v2H6zM18 6h2v14h-2zM6 4h2v2H6zm10 0h2v2h-2zm-6-2h4v2h-4zm0 4h4v2h-4zM8 2h2v6H8zm6 0h2v6h-2z"/></svg> </span>
          <span class="ml-num" id="lnkTask"></span>
          <span>每日任务</span>
        </router-link>
        <router-link class="m-link" to="/achieve">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/></svg> </span>
          <span class="ml-num" id="lnkAch"></span>
          <span>成就</span>
        </router-link>
        <router-link class="m-link" to="/intro">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M9 2h6v2H9zm0 8h6v2H9zm6-6h2v6h-2zM7 4h2v6H7zM4 18h2v4H4zm14 0h2v4h-2zM8 14h8v2H8zm-2 2h2v2H6zm10 0h2v2h-2z"/></svg> </span>
          <span>个人信息</span>
        </router-link>
        <router-link class="m-link" to="/settings">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 14H7v6H5v-6H2v-2h6v2Zm5 6h-2V10h2v10Zm9-2h-3v2h-2v-2h-1v-2h6v2Zm-3-4h-2V4h2v10ZM7 10H5V4h2v6Zm6-4h2v2H9V6h2V4h2v2Z"/></svg> </span>
          <span>设置</span>
        </router-link>
        <a class="m-link" href="/paint">
 <span class="ml-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/><path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/></svg> </span>
          <span>去画</span>
        </a>
      </div>
    </div>

    <a href="https://yhfx.jwznb.com/share?key=KkJt79XhQzW4&ts=1791048271" target="_blank" rel="noopener" class="cloudhu-btn">
 加入云湖【像素小镇 · 治愈小窝】交流群
    </a>

    <a href="https://convey-9jw5oj73x0i.qoder.zone" target="_blank" rel="noopener" class="portal-btn">
 像素小镇传送门
    </a>

    <!-- 我的作品：页内完整列表，只显示自己的 -->
    <div class="m-card" id="mineCard">
 <div class="m-card-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/><path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/></svg> 我的画<span class="m-tip" id="mineTip"></span><button class="lw-refresh" id="mineRefresh" type="button" data-label="刷新"></button></div>
      <div class="mine-del-tip">右键（手机长按）任意一幅可以转发、保存或删掉它（删了找不回来）</div>
      <div class="mine-filter" id="mineFilter" hidden>
        <span class="mf-label">筛选</span>
        <div class="mf-chips" id="mineChips"></div>
      </div>
      <div class="mine-grid" id="mineGrid"></div>
      <div id="mineEmpty"></div>
    </div>

    <!-- 「送过光尘的」不再在主页底部占一块了（用户要求删掉）。
         要看的话走「我的」里「送出的」那个入口，或者直接开 /mine/gifted，
         那条路由还在，loadLiked 也没动。 -->
    <div id="likedSlot"></div>
  </div>`
