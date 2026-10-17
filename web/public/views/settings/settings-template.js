/**
 * Settings 视图的HTML 模板
 *
 * 由 views/settings.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/settings.js 顶部。
 */

export const settingsTemplate = `<div class="container">
        <router-link class="st-back" to="/mine">← 我的</router-link>
      <details class="guide" id="guideBox">
        <summary>
          <span class="guide-hero">
            <b>👋 第一次来？两分钟看完这个网站能做什么</b>
            <i>像素小镇 · 和朋友一起在线画像素画</i>
          </span>
          <span class="guide-arrow">⌄</span>
        </summary>
        <div class="guide-body">
          <div class="guide-grid">
            <div class="g-item">
              <span class="g-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/>
  <path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/>
</svg></span>
              <b>一个人画</b>
              <i>16 / 32 / 64 三种尺寸，32 色彩板，橡皮、颜料桶、取色器、镜像、草稿槽，随时导出 PNG。</i>
            </div>
            <div class="g-item">
              <span class="g-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M19 21H5v-2h14v2ZM5 19H3v-4h2v4Zm16 0h-2v-4h2v4ZM13 5h2v2h2v2h-4v8h-2V9H7V7h2V5h2V3h2v2Z"/>
</svg></span>
              <b>发到社区</b>
              <i>上传作品进社区广场，别人可以送你光尘、投你一票，还能生成朋友圈小卡片分享。</i>
            </div>
            <div class="g-item">
              <span class="g-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/>
  <path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/>
</svg></span>
              <b>照片变像素</b>
              <i>用「像素相机」把照片一键转成像素画，再手动改几笔就是你的作品。</i>
            </div>
            <div class="g-item">
              <span class="g-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
<path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/>
</svg></span>
              <b>每周主题比赛</b>
              <i>开启后按题目作画，参赛作品能参加投票，赢的是本周最受欢迎的一张。</i>
            </div>
            <div class="g-item">
              <span class="g-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M21 7h2v5h-2zm-4-2h2v7h-2zm-4-2h2v8h-2zM9 3h2v8H9zM5 5h2v8H5zm14 0h2v2h-2zm-4-2h2v2h-2zm-4-2h2v2h-2zM7 3h2v2H7zm-4 8h2v2H3zm-2 2h2v2H1zm0 2h2v2H1zm2 2h2v2H3zm2 2h2v2H5zm2 2h12v2H7zm12-2h2v2h-2zm2-7h2v7h-2zM5 13h2v2H5zm2 2h2v2H7z"/>
</svg></span>
              <b>手型平移</b>
              <i>选 ✋ 只拖动画布不落笔；任何工具下点 ✥ 都能切成拖动模式。</i>
            </div>
          </div>
          <div class="guide-tips">
            <b><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/> <path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/> </svg>  三个上手小提示</b>
            <ul>
              <li>画错了按 <kbd>↩️</kbd> 撤销；手机上也可以直接点工具栏的撤销。</li>
              <li>点底部「社区」看看别人画了什么，喜欢的可以点♥；再点一次能取消。</li>
              <li>不想被复杂界面打扰？到下面「画板布局」里把用不到的都关掉。</li>
            </ul>
          </div>
          <button class="guide-close" id="guideClose" type="button">我知道了，开始画画</button>
        </div>
      </details>

      <details class="guide" id="authorNote">
        <summary>
          <span class="guide-hero">
            <b>💌 作者的话</b>
            <i>这个网站是谁做的，以及为什么需要你的支持</i>
          </span>
          <span class="guide-arrow">⌄</span>
        </summary>
        <div class="guide-body">
          <p class="an-p">
            「像素小镇」里的每一行代码、每一处界面，都是我借助 AI 一个字一个字搭出来的。
            说实话，一个人做完整点的东西很难，这个网站能走到今天，很大程度上靠的是 AI 帮我扛下了大部分的活。
          </p>
          <p class="an-p">
            也正因为这样，它更新得很慢。AI 本身要花钱调用接口，而我没有太多经费去长期承担这笔开销；
            加上我还要同时维护灯板那一端，能挤出来做网站的时间就非常有限。
            所以它不是被弃置了，而是真的<b>有心无力</b>——我不想随便糊弄你们，更不想让 AI 写出自己都看不懂的代码。
          </p>
          <p class="an-p an-quote">
            做这个网站，其实是为了圆我自己一个很小的愿望：<b>拥有一个真正属于自己的、能和朋友实时互动的小网站。</b><br />
            不是玩完就走的应用，不是关掉就消失的网页，而是一个我说了算、你也随时能来的地方。
            现在的它已经做到了——你们能一起画同一块画布，能看到彼此的笔迹，这就是我当初想要的全部。
          </p>
          <p class="an-p">
            继续维护它需要服务器和接口的钱。如果它陪你画过几次画，你愿意给我一点支持，
            它就能安稳地多运行一段时间，我也更有底气慢慢把想做的都补上。
          </p>
          <p class="an-p an-last">
            当然，赞助完全出于自愿，不给也一点都不影响使用。谢谢每一个愿意留下来画画的人。
          </p>
        </div>
      </details>

      <div class="header">
        <div class="header-text">
          <h1>设置</h1>
          <div class="header-sub">调整外观、了解像素小镇</div>
        </div>
      </div>

      <section class="group fold">
        <button class="fold-head" id="layFold" type="button" aria-expanded="false">
          <span class="fold-title">画板布局</span>
          <span class="fold-count" id="layCount"></span>
          <span class="fold-arrow">⌄</span>
        </button>
        <div class="fold-body" id="layFoldBody" hidden>
          <div class="group-hint">调整画板上显示哪些区域，让画布更大、界面更清爽。</div>
          <label class="lay-row">
            <input type="checkbox" id="layAllOn">
            <span class="lay-body"><b>全部显示</b><i>一键恢复默认</i></span>
          </label>
          <div class="lay-child" id="layBox"></div>
        </div>
      </section>

      <section class="group fold">
        <button class="fold-head" id="featFold" type="button" aria-expanded="false">
          <span class="fold-title">进阶功能</span>
          <span class="fold-count" id="featCount"></span>
          <span class="fold-arrow">⌄</span>
        </button>
        <div class="fold-body" id="featFoldBody" hidden>
          <div class="group-hint">这些功能默认都是关闭的，用不到就保持关闭，画板会更简单。只影响你这台设备。</div>
          <div id="featBox"></div>
          <div class="feat-all">
            <button class="feat-btn" id="featAllOff" type="button">全部关闭</button>
            <button class="feat-btn" id="featAllOn" type="button">全部开启</button>
          </div>
        </div>
      </section>

      <section class="group foldx">
        <button class="group-fold" id="foldLook" type="button" aria-expanded="true">
          <span class="group-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/> <path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/> </svg>  外观</span>
          <span class="fold-caret">▾</span>
        </button>
        <div class="fold-body" id="foldLookBody">
        <div class="row">
          <div>
            <div class="row-label">深色模式</div>
            <div class="row-desc">适合在夜里画画，保护眼睛</div>
          </div>
          <input class="switch" id="darkSwitch" type="checkbox" role="switch">
        </div>

        <div class="row row-col">
          <div class="slider-head">
            <div>
              <div class="row-label">动画强度</div>
              <div class="row-desc">
                动效越多越费电、低端机上越容易掉帧。卡就往左调
              </div>
            </div>
            <span class="slider-val" id="animLvVal">标准</span>
          </div>
          <div class="radio-row" id="animLvRow">
            <button class="radio-chip" type="button" data-animlv="off">关闭</button>
            <button class="radio-chip" type="button" data-animlv="low">省电</button>
            <button class="radio-chip" type="button" data-animlv="std">标准</button>
            <button class="radio-chip" type="button" data-animlv="rich">丰富</button>
          </div>
          <div class="anim-lv-tip" id="animLvTip"></div>
        </div>
        <div class="row row-col">
          <div class="slider-head">
            <div>
              <div class="row-label">底部导航透明度</div>
              <div class="row-desc">拖动即可实时预览，越低越通透</div>
            </div>
            <span class="slider-val" id="navOpVal">66%</span>
          </div>
          <input class="slider" id="navOpSlider" type="range" min="0" max="100" step="1" value="66"
                 aria-label="底部导航透明度">
          <div class="slider-presets" id="navOpPresets">
            <button type="button" data-v="0">全透明</button>
            <button type="button" data-v="35">很透</button>
            <button type="button" data-v="66">默认</button>
            <button type="button" data-v="88">偏实</button>
            <button type="button" data-v="100">完全不透明</button>
          </div>
          <div class="nav-preview" id="navPreview">
            <span class="np-bar">
              <i class="np-dot"></i><i class="np-dot"></i><i class="np-dot"></i><i class="np-dot"></i>
            </span>
            <span class="np-note">这就是底部导航的样子</span>
          </div>
        </div>
        <div class="row">
          <div>
            <div class="row-label">
              提示音效
              <!-- 开着的时候有个跳动的波形，一眼看出音效是开的 -->
              <span id="sfxWaveHost"></span>
            </div>
            <div class="row-desc">点按钮时的轻响，比如保存成功那声「叮」</div>
          </div>
          <input class="switch" id="sfxSwitch" type="checkbox" role="switch">
        </div>
        <div class="row row-col">
          <div class="slider-head">
            <div>
              <div class="row-label">音效音量</div>
              <div class="row-desc">松开手指试听一下，嫌吵就调小</div>
            </div>
            <span class="slider-val" id="sfxVolVal">80%</span>
          </div>
          <input class="slider" id="sfxVolSlider" type="range" min="0" max="100" step="5" value="80"
                 aria-label="音效音量">
          <div class="slider-presets" id="sfxVolPresets">
            <button type="button" data-v="0">静音</button>
            <button type="button" data-v="30">轻</button>
            <button type="button" data-v="60">适中</button>
            <button type="button" data-v="80">默认</button>
            <button type="button" data-v="100">最大</button>
          </div>
        </div>
        <div class="row row-col">
          <div>
            <div class="row-label">配色主题</div>
            <div class="row-desc">给小镇换一身衣裳</div>
          </div>
          <div class="theme-groups" id="themePicks"></div>
          <div class="theme-hint" id="themeNameHint">点一下即可切换</div>
        </div>
        <div class="row">
          <div>
            <div class="row-label">玻璃导航</div>
            <div class="row-desc">底部导航使用苹果风的毛玻璃质感</div>
          </div>
          <input class="switch" id="glassSwitch" type="checkbox" role="switch">
        </div>
        </div>
      </section>

      <section class="group foldx">
        <button class="group-fold" id="foldNav" type="button" aria-expanded="true">
          <span class="group-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M11 20h2V4h-2zm2-12h2V6h-2zm2 2h2V8h-2zm2 2h2v-2h-2zm-6-4H9V6h2z"/> <path d="M15 10H7V8h8zm2 2H5v-2h12z"/> </svg>  启动与导航</span>
          <span class="fold-caret">▾</span>
        </button>
        <div class="fold-body" id="foldNavBody">
        <div class="row row-col">
          <div>
            <div class="row-label">启动时打开</div>
            <div class="row-desc">每次打开小镇，先把你放到哪儿</div>
          </div>
          <div class="radio-row" id="entranceRow"></div>
        </div>
        <div class="row row-col">
          <div>
            <div class="row-label">导航栏位置</div>
            <div class="row-desc">摆在屏幕下边还是上边，切完立刻生效</div>
          </div>
          <div class="radio-row" id="navPosRow"></div>
        </div>
        <div class="row row-col">
          <div>
            <div class="row-label">导航栏样式</div>
            <div class="row-desc">除了毛玻璃还有 5 种样子，切完立刻生效</div>
          </div>
          <div class="nav-style-row" id="navStyleRow"></div>
        </div>
        <div class="row row-col">
          <div>
            <div class="row-label">导航栏顺序</div>
            <div class="row-desc">点一下换位置，怎么顺手怎么排</div>
          </div>
          <div class="order-list" id="navOrderList"></div>
        </div>
        </div>
      </section>

      <section class="group">
        <div class="group-title">版本与更新</div>
        <div class="upd-card">
          <div class="upd-top">
            <div class="upd-main">
              <div class="upd-label">当前版本</div>
              <div class="upd-ver" id="updVer">读取中…</div>
            </div>
            <button class="upd-btn" id="updBtn" type="button">刷新到最新版</button>
          </div>
          <div class="upd-note" id="updNote">界面还是老样子、新功能没出现？点右边重新拉取一次最新代码。草稿、登录和设置都不会丢。</div>
        </div>
      </section>

      <section class="group">
        <div class="group-title">更多</div>
        <router-link class="entry" to="/terms">
          <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M6 4H4v16h2zm10-2H6v2h10zm4 4h-2v14h2zm-2 14H6v2h12zM16 4h2v2h-2zm-4 0h2v6h-2z"/> <path d="M12 8h6v2h-6z"/> </svg> </span>
          <span class="entry-body">
            <span class="entry-label">使用条款</span>
            <div class="entry-desc">服务性质、禁止事项与责任划分</div>
          </span>
          <span class="entry-arrow">›</span>
        </router-link>
        <router-link class="entry" to="/copyright">
          <span class="entry-ico">©️</span>
          <span class="entry-body">
            <span class="entry-label">版权声明与侵权投诉</span>
            <div class="entry-desc">权利人可以在这里提交通知 · 48 小时内处理</div>
          </span>
          <span class="entry-arrow">›</span>
        </router-link>
        <router-link class="entry" to="/changelog">
          <span class="entry-ico">📦</span>
          <span class="entry-body">
            <span class="entry-label">更新日志</span>
            <div class="entry-desc">看看像素小镇最近又更新了什么</div>
          </span>
          <span class="entry-arrow">›</span>
        </router-link>
        <router-link class="entry" to="/faq">
          <span class="entry-ico">❓</span>
          <span class="entry-body">
            <span class="entry-label">常见问题</span>
            <div class="entry-desc">为什么没有 128×128？以及其他说明</div>
          </span>
          <span class="entry-arrow">›</span>
        </router-link>
      </section>

      <section class="group">
        <div class="group-title">联系与社区</div>
        <div class="contact-card">
          <router-link class="entry" to="/mod">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 2h16v2H4zM2 4h2v10H2zm18 0h2v10h-2zM4 14h2v2H4zm2 2h2v2H6zm4 4h4v2h-4zm10-6h-2v2h2zm-2 2h-2v2h2zm-2 2h-2v2h2zm-6 0H8v2h2z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">审核记录</span>
              <div class="entry-desc">我下架过哪些作品 · 误下架可以一键恢复</div>
            </span>
            <span class="entry-arrow">›</span>
          </router-link>
          <div class="entry-sep"></div>
          <router-link class="entry" to="/faq">
            <span class="entry-ico">❓</span>
            <span class="entry-body">
              <span class="entry-label">问题反馈</span>
              <div class="entry-desc">常见问题解答 · 微信 Tux123233 · 邮箱 linsifan123233@petalmail.com</div>
            </span>
            <span class="entry-arrow">›</span>
          </router-link>
        </div>
      </section>

            <section class="group">
        <div class="group-title">请作者喝杯咖啡</div>
        <div class="qr-row">
          <div class="qr-item">
            <img src="/images/alipay-code.jpg" alt="支付宝收款码">
            <b>支付宝</b>
          </div>
          <div class="qr-item">
            <img src="/images/tip-code.jpg" alt="微信赞赏码">
            <b>微信</b>
          </div>
        </div>
        <!--
          措辞是刻意这么写的，别改回「赞赏作品」那类说法。

          这一段的定位是「读者自愿赠与作者个人」，用来贴补服务器和域名费用，
          跟站上的任何作品、任何功能都**没有对价关系**。
          写成「喜欢这幅画就赞赏」会被理解成「为内容付费」，
          那正好踩中避风港里「未从用户提供的内容直接获得经济利益」这一条 ——
          一旦被认定靠用户的侵权内容赚钱，前面所有免责条款全部失效。
        -->
        <div class="qr-note">
          这是给作者个人的自愿赠与，用来贴补服务器和域名开销。<br>
          <b>与站内任何作品、任何功能都没有关系</b>，也不会因此获得任何特权或授权。<br>
          不给也完全不影响使用 —— 像素小镇一直免费，以后也是。
        </div>
      </section>

      <section class="group">
        <div class="group-title">致谢</div>
        <div class="credit-card">
          <!-- 界面图标来自 Pixelarticons（MIT，第一条），画布里的像素图仍是站内自绘。
               音效还留着 gamersounds.com 的十个文件，那一条在下面。 -->
          <a class="entry" href="https://pixelarticons.com/" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/>
  <path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">Pixelarticons</span>
              <div class="entry-desc">本站的扁平像素图标 · MIT License · pixelarticons.com</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
          <div class="entry-sep"></div>
          <a class="entry" href="https://gamersounds.com/" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M17 22h-2v-2h-2v-2h2V6h-2V4h2V2h2v20Zm-4-4h-2v-2h2v2ZM11 8v2H9v4h2v2H7V8h4Zm2 0h-2V6h2v2Z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">gamersounds.com</span>
              <div class="entry-desc">十个音效文件（点击 / 命中 / 火焰 / 金币 / 升级等）· 免费游戏音效素材</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
          <div class="entry-sep"></div>
          <a class="entry" href="https://github.com/Konsheng/Sensitive-lexicon" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 2h16v2H4zM2 4h2v10H2zm18 0h2v10h-2zM4 14h2v2H4zm2 2h2v2H6zm4 4h4v2h-4zm10-6h-2v2h2zm-2 2h-2v2h2zm-2 2h-2v2h2zm-6 0H8v2h2z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">Sensitive-lexicon</span>
              <div class="entry-desc">内容安全词库 · MIT License · Copyright (c) 2024~2099 Konsheng</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
          <div class="entry-sep"></div>
          <a class="entry" href="https://opencode.ai" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM6 16h2v2H6zm2-2h2v2H8zm-2-2h2v2H6z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">OpenCode</span>
              <div class="entry-desc">本站代码编写工具</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
          <div class="entry-sep"></div>
          <a class="entry" href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M5 3h14v2H5zm0 16h14v2H5zM3 5h2v14H3zm16 0h2v14h-2zM9 7h6v2H9zm0 8h6v2H9zM7 9h2v6H7zm8 0h2v6h-2zm-4-8h2v2h-2zm0 20h2v2h-2zM1 11h2v2H1zm20 0h2v2h-2zm0-4h2v2h-2zm0 8h2v2h-2zM1 15h2v2H1zm0-8h2v2H1zm6-6h2v2H7zm8 0h2v2h-2zm0 20h2v2h-2zm-8 0h2v2H7z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">DeepSeek Harness</span>
              <div class="entry-desc">本站的开发工具链 · 开源 · DeepSeek</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
          <div class="entry-sep"></div>
          <a class="entry" href="https://www.linux.org" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M15 22H9v-2h6v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM3 14h4v4H5v-2H1v-4h2v2Zm20 2h-4v2h-2v-4h4v-2h2v4Zm-10-3h-2v-2H9V9h6v2h-2v2Zm-8-1H3v-2h2v2Zm16 0h-2v-2h2v2ZM7 10H5V8h2v2Zm12 0h-2V8h2v2ZM9 8H7V4h2v4Zm8 0h-2V4h2v4Zm-2-4H9V2h6v2Z"/></svg></span>
            <span class="entry-body">
              <span class="entry-label">Linux</span>
              <div class="entry-desc">本站的开发环境</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
        </div>
        <div class="credit-note">本项目源码与词库均遵循各自许可证要求，词库仅在服务端用于发布内容校验。</div>
      </section>

      <section class="group">
        <div class="group-title">友链</div>
        <div class="credit-card">
          <a class="entry" href="https://www.fayederolex.top" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 6h7v2H4zm0 10h7v2H4zM2 8h2v8H2zm18-2h-7v2h7zm0 10h-7v2h7zm2-8h-2v8h2zM7 11h10v2H7z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">Fayeder Olex</span>
              <div class="entry-desc">www.fayederolex.top</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
          <div class="entry-sep"></div>
          <a class="entry" href="https://blog.ltx88.icu" target="_blank" rel="noopener noreferrer">
            <span class="entry-ico"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path d="M4 6h7v2H4zm0 10h7v2H4zM2 8h2v8H2zm18-2h-7v2h7zm0 10h-7v2h7zm2-8h-2v8h2zM7 11h10v2H7z"/>
</svg></span>
            <span class="entry-body">
              <span class="entry-label">ltx88 blog</span>
              <div class="entry-desc">blog.ltx88.icu</div>
            </span>
            <span class="entry-arrow">›</span>
          </a>
        </div>
      </section>

      <div class="notice">
        本画板仅用于个人学习与技术交流。请勿上传、绘制、发布任何违反中华人民共和国法律法规的内容。上传者须对自己发布的内容负全部法律责任。本平台有权在不事先通知的情况下删除违规内容，并保留追究法律责任的权利。
      </div>

      <div class="copyright">© 2026 像素小镇 · 版权所有 · 作者 Lin Sifan</div>
    </div>`
