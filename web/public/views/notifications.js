// 通知中心：谁给我的作品送了光尘、谁评论了我、谁关注了我。
// 进页面自动把红点清掉（POST /api/notify {action:'read'}）。
export default {
  name: 'notifications',
  title: '通知',
  css: `
      .ntf-page {
        min-height: 100vh;
        padding: 14px 14px calc(96px + env(safe-area-inset-bottom, 0px));
        max-width: 560px;
        margin: 0 auto;
      }
      .ntf-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .ntf-back {
        font-size: 14px;
        color: var(--text-muted2);
        text-decoration: none;
      }
      .ntf-title { font-size: 18px; font-weight: 800; color: var(--text); }
      .ntf-sum { margin: 0 2px 12px; font-size: 13px; color: var(--text-muted2); }
      .ntf-sum b { color: var(--text); }
      .ntf-list { display: flex; flex-direction: column; gap: 10px; }
      .ntf-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 12px 13px;
        box-shadow: 0 2px 10px var(--shadow2, rgba(0, 0, 0, 0.05));
        text-decoration: none;
        color: inherit;
      }
      .ntf-item.unread {
        border-color: var(--accent, #5b8def);
        background: var(--surface-2);
      }
      .ntf-item:active { transform: scale(0.995); }
      .ntf-ico {
        flex: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        background: var(--surface-2);
        border: 1px solid var(--border);
      }
      .ntf-item.unread .ntf-ico { background: rgba(91, 141, 239, 0.12); border-color: rgba(91, 141, 239, 0.35); }
      .ntf-main { flex: 1; min-width: 0; }
      .ntf-text { font-size: 14px; line-height: 1.55; color: var(--text); word-break: break-word; }
      .ntf-time { display: block; margin-top: 4px; font-size: 12px; color: var(--text-faint, #9aa3b2); }
      .ntf-dot {
        flex: none;
        width: 8px;
        height: 8px;
        margin-top: 7px;
        border-radius: 50%;
        background: var(--accent, #5b8def);
      }
      .ntf-empty {
        margin-top: 30%;
        text-align: center;
        font-size: 14px;
        line-height: 2;
        color: var(--text-muted2);
      }
      .ntf-empty a { color: var(--accent, #5b8def); font-weight: 700; }
    `,
  template: `
    <div class="ntf-page">
      <div class="ntf-head">
        <router-link class="ntf-back" to="/mine">← 我的</router-link>
        <div class="ntf-title">🔔 通知</div>
        <button class="lw-refresh" id="ntfRefresh" type="button" data-label="刷新"></button>
      </div>
      <div class="ntf-sum" id="ntfSum">正在读取…</div>
      <div class="ntf-list" id="ntfList"></div>
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
    function ago(t) {
      const n = Number(t) || 0
      if (!n) return ''
      const s = Math.floor((Date.now() - n) / 1000)
      if (s < 60) return '刚刚'
      if (s < 3600) return Math.floor(s / 60) + ' 分钟前'
      if (s < 86400) return Math.floor(s / 3600) + ' 小时前'
      if (s < 86400 * 7) return Math.floor(s / 86400) + ' 天前'
      const d = new Date(n)
      const p = (x) => String(x).padStart(2, '0')
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
    }
    const ICO = { like: '✨', comment: '💬', follow: '👥' }

    function render(items) {
      const list = $('ntfList')
      if (!items.length) {
        $('ntfSum').textContent = ''
        list.innerHTML =
          '<div class="ntf-empty">还没有通知。<br />收到光尘、评论和新粉丝都会出现在这里<br />' +
          '<a href="/gallery">去社区逛逛</a></div>'
        return
      }
      const unread = items.reduce((s, n) => s + (n.read ? 0 : 1), 0)
      $('ntfSum').innerHTML = unread ? '<b>' + unread + '</b> 条未读' : '都看完啦'
      list.innerHTML = items.map((n) => {
        // 有作品的通知点了去看作品；关注通知点了去对方主页；没有目标就不可点
        let href = ''
        if (n.work) href = '/gallery?t=' + encodeURIComponent(n.work)
        else if (n.type === 'follow' && n.from) href = '/u?uid=' + encodeURIComponent(n.from)
        const tag = href ? 'a' : 'div'
        return (
          '<' + tag + ' class="ntf-item' + (n.read ? '' : ' unread') + '"' +
          (href ? ' href="' + esc(href) + '"' : '') + '>' +
          '<span class="ntf-ico">' + (ICO[n.type] || '🔔') + '</span>' +
          '<span class="ntf-main">' +
          '<span class="ntf-text">' + esc(n.text || '') + '</span>' +
          '<span class="ntf-time">' + ago(n.at) + '</span>' +
          '</span>' +
          (n.read ? '' : '<span class="ntf-dot"></span>') +
          '</' + tag + '>'
        )
      }).join('')
    }

    async function load(mark) {
      const t = token()
      if (!t) {
        $('ntfSum').textContent = ''
        $('ntfList').innerHTML =
          '<div class="ntf-empty">通知跟着账号走。<br /><a href="/login">去登录 / 注册</a></div>'
        return
      }
      try {
        if (mark) {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
            body: JSON.stringify({ action: 'read' }),
          }).catch(() => {})
          // 通知「我的」页把红点撤掉
          try { window.dispatchEvent(new Event('lw-notify-read')) } catch (e) {}
        }
        const r = await fetch('/api/notify', {
          headers: { Authorization: 'Bearer ' + t },
          cache: 'no-store',
        })
        if (r.status === 401) {
          $('ntfList').innerHTML =
            '<div class="ntf-empty">登录已过期，请重新登录<br /><a href="/login">去登录</a></div>'
          return
        }
        const d = await r.json()
        render(Array.isArray(d.items) ? d.items : [])
      } catch (e) {
        $('ntfSum').textContent = ''
        $('ntfList').innerHTML = '<div class="ntf-empty">网络开小差了，稍后再试</div>'
      }
    }

    $('ntfRefresh').addEventListener('click', () => load(false))
    // 打开通知页即视为已读
    load(true)
  },
}
