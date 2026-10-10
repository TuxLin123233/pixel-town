// 由 settings.html 自动转换为 Vue 3 视图（无构建）
import { settingsStyles } from './settings/settings-styles.js'
import { settingsTemplate } from './settings/settings-template.js'
import { NAV_OP_KEY, GUIDE_KEY, FOLD_KEY, FEATURES, LAYOUTS, NAV_ORDER_KEY, NAV_STYLES, NAV_POS_KEY, ENTRANCE_KEY, NAV_ITEMS } from './settings/settings-constants.js'

export default {
  name: 'settings',
  title: '设置',
  css: settingsStyles,
  template: settingsTemplate,
  mounted() {
      const darkSwitch = document.getElementById('darkSwitch')
      /* ---------- 导航项定义（与 app.js 的导航保持一致） ---------- */
      
      function readLS(k, d) {
        try {
          const v = localStorage.getItem(k)
          return v === null || v === '' ? d : v
        } catch (e) {
          return d
        }
      }
      function writeLS(k, v) {
        try {
          localStorage.setItem(k, v)
        } catch (e) {}
      }

      /* ---------- 启动直达：单选，覆盖全部导航页 ---------- */
            const entranceRow = document.getElementById('entranceRow')
      if (entranceRow) {
        let cur = readLS(ENTRANCE_KEY, '/paint')
        if (!NAV_ITEMS.some((i) => i.path === cur)) cur = '/paint'
        const paint = () => {
          entranceRow.querySelectorAll('.radio-chip').forEach((c) => {
            c.classList.toggle('on', c.dataset.path === cur)
          })
        }
        NAV_ITEMS.forEach((it) => {
          const b = document.createElement('button')
          b.type = 'button'
          b.className = 'radio-chip'
          b.dataset.path = it.path
          b.innerHTML =
            '<span class="rc-ico">' + it.ico + '</span><span class="rc-txt">' + it.name + '</span>'
          b.addEventListener('click', () => {
            cur = it.path
            writeLS(ENTRANCE_KEY, cur)
            paint()
            if (window.sfx) window.sfx('tick')
            toast('下次打开将先进「' + it.name + '」')
          })
          entranceRow.appendChild(b)
        })
        paint()
      }

      /* ---------- 导航栏位置：底部 / 顶部 ---------- */
            const navPosRow = document.getElementById('navPosRow')
      if (navPosRow) {
        const POS = [
          { v: 'bottom', ico: '⬇️', name: '底部' },
          { v: 'top', ico: '⬆️', name: '顶部' },
        ]
        let cur = readLS(NAV_POS_KEY, 'bottom')
        if (!POS.some((p) => p.v === cur)) cur = 'bottom'
        const paint = () => {
          navPosRow.querySelectorAll('.radio-chip').forEach((c) => {
            c.classList.toggle('on', c.dataset.v === cur)
          })
        }
        POS.forEach((p) => {
          const b = document.createElement('button')
          b.type = 'button'
          b.className = 'radio-chip'
          b.dataset.v = p.v
          b.innerHTML = '<span class="rc-ico">' + p.ico + '</span>' + p.name
          b.addEventListener('click', () => {
            cur = p.v
            writeLS(NAV_POS_KEY, cur)
            paint()
            if (window.setNavPosition) window.setNavPosition(cur)
            if (window.sfx) window.sfx('tick')
          })
          navPosRow.appendChild(b)
        })
        paint()
      }

      /* ---------- 导航栏样式：玻璃 + 另外 5 款 ---------- */
            const navStyleRow = document.getElementById('navStyleRow')
      if (navStyleRow) {
        let curStyle = readLS('lw-nav-style', 'glass')
        if (!NAV_STYLES.some((x) => x.v === curStyle)) curStyle = 'glass'
        const paintStyles = () => {
          navStyleRow.querySelectorAll('.ns-item').forEach((el) => {
            el.classList.toggle('on', el.dataset.v === curStyle)
          })
        }
        NAV_STYLES.forEach((st) => {
          const b = document.createElement('button')
          b.type = 'button'
          b.className = 'ns-item'
          b.dataset.v = st.v
          b.innerHTML =
            '<span class="ns-bar">' + '<i></i>'.repeat(4) + '</span>' +
            '<span class="ns-name">' + st.name + '</span>'
          b.addEventListener('click', () => {
            curStyle = st.v
            writeLS('lw-nav-style', st.v)
            applyNavStyle(curStyle)
            paintStyles()
            if (window.sfx) window.sfx('tick')
            toast('导航栏样式：' + st.name)
          })
          navStyleRow.appendChild(b)
        })
        applyNavStyle(curStyle)
        paintStyles()
      }
      function applyNavStyle(v) {
        if (v === 'glass') document.documentElement.removeAttribute('data-nav-style')
        else document.documentElement.setAttribute('data-nav-style', v)
      }

      /* ---------- 导航栏顺序 ---------- */
            const orderList = document.getElementById('navOrderList')
      if (orderList) {
        let order = readLS(NAV_ORDER_KEY, '')
          .split(',')
          .filter((x) => NAV_ITEMS.some((i) => i.path === x))
        // 补齐缺失项（新增导航时不会丢）
        NAV_ITEMS.forEach((i) => {
          if (!order.includes(i.path)) order.push(i.path)
        })

        const render = () => {
          orderList.innerHTML = ''
          order.forEach((path, idx) => {
            const it = NAV_ITEMS.find((i) => i.path === path)
            if (!it) return
            const row = document.createElement('div')
            row.className = 'order-item'
            row.innerHTML =
              '<span class="oi-ico">' + it.ico + '</span><span class="oi-name">' + it.name + '</span>'
            const btns = document.createElement('div')
            btns.className = 'order-btns'
            const up = document.createElement('button')
            up.type = 'button'
            up.textContent = '↑'
            up.title = '上移'
            up.disabled = idx === 0
            up.addEventListener('click', () => {
              const t = order.slice()
              ;[t[idx - 1], t[idx]] = [t[idx], t[idx - 1]]
              order = t
              commit()
            })
            const down = document.createElement('button')
            down.type = 'button'
            down.textContent = '↓'
            down.title = '下移'
            down.disabled = idx === order.length - 1
            down.addEventListener('click', () => {
              const t = order.slice()
              ;[t[idx + 1], t[idx]] = [t[idx], t[idx + 1]]
              order = t
              commit()
            })
            btns.append(up, down)
            row.appendChild(btns)
            orderList.appendChild(row)
          })
        }
        const commit = () => {
          writeLS(NAV_ORDER_KEY, order.join(','))
          render()
          if (window.sfx) window.sfx('tick')
          if (window.setNavOrder) window.setNavOrder(order)
        }
        render()
      }

      function syncThemeUI() {
        darkSwitch.checked = document.documentElement.getAttribute('data-theme') === 'dark'
      }

      const glassSwitch = document.getElementById('glassSwitch')
      glassSwitch.checked = localStorage.getItem('lw-glass') !== '0'
      function applyGlass() {
        document.documentElement.classList.toggle('glass-off', !glassSwitch.checked)
      }
      glassSwitch.addEventListener('change', () => {
        try {
          localStorage.setItem('lw-glass', glassSwitch.checked ? '1' : '0')
        } catch (e) {}
        applyGlass()
        document.querySelectorAll('.bottom-nav').forEach((nav) => {
          nav.classList.remove('jelly')
          void nav.offsetWidth
          nav.classList.add('jelly')
        })
        glassSwitch.classList.remove('jelly')
        void glassSwitch.offsetWidth
        glassSwitch.classList.add('jelly')
      })
      applyGlass()

      /* ---------- 折叠分组 ---------- */
      function setupFold(headId, bodyId, countId, items, isOn) {
        const head = document.getElementById(headId)
        const body = document.getElementById(bodyId)
        const cnt = document.getElementById(countId)
        if (!head || !body) return
        const paint = () => {
          const on = items.filter((k) => isOn(k)).length
          if (cnt) cnt.textContent = on + ' / ' + items.length
        }
        head.addEventListener('click', () => {
          const open = body.hidden
          body.hidden = !open
          head.setAttribute('aria-expanded', String(open))
          head.classList.toggle('open', open)
          paint()
        })
        paint()
        return paint
      }

      /* ---------- 画板布局（母/子） ---------- */
            const layKey = (k) => 'lw-lay-' + k
      function isLayOn(k) {
        try {
          return localStorage.getItem(layKey(k)) !== '0'
        } catch (e) {
          return true
        }
      }
      function setLay(k, on) {
        try {
          localStorage.setItem(layKey(k), on ? '1' : '0')
        } catch (e) {}
      }
      function renderLayoutSwitches() {
        const box = document.getElementById('layBox')
        if (!box) return
        box.innerHTML = ''
        LAYOUTS.forEach((L) => {
          const row = document.createElement('label')
          row.className = 'lay-child-row'
          const cb = document.createElement('input')
          cb.type = 'checkbox'
          cb.checked = isLayOn(L.key)
          const body = document.createElement('span')
          body.className = 'lay-body'
          const b = document.createElement('b')
          b.className = 'lay-title'
          b.textContent = (L.ico || '') + ' ' + L.label
          const i = document.createElement('i')
          i.textContent = L.desc
          body.append(b, i)
          cb.addEventListener('change', () => {
            setLay(L.key, cb.checked)
            toast((cb.checked ? '已显示「' : '已隐藏「') + L.label + '」')
          })
          row.append(cb, body)
          box.appendChild(row)
        })
        syncLayAll()
      }
      function syncLayAll() {
        const all = document.getElementById('layAllOn')
        if (!all) return
        all.checked = LAYOUTS.every((L) => isLayOn(L.key))
      }
      const layAllOn = document.getElementById('layAllOn')
      if (layAllOn) {
        layAllOn.addEventListener('change', () => {
          LAYOUTS.forEach((L) => setLay(L.key, layAllOn.checked))
          renderLayoutSwitches()
          toast(layAllOn.checked ? '已显示画板全部区域' : '已隐藏画板全部区域')
        })
      }
      renderLayoutSwitches()

      /* 画板布局折叠：LAYOUTS 已定义，可安全绑定 */
      setupFold(
        'layFold',
        'layFoldBody',
        'layCount',
        LAYOUTS.map((L) => L.key),
        isLayOn
      )

      /* ---------- 轻提示 ---------- */
      let featToastTimer = null
      function toast(msg) {
        const el = document.getElementById('toast')
        if (!el) return
        el.textContent = msg
        el.classList.add('show')
        clearTimeout(featToastTimer)
        featToastTimer = setTimeout(() => el.classList.remove('show'), 1600)
      }

      /* ---------- 进阶功能开关（默认全关） ---------- */
            const featKey = (k) => 'lw-feat-' + k
      function isFeatOn(k) {
        try {
          return localStorage.getItem(featKey(k)) === '1'
        } catch (e) {
          return false
        }
      }
      function setFeat(k, on) {
        try {
          localStorage.setItem(featKey(k), on ? '1' : '0')
        } catch (e) {}
      }
      const featBox = document.getElementById('featBox')
      if (featBox) {
        FEATURES.forEach((f) => {
          const row = document.createElement('div')
          row.className = 'row'
          const left = document.createElement('div')
          const lb = document.createElement('div')
          lb.className = 'row-label'
          lb.textContent = (f.ico || '') + ' ' + f.label
          const ds = document.createElement('div')
          ds.className = 'row-desc'
          ds.textContent = f.desc
          left.append(lb, ds)
          const sw = document.createElement('input')
          sw.type = 'checkbox'
          sw.className = 'switch'
          sw.setAttribute('role', 'switch')
          sw.id = 'feat-' + f.key
          sw.checked = isFeatOn(f.key)
          sw.addEventListener('change', () => {
            setFeat(f.key, sw.checked)
            toast(sw.checked ? '已开启「' + f.label + '」' : '已关闭「' + f.label + '」')
          })
          row.append(left, sw)
          featBox.appendChild(row)
        })
      }
      /* 进阶功能折叠：必须等 FEATURES 定义与列表渲染完成后再绑定 */
      setupFold(
        'featFold',
        'featFoldBody',
        'featCount',
        FEATURES.map((F) => F.key),
        isFeatOn
      )

      document.getElementById('featAllOff').addEventListener('click', () => {
        FEATURES.forEach((f) => setFeat(f.key, false))
        syncFeatSwitches()
        toast('已关闭全部进阶功能')
      })
      document.getElementById('featAllOn').addEventListener('click', () => {
        FEATURES.forEach((f) => setFeat(f.key, true))
        syncFeatSwitches()
        toast('已开启全部进阶功能')
      })
      function syncFeatSwitches() {
        FEATURES.forEach((f) => {
          const el = document.getElementById('feat-' + f.key)
          if (el) el.checked = isFeatOn(f.key)
        })
      }

      /* ---------- 可折叠分组的展开/收起 ---------- */
            function applyFold(headId, bodyId, key) {
        const head = document.getElementById(headId)
        const body = document.getElementById(bodyId)
        if (!head || !body) return
        let open = true
        try {
          const saved = JSON.parse(localStorage.getItem(FOLD_KEY) || '{}')
          if (saved && typeof saved[key] === 'boolean') open = saved[key]
        } catch (e) {}
        const set = (v) => {
          head.setAttribute('aria-expanded', String(v))
          body.hidden = !v
          if (window.sfx) window.sfx('tap')
          try {
            const saved = JSON.parse(localStorage.getItem(FOLD_KEY) || '{}')
            saved[key] = v
            localStorage.setItem(FOLD_KEY, JSON.stringify(saved))
          } catch (e) {}
        }
        set(open)
        head.addEventListener('click', () => {
          set(head.getAttribute('aria-expanded') !== 'true')
        })
      }
      applyFold('foldLook', 'foldLookBody', 'look')
      applyFold('foldNav', 'foldNavBody', 'nav')

      /* ---------- 配色主题 ---------- */
      // 主题数据来自 /themes.js（唯一数据源，CSS 也由它生成）
      const THEMES = (window.LW_THEMES || []).map(function (t) {
        return { id: t.id, name: t.name, group: t.group, sw: t.sw || [] }
      })
      function applyTheme(id) {
        const hit = THEMES.find((x) => x.id === id)
        const t = hit ? id : 'light'
        document.documentElement.setAttribute('data-theme', t)
        // 视图里的暗色适配一律看 data-mood，理由见 index.html 里的注释
        document.documentElement.setAttribute('data-mood', (hit && hit.group === 'dark') ? 'dark' : 'light')
        try {
          localStorage.setItem('lw-theme', t)
        } catch (e) {}
        syncThemePicks()
        if (typeof syncThemeUI === 'function') syncThemeUI()
        return hit
      }
      function showThemeName(theme, quiet) {
        const hint = document.getElementById('themeNameHint')
        if (!hint || !theme) return
        hint.innerHTML =
          '当前：<b>' + theme.name + '</b> · ' + (theme.group === 'dark' ? '夜间系' : '浅色系')
        if (!quiet && window.sfx) window.sfx('swish')
      }
      function syncThemePicks() {
        const cur = document.documentElement.getAttribute('data-theme') || 'light'
        document.querySelectorAll('.theme-pick').forEach((el) => {
          el.classList.toggle('on', el.dataset.theme === cur)
        })
      }
      const themePicks = document.getElementById('themePicks')
      if (themePicks) {
        // 上：浅色系　下：夜间系
        const GROUPS = [
          { key: 'light', label: '浅色系', ico: '☀️' },
          { key: 'dark', label: '夜间系', ico: '🌙' },
        ]
        GROUPS.forEach((g) => {
          const list = THEMES.filter((t) => t.group === g.key)
          if (!list.length) return
          const wrap = document.createElement('div')
          const lab = document.createElement('div')
          lab.className = 'theme-group-label'
          lab.innerHTML = '<span class="tgl-ico">' + g.ico + '</span>' + g.label
          const row = document.createElement('div')
          row.className = 'theme-picks'
          list.forEach((t) => {
            const b = document.createElement('button')
            b.type = 'button'
            b.className = 'theme-pick'
            b.dataset.theme = t.id
            b.title = t.name
            b.setAttribute('aria-label', t.name)
            b.innerHTML =
              '<span class="tp-bar">' +
              (t.sw || []).slice(0, 3).map((c) => '<span class="tp-dot" style="background:' + c + '"></span>').join('') +
              '</span><span class="tp-name">' + t.name + '</span>'
            b.addEventListener('click', () => showThemeName(applyTheme(t.id)))
            row.appendChild(b)
          })
          wrap.append(lab, row)
          themePicks.appendChild(wrap)
        })
        syncThemePicks()
        const curId = document.documentElement.getAttribute('data-theme') || 'light'
        showThemeName(THEMES.find((t) => t.id === curId), true)
      }

      /* 教程：首次自动展开，看过之后记住选择 */
      const guideBox = document.getElementById('guideBox')
            if (guideBox) {
        let seen = false
        try {
          seen = localStorage.getItem(GUIDE_KEY) === '1'
        } catch (e) {}
        guideBox.open = !seen
        guideBox.addEventListener('toggle', () => {
          if (!guideBox.open) markSeen()
        })
      }
      function markSeen() {
        try {
          localStorage.setItem(GUIDE_KEY, '1')
        } catch (e) {}
      }
      const guideClose = document.getElementById('guideClose')
      if (guideClose)
        guideClose.addEventListener('click', () => {
          markSeen()
          if (guideBox) guideBox.open = false
          toast('祝你画得开心 🎨')
        })

      /* ---------- 底部导航透明度：实时预览 ---------- */
            const navOpSlider = document.getElementById('navOpSlider')
      const navOpVal = document.getElementById('navOpVal')
      const navOpPresets = document.getElementById('navOpPresets')

      function applyNavOp(v) {
        const n = Math.max(0, Math.min(100, Math.round(Number(v) || 0)))
        const ratio = (n / 100).toFixed(3)
        // 写到根元素，所有页面（含底部导航本体）立即生效
        document.documentElement.style.setProperty('--nav-op', ratio)
        if (navOpSlider) navOpSlider.value = String(n)
        if (navOpVal) navOpVal.textContent = n + '%'
        if (navOpPresets) {
          navOpPresets.querySelectorAll('button').forEach((b) => {
            b.classList.toggle('on', Number(b.dataset.v) === n)
          })
        }
        return n
      }

      // 全局函数：设置页之外（如管理页）也能调用
      window.setNavOpacity = function (v) {
        const n = applyNavOp(v)
        try {
          localStorage.setItem(NAV_OP_KEY, String(n))
        } catch (e) {}
        return n
      }

      if (navOpSlider) {
        let saved = 66
        try {
          const raw = localStorage.getItem(NAV_OP_KEY)
          if (raw !== null && raw !== '') saved = Number(raw)
        } catch (e) {}
        // 进入设置页先把已保存的值应用到真实导航
        applyNavOp(saved)
        // 拖动时只改内存，不落盘；松手才保存，避免频繁写 localStorage
        navOpSlider.addEventListener('input', () => {
          applyNavOp(navOpSlider.value)
        })
        const commit = () => {
          try {
            localStorage.setItem(NAV_OP_KEY, String(Number(navOpSlider.value)))
          } catch (e) {}
        }
        navOpSlider.addEventListener('change', commit)
        navOpSlider.addEventListener('pointerup', commit)
        navOpSlider.addEventListener('touchend', commit)
      }
      if (navOpPresets) {
        navOpPresets.addEventListener('click', (e) => {
          const b = e.target.closest('button[data-v]')
          if (!b) return
          window.setNavOpacity(b.dataset.v)
          if (window.sfx) window.sfx('tick')
        })
      }

      /* ---------- 动画强度 ----------
         四个档位，写到 <html data-anim-level>，CSS 统一开关。
         「关闭」还会顺手停掉像素图标的定时器 —— 那些是 JS 循环，
         光靠 CSS 停不掉。 */
      ;(function () {
        const row = document.getElementById('animLvRow')
        const val = document.getElementById('animLvVal')
        const tip = document.getElementById('animLvTip')
        if (!row || !window.LWIcon) return
        const LABEL = { off: '关闭', low: '省电', std: '标准', rich: '丰富' }
        const TIP = {
          off: '所有动画和过渡都停掉。最省电，界面会显得比较硬。',
          low: '只停掉一直循环的装饰动效（脉冲、呼吸、闪光），入场动画保留。',
          std: '默认。该动的地方都会动。',
          rich: '效果更明显：循环动效更快，图标播得更勤。<b>老手机可能会卡</b>。',
        }
        function render() {
          const cur = window.LWIcon.getLevel()
          if (val) val.textContent = LABEL[cur] || cur
          if (tip) tip.innerHTML = TIP[cur] || ''
          row.querySelectorAll('[data-animlv]').forEach((b) => {
            b.classList.toggle('on', b.getAttribute('data-animlv') === cur)
          })
        }
        row.addEventListener('click', (e) => {
          const b = e.target.closest('[data-animlv]')
          if (!b) return
          window.LWIcon.setLevel(b.getAttribute('data-animlv'))
          if (window.sfx) window.sfx('tick')
          render()
        })
        render()
      })()


      const sfxSwitch = document.getElementById('sfxSwitch')
      if (sfxSwitch) {
        sfxSwitch.checked = window.getSfx ? window.getSfx() : true

        /* 开关旁边的跳动波形。开着才跳 —— 这样不用读文字也知道音效是开是关，
           而且真的发声时会跟着动一下（见下面的 tick）。 */
        let wave = null
        const waveHost = document.getElementById('sfxWaveHost')
        if (waveHost && window.LWDeco && window.LWDeco.wave) {
          wave = window.LWDeco.wave(sfxSwitch.checked)
          waveHost.appendChild(wave)
        }
        const syncWave = () => {
          if (wave && window.LWDeco) window.LWDeco.setWave(wave, sfxSwitch.checked)
        }
        syncWave()
        // 切换开关时整页重渲染会丢状态，所以这里也顺带同步一次
        window.addEventListener('lw-sfx-changed', syncWave)

        sfxSwitch.addEventListener('change', () => {
          if (window.setSfx) window.setSfx(sfxSwitch.checked)
          syncWave()
          toast(sfxSwitch.checked ? '音效已开启' : '音效已关闭')
        })
      }

      /* 音效音量。拖动时不发声（拖一路响一路太吵），
         松手（change）才放一记「叮」当作试听。 */
      const sfxVolSlider = document.getElementById('sfxVolSlider')
      const sfxVolVal = document.getElementById('sfxVolVal')
      if (sfxVolSlider) {
        const paintVol = (n) => {
          sfxVolSlider.value = String(n)
          if (sfxVolVal) sfxVolVal.textContent = n + '%'
        }
        const applyVol = (v, preview) => {
          const n = Math.max(0, Math.min(100, Math.round(Number(v) || 0)))
          paintVol(n)
          if (window.setSfxVolume) window.setSfxVolume(n / 100)
          if (preview && n > 0 && window.sfx) window.sfx('ding')
        }
        const startVol = Math.round((window.getSfxVolume ? window.getSfxVolume() : 0.8) * 100)
        paintVol(startVol)
        sfxVolSlider.addEventListener('input', () => applyVol(sfxVolSlider.value, false))
        sfxVolSlider.addEventListener('change', () => applyVol(sfxVolSlider.value, true))
        const volPresets = document.getElementById('sfxVolPresets')
        if (volPresets) {
          volPresets.addEventListener('click', (e) => {
            const b = e.target.closest ? e.target.closest('button[data-v]') : null
            if (!b) return
            applyVol(b.getAttribute('data-v'), true)
          })
        }
      }

      function setTheme(dark) {
        applyTheme(dark ? 'dark' : 'light')
        syncThemeUI()
      }

      darkSwitch.addEventListener('change', () => setTheme(darkSwitch.checked))

      /* ---------- 版本与更新 ----------
         这个站的资源是「网络优先 + Service Worker 兜底」，正常刷新本来就能拿到新版。
         但用户可能一直停在页面里（SPA 切页不会重新加载 index.html），
         也可能被 SW 的壳缓存兜住，于是一直看着旧界面、以为作者没更新。
         这里给一个「刷新到最新版」：清掉 SW 缓存 → 注销 Service Worker →
         重新加载，强制从网络拿最新代码。
         只动缓存，不碰 localStorage —— 草稿、登录、设置都留着。 */
      const updBtn = document.getElementById('updBtn')
      const updVer = document.getElementById('updVer')
      const updNote = document.getElementById('updNote')
      const runningVer = window.__LW_VER || '未知'

      const paintUpdNote = (text, fresh) => {
        if (!updNote) return
        updNote.textContent = text
        updNote.className = fresh ? 'upd-note fresh' : 'upd-note'
      }

      /* 绕开所有缓存，读服务器上 index.html 里的版本号 */
      async function fetchServerVer() {
        const res = await fetch('/index.html?t=' + Date.now(), { cache: 'no-store' })
        if (!res.ok) return ''
        const txt = await res.text()
        const m = txt.match(/__LW_VER\s*=\s*['"]([^'"]+)['"]/)
        return m ? m[1] : ''
      }

      async function checkUpdate(byUser) {
        if (updVer) updVer.textContent = 'v' + runningVer
        try {
          const srv = await fetchServerVer()
          if (srv && srv !== runningVer) {
            paintUpdNote('发现新版本 v' + srv + '，点右边「刷新到最新版」即可更新。', true)
            if (byUser && window.sfx) window.sfx('ding')
            return true
          }
          paintUpdNote('已经是最新版本 v' + runningVer + '。刷新不会丢草稿、登录和设置。', false)
          if (byUser && window.toast) window.toast('已经是最新版本 v' + runningVer)
          return false
        } catch (e) {
          paintUpdNote('暂时连不上服务器，等联网后再试。本来是最新版的话，不刷新也没关系。', false)
          if (byUser && window.toast) window.toast('检查更新失败：网络错误')
          return false
        }
      }

      if (updBtn) {
        updBtn.addEventListener('click', async () => {
          if (updBtn.disabled) return
          if (navigator.onLine === false) {
            toast('现在没有网络，联网后再试')
            return
          }
          updBtn.disabled = true
          const old = updBtn.textContent
          updBtn.textContent = '更新中…'
          try {
            // 1) 删掉 Service Worker 的壳缓存
            if (window.caches && caches.keys) {
              const keys = await caches.keys()
              await Promise.all(keys.map((k) => caches.delete(k)))
            }
            // 2) 注销 Service Worker：重新加载时直接走网络，顺便拿到最新 sw.js
            if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
              const regs = await navigator.serviceWorker.getRegistrations()
              await Promise.all(regs.map((r) => r.unregister()))
            }
            // 3) 清掉切页缓存（内存里的，重载本来也会没，这里图个干净）
            if (window.__lwCache) window.__lwCache = {}
            /* 4) 把入口脚本用「强制走网络」的方式重新拉一遍。
                  只清 Cache Storage 不够：app.js / views 的地址没变，
                  浏览器仍可能从 HTTP 缓存里拿旧的。cache:'reload' 会绕过
                  HTTP 缓存并把新内容写回去，紧接着的重载才能拿到新版。 */
            await Promise.all(
              ['/app.js', '/lw-cache.js', '/themes.js', '/lw-avatar.js', '/lw-spray.js', '/lw-thumb.js']
                .map((p) => fetch(p, { cache: 'reload' }).catch(() => {}))
            )
            /* 5) 带一个一次性参数跳转 —— 这是最关键的一步。
                  location.reload() 用的是同一个地址，浏览器（以及装到桌面的
                  PWA 容器）仍可能从缓存里把旧页面交回来，表现就是「点了刷新
                  反而回到旧版本」。带上参数后它是一个「新地址」，必须重新向
                  服务器要；参数落地后由 index.html 里的脚本抹掉，地址栏不留痕。 */
            const u = new URL(location.href)
            u.searchParams.set('_u', Date.now().toString(36))
            location.replace(u.toString())
          } catch (e) {
            updBtn.disabled = false
            updBtn.textContent = old
            toast('更新失败，请手动长按浏览器的刷新按钮')
          }
        })
      }

      // 进设置页时静默查一次，有新版本就直接写在下方的说明里
      if (updVer) checkUpdate(false)

      syncThemeUI()
  },
}
