// 别人的主页（/u?name=xxx 或 /u?uid=xxx）
//
// 版面：IG 风格个人主页 —— 顶栏 → 78px 圆头像 + 三项数据 → 名字/简介
//       → 等宽描边按钮 → 作品 / 收藏 标签 → 通栏 3 列作品墙。
//
// 数据全部来自三个只读接口：
//   /api/profile?uid=  头像、简介、公开统计
//   /api/achieve?uid=  创作天数等公开指标（不给光尘余额）
//   /api/follow?uid=   关注状态
//   /api/get?author=   他的作品
//
// 配合「切页面不自动刷新」：第一次进来才请求，之后切回来直接用内存缓存，
// 右上角有刷新按钮。
//
// 模板 / 样式拆到 views/user/ 下，和「我的」页保持同一套类名与排版节奏。
import { userStyles } from './user/user-styles.js'
import { userTemplate } from './user/user-template.js'

export default {
  name: 'user',
  title: '画师主页',
  css: userStyles,
  template: userTemplate,
  mounted() {
    const $ = (id) => document.getElementById(id)
    const esc = (s) =>
      String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    const fmt = (n) => {
      const v = Number(n) || 0
      if (v >= 10000) return (v / 10000).toFixed(1) + '万'
      return String(v)
    }
    const token = () => {
      try {
        return localStorage.getItem('lw-token') || ''
      } catch (e) {
        return ''
      }
    }
    const C = window.LWCache || {}

    // 从地址里拿要看谁
    const q = new URLSearchParams(location.search)
    const wantName = (q.get('name') || '').trim()
    let wantUid = (q.get('uid') || '').trim()

    let profile = null
    let follow = null
    let ach = null
    let works = []
    /* 首屏铺 18 件（3 列 × 6 行），其余收在「查看更多」后面 */
    const WORKS_INIT = 18
    /* 当前标签：works / fav（收藏夹只有本人能看） */
    let tab = 'works'

    let msgTimer = 0
    function showMsg(text, bad) {
      const el = $('uMsg')
      if (!el) return
      el.textContent = text || ''
      el.hidden = !text
      el.classList.toggle('bad', !!bad)
      clearTimeout(msgTimer)
      /* 提示条浮在版面上方，不该一直挂着挡视线 */
      if (text) {
        msgTimer = setTimeout(() => {
          el.hidden = true
          el.textContent = ''
        }, 2800)
      }
    }

    /* 查无此人时不拆模板：保留所有 id，刷新后还能重新渲染 */
    function showMissing() {
      if ($('uName')) {
        $('uName').textContent = '画师主页'
        $('uName').classList.add('guest')
      }
      if ($('uBioName')) $('uBioName').textContent = '—'
      if ($('uBio')) {
        $('uBio').textContent = '没有找到这位画师。'
        $('uBio').classList.add('empty')
      }
      if ($('uMeta')) $('uMeta').innerHTML = ''
      if ($('uModBadge')) $('uModBadge').hidden = true
      ;['uStatWorks', 'uStatDust', 'uStatDays'].forEach((id) => {
        if ($(id)) $(id).textContent = '—'
      })
      if ($('uActions')) $('uActions').hidden = true
      if ($('uWorks')) {
        $('uWorks').innerHTML = ''
        $('uWorks').hidden = true
      }
      if ($('uMoreBtn')) $('uMoreBtn').hidden = true
      if ($('uFavEmpty')) $('uFavEmpty').hidden = true
      if ($('uEmpty')) {
        $('uEmpty').hidden = false
        $('uEmpty').textContent = '没有找到这位画师。'
      }
      tab = 'works'
      applyTab(true)
    }

    /* 一次性把三个接口都拉了。任何一个失败都不影响其它部分显示 */
    async function load(force) {
      if (force) {
        /* 刷新时把内存里那份也清掉，否则下面几个 `||` 会把旧值直接复用 */
        profile = null
        ach = null
        follow = null
        works = []
        if (wantUid) {
          C.drop('u:uid:' + wantUid)
          C.drop('u:ach:' + wantUid)
          C.drop('u:fu:' + wantUid)
        } else if (wantName) {
          C.drop('u:name:' + wantName)
        }
      }
      const head = {}
      const t = token()
      if (t) head.Authorization = 'Bearer ' + t
      const j = async (u) => {
        const r = await fetch(u, { headers: head, cache: 'no-store' })
        return r.json().catch(() => ({}))
      }

      try {
        if (!wantUid) {
          // 只给了用户名：先换成 uid，后面几个接口都要用
          const p = await j('/api/profile?name=' + encodeURIComponent(wantName))
          if (!p || !p.ok) {
            showMissing()
            return
          }
          wantUid = p.uid
          profile = p
        }
        const key = wantUid
        profile = profile || (await j('/api/profile?uid=' + encodeURIComponent(key)))
        if (!profile || !profile.ok) {
          showMissing()
          return
        }
        // 公开成就只用于取「创作天数」等汇总指标，主页不再铺成就墙
        ach = ach || (await j('/api/achieve?uid=' + encodeURIComponent(key)))
        follow = follow || (await j('/api/follow?uid=' + encodeURIComponent(key)))
        works = works.length ? works : ((await j('/api/get?limit=60&author=' + encodeURIComponent(profile.username))).history || [])

        C.put('u:uid:' + key, { profile, ach, follow, works })
        if (profile.username) C.put('u:name:' + profile.username, { profile, ach, follow, works })
        render()
      } catch (e) {
        showMsg('读取失败：' + ((e && e.message) || '网络错误'), true)
      }
    }

    /* 作品墙：3 列方格，无标题无文字 */
    function renderWorks() {
      const grid = $('uWorks')
      if (!grid) return
      if (!works.length) {
        grid.innerHTML = ''
        grid.hidden = true
        const em = $('uEmpty')
        if (em) {
          em.hidden = false
          em.textContent = '这位画师还没往墙上挂画。'
        }
        if ($('uMoreBtn')) $('uMoreBtn').hidden = true
        return
      }
      const em = $('uEmpty')
      if (em) {
        em.textContent = ''
        em.hidden = true
      }
      grid.innerHTML = works
        .map((w, wi) => {
          const t = w.time || 0
          const gave = !!(window.dust && window.dust.gave(String(t)))
          const noDust = w.fromImage === true
          return (
            '<div class="u-work' + (wi >= WORKS_INIT ? ' u-hidden' : '') + '" data-t="' + t + '">' +
            '<img alt="' + esc(w.workName || '未命名') + '" data-t="' + t +
            '" src="' + pixelsToURL(w.pixels, w.size === 32 || w.size === 64 ? w.size : 16) + '">' +
            /* 方格上不写字；这个按钮保留原来的 class / data / 事件，
               只是被 CSS 藏起来。主页的送光尘入口在按钮行里。 */
            '<button class="u-give' + (gave ? ' on' : '') + (noDust ? ' no-dust' : '') +
            '" type="button" data-give="' + t + '" tabindex="-1" aria-hidden="true"></button>' +
            '</div>'
          )
        })
        .join('')

      const more = $('uMoreBtn')
      if (more) {
        const rest = Math.max(0, works.length - WORKS_INIT)
        more.hidden = rest === 0 || tab === 'fav'
        more.textContent = '查看更多（还有 ' + rest + ' 件）'
      }

      // 点作品：复用社区那边的预览（有就打开，没有就保持安静）
      ;[...grid.querySelectorAll('img[data-t]')].forEach((im) => {
        im.addEventListener('click', () => {
          const w = works.find((x) => (x.time || 0) === Number(im.getAttribute('data-t')))
          if (w && window.LWOpenWork) window.LWOpenWork(w)
        })
      })
      // 方格上藏起来的送光尘按钮（保留原来的行为）
      ;[...grid.querySelectorAll('[data-give]')].forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          giveDust(Number(btn.getAttribute('data-give')), btn)
        })
      })
    }

    /* 标签页：作品 / 收藏（别人的收藏夹不公开；自己的跳到「我的收藏」） */
    function applyTab(force) {
      if (!force && tab === 'fav' && follow && follow.isMe) tab = 'works'
      const isFav = tab === 'fav'
      const grid = $('uWorks')
      const em = $('uEmpty')
      const fav = $('uFavEmpty')
      const more = $('uMoreBtn')
      if ($('uTabWorks')) $('uTabWorks').classList.toggle('on', !isFav)
      if ($('uTabFav')) $('uTabFav').classList.toggle('on', isFav)
      if (grid) grid.hidden = isFav || !works.length
      if (more) more.hidden = isFav || works.length <= WORKS_INIT
      if (em) em.hidden = isFav || works.length > 0
      if (fav) {
        fav.hidden = !isFav
        if (isFav) {
          fav.textContent = (follow && follow.isMe)
            ? '去「我的」查看收藏。'
            : '收藏夹只对本人可见。'
        }
      }
    }

    function render() {
      if (!profile) return
      const s = profile.stats || {}
      const m = (ach && ach.metrics) || {}
      const f = follow || {}
      const isMe = !!f.isMe
      const t = token()

      $('uHint').textContent = isMe ? '这是你自己' : '画师主页'

      const uname = profile.username || '画师'
      $('uName').textContent = uname
      $('uName').classList.remove('guest')
      $('uBioName').textContent = uname

      if ($('uModBadge')) $('uModBadge').hidden = !profile.isMod

      // 三项数据：作品 / 收到的光尘 / 创作天数
      $('uStatWorks').textContent = fmt(
        s.works != null ? s.works : (profile.works != null ? profile.works : works.length)
      )
      $('uStatDust').textContent = fmt(profile.received != null ? profile.received : (s.likes || 0))
      $('uStatDays').textContent = fmt(m.days || workDays())

      // 简介：没有就显示两行占位
      const bio = String(profile.bio || '').trim()
      const bioEl = $('uBio')
      bioEl.textContent = bio || '这位画师还没有写简介。\n喜欢像素画的人，大概都懂。'
      bioEl.classList.toggle('empty', !bio)

      /* 小字资料：加入时间、性别、生日、审核员下架数量、好友关系。
         没填的项不显示，也不占位。 */
      const bits = []
      if (profile.createdAt) {
        bits.push('加入于 ' + new Date(profile.createdAt).toLocaleDateString('zh-CN'))
      }
      if (profile.isMod) bits.push('已审核下架 ' + (Number(profile.modHides) || 0) + ' 件')
      const GENDER_LABEL = { male: '男生', female: '女生', secret: '保密' }
      if (profile.gender && GENDER_LABEL[profile.gender]) bits.push(GENDER_LABEL[profile.gender])
      // 只认服务端给的 MM-DD。格式不对就整条不显示，别画出「NaN 月 undefined 日」
      const bd = String(profile.birthday || '')
      if (/^\d{2}-\d{2}$/.test(bd)) {
        bits.push(
          profile.todayBirthday
            ? '今天生日！'
            : Number(bd.slice(0, 2)) + ' 月 ' + Number(bd.slice(3, 5)) + ' 日'
        )
      }
      $('uMeta').innerHTML =
        bits.map((x) => '<span>' + esc(x) + '</span>').join('') +
        (f.friend ? '<span class="u-friend-tip">你们是好友</span>' : '')

      /* 按钮行：登录后、不是自己时才出现。
         好友 → 聊天 / 逛他家 / 好友；
         非好友 → 送光尘 / 逛他家 / 加好友。
         两种情况下都正好三个等宽描边按钮。 */
      const canAct = !isMe && !!t
      const actions = $('uActions')
      actions.hidden = !canAct
      if (canAct) {
        const givable = works.some((w) => w.fromImage !== true)
        $('uChatBtn').hidden = !f.friend
        $('uVisitBtn').hidden = false
        $('uFollowBtn').hidden = false
        $('uGiveBtn').hidden = f.friend || !givable
        $('uGiveBtn').textContent = '送光尘'
        $('uGiveBtn').classList.remove('done')
        $('uGiveBtn').disabled = false

        const fb = $('uFollowBtn')
        fb.textContent = f.friend ? '好友' : f.iFollow ? '已申请' : '＋ 加好友'
        fb.classList.toggle('on', !!(f.iFollow || f.friend))
        fb.disabled = false
      } else {
        $('uGiveBtn').hidden = true
        $('uChatBtn').hidden = true
        $('uVisitBtn').hidden = true
        $('uFollowBtn').hidden = true
      }

      renderWorks()
      applyTab()

      // 头像：服务端给了就放进缓存，没给就按 uid 画默认像素头像
      const cv = $('uAvCanvas')
      if (cv && window.LWAvatar) {
        if (profile.avatar) window.LWAvatar.put(profile.uid, profile.avatar)
        window.LWAvatar.draw(cv, profile.uid, 78)
      } else if ($('uAv')) {
        $('uAv').textContent = Array.from(uname)[0] || '?'
      }
    }

    /* 送光尘。和社区里用的是同一套接口与账本，行为一致：
       未登录引导登录、余额不足提示、送过的不给重复送。 */
    async function giveDust(t, btn) {
      if (!window.dust) return
      if (!window.dust.logged()) {
        showMsg('登录后才能送光尘', true)
        setTimeout(() => {
          location.href = '/login'
        }, 800)
        return
      }
      if (window.dust.gave(String(t))) {
        showMsg('你已经送过光尘给这幅画了', true)
        return
      }
      if (window.dust.balance() < window.dust.cost) {
        showMsg('光尘不够了，去「我的」签到领一些吧', true)
        return
      }
      const w0 = works.find((x) => (x.time || 0) === Number(t))
      if (w0 && w0.fromImage === true) {
        showMsg('这幅是用像素相机转出来的照片，不支持收光尘，请给手绘作品送光尘', true)
        return
      }
      const isAct = btn && btn.id === 'uGiveBtn'
      if (btn) {
        btn.disabled = true
        btn.textContent = '…'
      }
      let ok = false
      try {
        const d = await window.dust.giveRemote(t)
        if (!d) {
          showMsg('赠送失败：网络错误', true)
          return
        }
        if (d.needLogin || d.code === 'noauth') {
          showMsg('登录状态已失效，请重新登录', true)
          setTimeout(() => {
            location.href = '/login'
          }, 800)
          return
        }
        if (!d.ok) {
          showMsg(d.error || '赠送失败', true)
          return
        }
        if (window.sfx) window.sfx('coin')
        ok = true
        /* mock / 老接口可能不回 charged；按实际扣费（或固定成本）记一笔，
           这样按钮行上的「收到的光尘」能立刻涨，不用等下次刷新 */
        const inc = Number(d.charged) || Number(window.dust.cost) || 0
        const w = works.find((x) => (x.time || 0) === Number(t))
        if (w) w.likes = (Number(w.likes) || 0) + inc
        if (isAct) {
          const cur = Number(profile.received != null
            ? profile.received
            : ((profile.stats || {}).likes || 0)) || 0
          profile.received = cur + inc
          $('uStatDust').textContent = fmt(profile.received)
        }
        showMsg('送出了 ' + (d.charged || window.dust.cost) + ' 个光尘　余额 ' + window.dust.balance())
      } catch (e) {
        showMsg('赠送失败：' + ((e && e.message) || '网络错误'), true)
      } finally {
        if (btn) {
          btn.disabled = false
          if (isAct) {
            btn.textContent = ok ? '已送光尘' : '送光尘'
            btn.classList.toggle('done', ok)
          } else {
            const w = works.find((x) => (x.time || 0) === Number(t))
            btn.textContent = ' ' + (w ? Number(w.likes) || 0 : 0)
            if (ok) btn.classList.add('on')
          }
        }
      }
    }

    /* 创作天数：优先用成就接口的 metrics.days；接口没给（或失败）时，
       退回「这批作品分布在几个不同的日子」，至少是个真实的下限，
       不会在主页上摆一个 0。 */
    function workDays() {
      const seen = new Set()
      for (const w of works) {
        const t = Number(w.time) || 0
        if (!t) continue
        const d = new Date(t)
        seen.add(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())
      }
      return seen.size
    }

    // 像素数组 → 图片地址。和社区用的是同一套缩放规则
    function pixelsToURL(px, size) {
      if (!Array.isArray(px) || !px.length) return ''
      const n = size === 32 || size === 64 ? size : 16
      const c = document.createElement('canvas')
      c.width = n
      c.height = n
      const x = c.getContext('2d')
      for (let i = 0; i < n * n; i++) {
        const p = px[i]
        if (!p) continue
        if (p[0] > 246 && p[1] > 246 && p[2] > 246) continue
        x.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'
        x.fillRect(i % n, Math.floor(i / n), 1, 1)
      }
      return c.toDataURL()
    }

    /* ---------- 静态元素的事件只绑一次 ---------- */

    // 刷新：图标按钮，忙的时候转一圈
    const rf = $('uRefresh')
    if (rf) {
      rf.addEventListener('click', async () => {
        if (rf.disabled) return
        rf.disabled = true
        rf.classList.add('busy')
        try {
          await load(true)
        } finally {
          rf.disabled = false
          rf.classList.remove('busy')
        }
      })
    }

    // 分享主页：系统分享面板优先，否则复制链接
    const sh = $('uShareBtn')
    if (sh) {
      sh.addEventListener('click', async () => {
        const url = location.href
        const title = (profile && profile.username ? profile.username + ' 的画师主页' : '画师主页')
        if (window.sfx) window.sfx('tap')
        if (navigator.share) {
          try {
            await navigator.share({ title, url })
            return
          } catch (e) {
            if (e && e.name === 'AbortError') return
          }
        }
        let copied = false
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url)
            copied = true
          }
        } catch (e) {}
        if (!copied) {
          /* 没有剪贴板权限时的兜底：临时 textarea + execCommand。
             还不能用就告诉用户去哪复制，不要把一长串 URL 糊在提示里。 */
          try {
            const ta = document.createElement('textarea')
            ta.value = url
            ta.setAttribute('readonly', '')
            ta.style.position = 'fixed'
            ta.style.top = '-1000px'
            document.body.appendChild(ta)
            ta.select()
            copied = document.execCommand('copy')
            document.body.removeChild(ta)
          } catch (e) {
            copied = false
          }
        }
        showMsg(copied ? '主页链接已复制' : '复制失败，请长按地址栏复制', !copied)
      })
    }

    // 标签页
    const tw = $('uTabWorks')
    if (tw) {
      tw.addEventListener('click', () => {
        if (tab === 'works') return
        tab = 'works'
        if (window.sfx) window.sfx('tick')
        applyTab()
      })
    }
    const tf = $('uTabFav')
    if (tf) {
      tf.addEventListener('click', () => {
        if (follow && follow.isMe) {
          const to = '/mine/fav'
          if (window.__lwRouter) window.__lwRouter.push(to)
          else location.href = to
          return
        }
        if (tab === 'fav') return
        tab = 'fav'
        if (window.sfx) window.sfx('tick')
        applyTab()
      })
    }

    /* 「查看更多」：把藏起来的作品放出来。只是去掉 class，不重新渲染 ——
       重渲染就得把点击 / 送光尘的事件重绑一遍，容易漏。 */
    const moreBtn = $('uMoreBtn')
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        const grid = $('uWorks')
        if (grid) {
          grid.querySelectorAll('.u-work.u-hidden').forEach((el) => el.classList.remove('u-hidden'))
        }
        moreBtn.hidden = true
        if (window.sfx) window.sfx('open')
      })
    }

    // 按钮行：送光尘（给最近一件能收光尘的手绘作品）
    const gb = $('uGiveBtn')
    if (gb) {
      gb.addEventListener('click', () => {
        const w = works.find((x) => x.fromImage !== true && !(window.dust && window.dust.gave(String(x.time || 0)))) ||
          works.find((x) => x.fromImage !== true)
        if (!w) {
          showMsg('这位画师的作品暂时不能收光尘', true)
          return
        }
        giveDust(w.time || 0, gb)
      })
    }

    /* 「与他聊天」：私信页要知道跟谁聊，所以把 uid 一起带过去。
       顺便先把会话建出来（后端 add 会拒绝非好友，这里已经是好友了），
       这样过去就是现成的对话，不用再发一次消息才建起来。 */
    const cb = $('uChatBtn')
    if (cb) {
      cb.addEventListener('click', async () => {
        if (window.sfx) window.sfx('tap')
        const tk = token()
        if (!tk) {
          showMsg('聊天需要先登录。', true)
          return
        }
        const uid = (profile && profile.uid) || wantUid || ''
        if (!uid) return
        cb.disabled = true
        const old = cb.textContent
        cb.textContent = '打开中…'
        try {
          await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk },
            body: JSON.stringify({ action: 'add', uid, text: '' }),
          })
        } catch (e) {
          /* 建会话失败不拦着：私信页照样能打开，里面也能发 */
        }
        try {
          const C2 = window.LWCache || {}
          C2.drop('chatlist')
          C2.drop('chat:' + uid)
          C2.drop('chatBadge')
        } catch (e) {}
        if (window.__lwRouter) window.__lwRouter.push('/chat?to=' + encodeURIComponent(uid))
        else location.href = '/chat?to=' + encodeURIComponent(uid)
        cb.disabled = false
        cb.textContent = old
      })
    }

    /* 逛他家的小屋。
       用 uid 而不是用户名：小屋接口认 uid，用户改名后链接不会失效。
       没登录也能看（town.js 那边 wantUid 为空时才是「自己」）。 */
    const vb = $('uVisitBtn')
    if (vb) {
      vb.addEventListener('click', () => {
        if (window.sfx) window.sfx('tap')
        const to = '/town/home?to=' + encodeURIComponent((profile && profile.uid) || wantUid)
        if (window.__lwRouter) window.__lwRouter.push(to)
        else location.href = to
      })
    }

    // 加好友 / 关注
    const fb = $('uFollowBtn')
    if (fb) {
      fb.addEventListener('click', async () => {
        const tk = token()
        if (!tk) {
          showMsg('加好友需要先登录。', true)
          return
        }
        if (!profile) return
        const on = fb.classList.contains('on')
        fb.disabled = true
        const old = fb.textContent
        fb.textContent = on ? '处理中…' : '申请中…'
        try {
          const res = await fetch('/api/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk },
            body: JSON.stringify({ action: on ? 'unfollow' : 'follow', uid: profile.uid }),
          })
          const d = await res.json().catch(() => ({}))
          if (!res.ok || !d || !d.ok) {
            fb.textContent = old
            fb.disabled = false
            showMsg((d && d.error) || '操作失败', true)
            return
          }
          follow = {
            ...(follow || {}),
            iFollow: d.iFollow,
            friend: d.friend,
            following: d.following,
            followers: d.followers,
          }
          // 缓存里也要更新，不然切回来又变回旧状态
          C.put('u:uid:' + profile.uid, { profile, ach, follow, works })
          if (window.sfx) window.sfx(on ? 'close' : 'follow')
          render()
          showMsg(
            d.friend ? '你们已经是好友了　现在可以聊天了'
              : on ? '已解除好友'
                : '已发出好友申请，等对方通过'
          )
        } catch (e) {
          fb.textContent = old
          fb.disabled = false
          showMsg('操作失败：' + ((e && e.message) || '网络错误'), true)
        }
      })
    }

    /* ---------- 第一次进来才请求；切回来直接用缓存 ---------- */
    const cachedData = wantUid
      ? C.get('u:uid:' + wantUid)
      : wantName ? C.get('u:name:' + wantName) : null
    if (cachedData && cachedData.profile) {
      profile = cachedData.profile
      ach = cachedData.ach
      follow = cachedData.follow
      works = cachedData.works || []
      render()
    } else {
      load(false)
    }
  },
}
