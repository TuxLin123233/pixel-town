/**
 * Gallery 视图的HTML 模板
 *
 * 由 views/gallery.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/gallery.js 顶部。
 *
 * 布局：社区页按「信息流」排 —— 顶栏 → 今日画师 → 单列 feed。
 * 活动区（今日一题 / 大赛 / 佳作 / 发现）、作者页、免责声明和页脚
 * 全部排在 feed 下面，id 一个不少（gallery.js 按 id 取元素）。
 * 作品卡（.card）由 gallery.js 的 appendCards 动态生成，模板里没有。
 */

export const galleryTemplate = `<div class="container">
      <div class="header">
        <div class="header-text">
          <h1>社区</h1>
          <div id="count">加载中…</div>
        </div>
        <router-link class="ig-bell" to="/notifications" aria-label="通知">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 2h6v2H9zM8 4h2v2H8zM6 6h2v8H6zm12-2h2v10h-2zM4 16h2v4H4zm14 0h2v4h-2zM7 19h10v2H7zM12 10h2v2h-2z"/></svg>
        </router-link>
      </div>

      <!-- 今日画师：一排圆形头像，点进去看作者主页。由 gallery.js 填充 -->
      <div class="stories" id="stories"></div>

      <!-- 搜索 / 筛选：按信息流改版后不再露出搜索框和筛选按钮，
           只保留「当前筛选」这一行胶囊（无筛选时 chipRow 自带 hidden，
           整块高度为 0，feed 紧贴今日画师）。id 全部保留给 gallery.js。 -->
      <section class="finder" id="finder">
        <div class="search-row">
          <input class="search-input" id="searchInput" type="search" placeholder="搜作品名、作者或标签…" autocomplete="off">
          <button class="search-clear" id="searchClear" type="button" hidden></button>
        </div>
        <div class="chip-row" id="chipRow" hidden></div>
        <div class="tag-cloud" id="tagCloud" hidden></div>

        <div class="filter-panel" id="filterPanel" hidden>
          <div class="fp-group" data-group="method">
            <span class="fp-label">画布</span>
            <div class="fp-chips" id="fpMethod"></div>
          </div>
          <div class="fp-group" data-group="size">
            <span class="fp-label">尺寸</span>
            <div class="fp-chips" id="fpSize"></div>
          </div>
          <div class="fp-group" data-group="range">
            <span class="fp-label">时间</span>
            <div class="fp-chips" id="fpRange"></div>
          </div>
          <div class="fp-group" data-group="sort">
            <span class="fp-label">排序</span>
            <div class="fp-chips" id="fpSort"></div>
          </div>
          <div class="fp-group" data-group="extra">
            <span class="fp-label">其它</span>
            <div class="fp-chips" id="fpExtra"></div>
          </div>
          <div class="fp-foot">
            <span class="fp-count" id="fpCount"></span>
            <button class="fp-reset" id="fpReset" type="button">全部重置</button>
          </div>
        </div>

        <!-- 分区标题（按画布类型分组时用） -->
        <div class="sec-bar" id="secBar" hidden></div>
      </section>

      <!-- 单列 feed：gallery.js 往这里 append 帖子（.card） -->
      <div id="gallery" class="gallery-grid"></div>
      <div id="sentinel" class="status">加载中…</div>
      <div id="status" class="status" hidden></div>

      <section class="author-page" id="authorPage" hidden>
        <div class="author-head">
          <button class="author-back" id="authorBack" type="button">← 返回全部</button>
          <div class="author-id">
            <div class="author-av" id="authorAv"><span class="author-av-ph">?</span></div>
            <div class="author-id-txt">
              <span class="author-name" id="authorName"></span>
              <span class="author-bio" id="authorBio" hidden></span>
              <span class="author-count" id="authorCount"></span>
            </div>
          </div>
        </div>
        <div class="author-works" id="authorWorks"></div>
      </section>

      <section class="daily" id="dailyPanel" hidden>
        <div class="daily-head">
  <span class="daily-title"> 今日一题</span>
          <span class="daily-day" id="dailyDay"></span>
        </div>
        <div class="daily-theme">今日题目《<b id="dailyTheme"></b>》</div>
        <div class="daily-prompt" id="dailyPrompt"></div>
        <div class="daily-cta-row">
          <a class="daily-cta" id="dailyCta" href="/paint"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/> <path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/> </svg>  去创作</a>
          <span class="daily-tip" id="dailyTip"></span>
        </div>
        <div class="daily-top" id="dailyTop"></div>
      </section>

      <section class="contest" id="contestPanel" hidden>
        <div class="contest-head">
          <span class="contest-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/> </svg>  本周大赛</span>
          <span class="contest-badge" id="contestBadge">进行中</span>
        </div>
        <div class="contest-theme">本周主题《<b id="contestTheme"></b>》</div>
        <div class="contest-prompt" id="contestPrompt"></div>
        <div class="contest-meta" id="contestMeta"></div>
        <div class="contest-cta-row">
          <router-link class="contest-cta" to="/paint?contest=1"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/> <path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/> </svg>  去创作参赛</router-link>
          <span class="contest-tip" id="contestTip"></span>
        </div>
        <div class="contest-top" id="contestTop"></div>
      </section>

      <section class="featured" id="featured" hidden>
        <div class="featured-head">
          <span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/> </svg>  佳作展示</span>
          <div class="range-tabs" id="rangeTabs">
            <button type="button" data-range="all" class="active">总榜</button>
            <button type="button" data-range="today">今日</button>
            <button type="button" data-range="week">本周</button>
          </div>
        </div>
        <div class="featured-sub" id="featuredSub">按收到的光尘排名 Top 5</div>
        <div class="featured-row" id="featuredRow"></div>
      </section>

      <section class="discover" id="discover">
        <div class="discover-head">
          <div class="discover-text">
            <b><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M22 22h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-6-2H6v-2h8v2Zm4 0h-2v-2h2v2ZM6 16H4v-2h2v2Zm10 0h-2v-2h2v2ZM4 14H2V6h2v8Zm14 0h-2V6h2v8ZM6 6H4V4h2v2Zm10 0h-2V4h2v2Zm-2-2H6V2h8v2Z"/> </svg>  发现</b>
            <i>随机翻出一件旧作品，给被时间埋掉的好东西一次机会</i>
          </div>
          <button class="discover-btn" id="discoverBtn" type="button">掷一个</button>
        </div>
        <div class="discover-body" id="discoverBody">
          <div class="discover-empty">手气不错的话，能翻出别人埋在底下的老画</div>
        </div>
      </section>

      <div class="disclaimer">
        以下作品均来自全网上传。全部作品仅支持预览，不可载入作画，请尊重原作者，切勿抄袭或直接提交他人作品。
        本画板仅用于个人学习与技术交流，上传者须对自己发布的内容负全部法律责任。
        <div class="disclaimer-report">发现违规内容？请联系微信 Tux123233 或邮箱 linsifan123233@petalmail.com 举报。</div>
      </div>
      <div class="copyright">© 2026 像素小镇 · 版权所有 · 作者 Lin Sifan</div>
    </div>

    <div class="preview-overlay" id="previewOverlay" hidden>
      <!-- preview-box 支持往下一拖关闭：评论多的时候不用去够右上角的按钮 -->
      <div class="preview-box" id="previewBox">
        <div class="preview-grab" aria-hidden="true"></div>
        <div class="preview-head">
          <span class="preview-title" id="previewTitle">作品预览</span>
          <button class="preview-close" id="previewClose" type="button">关闭</button>
        </div>
        <div class="preview-body" id="previewBody">
        <!-- 画布单独包一层：这块要归「往下一拖关闭」的手势管。
             touch-action:none 是必须的 —— 评论区展开后弹窗本身可滚，
             浏览器会把纵向拖动当成原生滚动，抢走指针并发 pointercancel，
             结果就是按下去立刻被取消、怎么拖都关不掉。 -->
        <div class="preview-art" id="previewArt">
        <canvas id="previewCanvas" width="16" height="16" hidden></canvas>
        <img id="previewImg" alt="作品预览" draggable="false">
        </div>
        <div class="preview-info">
          <div class="preview-who">
            <span class="preview-av" id="previewAv"></span>
            <button class="preview-author-btn" id="previewAuthor" type="button"></button>
  <button class="preview-report" id="previewReportUser" type="button" hidden> 举报该用户</button>
          </div>
          <div class="preview-bio" id="previewBio" hidden></div>
          <span id="previewTime" class="preview-time"></span>
        </div>
        <div class="preview-like">
          <button class="like-btn" id="previewLike" type="button" title="送光尘给这幅画"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/> <path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/> </svg>  <span id="previewLikeCount">0</span></button>
  <button class="fav-btn" id="previewFav" type="button" title="收藏这幅画"> 收藏</button>
          <button class="vote-btn" id="previewVoteBtn" type="button" hidden><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/> </svg>  投一票</button>
          <button class="share-btn" id="previewShare" type="button"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 6h7v2H4zm0 10h7v2H4zM2 8h2v8H2zm18-2h-7v2h7zm0 10h-7v2h7zm2-8h-2v8h2zM7 11h10v2H7z"/> </svg>  复制链接</button>
          <button class="share-btn" id="previewCard" type="button"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3zM3 19h18v2H3zM3 5h2v14H3zM19 5h2v14h-2zM7 9h4v2H7zM13 9h4v2h-4zM7 13h4v2H7zM13 13h4v2h-4z"/></svg> 卡片</button>
          <button class="share-btn" id="previewPaletteBtn" type="button" aria-expanded="false"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/> <path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/> </svg>  用色</button>
  <button class="report-hold" id="previewReport" type="button"> 长按举报</button>
        </div>
        <div class="cmt-box" id="cmtBox">
          <div class="cmt-head">
            <span class="cmt-title"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M20 2H4v2h16zm0 14H6v2h14zm2-12h-2v12h2zM4 4H2v18h2zm2 14H4v2h2z"/> </svg>  评论</span>
            <button class="lw-refresh" id="cmtRefresh" type="button" data-label="刷新"></button>
          </div>
          <textarea class="cmt-in" id="cmtInput" maxlength="200" rows="2"
                    placeholder="说点什么…（登录后才能评论）"></textarea>
          <div class="cmt-act">
            <span class="cmt-count" id="cmtCount"></span>
            <button class="cmt-send" id="cmtSend" type="button" disabled>发表</button>
          </div>
          <button class="cmt-fold" id="cmtFold" type="button" aria-expanded="false">
            <span class="cmt-fold-ico">▼</span>
            <span id="cmtFoldTx">展开评论</span>
            <span class="cmt-fold-num" id="cmtFoldNum"></span>
          </button>
          <div class="cmt-scroll" id="cmtScroll" hidden>
            <div class="cmt-list" id="cmtList"></div>
            <button class="cmt-more" id="cmtMore" type="button" hidden></button>
          </div>
        </div>
        <div class="report-progress" id="reportProgress" hidden><i></i></div>
        <div class="pal-box" id="previewPalette" hidden>
          <div class="pal-head">
            <span class="pal-title">这幅画用到的颜色</span>
            <span class="pal-count" id="palCount"></span>
          </div>
          <div class="pal-grid" id="palGrid"></div>
          <div class="pal-tip">点任意色块即可复制它的色号</div>
        </div>
        <div class="preview-note">仅支持预览，不可载入作画。请勿抄袭或直接提交他人的作品。对着画右键（手机长按）可以转发或保存。</div>
        </div>
      </div>
    </div>

    <div class="card-overlay" id="reportOverlay" hidden>
      <div class="card-box report-box">
        <div class="card-head">
          <span class="card-title">举报作品</span>
          <button class="card-close" id="reportClose" type="button">取消</button>
        </div>
        <div class="report-reasons" id="reportReasons">
          <button class="report-reason" type="button" data-r="违法违规">违法违规</button>
          <button class="report-reason" type="button" data-r="色情低俗">色情低俗</button>
          <button class="report-reason" type="button" data-r="辱骂攻击">辱骂攻击</button>
          <button class="report-reason" type="button" data-r="抄袭他人">抄袭他人</button>
          <button class="report-reason" type="button" data-r="广告诈骗">广告诈骗</button>
          <button class="report-reason" type="button" data-r="其他">其他</button>
        </div>
        <textarea class="report-note" id="reportNote" maxlength="200" placeholder="补充说明（选填）"></textarea>
        <div class="card-actions">
          <button class="card-btn" id="reportSubmit" type="button">提交举报</button>
        </div>
      </div>
    </div>

    <div class="card-overlay" id="cardOverlay" hidden>
      <div class="card-box">
        <div class="card-head">
          <span class="card-title">朋友圈小卡片</span>
          <button class="card-close" id="cardClose" type="button">关闭</button>
        </div>
        <img id="cardImg" alt="分享卡片">
        <div class="card-actions">
  <a id="cardDownload" class="card-btn" href="#" download="guangyu-card.png"> 保存图片</a>
        </div>
        <div class="card-note">长按图片也能保存到相册，发到朋友圈秀一秀吧～</div>
      </div>
    </div>`
