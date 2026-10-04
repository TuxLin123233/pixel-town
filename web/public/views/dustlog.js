// 光尘流水：每一笔收入和支出的来龙去脉。
// 数据就是 /api/dust 返回的 book.ledger（服务端已按最新在前排好）。
export default {
  name: 'dustlog',
  title: '光尘明细',
  css: `
      .dl-page {
        min-height: 100vh;
        padding: 14px 14px calc(96px + env(safe-area-inset-bottom, 0px));
        max-width: 560px;
        margin: 0 auto;
      }
      .dl-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .dl-back { font-size: 14px; color: var(--text-muted2); text-decoration: none; }
      .dl-title { font-size: 18px; font-weight: 800; color: var(--text); }
      .dl-bal {
        margin: 0 2px 12px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14px 16px;
        display: flex;
        align-items: baseline;
        gap: 8px;
        box-shadow: 0 2px 10px var(--shadow2, rgba(0, 0, 0, 0.05));
      }
      .dl-bal .lab { font-size: 13px; color: var(--text-muted2); }
      .dl-bal .num { font-size: 24px; font-weight: 800; color: var(--accent, #5b8def); }
      .dl-bal .sub { margin-left: auto; font-size: 12px; color: var(--text-faint, #9aa3b2); }
      .dl-list { display: flex; flex-direction: column; gap: 8px; }
      .dl-row {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 11px 14px;
      }
      .dl-reason { flex: 1; min-width: 0; font-size: 14px; color: var(--text); }
      .dl-time { display: block; font-size: 12px; color: var(--text-faint, #9aa3b2); margin-top: 2px; }
      .dl-amt { flex: none; font-size: 15px; font-weight: 800; font-variant-numeric: tabular-nums; }
      .dl-amt.in { color: var(--accent, #5b8def); }
      .dl-amt.out { color: var(--text-muted2); }
      .dl-empty {
        margin-top: 30%;
        text-align: center;
        font-size: 14px;
        line-height: 2;
        color: var(--text-muted2);
      }
    `,
  template: `
    <div class="dl-page">
      <div class="dl-head">
        <router-link class="dl-back" to="/mine">← 我的</router-link>
        <div class="dl-title">📒 光尘明细</div>
        <button class="lw-refresh" id="dlRefresh" type="button" data-label="刷新"></button>
      </div>
      <div class="dl-bal" id="dlBal">
        <span class="lab">当前余额</span>
        <span class="num" id="dlBalNum">—</span>
        <span class="sub">只显示最近 50 笔</span>
      </div>
      <div class="dl-list" id="dlList"></div>
    </div>`,
  mounted() {
    const $ = (id) => document.getElementById(id)
    const token = () => {
      try { return localStorage.getItem('lw-token') || '' } catch (e) { return '' }
    }
    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    }
    function fmt(t) {
      const d = new Date(Number(t) || 0)
      const p = (x) => String(x).padStart(2, '0')
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
        ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
    }

    async function load() {
      const t = token()
      if (!t) {
        $('dlBalNum').textContent = '0'
        $('dlList').innerHTML =
          '<div class="dl-empty">光尘账跟着账号走。<br /><a href="/login">去登录 / 注册</a></div>'
        return
      }
      try {
        const r = await fetch('/api/dust', {
          headers: { Authorization: 'Bearer ' + t },
          cache: 'no-store',
        })
        if (r.status === 401) {
          $('dlList').innerHTML =
            '<div class="dl-empty">登录已过期，请重新登录<br /><a href="/login">去登录</a></div>'
          return
        }
        const d = await r.json()
        const book = d && d.book ? d.book : {}
        $('dlBalNum').textContent = String(book.bal == null ? 0 : book.bal)
        const ledger = Array.isArray(book.ledger) ? book.ledger : []
        if (!ledger.length) {
          $('dlList').innerHTML =
            '<div class="dl-empty">还没有账目。<br />每天签到、发布作品都能赚到光尘</div>'
          return
        }
        $('dlList').innerHTML = ledger.map((x) => {
          const n = Math.floor(Number(x.d) || 0)
          const inOut = n >= 0 ? 'in' : 'out'
          const sign = n > 0 ? '+' : ''
          return (
            '<div class="dl-row">' +
            '<div class="dl-reason">' + esc(x.r || '光尘变动') +
            '<span class="dl-time">' + fmt(x.t) + '</span></div>' +
            '<div class="dl-amt ' + inOut + '">' + sign + n + '</div>' +
            '</div>'
          )
        }).join('')
      } catch (e) {
        $('dlList').innerHTML = '<div class="dl-empty">网络开小差了，稍后再试</div>'
      }
    }

    $('dlRefresh').addEventListener('click', load)
    load()
  },
}
