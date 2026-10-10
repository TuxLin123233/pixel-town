/**
 * Admin 视图的HTML 模板
 *
 * 由 views/admin.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/admin.js 顶部。
 */

export const adminTemplate = `<div class="page-head">
      <router-link class="back" to="/mine">← 我的</router-link>
      <h1>🛡️ 维护社区稳定</h1>
      <div class="sub">像素小镇是大家共同的家，社区的和谐需要每一位热心用户共同守护。</div>
    </div>

    <div class="card">
      <div class="card-title">维护者的职责</div>
      <ul class="roles">
        <li>在社区作品列表里直接审核，发现违规内容点<b>「暂时下架」</b>并填一句原因</li>
        <li><b>不能直接删除作品</b> —— 下架只是暂时不显示，作品本体不动，由作者决定是否真删</li>
        <li>可以<b>恢复</b>自己或其他审核员误下架的作品</li>
        <li>发现其他审核员滥用职权，可以直接<b>举报</b></li>
        <li>审核员<b>没有封号权力</b>；滥用职权会被暂停审核资格</li>
      </ul>
    </div>

    <div class="card login" id="loginCard">
      <div class="card-title">维护者口令</div>
      <input id="passInput" type="password" placeholder="请输入维护者口令">
      <button class="enter" id="enterBtn" type="button">进入维护面板</button>
    </div>

    <div id="panel" hidden>
      <!-- ============ 审核员管理 ============ -->
      <div class="card">
        <div class="card-title">审核员名单 <span id="modCount" style="font-weight:400;color:var(--text-faint)"></span></div>
        <div id="modList" class="mod-list"><div class="empty">读取中…</div></div>
        <div class="mod-add">
          <input id="modUid" type="text" placeholder="要任命的用户 ID" autocomplete="off">
          <input id="modName" type="text" placeholder="显示名（可留空）" autocomplete="off">
          <button id="modAdd" type="button">任命为审核员</button>
        </div>
        <div class="hint">审核员只能<b>暂时下架</b>作品，不能删除、不能封号。下架原因必填，你在这里决定是恢复还是真删。</div>
      </div>

      <!-- ============ 待处理下架 ============ -->
      <div class="card">
        <div class="card-title">待处理下架 <span id="pendCount" style="font-weight:400;color:var(--text-faint)"></span></div>
        <div id="pendList" class="mod-list"><div class="empty">读取中…</div></div>
        <div class="hint">「恢复显示」会撤销下架，作品原样回到社区；「永久删除」不可撤销。</div>
      </div>

      <!-- ============ 审核员举报 ============ -->
      <div class="card">
        <div class="card-title">审核员举报 <span id="repCount" style="font-weight:400;color:var(--text-faint)"></span></div>
        <div id="repList" class="mod-list"><div class="empty">读取中…</div></div>
      </div>

      <div class="card">
        <div class="card-title">最新社区作品</div>
        <div class="latest" id="latestWrap">
          <div class="empty">暂无数据</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">用户举报（待处理）<span class="rp-count" id="reportCount"></span></div>
        <div id="reportList"><div class="empty">暂无举报</div></div>
      </div>

      <div class="card">
        <div class="card-title">违规作品清理（最新 10 条）</div>
        <div id="entryList"></div>
      </div>

      <div class="card">
        <div class="card-title">账号封禁<span class="rp-count" id="banCount"></span></div>
        <div class="ban-lookup">
          <input id="banName" type="text" placeholder="输入用户名查 uid" autocomplete="off">
          <button id="banFindBtn" type="button">查找</button>
        </div>
        <div id="banTarget"></div>
        <div id="banList"><div class="empty">加载中…</div></div>
        <p class="ban-hint">封禁会立即生效：对方已登录的设备上，签到、送光尘、发布作品都会被拒绝，直到解封。登录凭证本身不销毁，所以解封后无需重新登录。</p>
      </div>

      <div class="card">
        <div class="card-title">赠送光尘</div>
        <div class="ban-lookup">
          <input id="grantName" type="text" placeholder="输入用户名" autocomplete="off">
          <input id="grantAmt" type="number" value="100" step="1" style="width:88px" aria-label="数量">
          <button id="grantBtn" type="button">赠送</button>
        </div>
        <div id="grantOut"></div>
        <p class="ban-hint">按用户名直接加减光尘，正数增加、负数扣减，单次上限 10 万。正数会同时计入对方「累计收到」。这里不会代替对方发信，需要通知的话在下面举报/信件里说明。</p>
      </div>

      <div class="card">
        <div class="card-title">信箱发布（公告 / 奖励）</div>
        <div class="mail-form">
          <div class="mail-row">
            <input id="mailIcon" type="text" value="📢" maxlength="4" style="flex:0 0 56px;text-align:center" aria-label="图标">
            <input id="mailTitle" type="text" maxlength="40" placeholder="标题，例如：国庆活动开启" aria-label="标题">
          </div>
          <textarea id="mailBody" maxlength="300" rows="4" placeholder="正文，可以写多行" aria-label="正文"></textarea>
          <div class="mail-row">
            <input id="mailDust" type="number" value="0" min="0" step="1" style="flex:0 0 88px" aria-label="光尘数量">
            <input id="mailTo" type="text" placeholder="收件人用户名（留空 = 全体）" autocomplete="off" aria-label="收件人">
            <button id="mailPubBtn" type="button">发布</button>
          </div>
        </div>
        <div id="mailOut"></div>
        <div id="admMailList" class="adm-mail-list"><div class="empty">加载中…</div></div>
        <p class="ban-hint">留空收件人就是<b>广播</b>：所有人下次打开信箱时收到，<b>之后注册的新号也会收到</b>，每人每封只收一次。填用户名则只投给那一个人。光尘填 0 是纯公告，填数字就是可领取的奖励。</p>
      </div>

      <div class="card">
        <div class="card-title">紧急处置</div>
        <div class="card-text" style="margin-bottom:12px">若社区出现大面积违规内容，可一键清空全部作品。此操作不可恢复，请务必慎重。</div>
        <button class="clear" id="clearAllBtn" type="button">一键清空全部作品</button>
      </div>

      <button class="logout" id="logoutBtn" type="button">退出维护面板</button>
    </div>

    <div class="foot">维护者需为自己的操作负责 · 所有操作仅用于维护社区安全与稳定<br>© 2026 像素小镇 · 作者 Lin Sifan</div>`
