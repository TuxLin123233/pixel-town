// 由 admin.html 自动转换为 Vue 3 视图（无构建）
import { adminStyles } from './admin/admin-styles.js'
import { adminTemplate } from './admin/admin-template.js'

/* 纯字面量、全程只读的常量放在模块级即可，不必塞进 mounted()。 */
const DONE_KEY = 'lw-admin-done-reports'

export default {
  name: 'admin',
  title: '管理后台',
  css: adminStyles,
  template: adminTemplate,
  mounted() {
      const passInput = document.getElementById('passInput')
      const enterBtn = document.getElementById('enterBtn')
      const loginCard = document.getElementById('loginCard')
      const panel = document.getElementById('panel')
      const latestWrap = document.getElementById('latestWrap')
      const entryList = document.getElementById('entryList')
      const reportList = document.getElementById('reportList')
      const reportCount = document.getElementById('reportCount')
      const clearAllBtn = document.getElementById('clearAllBtn')
      // 老版本把口令存在 sessionStorage 里，清掉，别留着
      try { sessionStorage.removeItem('adminKey') } catch (e) {}

      const logoutBtn = document.getElementById('logoutBtn')

      /* 后台口令**只存内存**，不落 sessionStorage 也不落 localStorage。
         落盘的话，页面上任何一个 XSS 都能把口令读走 —— 那是整站后台。
         代价是刷新要重输一次，这个代价值得付。 */
      let adminKeyMem = ''
      const dpr = window.devicePixelRatio || 1

      function getKey() {
        return adminKeyMem
      }

      function setKey(k) {
        adminKeyMem = String(k || '')
      }

      function clearKey() {
        adminKeyMem = ''
      }

      function formatTime(ts) {
        if (!ts) return ''
        const d = new Date(ts)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      }

      /* 走 LWThumb：它会算出「整数倍缩放」再把 CSS 尺寸和背板一起设好。
         这里原来是自己画，背板写成 n*dpr（16×2=32px），
         却要显示到 110px / 48px —— 两边不是整数倍关系，
         浏览器拉伸时最后一行/一列只盖住部分像素，露出的就是白条纹。 */
      function drawThumb(canvas, pixels, s) {
        if (window.LWThumb) {
          window.LWThumb.draw(canvas, pixels, s)
          return
        }
        // 兜底（LWThumb 没加载时）：1:1 背板，靠 CSS 的 pixelated 放大
        const n = s === 32 || s === 64 ? s : 16
        canvas.width = n
        canvas.height = n
        const c = canvas.getContext('2d')
        c.fillStyle = '#ffffff'
        c.fillRect(0, 0, n, n)
        for (let y = 0; y < n; y++) {
          for (let x = 0; x < n; x++) {
            const px = pixels && pixels[y * n + x]
            if (!Array.isArray(px) || px.length < 3) continue
            c.fillStyle = `rgb(${px[0]}, ${px[1]}, ${px[2]})`
            c.fillRect(x, y, 1, 1)
          }
        }
      }

      async function verify(key) {
        const res = await fetch('/api/admin/verify', {
          headers: { 'x-admin-key': key },
        })
        return res.ok
      }

      async function login() {
        const key = passInput.value.trim()
        if (!key) {
          toast('请输入维护者口令')
          return
        }
        enterBtn.disabled = true
        try {
          if (await verify(key)) {
            setKey(key)
            loginCard.hidden = true
            panel.hidden = false
            passInput.value = ''
            toast('口令验证通过')
            refresh()
            loadModAdmin()
          } else {
            toast('口令错误')
          }
        } catch (err) {
          toast('网络错误')
        } finally {
          enterBtn.disabled = false
        }
      }

      enterBtn.addEventListener('click', login)
      passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') login()
      })

      logoutBtn.addEventListener('click', () => {
        clearKey()
        panel.hidden = true
        loginCard.hidden = false
      })

      /* ---------- 审核员管理 ----------
         全站唯一能「真删作品」和「封审核员」的地方。
         审核员自己做不到这两件事 —— 接口层面就没给他们。 */
      const modListEl = document.getElementById('modList')
      const pendListEl = document.getElementById('pendList')
      const repListEl = document.getElementById('repList')
      const modCountEl = document.getElementById('modCount')
      const pendCountEl = document.getElementById('pendCount')
      const repCountEl = document.getElementById('repCount')
      const modUidEl = document.getElementById('modUid')
      const modNameEl = document.getElementById('modName')
      const modAddBtn = document.getElementById('modAdd')

      async function adminMod(body) {
        const res = await fetch('/api/admin/mod', {
          method: body ? 'POST' : 'GET',
          headers: body
            ? { 'Content-Type': 'application/json', 'x-admin-key': getKey() }
            : { 'x-admin-key': getKey() },
          body: body ? JSON.stringify(body) : undefined,
        })
        return res.json().catch(() => ({}))
      }

      function emptyRow(text) {
        const d = document.createElement('div')
        d.className = 'empty'
        d.textContent = text
        return d
      }

      function modRow(title, sub, buttons) {
        const row = document.createElement('div')
        row.className = 'mod-row'
        const mi = document.createElement('div')
        mi.className = 'mi'
        const b = document.createElement('b')
        b.textContent = title
        mi.appendChild(b)
        const sp = document.createElement('span')
        sp.textContent = sub
        mi.appendChild(sp)
        row.appendChild(mi)
        ;(buttons || []).forEach(({ text, cls, fn }) => {
          const btn = document.createElement('button')
          btn.type = 'button'
          btn.textContent = text
          if (cls) btn.className = cls
          btn.addEventListener('click', fn)
          row.appendChild(btn)
        })
        return row
      }

      async function loadModAdmin() {
        let d
        try {
          d = await adminMod(null)
        } catch (e) {
          d = {}
        }
        if (!d || !d.ok) {
          modListEl.textContent = ''
          modListEl.appendChild(emptyRow('读取失败，口令可能过期了'))
          return
        }

        // 审核员名单
        const mods = d.mods || []
        modCountEl.textContent = mods.length ? '共 ' + mods.length + ' 人' : ''
        modListEl.textContent = ''
        if (!mods.length) {
          modListEl.appendChild(emptyRow('还没有审核员。在下面输入用户 ID 任命一个。'))
        } else {
          mods.forEach((m) => {
            const btns = []
            if (m.banned) {
              btns.push({
                text: '恢复资格', cls: 'ok',
                fn: async () => { await adminMod({ action: 'unban', uid: m.uid }); loadModAdmin() },
              })
            } else {
              btns.push({
                text: '暂停资格', cls: 'danger',
                fn: async () => {
                  const why = await lwPrompt('暂停「' + (m.name || m.uid) + '」的审核资格，写一句原因：', '')
                  if (why === null) return
                  if (!String(why).trim()) { await lwAlert('原因不能空'); return }
                  await adminMod({ action: 'ban', uid: m.uid, reason: why })
                  loadModAdmin()
                },
              })
            }
            btns.push({
              text: '撤职', cls: 'danger',
              fn: async () => {
                if (!(await lwConfirm('把「' + (m.name || m.uid) + '」从审核员名单里移除？'))) return
                await adminMod({ action: 'remove', uid: m.uid })
                loadModAdmin()
              },
            })
            const sub = m.uid + (m.banned ? ' · 已暂停：' + (m.banReason || '') : ' · ' + fmtTime(m.at) + ' 任命')
            modListEl.appendChild(modRow(m.name || m.uid, sub, btns))
          })
        }

        // 待处理下架
        const pend = d.pending || []
        pendCountEl.textContent = pend.length ? pend.length + ' 件待处理' : ''
        pendListEl.textContent = ''
        if (!pend.length) {
          pendListEl.appendChild(emptyRow('没有待处理的下架。'))
        } else {
          pend.forEach((h) => {
            pendListEl.appendChild(
              modRow(
                '作品时间 ' + h.time,
                (h.byName || h.byUid || '?') + ' 于 ' + fmtTime(h.at) + ' 下架 · 原因：' + (h.reason || '无'),
                [
                  {
                    text: '恢复显示', cls: 'ok',
                    fn: async () => { await adminMod({ action: 'restore', time: h.time }); loadModAdmin() },
                  },
                  {
                    text: '永久删除', cls: 'danger',
                    fn: async () => {
                      if (!(await lwConfirm('永久删除这件作品？\n\n不可撤销。\n时间：' + h.time, { danger: true }))) return
                      const r = await adminMod({ action: 'delete', time: h.time })
                      if (!r || !r.ok) { await lwAlert((r && r.error) || '删除失败'); return }
                      toast('已永久删除')
                      loadModAdmin()
                    },
                  },
                ]
              )
            )
          })
        }

        // 审核员举报
        const reps = d.reports || []
        const open = reps.filter((r) => !r.handled)
        repCountEl.textContent = open.length ? open.length + ' 条未处理' : reps.length ? '全部已处理' : ''
        repListEl.textContent = ''
        if (!reps.length) {
          repListEl.appendChild(emptyRow('还没有审核员之间的举报。'))
        } else {
          reps.slice(0, 30).forEach((rp) => {
            const btns = []
            if (!rp.handled) {
              btns.push({
                text: '标记已处理',
                fn: async () => { await adminMod({ action: 'handle', id: rp.id }); loadModAdmin() },
              })
              btns.push({
                text: '暂停其资格', cls: 'danger',
                fn: async () => {
                  const why = await lwPrompt('暂停「' + (rp.targetName || rp.targetUid) + '」的资格，原因：', rp.reason || '')
                  if (why === null) return
                  await adminMod({ action: 'ban', uid: rp.targetUid, reason: why || '举报核实' })
                  await adminMod({ action: 'handle', id: rp.id })
                  loadModAdmin()
                },
              })
            }
            repListEl.appendChild(
              modRow(
                (rp.byName || rp.byUid) + ' 举报 ' + (rp.targetName || rp.targetUid),
                fmtTime(rp.at) + ' · ' + (rp.reason || '') + (rp.handled ? '（已处理）' : ''),
                btns
              )
            )
          })
        }
      }

      if (modAddBtn) {
        modAddBtn.addEventListener('click', async () => {
          const uid = (modUidEl.value || '').trim()
          if (!uid) { toast('请填用户 ID'); return }
          const r = await adminMod({ action: 'add', uid, name: (modNameEl.value || '').trim() })
          if (!r || !r.ok) { await lwAlert((r && r.error) || '任命失败'); return }
          modUidEl.value = ''
          modNameEl.value = ''
          toast('已任命')
          loadModAdmin()
        })
      }

      async function refresh() {
        // 举报、封号与作品列表互不影响：任何一边失败另一边照样能看
        loadReports()
        loadBanned()
        loadAdminMails()
        try {
          const res = await fetch('/api/get?limit=30&t=' + Date.now(), { cache: 'no-store' })
          if (!res.ok) {
            toast('获取数据失败')
            return
          }
          const data = await res.json()
          renderLatest(data)
          renderList(data.history || [])
        } catch (err) {
          toast('网络错误')
        }
      }

      /* ---------- 举报 ---------- */
      function fmtTime(ts) {
        const d = new Date(ts)
        const p2 = (x) => String(x).padStart(2, '0')
        return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes())
      }

      /* 本机已处理的举报 id：即使服务端短暂返回旧数据，也不再显示 */
            function getDone() {
        try {
          const a = JSON.parse(localStorage.getItem(DONE_KEY) || '[]')
          return Array.isArray(a) ? a : []
        } catch (e) {
          return []
        }
      }
      function markDone(id) {
        const a = getDone()
        if (!a.includes(id)) a.push(id)
        try {
          localStorage.setItem(DONE_KEY, JSON.stringify(a.slice(-500)))
        } catch (e) {}
      }
      function pruneDone(list) {
        const alive = new Set(list.map((r) => r.id))
        const a = getDone().filter((id) => alive.has(id))
        try {
          localStorage.setItem(DONE_KEY, JSON.stringify(a))
        } catch (e) {}
      }

      function renderReports(rawList) {
        const done = new Set(getDone())
        const list = Array.isArray(rawList) ? rawList.filter((r) => !done.has(r.id)) : []
        pruneDone(rawList || [])
        reportList.innerHTML = ''
        updateReportCount(list.length)
        if (!list.length) {
          const empty = document.createElement('div')
          empty.className = 'empty'
          empty.textContent = '暂无举报'
          reportList.appendChild(empty)
          return
        }
        list
          .slice()
          .sort((a, b) => (b.at || 0) - (a.at || 0))
          .forEach((r) => {
            const item = document.createElement('div')
            item.className = 'rp-item'

            const top = document.createElement('div')
            top.className = 'rp-top'
            const tag = document.createElement('span')
            tag.className = 'rp-tag'
            tag.textContent = r.reason || '其他'
            const title = document.createElement('span')
            title.className = 'rp-title'
            // 举报用户和举报作品的标题含义不同，分开标出来免得看混
            if (r.target === 'user') {
              tag.textContent = '👤 ' + (r.reason || '其他')
              title.textContent = '用户 ' + (r.title || r.author || '未知')
            } else {
              title.textContent = r.title || '未命名作品'
            }
            top.append(tag, title)

            const meta = document.createElement('div')
            meta.className = 'rp-meta'
            meta.textContent =
              r.target === 'user'
                ? '被举报账号 ' + (r.title || '') + '（' + (r.targetUid || '?') + '） · 提交于 ' + fmtTime(r.at || 0)
                : '作者 ' + (r.author || '匿名') + ' · 提交于 ' + fmtTime(r.at || 0) + ' · 作品时间戳 ' + r.time

            item.append(top, meta)

            if (r.note) {
              const note = document.createElement('div')
              note.className = 'rp-note'
              note.textContent = '补充：' + r.note
              item.appendChild(note)
            }

            const actions = document.createElement('div')
            actions.className = 'rp-actions'
            const del = document.createElement('button')
            del.className = 'rp-btn danger'
            del.type = 'button'
            del.textContent = r.target === 'user' ? '违规，封禁该账号' : '违规，删除作品'
            const done = document.createElement('button')
            done.className = 'rp-btn'
            done.type = 'button'
            done.textContent = '已核实无误'
            actions.append(del, done)
            item.appendChild(actions)

            const isUser = r.target === 'user'
            const handle = async (action) => {
              const msg =
                action === 'remove'
                  ? isUser
                    ? '核实该账号违规？将立即封禁「' + (r.title || '') + '」并标记举报已处理。'
                    : '确定删除该作品并标记举报已处理吗？'
                  : '确定标记该举报为已处理吗？'
              if (!(await lwConfirm(msg))) return
              const key = getKey()
              if (!key) {
                toast('请先登录')
                return
              }
              try {
                const res = await fetch('/api/report', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
                  body: JSON.stringify({ id: r.id, action }),
                })
                if (!res.ok) {
                  toast((await res.json().catch(() => ({}))).error || '操作失败')
                  return
                }
                markDone(r.id)
                // 立刻从列表里移除，不等网络回来，避免"处理完还在"的错觉
                const row = item.closest('.rp-item') || item
                if (row && row.parentNode) row.parentNode.removeChild(row)
                updateReportCount()
                toast(
                  action === 'remove' ? '已删除作品'
                    : action === 'banuser' ? '已封禁该账号'
                    : '已标记处理'
                )
                refresh()
                loadReports()
              } catch (err) {
                toast('网络错误')
              }
            }
            del.addEventListener('click', () => handle(isUser ? 'banuser' : 'remove'))
            done.addEventListener('click', () => handle('done'))

            reportList.appendChild(item)
          })
      }

      function updateReportCount(n) {
        if (!reportCount) return
        const left = typeof n === 'number' ? n : reportList.querySelectorAll('.rp-item').length
        reportCount.textContent = left ? '共 ' + left + ' 条' : ''
        if (!left) {
          reportList.innerHTML = ''
          const empty = document.createElement('div')
          empty.className = 'empty'
          empty.textContent = '暂无举报'
          reportList.appendChild(empty)
        }
      }

      async function loadReports() {
        const key = getKey()
        if (!key || !reportList) return
        try {
          const res = await fetch('/api/report?t=' + Date.now(), {
            headers: { 'x-admin-key': key, 'Cache-Control': 'no-cache' },
            cache: 'no-store',
          })
          if (!res.ok) return
          const data = await res.json().catch(() => ({}))
          renderReports(data.reports || [])
        } catch (err) {}
      }

      /* ---------- 封号 ---------- */
      const banList = document.getElementById('banList')
      const banCount = document.getElementById('banCount')
      const banTarget = document.getElementById('banTarget')
      // 查到的目标账号暂存这里，确认后才执行封禁
      let banCandidate = null

      function fmtDate(n) {
        const t = Number(n) || 0
        if (!t) return ''
        const d = new Date(t)
        const p = (x) => String(x).padStart(2, '0')
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
      }

      function renderBanned(list) {
        if (!banList) return
        const arr = Array.isArray(list) ? list : []
        if (banCount) banCount.textContent = arr.length ? '共 ' + arr.length + ' 人' : ''
        banList.innerHTML = ''
        if (!arr.length) {
          const empty = document.createElement('div')
          empty.className = 'empty'
          empty.textContent = '当前没有被封禁的账号'
          banList.appendChild(empty)
          return
        }
        arr.forEach((u) => {
          const row = document.createElement('div')
          row.className = 'ban-row'

          const name = document.createElement('span')
          name.className = 'ban-name'
          name.textContent = u.username

          const tag = document.createElement('span')
          tag.className = 'ban-tag'
          tag.textContent = '已封'

          const when = document.createElement('span')
          when.className = 'ban-when'
          when.textContent = u.bannedAt ? '封于 ' + fmtDate(u.bannedAt) : ''

          const btn = document.createElement('button')
          btn.className = 'ban-btn'
          btn.type = 'button'
          btn.textContent = '解封'
          btn.addEventListener('click', async () => {
            if (!(await lwConfirm('确定解封「' + u.username + '」吗？'))) return
            btn.disabled = true
            try {
              const res = await fetch('/api/ban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': getKey() },
                body: JSON.stringify({ action: 'unban', uid: u.uid }),
              })
              const d = await res.json().catch(() => ({}))
              if (d && d.ok) {
                toast('已解封 ' + u.username)
                loadBanned()
              } else {
                btn.disabled = false
                toast(d && d.error ? d.error : '解封失败')
              }
            } catch (e) {
              btn.disabled = false
              toast('网络错误')
            }
          })

          row.append(name, tag, when, btn)
          if (u.banReason) {
            const r = document.createElement('div')
            r.className = 'ban-reason'
            r.textContent = '原因：' + u.banReason
            row.appendChild(r)
          }
          banList.appendChild(row)
        })
      }

      async function loadBanned() {
        if (!banList) return
        try {
          const res = await fetch('/api/ban?t=' + Date.now(), {
            headers: { 'x-admin-key': getKey(), 'Cache-Control': 'no-cache' },
            cache: 'no-store',
          })
          if (!res.ok) return
          const d = await res.json().catch(() => ({}))
          if (d && d.ok) renderBanned(d.banned)
        } catch (e) {}
      }

      function renderBanCandidate(u) {
        if (!banTarget) return
        banCandidate = u
        banTarget.innerHTML = ''
        if (!u) return
        const box = document.createElement('div')
        box.className = 'ban-target'
        box.textContent = '找到：' + u.username + '（' + u.uid + '）' + (u.banned ? ' · 当前已封禁' : '')

        const input = document.createElement('input')
        input.className = 'ban-reason-input'
        input.type = 'text'
        input.placeholder = '封禁原因（会记入封号列表）'
        input.maxLength = 100

        const btn = document.createElement('button')
        btn.className = 'ban-btn warn'
        btn.type = 'button'
        btn.style.marginTop = '8px'
        btn.textContent = u.banned ? '解封该账号' : '封禁该账号'
        btn.addEventListener('click', async () => {
          const act = u.banned ? 'unban' : 'ban'
          if (act === 'ban' && !(await lwConfirm('确定封禁「' + u.username + '」吗？\n\n对方将无法签到、送光尘和发布作品，直到解封。', { danger: true }))) return
          btn.disabled = true
          try {
            const res = await fetch('/api/ban', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': getKey() },
              body: JSON.stringify({ action: act, uid: u.uid, reason: input.value || '' }),
            })
            const d = await res.json().catch(() => ({}))
            if (d && d.ok) {
              toast(act === 'ban' ? '已封禁 ' + u.username : '已解封 ' + u.username)
              banCandidate = null
              banTarget.innerHTML = ''
              loadBanned()
            } else {
              btn.disabled = false
              toast(d && d.error ? d.error : '操作失败')
            }
          } catch (e) {
            btn.disabled = false
            toast('网络错误')
          }
        })

        box.appendChild(btn)
        banTarget.append(box, input)
      }

      const banFindBtn = document.getElementById('banFindBtn')
      const banName = document.getElementById('banName')
      if (banFindBtn && banName) {
        const doFind = async () => {
          const name = banName.value.trim()
          if (!name) {
            toast('请输入用户名')
            return
          }
          banFindBtn.disabled = true
          try {
            const res = await fetch('/api/ban', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': getKey() },
              body: JSON.stringify({ action: 'lookup', name }),
            })
            const d = await res.json().catch(() => ({}))
            if (d && d.ok) renderBanCandidate(d.user)
            else {
              renderBanCandidate(null)
              toast(d && d.error ? d.error : '查找失败')
            }
          } catch (e) {
            toast('网络错误')
          } finally {
            banFindBtn.disabled = false
          }
        }
        banFindBtn.addEventListener('click', doFind)
        banName.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doFind()
        })
      }

      function renderLatest(data) {
        latestWrap.innerHTML = ''
        if (!data.pixels) {
          const empty = document.createElement('div')
          empty.className = 'empty'
          empty.textContent = '暂无数据'
          latestWrap.appendChild(empty)
          return
        }
        const canvas = document.createElement('canvas')
        drawThumb(canvas, data.pixels, data.size)

        const info = document.createElement('div')
        info.className = 'latest-info'
        const author = document.createElement('div')
        author.className = 'author'
        author.textContent = data.name || '匿名'
        const time = document.createElement('div')
        time.className = 'time'
        time.textContent = formatTime(data.time)
        info.append(author, time)

        latestWrap.append(canvas, info)
      }

      function renderList(records) {
        entryList.innerHTML = ''
        if (!records.length) {
          const empty = document.createElement('div')
          empty.className = 'empty'
          empty.textContent = '暂无历史记录'
          entryList.appendChild(empty)
          return
        }
        records.forEach((rec) => {
          const row = document.createElement('div')
          row.className = 'entry'

          const canvas = document.createElement('canvas')
          drawThumb(canvas, rec.pixels, rec.size)

          const info = document.createElement('div')
          info.className = 'info'
          const author = document.createElement('span')
          author.className = 'author'
          author.textContent = rec.name || '匿名'
          const time = document.createElement('span')
          time.className = 'time'
          time.textContent = formatTime(rec.time)
          info.append(author, time)

          const del = document.createElement('button')
          del.type = 'button'
          del.className = 'del'
          del.textContent = '删除'
          del.addEventListener('click', () => removeEntry(rec))

          row.append(canvas, info, del)
          entryList.appendChild(row)
        })
      }

      async function removeEntry(rec) {
        const label = rec.name || '匿名'
        if (!(await lwConfirm(`确定删除「${label}」的作品吗？`, { danger: true }))) return

        const key = getKey()
        if (!key) {
          toast('请先登录')
          return
        }
        try {
          const res = await fetch('/api/admin/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
            body: JSON.stringify({ time: rec.time }),
          })
          if (!res.ok) {
            toast((await res.json().catch(() => ({}))).error || '删除失败')
            return
          }
          toast('已删除')
          refresh()
        } catch (err) {
          toast('网络错误')
        }
      }

      /* ---------- 赠送光尘 ---------- */
      const grantBtn = document.getElementById('grantBtn')
      const grantName = document.getElementById('grantName')
      const grantAmt = document.getElementById('grantAmt')
      const grantOut = document.getElementById('grantOut')
      if (grantBtn) {
        grantBtn.addEventListener('click', async () => {
          const key = getKey()
          if (!key) {
            toast('请先登录维护面板')
            return
          }
          const name = (grantName.value || '').trim()
          const amt = Math.trunc(Number(grantAmt.value))
          if (!name) {
            toast('请填写用户名')
            return
          }
          if (!Number.isFinite(amt) || amt === 0) {
            toast('数量要是非 0 的整数，正数增加、负数扣减')
            return
          }
          if (amt > 0 && !(await lwConfirm('确定给「' + name + '」赠送 ' + amt + ' 个光尘吗？'))) return
          if (amt < 0 && !(await lwConfirm('确定从「' + name + '」扣掉 ' + (-amt) + ' 个光尘吗？'))) return
          grantBtn.disabled = true
          const old = grantBtn.textContent
          grantBtn.textContent = '处理中'
          try {
            const res = await fetch('/api/ban', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
              body: JSON.stringify({ action: 'grant', name: name, amount: amt }),
            })
            const d = await res.json().catch(() => ({}))
            if (!res.ok || !d.ok) {
              toast((d && d.error) || '赠送失败')
              return
            }
            grantOut.textContent =
              '✅ ' + d.user.username + '（' + d.user.uid + '）现在有 ' + d.book.bal + ' 个光尘' +
              (amt > 0 ? '，累计收到 ' + d.book.got + ' 个。' : '。')
            grantOut.className = ''
            if (window.sfx) window.sfx('ding')
            toast(amt > 0 ? '已赠送 ' + amt + ' 个光尘' : '已扣减 ' + (-amt) + ' 个光尘')
          } catch (e) {
            toast('赠送失败：网络错误')
          } finally {
            grantBtn.disabled = false
            grantBtn.textContent = old
          }
        })
      }

      /* ---------- 信箱发布（公告 / 奖励） ---------- */
      function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
          ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
        )
      }

      function renderAdminMails(list) {
        if (!admMailList) return
        if (!list || !list.length) {
          admMailList.innerHTML = '<div class="empty">还没有发布过广播信</div>'
          return
        }
        admMailList.innerHTML = list
          .map(
            (m) =>
              '<div class="adm-mail">' +
              '<div class="adm-mail-ico">' + esc(m.icon || '📢') + '</div>' +
              '<div class="adm-mail-b">' +
              '<div class="adm-mail-t">' + esc(m.title) + '</div>' +
              '<div class="adm-mail-d">' + esc(formatTime(m.time)) +
              (m.dust > 0 ? ' · <span class="adm-mail-dust">+' + m.dust + ' 光尘</span>' : ' · 纯公告') +
              '</div></div>' +
              '<button class="adm-mail-x" type="button" data-revoke="' + esc(m.id) + '">撤回</button>' +
              '</div>'
          )
          .join('')
      }

      async function loadAdminMails() {
        const key = getKey()
        if (!key || !admMailList) return
        try {
          const res = await fetch('/api/admin/mail', {
            headers: { 'x-admin-key': key },
            cache: 'no-store',
          })
          const d = await res.json().catch(() => ({}))
          renderAdminMails((d && d.mails) || [])
        } catch (e) {
          admMailList.innerHTML = '<div class="empty">读取失败</div>'
        }
      }

      const mailIcon = document.getElementById('mailIcon')
      const mailTitle = document.getElementById('mailTitle')
      const mailBody = document.getElementById('mailBody')
      const mailDust = document.getElementById('mailDust')
      const mailTo = document.getElementById('mailTo')
      const mailPubBtn = document.getElementById('mailPubBtn')
      const mailOut = document.getElementById('mailOut')
      const admMailList = document.getElementById('admMailList')

      if (admMailList) {
        admMailList.addEventListener('click', async (e) => {
          const btn = e.target && e.target.closest ? e.target.closest('[data-revoke]') : null
          if (!btn) return
          if (!(await lwConfirm('撤回这封广播信？之后打开信箱的人不再收到（已经收到的不会收回）'))) return
          try {
            const res = await fetch('/api/admin/mail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': getKey() },
              body: JSON.stringify({ action: 'revoke', id: btn.getAttribute('data-revoke') }),
            })
            const d = await res.json().catch(() => ({}))
            if (!res.ok || !d.ok) {
              toast((d && d.error) || '撤回失败')
              return
            }
            renderAdminMails(d.mails || [])
            if (window.sfx) window.sfx('close')
            toast('已撤回')
          } catch (err) {
            toast('撤回失败：网络错误')
          }
        })
      }

      if (mailPubBtn) {
        mailPubBtn.addEventListener('click', async () => {
          const key = getKey()
          if (!key) {
            toast('请先登录维护面板')
            return
          }
          const title = (mailTitle.value || '').trim()
          if (!title) {
            toast('请填写信件标题')
            return
          }
          const payload = {
            action: 'publish',
            icon: (mailIcon.value || '📢').trim() || '📢',
            title,
            body: (mailBody.value || '').trim(),
            dust: Math.max(0, Math.trunc(Number(mailDust.value) || 0)),
            to: (mailTo.value || '').trim(),
          }
          const who = payload.to ? '「' + payload.to + '」' : '全体用户'
          const kind = payload.dust > 0 ? '奖励（' + payload.dust + ' 光尘）' : '公告'
          if (!(await lwConfirm('确定把' + kind + '发给 ' + who + ' 吗？'))) return
          mailPubBtn.disabled = true
          const old = mailPubBtn.textContent
          mailPubBtn.textContent = '发布中'
          try {
            const res = await fetch('/api/admin/mail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
              body: JSON.stringify(payload),
            })
            const d = await res.json().catch(() => ({}))
            if (!res.ok || !d.ok) {
              toast((d && d.error) || '发布失败')
              return
            }
            if (mailOut) {
              mailOut.className = ''
              mailOut.textContent = d.targeted
                ? '✅ 已投递给「' + d.to + '」，对方打开信箱即可看到'
                : '✅ 广播已发布，所有人下次打开信箱时收到（之后注册的新号也会收到）'
            }
            if (window.sfx) window.sfx('ding')
            toast('发布成功')
            if (d.targeted) {
              mailTo.value = ''
            } else {
              mailTitle.value = ''
              mailBody.value = ''
              mailDust.value = '0'
              renderAdminMails(d.mails || [])
            }
          } catch (err) {
            toast('发布失败：网络错误')
          } finally {
            mailPubBtn.disabled = false
            mailPubBtn.textContent = old
          }
        })
      }

      clearAllBtn.addEventListener('click', async () => {
        if (!(await lwConfirm('确定清空全部数据吗？此操作不可恢复！', { danger: true }))) return

        const key = getKey()
        if (!key) {
          toast('请先登录')
          return
        }
        try {
          const res = await fetch('/api/admin/clear', {
            method: 'POST',
            headers: { 'x-admin-key': key },
          })
          if (!res.ok) {
            toast((await res.json().catch(() => ({}))).error || '清空失败')
            return
          }
          toast('已清空全部')
          refresh()
        } catch (err) {
          toast('网络错误')
        }
      })

      let toastTimer
      function toast(msg) {
        const el = document.getElementById('toast')
        el.textContent = msg
        el.classList.add('show')
        clearTimeout(toastTimer)
        toastTimer = setTimeout(() => el.classList.remove('show'), 2200)
      }

      if (getKey()) {
        verify(getKey()).then((ok) => {
          if (ok) {
            loginCard.hidden = true
            panel.hidden = false
            refresh()
          } else {
            clearKey()
          }
        })
      }
  },
}
