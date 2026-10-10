/**
 * Gallery 视图的HTML 模板
 *
 * 由 views/gallery.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/gallery.js 顶部。
 */

export const galleryTemplate = `<div class="container">
      <div class="header">
        <router-link class="back" to="/paint">← 返回画板</router-link>
        <div class="header-text">
          <h1>全部作品</h1>
          <div id="count">加载中…</div>
        </div>
      </div>

      <section class="finder" id="finder">
        <div class="search-row">
          <input class="search-input" id="searchInput" type="search" placeholder="搜作品名、作者或标签…" autocomplete="off">
          <button class="search-clear" id="searchClear" type="button" hidden>✕</button>
        </div>
        <div class="chip-row" id="chipRow" hidden></div>
        <div class="tag-cloud" id="tagCloud" hidden></div>

        <!-- 过滤器：折叠面板，默认收起，不占地方 -->
        <button class="filter-toggle" id="filterToggle" type="button" aria-expanded="false">
          <span>⚙️ 筛选</span>
          <span class="ft-badge" id="filterBadge" hidden>0</span>
          <span class="ft-caret">▾</span>
        </button>
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

      <section class="daily" id="dailyPanel" hidden>
        <div class="daily-head">
          <span class="daily-title">⚡ 今日一题</span>
          <span class="daily-day" id="dailyDay"></span>
        </div>
        <div class="daily-theme">今日题目《<b id="dailyTheme"></b>》</div>
        <div class="daily-prompt" id="dailyPrompt"></div>
        <div class="daily-cta-row">
          <a class="daily-cta" id="dailyCta" href="/paint">🎨 去创作</a>
          <span class="daily-tip" id="dailyTip"></span>
        </div>
        <div class="daily-top" id="dailyTop"></div>
      </section>

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

      <section class="contest" id="contestPanel" hidden>
        <div class="contest-head">
          <span class="contest-title">🏆 本周大赛</span>
          <span class="contest-badge" id="contestBadge">进行中</span>
        </div>
        <div class="contest-theme">本周主题《<b id="contestTheme"></b>》</div>
        <div class="contest-prompt" id="contestPrompt"></div>
        <div class="contest-meta" id="contestMeta"></div>
        <div class="contest-cta-row">
          <router-link class="contest-cta" to="/paint?contest=1">🎨 去创作参赛</router-link>
          <span class="contest-tip" id="contestTip"></span>
        </div>
        <div class="contest-top" id="contestTop"></div>
      </section>


      <section class="discover" id="discover">
        <div class="discover-head">
          <div class="discover-text">
            <b>🔍 发现</b>
            <i>随机翻出一件旧作品，给被时间埋掉的好东西一次机会</i>
          </div>
          <button class="discover-btn" id="discoverBtn" type="button">掷一个</button>
        </div>
        <div class="discover-body" id="discoverBody">
          <div class="discover-empty">手气不错的话，能翻出别人埋在底下的老画</div>
        </div>
      </section>

      <section class="featured" id="featured" hidden>
        <div class="featured-head">
          <span>🏆 佳作展示</span>
          <div class="range-tabs" id="rangeTabs">
            <button type="button" data-range="all" class="active">总榜</button>
            <button type="button" data-range="today">今日</button>
            <button type="button" data-range="week">本周</button>
          </div>
        </div>
        <div class="featured-sub" id="featuredSub">按收到的光尘排名 Top 5</div>
        <div class="featured-row" id="featuredRow"></div>
      </section>

      <div id="gallery" class="gallery-grid"></div>
      <div id="sentinel" class="status">加载中…</div>
      <div id="status" class="status" hidden></div>

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
            <button class="preview-report" id="previewReportUser" type="button" hidden>🚩 举报该用户</button>
          </div>
          <div class="preview-bio" id="previewBio" hidden></div>
          <span id="previewTime" class="preview-time"></span>
        </div>
        <div class="preview-like">
          <button class="like-btn" id="previewLike" type="button" title="送光尘给这幅画">✨ <span id="previewLikeCount">0</span></button>
          <button class="fav-btn" id="previewFav" type="button" title="收藏这幅画">☆ 收藏</button>
          <button class="vote-btn" id="previewVoteBtn" type="button" hidden>🏆 投一票</button>
          <button class="share-btn" id="previewShare" type="button">🔗 复制链接</button>
          <button class="share-btn" id="previewCard" type="button">🃏 生成朋友圈卡片</button>
          <button class="share-btn" id="previewPaletteBtn" type="button" aria-expanded="false">🎨 用色</button>
          <button class="report-hold" id="previewReport" type="button">🚩 长按举报</button>
        </div>
        <div class="cmt-box" id="cmtBox">
          <div class="cmt-head">
            <span class="cmt-title">💬 评论</span>
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
          <a id="cardDownload" class="card-btn" href="#" download="guangyu-card.png">⬇️ 保存图片</a>
        </div>
        <div class="card-note">长按图片也能保存到相册，发到朋友圈秀一秀吧～</div>
      </div>
    </div>`
