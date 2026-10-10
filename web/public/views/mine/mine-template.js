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
        <span class="me-av-edit">✏️</span>
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
      <div class="m-card-title">📅 今日报到<span class="m-tip" id="signTip">存在本机 · 登录可同步</span></div>
      <div class="dust-bar" id="dustBar">
        <span class="dust-ico">✨</span>
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

    <!-- 邀请好友 -->
    <div class="m-card" id="inviteCard" hidden>
      <div class="m-card-title">🎁 邀请好友 · 赚光尘</div>
      <div class="invite-rules">
        好友用你的邀请码注册，他立得 <b>20</b> 光尘；好友发布第一幅作品，你立得 <b>100</b> 光尘。
      </div>
      <div class="invite-code-label">你的专属邀请码</div>
      <span class="invite-code" id="inviteCode">·······</span>
      <button class="invite-copy" id="inviteCopy" type="button">复制邀请链接</button>
      <div class="invite-stat" id="inviteStat"></div>
      <div class="invite-bind" id="inviteBindBox" hidden>
        <div class="invite-bind-tip">有人邀请你来小镇？填上他的邀请码（只能绑定一次，不可更改）</div>
        <div class="invite-bind-row">
          <input class="invite-bind-input" id="inviteBindInput" maxlength="7"
                 type="text" autocomplete="off" placeholder="7 位邀请码">
          <button class="invite-bind-btn" id="inviteBindBtn" type="button">绑定</button>
        </div>
      </div>
    </div>

    <!-- 创作数据 -->
    <div class="m-card" id="statCard">
      <div class="m-card-title">📊 创作账本</div>
      <div class="stat-grid" id="statGrid">
        <div class="stat"><div class="stat-num">—</div><div class="stat-lab">加载中</div></div>
      </div>
      <div class="size-bars" id="sizeBars" hidden></div>
      <div class="best-work" id="bestWork" hidden></div>
    </div>

    <!-- 快捷入口 -->
    <div class="m-card" id="linkCard">
      <div class="m-card-title">🔗 常去的地方</div>
      <div class="m-links">
        <router-link class="m-link" to="/notifications">
          <span class="ml-ico">🔔</span>
          <span class="ml-num" id="lnkNotify"></span>
          <span>通知</span>
        </router-link>
        <router-link class="m-link" to="/mine/fav">
          <span class="ml-ico">☆</span>
          <span class="ml-num" id="lnkFav"></span>
          <span>收藏</span>
        </router-link>
        <router-link class="m-link" to="/mine/works">
          <span class="ml-ico">🖼️</span>
          <span class="ml-num" id="lnkWorks">0</span>
          <span>我的作品</span>
        </router-link>
        <router-link class="m-link" to="/mine/gifted">
          <span class="ml-ico">✨</span>
          <span class="ml-num" id="lnkLiked"></span>
          <span>送出的</span>
        </router-link>
        <router-link class="m-link" to="/dustlog">
          <span class="ml-ico">📒</span>
          <span class="ml-num"></span>
          <span>光尘明细</span>
        </router-link>
        <router-link class="m-link" to="/mail">
          <span class="ml-ico">✉️</span>
          <span class="ml-num" id="lnkMail"></span>
          <span>信箱</span>
        </router-link>
        <router-link class="m-link" to="/chat">
          <span class="ml-ico">💬</span>
          <span class="ml-num" id="lnkChat"></span>
          <span>好友</span>
        </router-link>
        <router-link class="m-link" to="/rank">
          <span class="ml-ico">🏆</span>
          <span class="ml-num" id="lnkRank"></span>
          <span>排行榜</span>
        </router-link>
        <router-link class="m-link" to="/tasks">
          <span class="ml-ico">📋</span>
          <span class="ml-num" id="lnkTask"></span>
          <span>每日任务</span>
        </router-link>
        <router-link class="m-link" to="/achieve">
          <span class="ml-ico">🏅</span>
          <span class="ml-num" id="lnkAch"></span>
          <span>成就</span>
        </router-link>
        <router-link class="m-link" to="/intro">
          <span class="ml-ico">👤</span>
          <span>个人信息</span>
        </router-link>
        <router-link class="m-link" to="/settings">
          <span class="ml-ico">⚙️</span>
          <span>设置</span>
        </router-link>
        <a class="m-link" href="/paint">
          <span class="ml-ico">🎨</span>
          <span>去画</span>
        </a>
      </div>
    </div>

    <a href="https://yhfx.jwznb.com/share?key=KkJt79XhQzW4&ts=1791048271" target="_blank" rel="noopener" class="cloudhu-btn">
      🏠 加入云湖【像素小镇 · 治愈小窝】交流群
    </a>

    <a href="https://convey-9jw5oj73x0i.qoder.zone" target="_blank" rel="noopener" class="portal-btn">
      🚀 像素小镇传送门
    </a>

    <!-- 我的作品：页内完整列表，只显示自己的 -->
    <div class="m-card" id="mineCard">
      <div class="m-card-title">🎨 我的画<span class="m-tip" id="mineTip"></span><button class="lw-refresh" id="mineRefresh" type="button" data-label="刷新"></button></div>
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
