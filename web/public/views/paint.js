/**
 * 画板主组件
 * 
 * 像素小镇画板的核心 Vue 组件，支持三种创作模式：
 * - 像素画：逐格上色，支持 16/32/64 尺寸
 * - 像素喷漆：按住拖着喷，64×64 出图
 * - 像素重力：撒一把，看它自己往下堆
 * 
 * 模块结构（css / template / 常量已拆出，画布逻辑仍在 mounted() 内）：
 * - ./paint/paint-styles.js: CSS 样式
 * - ./paint/paint-template.js: HTML 模板
 * - ./paint/paint-constants.js: 常量定义（调色板、工具提示与图标、命题题库、模式与缩放）
 */

import { paintStyles } from './paint/paint-styles.js'
import { paintTemplate } from './paint/paint-template.js'
import {
  PRESET_COLORS,
  TOOL_HINTS,
  paintSvg,
  PIXEL_PROMPTS,
  PROMPT_CATEGORIES,
  PROMPT_KEY,
  MODE_LABEL,
  MINI_SIZES,
  MAX_ZOOM,
} from './paint/paint-constants.js'

export default {
  name: 'paint',
  title: '画板',
  noZoom: true,
  css: paintStyles,
  template: paintTemplate,
  mounted() {
      ;(function () {
        try {
          var has =
            document.cookie.indexOf('paint_consent=') !== -1 ||
            document.cookie.split(';').some(function (c) {
              return c.trim().indexOf('paint_consent=') === 0
            })
          if (!has) document.getElementById('consentOverlay').removeAttribute('hidden')
        } catch (e) {}
      })()
      let size = 16

      // 把模板里的 <i class="pico" data-svg="..."> 占位符替换成真正的 SVG
      document.querySelectorAll('[data-svg]').forEach((el) => {
        el.innerHTML = paintSvg(el.getAttribute('data-svg'))
      })

      /* ---------- 命题（分类与 100 道题库见 paint/paint-constants.js） ---------- */
      const promptCard = document.getElementById('promptCard')
      const promptRoll = document.getElementById('promptRoll')
      const promptText = document.getElementById('promptText')
      const promptMeta = document.getElementById('promptMeta')
      const promptCat = document.getElementById('promptCat')
      let promptIdx = -1

      function promptCand() {
        if (promptCat.value === 'all') return PIXEL_PROMPTS.map((_, i) => i)
        const g = Number(promptCat.value)
        return Array.from({ length: 10 }, (_, i) => g * 10 + i)
      }

      function applyPrompt(idx, syncCat) {
        promptIdx = idx
        promptText.textContent = PIXEL_PROMPTS[idx]
        promptMeta.textContent = PROMPT_CATEGORIES[Math.floor(idx / 10)] + ' · 第 ' + (idx + 1) + ' / ' + PIXEL_PROMPTS.length + ' 题'
        if (syncCat) promptCat.value = String(Math.floor(idx / 10))
      }

      function rollPrompt() {
        const pool = promptCand().filter((i) => i !== promptIdx)
        const cand = pool.length ? pool : promptCand()
        applyPrompt(cand[Math.floor(Math.random() * cand.length)], false)
        localStorage.setItem(PROMPT_KEY, String(promptIdx))
      }

      promptRoll.addEventListener('click', () => {
        rollPrompt()
        toast('给你出了一道新题')
      })
      promptCat.addEventListener('change', rollPrompt)

      function initPrompt() {
        const saved = parseInt(localStorage.getItem(PROMPT_KEY), 10)
        let idx = dailyPromptIdx()
        if (!isNaN(saved) && saved >= 0 && saved < PIXEL_PROMPTS.length) idx = saved
        applyPrompt(idx, true)
        localStorage.setItem(PROMPT_KEY, String(idx))
      }

      function dailyPromptIdx() {
        const d = new Date()
        const key = '' + d.getFullYear() + d.getMonth() + d.getDate()
        let h = 0
        for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0
        return h % PIXEL_PROMPTS.length
      }

      /* ---------- 创作模式选择 ---------- */
      let createMode = null
      const modeOverlay = document.getElementById('modeOverlay')
      const modeBar = document.getElementById('modeBar')
      const modeChip = document.getElementById('modeChip')
      const switchModeBtn = document.getElementById('switchModeBtn')

      // 按开关隐藏模式按钮与相关 UI
      function applyFeatureVisibility() {
        applyLayout()
        const promptBtn = document.querySelector('[data-mode="prompt"]')
        const animBtn = document.querySelector('[data-mode="anim"]')
        if (promptBtn) promptBtn.hidden = !feat.prompt
        if (animBtn) animBtn.hidden = !feat.anim
        const imgBtnEl = document.getElementById('imgBtn')
        if (imgBtnEl) imgBtnEl.hidden = !feat.image
        const mirrorBtnEl = document.getElementById('mirrorBtn')
        if (mirrorBtnEl) mirrorBtnEl.hidden = !feat.mirror
        const tagRowEl = document.querySelector('.tag-row')
        if (tagRowEl) tagRowEl.hidden = !feat.tags
        if (mirrorBtnEl) {
          mirrorBtnEl.classList.remove('active')
          mirrorBtnEl.setAttribute('aria-pressed', 'false')
        }
      }

      /** 这个创作模式现在可用吗？只认已知的三种模式 ——
          以前对 'prompt'/'anim' 之外的一切都返回 true，于是
          localStorage 里没有 lw-mode 时会走进 enterMode(null)，
          顶部芯片显示成「当前：undefined」（MODE_LABEL[null] 是 undefined）。 */
      function modeAllowed(m) {
        if (m === 'free') return true
        if (m === 'prompt') return feat.prompt
        if (m === 'anim') return feat.anim
        return false
      }

      function enterMode(mode) {
        if (window.sfx) window.sfx('open')
        if (!MODE_LABEL[mode] || !modeAllowed(mode)) mode = 'free'
        const isPrompt = mode === 'prompt'
        const firstTime = createMode !== mode
        createMode = mode
        modeOverlay.hidden = true
        modeBar.hidden = false
        modeChip.textContent = '当前：' + MODE_LABEL[mode]
        promptCard.hidden = !isPrompt
        if (mode === 'anim') {
          if (!animOpen) {
            if (size !== 16) switchSize(16)
            animOpenEditor()
          }
        } else {
          if (animOpen) animCloseEditor()
          if (isPrompt && firstTime) initPrompt()
        }
        try { localStorage.setItem('lw-mode', mode) } catch (e) {}
      }

      document.querySelectorAll('.mode-opt').forEach((b) => {
        b.addEventListener('click', () => enterMode(b.dataset.mode))
      })
      switchModeBtn.addEventListener('click', () => {
        modeOverlay.hidden = false
      })
      modeOverlay.addEventListener('click', (e) => {
        if (e.target === modeOverlay && createMode) modeOverlay.hidden = true
      })

      const canvas = document.getElementById('board')
      const ctx = canvas.getContext('2d')

      const dpr = window.devicePixelRatio || 1
      /* 画板是 width:100% 的流式尺寸，背板不能固定 512*dpr ——
         那和实际显示宽度不是整数倍，浏览器拉伸时最后一行只覆盖部分像素，
         露出来的就是一条条白边。这里按实际显示宽度同步背板。 */
      function syncBoardBacking() {
        const cssW = canvas.getBoundingClientRect().width || 512
        const px = Math.max(64, Math.round(cssW * dpr))
        if (canvas.width !== px) {
          canvas.width = px
          canvas.height = px
        }
      }
      syncBoardBacking()
      let CELL = 512 / size

      let zoom = 1
      let panX = 0
      let panY = 0

      let pixels = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => [255, 255, 255])
      )
      let currentColor = [229, 57, 53]
      let activeTool = 'brush'
      /* 拖动锁：开启后任何工具拖动都只平移；按住空格/中键也能临时平移 */
      let panLock = false

      const hint = document.getElementById('hint')
      const curSwatch = document.getElementById('curSwatch')
      const curHex = document.getElementById('curHex')
      const undoBtn = document.getElementById('undoBtn')
      const zoomRow = document.getElementById('zoomRow')
      const zoomIn = document.getElementById('zoomIn')
      const zoomOut = document.getElementById('zoomOut')
      const zoomLevel = document.getElementById('zoomLevel')
      const miniWrap = document.getElementById('miniWrap')
      const miniCanvas = document.getElementById('miniCanvas')

      /* ---------- 小地图：可拖动 + 三档大小 + 记住设置 ----------
         原来位置和尺寸都写死（120px / top:74px right:12px）。
         窄屏或者顶部栏一高就压在画布上，用户想躲开也没有办法。 */
      const MINI_KEY = 'lw-mini-pref'
      let miniSize = 1      // MINI_SIZES 的下标
      let miniPos = null    // { x, y }，null 表示还没定过，用默认位置

      function readMiniPref() {
        try {
          const o = JSON.parse(localStorage.getItem(MINI_KEY) || '{}')
          if (typeof o.i === 'number' && o.i >= 0 && o.i < MINI_SIZES.length) miniSize = o.i
          if (o.p && typeof o.p.x === 'number' && typeof o.p.y === 'number') miniPos = o.p
        } catch (e) {}
      }
      function writeMiniPref() {
        try {
          localStorage.setItem(MINI_KEY, JSON.stringify({ i: miniSize, p: miniPos }))
        } catch (e) {}
      }
      readMiniPref()

      /* ★ 不要再存一个 MINI 常量。
         切尺寸只改 miniSize，常量还留着旧值 —— clampMiniPos 和默认位置
         会按旧尺寸算，换到「大」之后可能会越界。
         统一走 curMini() 现算。 */
      function curMini() {
        return MINI_SIZES[miniSize] || 120
      }
      miniCanvas.width = miniCanvas.height = curMini() * dpr
      miniCanvas.style.width = curMini() + 'px'
      miniCanvas.style.height = curMini() + 'px'

      /* 把位置夹在视口内，别让小地图被拖到看不见的地方 */
      function clampMiniPos(x, y) {
        const w = curMini() + 12
        const h = curMini() + 12
        const maxX = Math.max(4, window.innerWidth - w - 4)
        const maxY = Math.max(4, window.innerHeight - h - 4)
        return { x: Math.max(4, Math.min(maxX, x)), y: Math.max(4, Math.min(maxY, y)) }
      }
      function applyMiniPos() {
        if (!miniPos) {
          // 默认：右上角，但要避开顶部栏和缩放条
          miniPos = clampMiniPos(window.innerWidth - (curMini() + 12) - 12, 96)
        } else {
          miniPos = clampMiniPos(miniPos.x, miniPos.y)
        }
        miniWrap.style.left = miniPos.x + 'px'
        miniWrap.style.top = miniPos.y + 'px'
        miniWrap.style.right = 'auto'
        miniWrap.style.bottom = 'auto'
      }
      applyMiniPos()
      window.addEventListener('resize', () => {
        // 转屏 / 改窗口后重新夹一次，但别覆盖用户拖过的位置
        if (miniPos) applyMiniPos()
      })

      /* 拖动：按在小地图上（不是两个按钮上）就能拖 */
      ;(function bindMiniDrag() {
        let drag = null
        miniWrap.addEventListener('pointerdown', (ev) => {
          /* 两个按钮上按下时不拖 —— 用 closest 而不是比变量，
             那两个元素是后面才取的，这里引用会 TDZ。 */
          if (ev.target && ev.target.closest && ev.target.closest('.mini-hide, .mini-size')) return
          ev.preventDefault()
          drag = { dx: ev.clientX - miniPos.x, dy: ev.clientY - miniPos.y, moved: false }
          miniWrap.classList.add('dragging')
          miniWrap.style.pointerEvents = 'auto'
          try { miniWrap.setPointerCapture(ev.pointerId) } catch (e) {}
        })
        miniWrap.addEventListener('pointermove', (ev) => {
          if (!drag) return
          drag.moved = true
          miniPos = clampMiniPos(ev.clientX - drag.dx, ev.clientY - drag.dy)
          miniWrap.style.left = miniPos.x + 'px'
          miniWrap.style.top = miniPos.y + 'px'
        })
        const end = () => {
          if (!drag) return
          const moved = drag.moved
          drag = null
          miniWrap.classList.remove('dragging')
          miniWrap.style.pointerEvents = ''
          if (moved) {
            writeMiniPref()
            if (window.sfx) window.sfx('tick')
            /* 记一下「刚拖过」。小地图的点击跳转是绑在 pointerdown 上的，
               拖完松手会被当成点击，所以让后面的 click 拦一次。 */
            miniWrap.dataset.justDragged = '1'
            setTimeout(() => { delete miniWrap.dataset.justDragged }, 320)
          }
        }
        miniWrap.addEventListener('pointerup', end)
        miniWrap.addEventListener('pointercancel', end)
        /* 拖动时不要触发点击跳转 —— renderMini 里那边靠 pointerdown 起手。
           这里把拖过的标记留在 dataset 上，跳转逻辑看到就跳过。 */
        miniWrap.addEventListener('click', (ev) => {
          if (miniWrap.dataset.justDragged === '1') {
            ev.stopPropagation()
            ev.preventDefault()
            delete miniWrap.dataset.justDragged
          }
        }, true)
      })()

      const miniCtx = miniCanvas.getContext('2d')
      const fullCanvas = document.createElement('canvas')
      fullCanvas.width = fullCanvas.height = 512 * dpr
      const fullCtx = fullCanvas.getContext('2d')
      let fullDirty = true

      /* ---------- 撤销 ---------- */
      const undoStack = []
      const MAX_UNDO = 30

      const snapshot = () => pixels.map((r) => r.map((px) => [px[0], px[1], px[2]]))
      const updateUndoBtn = () => (undoBtn.disabled = undoStack.length === 0)

      function pushUndo() {
        undoStack.push(snapshot())
        if (undoStack.length > MAX_UNDO) undoStack.shift()
        updateUndoBtn()
      }

      function undo() {
        if (!undoStack.length) return
        pixels = undoStack.pop()
        fullDirty = true
        redraw()
        updateUndoBtn()
        toast('已撤销')
      }

      undoBtn.addEventListener('click', () => {
        if (window.sfx) window.sfx('undo')
        undo()
        scheduleSave()
      })

      /* ---------- 颜色 ---------- */
      const pickWrap = document.getElementById('pickWrap')
      const toolColorBtn = document.getElementById('toolColor')
      const hsvBody = document.getElementById('hsvBody')
      const customBtn = document.getElementById('customBtn')
      const presetRow = document.getElementById('presetRow')
      const svBox = document.getElementById('svBox')
      const svCanvas = document.getElementById('svCanvas')
      const svMarker = document.getElementById('svMarker')
      const hueBox = document.getElementById('hueBox')
      const hueCanvas = document.getElementById('hueCanvas')
      const hueMarker = document.getElementById('hueMarker')
      const ctxSv = svCanvas.getContext('2d')
      const ctxSvM = svMarker.getContext('2d')
      const ctxHue = hueCanvas.getContext('2d')
      const ctxHueM = hueMarker.getContext('2d')

      let H = 0, S = 0.77, V = 0.9
      let SW = 0, SH = 0, HW = 0, HH = 0
      let pickOpen = false
      let hsvOpen = false

      toolColorBtn.addEventListener('click', () => {
        pickOpen = !pickOpen
        pickWrap.hidden = !pickOpen
        toolColorBtn.classList.toggle('active', pickOpen)
        if (pickOpen && hsvOpen) resizePicker()
      })

      customBtn.addEventListener('click', () => {
        hsvOpen = !hsvOpen
        hsvBody.hidden = !hsvOpen
        customBtn.classList.toggle('active', hsvOpen)
        if (hsvOpen) resizePicker()
      })

      function hexToRgb(hex) {
        const h = hex.replace('#', '')
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
      }

      function parseHex(v) {
        const m = String(v).trim().replace(/^#/, '')
        if (!/^[0-9a-fA-F]{6}$/.test(m)) return null
        return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)]
      }

      function hsvToRgb(h, s, v) {
        const i = Math.floor(h * 6)
        const f = h * 6 - i
        const p = v * (1 - s)
        const q = v * (1 - f * s)
        const t = v * (1 - (1 - f) * s)
        const rr = Math.round([v, q, p, p, t, v][i % 6] * 255)
        const gg = Math.round([t, v, v, q, p, p][i % 6] * 255)
        const bb = Math.round([p, p, t, v, v, q][i % 6] * 255)
        return [rr, gg, bb]
      }

      /* RGB → HSV。取色器吸到颜色后靠它把 H/S/V 还原回去，
         否则 SV 方块和色相条的 marker 不会跟着动
         —— 表现就是「取色器不同步到选取的位置」。 */
      /* ★ 这个函数原本有**两份定义**，一份收数组、一份收三个参数，
         而 JS 里同名函数是后面的覆盖前面的 —— 所以只有收三个参数的那份
         活着。可调用方两种写法都有：
           syncPickerFromRgb: rgbToHsv(rgb[0], rgb[1], rgb[2])
           另一处:            rgbToHsv(rgb)
         传数组进去时 r 是数组、g/b 是 undefined，
         算出来是 [0, 0, NaN]，颜色直接错掉，而且不报错。
         现在只留一份，并把两种签名都认下来。 */
      function rgbToHsv(a, b, c) {
        let r, g, b2
        if (Array.isArray(a)) {
          r = a[0]; g = a[1]; b2 = a[2]
        } else {
          r = a; g = b; b2 = c
        }
        const rr = r / 255, gg = g / 255, bb = b2 / 255
        const max = Math.max(rr, gg, bb)
        const min = Math.min(rr, gg, bb)
        const d = max - min
        let h = 0
        if (d > 0) {
          if (max === rr) h = ((gg - bb) / d) % 6
          else if (max === gg) h = (bb - rr) / d + 2
          else h = (rr - gg) / d + 4
          h /= 6
          if (h < 0) h += 1
        }
        const sat = max === 0 ? 0 : d / max
        return [h, sat, max]
      }

      /**
       * 把外部设置的颜色（取色器吸取、导入等）同步进选择器：
       * 更新 H/S/V、重画 SV 渐变与色相条、挪动两个 marker。
       * 选择器没打开时只更新状态，等打开时 resizePicker 会按新状态绘制。
       */
      function syncPickerFromRgb(rgb) {
        const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2])
        // 灰色系没有色相，保留原来的 H，否则色相条会乱跳
        H = hsv[1] < 0.02 ? H : hsv[0]
        S = hsv[1]
        V = hsv[2]
        /* 原来写的是 `pickOpen && hsvOpen`（两个都开着才重画）。
           在画布上用取色器的时候，这两个面板通常都是关着的 ——
           于是 S/V 变了、界面却没跟着重画，指示圆点留在旧位置
           甚至看不见（用户反馈「取色后 HSV 没有指示圆点」）。
           只要有任何一个开着就该重画。 */
        if (pickOpen || hsvOpen) {
          renderSV()
          renderHue()
          drawSVMarker()
          drawHueMarker()
        }
      }

      function sameRgb(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
      }

      const presets = PRESET_COLORS.map(([hex]) => hexToRgb(hex))
      const swatches = PRESET_COLORS.map(([hex], i) => {
        const sw = document.createElement('button')
        sw.type = 'button'
        sw.className = 'swatch'
        sw.style.background = hex
        sw.title = PRESET_COLORS[i][1]
        sw.addEventListener('click', () => setFromPreset(i))
        presetRow.appendChild(sw)
        return sw
      })

      function setFromPreset(i) {
        setFromRgb(presets[i])
      }

      /* 喷漆模式专用色板。
         和像素画共用 currentColor，所以在任何地方换了颜色
         （预设、色值输入、HSV、吸管）这里的高亮都会跟着走。 */
      const sprayPal = document.getElementById('sprayPal')
      const spraySwatches = []
      if (sprayPal) {
        PRESET_COLORS.forEach(([hex, name], i) => {
          const sw = document.createElement('button')
          sw.type = 'button'
          sw.className = 'spray-sw'
          sw.style.background = hex
          sw.title = name || hex
          sw.setAttribute('aria-label', name || hex)
          sw.addEventListener('click', () => setFromPreset(i))
          sprayPal.appendChild(sw)
          spraySwatches.push(sw)
        })
      }
      /* 重力模式专用色板。和喷漆一样只用 currentColor，
         所以在任何地方换了颜色，这里的高亮都会跟着走。 */
      const gravityPal = document.getElementById('gravityPal')
      const gravitySwatches = []
      if (gravityPal) {
        PRESET_COLORS.forEach(([hex, name], i) => {
          const sw = document.createElement('button')
          sw.type = 'button'
          sw.className = 'gravity-sw'
          sw.style.background = hex
          sw.title = name || hex
          sw.setAttribute('aria-label', name || hex)
          sw.addEventListener('click', () => setFromPreset(i))
          gravityPal.appendChild(sw)
          gravitySwatches.push(sw)
        })
      }

      /* 喷漆和重力两套色板一起同步。
         它俩都是「别的方向的画布」，都只读 currentColor、不各自存颜色，
         所以颜色变化只需要一个入口 —— 谁在前面显示谁就跟着亮。 */
      function syncAuxPalette() {
        const hex = '#' + currentColor.map((c) => c.toString(16).padStart(2, '0')).join('')
        if (spraySwatches.length) {
          for (let i = 0; i < spraySwatches.length; i++) {
            spraySwatches[i].classList.toggle('on', sameRgb(presets[i], currentColor))
          }
          const sw = document.getElementById('sprayCurSw')
          const tx = document.getElementById('sprayCurTx')
          if (sw) sw.style.background = hex
          if (tx) tx.textContent = hex
        }
        if (gravitySwatches.length) {
          for (let i = 0; i < gravitySwatches.length; i++) {
            gravitySwatches[i].classList.toggle('on', sameRgb(presets[i], currentColor))
          }
          const gsw = document.getElementById('gravityCurSw')
          const gtx = document.getElementById('gravityCurTx')
          if (gsw) gsw.style.background = hex
          if (gtx) gtx.textContent = hex
        }
      }
      /* 「更多颜色」复用像素画那套完整调色板（含 HSV 和色值输入）。
         喷漆和重力都要用，动作完全一样，所以绑同一个函数。 */
      function togglePickWrap() {
        // 走和像素画「颜色」按钮同一套状态，别只改 hidden，
        // 否则 pickOpen 还是 false，resizePicker 会直接 return，画布尺寸不对
        if (pickOpen) {
          pickOpen = false
          pickWrap.hidden = true
          toolColorBtn.classList.remove('active')
        } else {
          pickOpen = true
          pickWrap.hidden = false
          toolColorBtn.classList.add('active')
          if (!hsvOpen) {
            hsvOpen = true
            hsvBody.hidden = false
            customBtn.classList.add('active')
          }
          resizePicker()
          renderSV()
          renderHue()
          drawSVMarker()
          drawHueMarker()
          syncAuxPalette()
        }
        if (window.sfx) window.sfx('open')
      }
      const sprayMoreColor = document.getElementById('sprayMoreColor')
      if (sprayMoreColor) {
        sprayMoreColor.addEventListener('click', togglePickWrap)
      }
      const gravityMoreColor = document.getElementById('gravityMoreColor')
      if (gravityMoreColor) {
        gravityMoreColor.addEventListener('click', togglePickWrap)
      }

      function setFromRgb(rgb) {
        currentColor = rgb.slice()
        const [h, s, v] = rgbToHsv(rgb)
        H = h
        S = s
        V = v
        if (pickOpen && hsvOpen) {
          renderSV()
          drawSVMarker()
          drawHueMarker()
        }
        updateDisplay(currentColor)
        syncAuxPalette()
      }

      curHex.addEventListener('input', () => {
        const rgb = parseHex(curHex.value)
        if (rgb) setFromRgb(rgb)
      })

      curHex.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const rgb = parseHex(curHex.value)
          if (rgb) setFromRgb(rgb)
        }
      })

      /* ---------- 从照片生成像素画 ---------- */
      const imgBtn = document.getElementById('imgBtn')
      const imgInput = document.getElementById('imgInput')
      const imgModeOverlay = document.getElementById('imgModeOverlay')
      const imgModeCancel = document.getElementById('imgModeCancel')
      let fromImage = false

      // 均匀量化：把每个通道吸附到 levels 档
      function quantize(rgb, levels) {
        if (!levels) return rgb
        const step = 255 / (levels - 1)
        return rgb.map((v) => Math.round(Math.round(v / step) * step))
      }
      // 吸附到最接近的预设色
      function snapToPalette(rgb, palette) {
        if (!palette || !palette.length) return rgb
        let best = palette[0]
        let bestD = Infinity
        for (const c of palette) {
          const d =
            (c[0] - rgb[0]) ** 2 + (c[1] - rgb[1]) ** 2 + (c[2] - rgb[2]) ** 2
          if (d < bestD) {
            bestD = d
            best = c
          }
        }
        return [best[0], best[1], best[2]]
      }

      function applyImageToCanvas(file, mode) {
        if (!file || !/^image\//.test(file.type)) {
          toast('请选择一张图片')
          return
        }
        const url = URL.createObjectURL(file)
        const im = new Image()
        im.onload = () => {
          try {
            const n = size
            const cv = document.createElement('canvas')
            cv.width = n
            cv.height = n
            const ctx = cv.getContext('2d', { willReadFrequently: true })
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            // 居中裁切成正方形再缩放，避免拉伸变形
            const side = Math.min(im.width, im.height)
            const sx = (im.width - side) / 2
            const sy = (im.height - side) / 2
            ctx.drawImage(im, sx, sy, side, side, 0, 0, n, n)
            const data = ctx.getImageData(0, 0, n, n).data

            pushUndo()
            const usePalette = mode === 'palette'
            const levels = mode === 'quant' ? 6 : 0
            for (let y = 0; y < n; y++) {
              for (let x = 0; x < n; x++) {
                const i = (y * n + x) * 4
                if (data[i + 3] < 8) continue
                let rgb = [data[i], data[i + 1], data[i + 2]]
                rgb = quantize(rgb, levels)
                if (usePalette) rgb = snapToPalette(rgb, presets)
                pixels[y][x] = rgb
              }
            }
            fromImage = true
            imgBtn.classList.add('active')
            fullDirty = true
            redraw()
            scheduleSave()
            refreshHint()
            toast(
              '已生成 ' + n + '×' + n + ' 像素画，可继续手改' +
                (usePalette ? '（已统一成 32 色）' : levels ? '（颜色已简化）' : '')
            )
          } catch (err) {
            toast('图片处理失败：' + err.message)
          } finally {
            URL.revokeObjectURL(url)
          }
        }
        im.onerror = () => {
          URL.revokeObjectURL(url)
          toast('图片读取失败')
        }
        im.src = url
      }

      if (imgBtn && imgInput) {
        imgBtn.addEventListener('click', () => {
          imgModeOverlay.hidden = false
        })
        imgModeOverlay.querySelectorAll('[data-imgmode]').forEach((b) => {
          b.addEventListener('click', () => {
            pendingImgMode = b.dataset.imgmode
            imgModeOverlay.hidden = true
            imgInput.click()
          })
        })
        imgModeCancel.addEventListener('click', () => {
          if (window.sfx) window.sfx('close')
          imgModeOverlay.hidden = true
        })
        imgModeOverlay.addEventListener('click', (e) => {
          if (e.target === imgModeOverlay) imgModeOverlay.hidden = true
        })
        imgInput.addEventListener('change', () => {
          const f = imgInput.files && imgInput.files[0]
          if (f) applyImageToCanvas(f, pendingImgMode)
          imgInput.value = ''
        })
      }
      let pendingImgMode = 'plain'

      // 画板直接拖入图片
      const boardEl = document.getElementById('board')
      if (boardEl) {
        ;['dragenter', 'dragover'].forEach((t) =>
          boardEl.addEventListener(t, (e) => {
            e.preventDefault()
            boardEl.classList.add('drop-hint')
          })
        )
        ;['dragleave', 'drop'].forEach((t) =>
          boardEl.addEventListener(t, (e) => {
            e.preventDefault()
            boardEl.classList.remove('drop-hint')
          })
        )
        boardEl.addEventListener('drop', (e) => {
          const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]
          if (f) applyImageToCanvas(f, pendingImgMode)
        })
      }

      /* ---------- 删除自己的作品 ---------- */
      async function deleteOwnWork(rec) {
        if (!authToken()) {
          toast('删除作品需要先登录')
          setTimeout(() => {
            location.href = '/login'
          }, 800)
          return
        }
        const name = rec.workName || '未命名'
        if (!(await lwConfirm('确定删除「' + name + '」吗？删除后无法恢复。'))) return
        try {
          const res = await fetch('/api/mine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken() },
            body: JSON.stringify({ action: 'delete', token: authToken(), time: rec.time }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok) {
            toast('删除失败：' + (data.error || res.status))
            return
          }
          toast('已删除「' + name + '」')
        } catch (e) {
          toast('删除失败：网络错误')
          return
        }
        // 删除已成功，下面这些收尾动作失败也不该影响结果
        try {
          const ids = JSON.parse(localStorage.getItem('paintMyTimes') || '[]')
          localStorage.setItem(
            'paintMyTimes',
            JSON.stringify(ids.filter((t) => String(t) !== String(rec.time)))
          )
        } catch (e) {}
        await loadOwned()
        await fetchRecords()
      }

      /* ---------- 画板布局开关 ---------- */
      function isLayOn(k) {
        try {
          return localStorage.getItem('lw-lay-' + k) !== '0'
        } catch (e) {
          return true
        }
      }
      function applyLayout() {
        const map = {
          size: '.size-row',
          tools: '.tools',
          join: '#joinCard',
          name: '.name-row',
          actions: '.actions',
          hint: '#hint',
          disclaimer: '.disclaimer',
        }
        for (const k in map) {
          const el = document.querySelector(map[k])
          if (el) el.hidden = !isLayOn(k)
        }
        // 标签行有自己的开关，这里只在开启时叠加显示
        const tagRowEl = document.querySelector('.tag-row')
        if (tagRowEl) tagRowEl.hidden = !(feat.tags && isLayOn('name'))
        // 草稿行/最近色属于进阶功能，受两套开关共同控制
        const draftRow = document.getElementById('draftRow')
        if (draftRow) draftRow.hidden = !(feat.drafts && isLayOn('history'))
        const recentRow = document.getElementById('recentRow')
        if (recentRow) recentRow.hidden = !(isLayOn('tools') && recentColors.length > 0)
      }

      /* ---------- 开局菜单状态（须在 consent 块调用前完成初始化） ---------- */
      let startMode = 'free'
      let startJoin = 'none'
      let startSize = 16
      /* 创作方向：pixel / spray / gravity。
         和上面三个一样必须在这里就初始化好 —— applyDir() 会读它，
         而 applyDir() 经 openStartMenu() ← startCreation() 在同意协议后**立刻**被调用。
         漏了这一行就会抛 Cannot access 'startDir' before initialization，
         mounted() 从那一行起整段不执行。 */
      let startDir = 'pixel'

      /* ---------- 进阶功能开关 ---------- */
      function isFeatOn(k) {
        try {
          return localStorage.getItem('lw-feat-' + k) === '1'
        } catch (e) {
          return false
        }
      }
      const feat = {
        get prompt() { return isFeatOn('prompt') },
        get anim() { return isFeatOn('anim') },
        get daily() { return isFeatOn('daily') },
        get contest() { return isFeatOn('contest') },
        get image() { return isFeatOn('image') },
        get mirror() { return isFeatOn('mirror') },
        get drafts() { return isFeatOn('drafts') },
        get tags() { return isFeatOn('tags') },
      }

      /* ---------- 多张草稿槽 ---------- */
      const SLOTS = 3
      const SLOT_KEY = 'paintSlots'
      const draftRow = document.getElementById('draftRow')
      const draftSlots = document.getElementById('draftSlots')
      let slotBusy = false

      function readSlots() {
        try {
          const raw = JSON.parse(localStorage.getItem(SLOT_KEY) || '[]')
          return Array.isArray(raw) ? raw : []
        } catch (e) {
          return []
        }
      }
      function writeSlots(arr) {
        try {
          localStorage.setItem(SLOT_KEY, JSON.stringify(arr))
        } catch (e) {}
      }
      function currentFlat() {
        const flat = []
        for (const row of pixels) for (const px of row) flat.push([px[0], px[1], px[2]])
        return flat
      }
      function restoreSlot(entry) {
        size = entry.size === 32 || entry.size === 64 || entry.size === 128 ? entry.size : 16
        CELL = 512 / size
        undoStack.length = 0
        updateUndoBtn()
        document.querySelectorAll('.size-btn').forEach((b) =>
          b.classList.toggle('active', Number(b.dataset.size) === size)
        )
        const out = Array.from({ length: size }, () => Array.from({ length: size }, () => [255, 255, 255]))
        for (let i = 0; i < size * size; i++) {
          const src = entry.pixels[i]
          if (!src) continue
          out[Math.floor(i / size)][i % size] = [src[0], src[1], src[2]]
        }
        pixels.length = 0
        for (const row of out) pixels.push(row)
        resetCamera()
        refreshHint()
        fullDirty = true
        redraw()
        scheduleSave()
      }
      function renderSlots() {
        if (!draftSlots) return
        const slots = readSlots()
        let used = 0
        draftSlots.innerHTML = ''
        for (let i = 0; i < SLOTS; i++) {
          const has = !!slots[i]
          if (has) used++
          const wrap = document.createElement('div')
          wrap.className = 'draft-slot' + (has ? ' filled' : '')
          const label = document.createElement('span')
          label.className = 'draft-no'
          label.textContent = '槽 ' + (i + 1)
          wrap.appendChild(label)
          if (has) {
            const th = document.createElement('img')
            th.className = 'draft-thumb'
            th.alt = '草稿 ' + (i + 1)
            th.src = (function () {
              const cv = document.createElement('canvas')
              cv.width = slots[i].size
              cv.height = slots[i].size
              const c = cv.getContext('2d')
              for (let y = 0; y < slots[i].size; y++)
                for (let x = 0; x < slots[i].size; x++) {
                  const p = slots[i].pixels[y * slots[i].size + x]
                  c.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'
                  c.fillRect(x, y, 1, 1)
                }
              return cv.toDataURL('image/png')
            })()
            wrap.appendChild(th)
            const del = document.createElement('button')
            del.type = 'button'
            del.className = 'draft-del'
            del.textContent = '×'
            del.title = '清空这个槽'
            del.addEventListener('click', (e) => {
              e.stopPropagation()
              const arr = readSlots()
              arr[i] = null
              writeSlots(arr)
              renderSlots()
            })
            wrap.appendChild(del)
            wrap.addEventListener('click', () => {
              if (slotBusy) return
              slotBusy = true
              try {
                restoreSlot(slots[i])
                toast('已载入草稿 ' + (i + 1))
              } finally {
                slotBusy = false
              }
            })
          } else {
            const add = document.createElement('button')
            add.type = 'button'
            add.className = 'draft-add'
            add.textContent = '存当前'
            add.addEventListener('click', (e) => {
              e.stopPropagation()
              const arr = readSlots()
              arr[i] = { size, pixels: currentFlat(), time: Date.now() }
              writeSlots(arr)
              renderSlots()
              toast('已存入草稿槽 ' + (i + 1))
            })
            wrap.appendChild(add)
          }
          draftSlots.appendChild(wrap)
        }
        if (draftRow) draftRow.hidden = false
      }

      /* ---------- 导出 PNG ---------- */
      const savePngBtn = document.getElementById('savePngBtn')
      if (savePngBtn) savePngBtn.addEventListener('click', () => window.sfx && window.sfx('save'))
      /* 一维像素数组 → PNG dataURL。
         喷漆、重力、像素画三条路最后都是「把一片格子放大后存成图」，
         只有尺寸和数组来源不同，所以画图这段共用一份。 */
      function flatToPng(flat, n, scale) {
        const k = scale || 8
        const cv = document.createElement('canvas')
        cv.width = n * k
        cv.height = n * k
        const sctx = cv.getContext('2d')
        for (let i = 0; i < flat.length; i++) {
          const p = flat[i]
          sctx.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'
          sctx.fillRect((i % n) * k, Math.floor(i / n) * k, k, k)
        }
        return cv.toDataURL('image/png')
      }
      function exportPng(scale) {
        // 喷漆模式下导出喷漆结果，与发布口径一致(64×64)
        if (sprayOn && spray) {
          return flatToPng(spray.full(), 64, scale)
        }
        // 重力画布上半截必然是空的（颗粒只会往下掉），
        // 原样导出就是一张上面全白的图。这里按发布口径裁剪后再导出，
        // 存下来的 PNG 和社区里看到的是同一张。
        if (gravityOn && gravity) {
          const ex = gravity.exportData()
          if (!ex) return ''
          return flatToPng(ex.flat, ex.size, scale)
        }
        const n = size
        const k = scale || 8
        const cv = document.createElement('canvas')
        cv.width = n * k
        cv.height = n * k
        const ctx = cv.getContext('2d')
        for (let y = 0; y < n; y++) {
          for (let x = 0; x < n; x++) {
            const p = pixels[y][x]
            ctx.fillStyle = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')'
            ctx.fillRect(x * k, y * k, k, k)
          }
        }
        return cv.toDataURL('image/png')
      }
      if (savePngBtn) {
        savePngBtn.addEventListener('click', () => {
          try {
            let url
            let nameSize = size
            if (sprayOn && spray) nameSize = 64
            if (gravityOn && gravity) {
              const ex = gravity.exportData()
              if (!ex) {
                toast('还没撒东西呢')
                return
              }
              nameSize = ex.size
            }
            url = exportPng(Math.max(4, Math.round(512 / nameSize)))
            if (!url) {
              toast('还没撒东西呢')
              return
            }
            const a = document.createElement('a')
            a.href = url
            a.download = '像素小镇-' + nameSize + 'x' + nameSize + '.png'
            document.body.appendChild(a)
            a.click()
            a.remove()
            toast('已导出 PNG（' + nameSize + '×' + nameSize + '）')
          } catch (err) {
            toast('导出失败：' + err.message)
          }
        })
      }

      /* ---------- 镜像绘制 ---------- */
      let mirrorOn = false
      const mirrorBtn = document.getElementById('mirrorBtn')
      // 填充后把左半边整体镜像到右半边，保持对称
      function enforceSymmetry() {
        const half = Math.floor(size / 2)
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < half; x++) {
            pixels[y][size - 1 - x] = pixels[y][x].slice()
          }
        }
        fullDirty = true
      }
      if (mirrorBtn) {
        mirrorBtn.addEventListener('click', () => {
          mirrorOn = !mirrorOn
          mirrorBtn.classList.toggle('active', mirrorOn)
          mirrorBtn.setAttribute('aria-pressed', mirrorOn ? 'true' : 'false')
          refreshHint()
          toast(mirrorOn ? '已开启左右镜像绘制' : '已关闭镜像绘制')
        })
      }

      /* ---------- 最近使用颜色 ---------- */
      const RECENT_KEY = 'paintRecentColors'
      const recentRow = document.getElementById('recentRow')
      const recentSwatches = document.getElementById('recentSwatches')
      let recentColors = []
      try {
        const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
        if (Array.isArray(raw)) recentColors = raw.filter((c) => Array.isArray(c) && c.length === 3).slice(0, 12)
      } catch (e) {}

      function renderRecent() {
        if (!recentRow || !recentSwatches) return
        recentRow.hidden = recentColors.length === 0
        recentSwatches.innerHTML = ''
        recentColors.forEach((c) => {
          const b = document.createElement('button')
          b.type = 'button'
          b.className = 'recent-swatch'
          b.title = 'rgb(' + c.join(',') + ')'
          b.style.background = 'rgb(' + c.join(',') + ')'
          b.addEventListener('click', () => {
            currentColor = [c[0], c[1], c[2]]
            updateDisplay(currentColor)
          })
          recentSwatches.appendChild(b)
        })
      }

      function pushRecentColor(rgb) {
        const key = rgb.join(',')
        recentColors = recentColors.filter((c) => c.join(',') !== key)
        recentColors.unshift([rgb[0], rgb[1], rgb[2]])
        if (recentColors.length > 12) recentColors.length = 12
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(recentColors))
        } catch (e) {}
        renderRecent()
      }

      const tagsInput = document.getElementById('tagsInput')
      function readTags() {
        if (!tagsInput) return []
        const raw = tagsInput.value.trim()
        if (!raw) return []
        return raw
          .split(/[\s,，、#]+/)
          .map((t) => t.trim().slice(0, 6))
          .filter(Boolean)
          .slice(0, 3)
      }

      function syncToolSwatch() {
        const el = document.getElementById('toolSwatch')
        if (el) el.style.background = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`
      }

      function updateDisplay(rgb) {
        syncToolSwatch()
        pushRecentColor(rgb)
        curSwatch.style.background = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
        curHex.value = '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('')
        swatches.forEach((sw, i) => sw.classList.toggle('selected', sameRgb(rgb, presets[i])))
      }

      function applyColor() {
        currentColor = hsvToRgb(H, S, V)
        updateDisplay(currentColor)
      }

      function resizePicker() {
        if (!pickOpen || !hsvOpen) return
        const sRect = svBox.getBoundingClientRect()
        SW = Math.max(20, Math.round(sRect.width * dpr))
        SH = SW
        svCanvas.width = svCanvas.height = SW
        svMarker.width = svMarker.height = SW

        const hRect = hueBox.getBoundingClientRect()
        HW = Math.max(10, Math.round(hRect.width * dpr))
        HH = Math.max(20, Math.round(hRect.height * dpr))
        hueCanvas.width = HW
        hueCanvas.height = HH
        hueMarker.width = HW
        hueMarker.height = HH

        renderSV()
        renderHue()
        drawSVMarker()
        drawHueMarker()
      }

      function renderSV() {
        if (!SW) return
        const img = ctxSv.createImageData(SW, SH)
        const d = img.data
        for (let y = 0; y < SH; y++) {
          const v = 1 - y / (SH - 1)
          for (let x = 0; x < SW; x++) {
            const s = x / (SW - 1)
            const [r, g, b] = hsvToRgb(H, s, v)
            const i = (y * SW + x) * 4
            d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255
          }
        }
        ctxSv.putImageData(img, 0, 0)
      }

      function renderHue() {
        if (!HW) return
        for (let y = 0; y < HH; y++) {
          const hue = y / (HH - 1)
          const [r, g, b] = hsvToRgb(hue, 1, 1)
          ctxHue.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctxHue.fillRect(0, y, HW, 1)
        }
      }

      function drawSVMarker() {
        if (!SW) return
        ctxSvM.clearRect(0, 0, SW, SH)
        const x = S * SW
        const y = (1 - V) * SH
        ctxSvM.beginPath()
        ctxSvM.arc(x, y, 8 * dpr, 0, 2 * Math.PI)
        ctxSvM.fillStyle = '#fff'
        ctxSvM.fill()
        ctxSvM.lineWidth = 2 * dpr
        ctxSvM.strokeStyle = 'rgba(0, 0, 0, 0.7)'
        ctxSvM.stroke()
      }

      function drawHueMarker() {
        if (!HW) return
        ctxHueM.clearRect(0, 0, HW, HH)
        const y = H * HH
        ctxHueM.fillStyle = '#fff'
        ctxHueM.fillRect(0, y - 3 * dpr, HW, 6 * dpr)
        ctxHueM.strokeStyle = 'rgba(0, 0, 0, 0.7)'
        ctxHueM.lineWidth = 1.5 * dpr
        ctxHueM.beginPath()
        ctxHueM.moveTo(0, y)
        ctxHueM.lineTo(HW, y)
        ctxHueM.stroke()
      }

      let svDrag = false
      let hueDrag = false

      function setSV(e) {
        const rect = svCanvas.getBoundingClientRect()
        S = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        V = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
        drawSVMarker()
        applyColor()
      }

      svCanvas.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        svDrag = true
        svCanvas.setPointerCapture(e.pointerId)
        setSV(e)
      })
      svCanvas.addEventListener('pointermove', (e) => {
        if (svDrag) setSV(e)
      })
      svCanvas.addEventListener('pointerup', () => (svDrag = false))
      svCanvas.addEventListener('pointercancel', () => (svDrag = false))

      function setHue(e) {
        const rect = hueCanvas.getBoundingClientRect()
        H = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
        renderSV()
        drawHueMarker()
        applyColor()
      }

      hueCanvas.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        hueDrag = true
        hueCanvas.setPointerCapture(e.pointerId)
        setHue(e)
      })
      hueCanvas.addEventListener('pointermove', (e) => {
        if (hueDrag) setHue(e)
      })
      hueCanvas.addEventListener('pointerup', () => (hueDrag = false))
      hueCanvas.addEventListener('pointercancel', () => (hueDrag = false))

      window.addEventListener('resize', () => {
        resizePicker()
        // 显示宽度变了要重设背板，否则又会出现白边
        syncBoardBacking()
        redraw()
      })
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          syncBoardBacking()
          redraw()
        }, 260)
      })

      /* ---------- 画板 ---------- */
      document.querySelectorAll('.tool[data-tool]').forEach((btn) => {
        btn.addEventListener('click', () => setTool(btn.dataset.tool))
      })

      function setTool(tool) {
        activeTool = tool
        document.querySelectorAll('.tool[data-tool]').forEach((b) =>
          b.classList.toggle('active', b.dataset.tool === tool)
        )
        refreshHint()
      }

      const toolLock = document.getElementById('toolLock')
      function setPanLock(v) {
        panLock = !!v
        if (toolLock) toolLock.classList.toggle('active', panLock)
        try {
          localStorage.setItem('lw-panlock', panLock ? '1' : '0')
        } catch (e) {}
        refreshHint()
      }
      if (toolLock) {
        toolLock.addEventListener('click', () => {
          setPanLock(!panLock)
          if (window.sfx) window.sfx('tick')
          toast(panLock ? '拖动锁已开启：拖动只移动画布' : '拖动锁已关闭：拖动正常涂色')
        })
        try {
          panLock = localStorage.getItem('lw-panlock') === '1'
        } catch (e) {}
        toolLock.classList.toggle('active', panLock)
      }

      function refreshHint() {
        let base = TOOL_HINTS[activeTool] || TOOL_HINTS.brush
        if (mirrorOn) base += ' · 🦋 镜像中'
        if (activeTool === 'pan') base += ' · 只拖动画布，不会落笔'
        else if (panLock) base += ' · ✥ 拖动锁已开：拖动只移动画布'
        else if (size > 16) base += ' · 拖动涂色 · ✥ 切换成拖动画布 · ＋/－ 缩放'
        else base += ' · 拖动涂色 · 点 ✥ 可改为拖动画布'
        hint.textContent = base
      }

      function resetCamera() {
        zoom = Math.max(1, size / 32)
        panX = 0
        panY = 0
        clampPan()
        zoomRow.hidden = size === 16
        updateMiniVis()
        updateZoomUI()
      }

      function setCam(nz, c) {
        nz = Math.max(1, Math.min(MAX_ZOOM, nz))
        if (c) {
          panX = c.x - 256 / nz
          panY = c.y - 256 / nz
        }
        zoom = nz
        clampPan()
        updateMiniVis()
        redraw()
        updateZoomUI()
      }

      function clampPan() {
        const maxPan = 512 - 512 / zoom
        panX = Math.max(0, Math.min(maxPan, panX))
        panY = Math.max(0, Math.min(maxPan, panY))
      }

      const miniShow = document.getElementById('miniShow')
      const miniHide = document.getElementById('miniHide')
      let miniOpen = false
      function updateMiniVis() {
        const show = miniOpen && size > 16 && zoom > 1
        miniWrap.hidden = !show
        if (miniShow) miniShow.hidden = show || size <= 16
      }
      if (miniShow)
        miniShow.addEventListener('click', () => {
          miniOpen = true
          updateMiniVis()
          // 展开后把位置重新夹一次（窗口大小可能变了）
          try { applyMiniPos() } catch (e) {}
        })
      if (miniHide)
        miniHide.addEventListener('click', () => {
          miniOpen = false
          updateMiniVis()
        })

      /* 尺寸按钮：小 → 中 → 大 循环。切换时重建背板尺寸并重画。 */
      const miniSizeBtn = document.getElementById('miniSize')
      if (miniSizeBtn)
        miniSizeBtn.addEventListener('click', () => {
          miniSize = (miniSize + 1) % MINI_SIZES.length
          const px = MINI_SIZES[miniSize]
          miniCanvas.width = miniCanvas.height = px * dpr
          miniCanvas.style.width = px + 'px'
          miniCanvas.style.height = px + 'px'
          // 位置要跟着重夹一次，变大后可能越界
          miniPos = null
          try { applyMiniPos() } catch (e) {}
          writeMiniPref()
          try { renderMini() } catch (e) {}
          if (window.sfx) window.sfx('tick')
          toast('小地图：' + ['小', '中', '大'][miniSize])
        })

      function updateZoomUI() {
        zoomLevel.textContent = Math.round(zoom * 100) + '%'
      }

      function switchSize(n) {
        if (n === size) return
        if (animOpen && n !== 16) {
          animFrames = null
          animCloseEditor()
        }
        size = n
        CELL = 512 / size
        pixels = Array.from({ length: size }, () =>
          Array.from({ length: size }, () => [255, 255, 255])
        )
        fullDirty = true
        undoStack.length = 0
        updateUndoBtn()
        document.querySelectorAll('.size-btn').forEach((b) =>
          b.classList.toggle('active', Number(b.dataset.size) === size)
        )
        if (window.sfx) window.sfx('select')
        resetCamera()
        refreshHint()
        redraw()
      }

      document.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const n = Number(btn.dataset.size)
          if (n === size) return
          switchSize(n)
          scheduleSave()
          toast('画布已切换为 ' + n + '×' + n)
        })
      })

      zoomIn.addEventListener('click', () => {
        const c = { x: 256 / zoom + panX, y: 256 / zoom + panY }
        setCam(zoom * 1.5, c)
      })
      zoomOut.addEventListener('click', () => {
        const c = { x: 256 / zoom + panX, y: 256 / zoom + panY }
        setCam(zoom / 1.5, c)
      })

      /* 画辅助网格。
         原来每条线一个粗细（rgba .10），16×16 时还行，
         到 64×64 就是一片均匀的灰网，看不出格子在哪。
         改成**主次两层**：每 8 格一条较深的主线，每格一条很浅的细线。
         这样扫一眼就能数出格子，长时间画也不累眼。 */
      function drawGrid() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
        const minor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)'
        const major = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.16)'
        const lw = 1 / zoom

        // 先铺细线
        ctx.strokeStyle = minor
        ctx.lineWidth = lw
        for (let i = 1; i < size; i++) {
          const p = i * CELL + 0.5
          ctx.beginPath()
          ctx.moveTo(p, 0)
          ctx.lineTo(p, 512)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, p)
          ctx.lineTo(512, p)
          ctx.stroke()
        }

        // 再压主线上去。8 的倍数画主线，等于把画布分成 8 格一块
        if (size >= 8) {
          ctx.strokeStyle = major
          ctx.lineWidth = lw
          for (let i = 8; i < size; i += 8) {
            const p = i * CELL + 0.5
            ctx.beginPath()
            ctx.moveTo(p, 0)
            ctx.lineTo(p, 512)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, p)
            ctx.lineTo(512, p)
            ctx.stroke()
          }
        }

        // 最外框：让画布边界清楚，不然浅色画到边上分不清出没出去
        ctx.strokeStyle = major
        ctx.lineWidth = lw * 2
        ctx.strokeRect(0, 0, 512, 512)
      }

      function redraw() {
        ensureFull()
        syncBoardBacking()
        ctx.imageSmoothingEnabled = false
        // 逻辑坐标固定 512×512；k 把逻辑像素映射到背板设备像素，
        // 因为背板 = 显示宽度 × dpr，缩放比是精确的，不会切出白边。
        const k = canvas.width / 512
        const z = zoom * k
        ctx.setTransform(z, 0, 0, z, -panX * z, -panY * z)
        ctx.clearRect(0, 0, 512, 512)
        ctx.drawImage(fullCanvas, 0, 0, 512, 512)
        drawGrid()
        renderMini()
      }

      function ensureFull() {
        if (!fullDirty) return
        renderFull()
        fullDirty = false
      }

      function renderFull() {
        fullCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
        fullCtx.clearRect(0, 0, 512, 512)
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const [r, g, b] = pixels[y][x]
            fullCtx.fillStyle = `rgb(${r}, ${g}, ${b})`
            fullCtx.fillRect(x * CELL, y * CELL, CELL, CELL)
          }
        }
      }

      function renderMini() {
        const k = miniCanvas.width / 512
        miniCtx.setTransform(1, 0, 0, 1, 0, 0)
        miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height)
        miniCtx.imageSmoothingEnabled = false
        miniCtx.setTransform(k, 0, 0, k, 0, 0)
        miniCtx.drawImage(fullCanvas, 0, 0, 512, 512)
        if (size <= 16) return
        miniCtx.setTransform(1, 0, 0, 1, 0, 0)
        miniCtx.strokeStyle = 'rgba(255, 82, 82, 0.95)'
        miniCtx.lineWidth = 2
        miniCtx.strokeRect(panX * k, panY * k, (512 / zoom) * k, (512 / zoom) * k)
      }


      function cellFromEvent(e) {
        const rect = canvas.getBoundingClientRect()
        const boardX = ((e.clientX - rect.left) * (512 / rect.width)) / zoom + panX
        const boardY = ((e.clientY - rect.top) * (512 / rect.height)) / zoom + panY
        const col = Math.floor(boardX / CELL)
        const row = Math.floor(boardY / CELL)
        return { row: Math.max(0, Math.min(size - 1, row)), col: Math.max(0, Math.min(size - 1, col)) }
      }

      function sameColor(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
      }

      function floodFill(row, col) {
        const target = pixels[row][col]
        if (sameColor(target, currentColor)) return
        const stack = [[row, col]]
        while (stack.length) {
          const [r, c] = stack.pop()
          if (r < 0 || r >= size || c < 0 || c >= size) continue
          const px = pixels[r][c]
          if (!sameColor(px, target)) continue
          pixels[r][c] = currentColor.slice()
          stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1])
        }
      }

      function paintCell(row, col) {
        if (activeTool === 'pan' || panLock) return
        fullDirty = true
        if (activeTool === 'picker') {
          const c = pixels[row][col]
          if (c) {
            currentColor = [c[0], c[1], c[2]]
            // 关键：把吸到的颜色反解回 H/S/V 并刷新选择器，
            // 否则 SV 方块和色相条的 marker 停在旧位置
            syncPickerFromRgb(currentColor)
            updateDisplay(currentColor)
            syncToolSwatch()
            toast('已吸取颜色 rgb(' + c.join(',') + ')')
          }
          return
        }
        if (activeTool === 'fill') {
          floodFill(row, col)
          if (mirrorOn) enforceSymmetry()
          return
        }
        const color = activeTool === 'eraser' ? [255, 255, 255] : currentColor
        pixels[row][col] = color.slice()
        if (mirrorOn && col >= 0 && col < size) {
          const mc = size - 1 - col
          pixels[row][mc] = color.slice()
        }
      }

      function paint(e) {
        const { row, col } = cellFromEvent(e)
        paintCell(row, col)
      }

      let painting = false
      let panning = false
      let startX = 0
      let startY = 0
      let startPanX = 0
      let startPanY = 0
      let downCell = null
      const PAN_DIST = 12

      canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault()

        canvas.setPointerCapture(e.pointerId)
        /* 能不能拖动画布，只看工具，不看尺寸。
           以前加了 `|| size > 16`：32×32 和 64×64 上拖动一律当平移，
           于是大尺寸根本没法拖动滑画，只能一格一格点（用户反馈的问题）。
           现在笔刷/橡皮在哪种尺寸下都能拖着画；
           要移动画面用 ✥ 手型、✥ 拖动锁、空格或中键。 */
        const canPan = activeTool === 'pan' || panLock
        if (canPan) {
          painting = true
          panning = false
          // 手型/拖动锁/空格/中键：只拖动，不记录落点，否则松手会被当成点一下而画出东西
          const noPaint = activeTool === 'pan' || panLock
          downCell = noPaint ? null : cellFromEvent(e)
          startX = e.clientX
          startY = e.clientY
          startPanX = panX
          startPanY = panY
        } else {
          painting = true
          panning = false
          pushUndo()
          paint(e)
          redraw()
        }
      })

      canvas.addEventListener('pointermove', (e) => {
        if (!painting) return
        if (activeTool === 'pan' || panLock) {
          const dx = e.clientX - startX
          const dy = e.clientY - startY
          if (!panning && (activeTool === 'pan' || panLock || Math.hypot(dx, dy) >= PAN_DIST)) {
            panning = true
            canvas.classList.add('grabbing')
          }
          if (panning) {
            const rect = canvas.getBoundingClientRect()
            const s = 512 / rect.width
            panX = startPanX - dx * s / zoom
            panY = startPanY - dy * s / zoom
            clampPan()
            redraw()
          }
        } else if (activeTool !== 'fill') {
          paint(e)
          redraw()
        }
      })

      function finishTap() {
        if (activeTool === 'pan' || panLock) {
          downCell = null
          return
        }
        if (downCell) {
          pushUndo()
          paintCell(downCell.row, downCell.col)
          downCell = null
          redraw()
          scheduleSave()
        }
      }

      canvas.addEventListener('pointerup', () => {
        if (activeTool === 'pan' || panLock) {
          // 纯拖动，不落笔、不存草稿
        } else if (painting) {
          // 落笔了就存草稿，不管什么尺寸
          scheduleSave()
        }
        painting = false
        panning = false
        downCell = null
      })

      canvas.addEventListener('pointercancel', () => {
        if (painting && !panning && downCell) {
          // 拖到一半被系统打断：至少把起手那一格保住，别白按一下
          finishTap()
        }
        painting = false
        panning = false
        downCell = null
      })

      document.getElementById('clearBtn').addEventListener('click', () => {
        if (window.sfx) window.sfx('clear')
        pushUndo()
        pixels = Array.from({ length: size }, () =>
          Array.from({ length: size }, () => [255, 255, 255])
        )
        fullDirty = true
        redraw()
        scheduleSave()
        toast('已清空')
      })

      /* ---------- 中途保存（localStorage） ---------- */
      const DRAFT_KEY = 'paintDraft'
      const DRAFT_VERSION = 3
      let saveTimer

      function saveDraft() {
        try {
          const flat = []
          for (const row of pixels) {
            for (const px of row) {
              flat.push([px[0], px[1], px[2]])
            }
          }
          localStorage.setItem(DRAFT_KEY, JSON.stringify({
            v: DRAFT_VERSION,
            size,
            pixels: flat,
            time: Date.now()
          }))
        } catch (err) {
          /* 存储失败可忽略 */
        }
      }

      function normalizePixel(px) {
        if (!Array.isArray(px) || px.length < 3) return [255, 255, 255]
        const r = Number(px[0])
        const g = Number(px[1])
        const b = Number(px[2])
        if (![r, g, b].every(Number.isFinite)) return [255, 255, 255]
        return [
          Math.max(0, Math.min(255, Math.round(r))),
          Math.max(0, Math.min(255, Math.round(g))),
          Math.max(0, Math.min(255, Math.round(b))),
        ]
      }

      function scheduleSave() {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(saveDraft, 400)
      }

      function loadDraft() {
        try {
          const raw = localStorage.getItem(DRAFT_KEY)
          if (!raw) return false
          const data = JSON.parse(raw)
          if (!data || !Array.isArray(data.pixels)) return false

          const ds = data.size === 32 || data.size === 64 ? data.size : 16
          if (ds !== size) {
            size = ds
            CELL = 512 / size
            undoStack.length = 0
            updateUndoBtn()
            document.querySelectorAll('.size-btn').forEach((b) =>
              b.classList.toggle('active', Number(b.dataset.size) === size)
            )
            resetCamera()
            refreshHint()
          }

          const src = data.pixels
          const out = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => [255, 255, 255])
          )

          const isNested = Array.isArray(src[0]) && Array.isArray(src[0][0])
          const isFlat = Array.isArray(src[0]) && typeof src[0][0] === 'number'

          if (isNested) {
            for (let y = 0; y < size; y++) {
              for (let x = 0; x < size; x++) {
                out[y][x] = normalizePixel(src[y] && src[y][x])
              }
            }
          } else if (isFlat) {
            for (let y = 0; y < size; y++) {
              for (let x = 0; x < size; x++) {
                out[y][x] = normalizePixel(src[y * size + x])
              }
            }
          } else {
            return false
          }

          pixels = out
          fullDirty = true
          redraw()
          return true
        } catch (err) {
          return false
        }
      }

      window.addEventListener('beforeunload', saveDraft)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) saveDraft()
      })

      /* ---------- 作品名与作者名 ---------- */
      const titleInput = document.getElementById('titleInput')

      /* ---------- 每日挑战 ---------- */
      async function joinDaily(time) {
        if (!time) return
        try {
          const res = await fetch('/api/challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'join', time }),
          })
          const d = await res.json().catch(() => ({}))
          if (res.ok) {
            toast('已参加今天的每日挑战 🏅')
          } else if (res.status === 409) {
            toast('这件作品已经参加过挑战了')
          }
        } catch (e) {}
      }

      const joinCard = document.getElementById('joinCard')
      const dailyRow = document.getElementById('dailyRow')
      const dailyCheck = document.getElementById('dailyCheck')
      const dailyLabel = document.getElementById('dailyLabel')
      let dailyId = ''
      let wantDaily = false

      // 两个活动只能选一个（radio 同名已互斥，这里同步卡片高亮与显隐）
      function syncJoinHighlight() {
        document.querySelectorAll('.join-opt').forEach((el) => {
          const inp = el.querySelector('input')
          el.classList.toggle('on', !!(inp && inp.checked))
        })
        const dRow = document.getElementById('dailyRow')
        const cRow = document.getElementById('contestRow')
        if (joinCard) joinCard.hidden = !((dRow && !dRow.hidden) || (cRow && !cRow.hidden))
      }
      /* 参赛两张卡片：切换「再点一次即取消」+ 高亮 + 「作品名是否被冻住」。

         这里踩过两个坑，都跟事件时机有关：

         1) 切换以前挂在 <label> 的 click 上。这两个 <label> 既有 for=，
            内部又内嵌着那个 input：点一下 label 先触发 label 自己的 click，
            紧接着 label 的激活行为把一次合成点击转发给 input，
            而这次转发同样会冒泡回 label —— 切换逻辑一次点击跑两遍，
            两遍正好互相抵消，表现为「点了没反应 / 状态乱跳」。
            所以切换改挂到 input 自己的 click 上。

         2) 不能在 click 里读 inp.checked 来判断「这次是要选中还是取消」。
            radio 的选中是在 click 派发**之前**就置好的（HTML 规范的
            pre-click activation steps），事件跑到的时候已经是新状态，
            读出来永远是「已选中」，于是每次点击都误判成「取消」。
            而且浏览器本来就不允许点掉已选中的 radio（那种点击不触发
            change），要取消只能自己改 checked 再补一个 change。
            所以「上一次是什么状态」得靠 change 记下来。 */
      const joinInputs = Array.prototype.slice.call(document.querySelectorAll('.join-opt input'))
      const joinWasOn = new WeakMap()
      joinInputs.forEach((inp) => joinWasOn.set(inp, inp.checked))
      joinInputs.forEach((inp) => {
        inp.addEventListener('click', () => {
          if (!joinWasOn.get(inp)) return // 本来没选 → 交给浏览器置上
          inp.checked = false // 本来就选中 → 这次是取消，浏览器不管，得自己来
          inp.dispatchEvent(new Event('change'))
        })
        inp.addEventListener('change', () => {
          // 整组一起对齐：同名 radio 被浏览器取消选中时，那个 input
          // 自己收不到 change（只通知新选中的那个），不统一刷新的话
          // 它的「上一次状态」就过期了，下次点它会没反应
          joinInputs.forEach((i) => joinWasOn.set(i, i.checked))
          syncJoinHighlight()
          syncContestFields()
          wantDaily = dailyCheck.checked
        })
      })


      ;(async () => {
        if (!feat.daily) return
        try {
          const res = await fetch('/api/challenge')
          if (!res.ok) return
          const d = await res.json()
          if (!d || !d.theme) return
          dailyId = d.day
          dailyLabel.textContent =
            '参加每日挑战《' + d.theme.zh + '》' + (d.theme.prompt ? ' · ' + d.theme.prompt : '')
          dailyRow.hidden = false
          if (new URLSearchParams(location.search).get('daily') === '1') {
            dailyCheck.checked = true
            wantDaily = true
          }
        } catch (e) {}
        syncJoinHighlight()
      })()

      /* ---------- 每周主题比赛 ---------- */
      const contestRow = document.getElementById('contestRow')
      const contestCheck = document.getElementById('contestCheck')
      const contestLabel = document.getElementById('contestLabel')
      let contestWeek = ''
      let contestTheme = ''

      function syncContestFields() {
        const on = contestCheck.checked
        if (on) {
          if (!titleInput.disabled) titleInput.dataset.keep = titleInput.value
          titleInput.disabled = true
          if (contestTheme) titleInput.value = '《' + contestTheme + '》'
        } else {
          titleInput.disabled = false
          titleInput.value = titleInput.dataset.keep || ''
        }
      }

      ;(async () => {
        if (!feat.contest) return
        try {
          const res = await fetch('/api/contest')
          if (!res.ok) return
          const c = await res.json()
          if (c && c.open) {
            contestWeek = c.week
            contestTheme = c.theme ? c.theme.zh : ''
            contestLabel.textContent =
              '参与本周主题《' + contestTheme + '》' + ((c.theme && c.theme.prompt) ? ' · ' + c.theme.prompt : '')
            contestRow.hidden = false
            if (new URLSearchParams(location.search).get('contest') === '1') contestCheck.checked = true
            syncContestFields()
            syncJoinHighlight()
          }
        } catch (e) {}
      })()

      contestCheck.addEventListener('change', syncContestFields)

      function readCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)'))
        return match ? decodeURIComponent(match[1]) : ''
      }

      function initName() {
        paintAuthorTag()
        // 登录状态在别的页面可能刚变过，这里同步一下显示
        window.addEventListener('focus', paintAuthorTag)
        window.addEventListener('pageshow', paintAuthorTag)
      }

      /* 作者名不再手填：一律取登录账号的用户名。
         填了也能被伪造，改成账号名后作品归属才是真的。 */
      function accountName() {
        try {
          return localStorage.getItem('lw-user') || ''
        } catch (e) {
          return ''
        }
      }
      function authToken() {
        try {
          return localStorage.getItem('lw-token') || ''
        } catch (e) {
          return ''
        }
      }
      function resolveAuthor() {
        return accountName()
      }
      /* 发布是贡献行为，必须登录 */
      function requireLogin() {
        if (authToken() && accountName()) return true
        toast('发布作品需要先登录')
        if (window.sfx) window.sfx('no')
        setTimeout(() => {
          location.href = '/login'
        }, 800)
        return false
      }
      function paintAuthorTag() {
        const el = document.getElementById('authorTag')
        if (!el) return
        const n = accountName()
        el.textContent = n ? '作者 ' + n : '未登录'
        el.classList.toggle('need', !n)
      }

      function formatTime(ts) {
        if (!ts) return ''
        const d = new Date(ts)
        return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      }

      /* ⚠️ 这个元素在当前模板里不存在。
         下面的用法都有 `if (!recordList) return` 兜着，所以不会报错，
         但这块「撤销记录列表」的界面是没有的 —— 代码留着是为了
         以后要把记录列表做出来时能直接接上。 */
      const recordList = document.getElementById('recordList')
      const moreBtn = document.getElementById('moreBtn')

      const mineSet = loadMine()
      // 当前账号真正持有的作品时间戳（只有这些才显示删除按钮）
      let ownedSet = new Set()
      async function loadOwned() {
        if (!authToken()) {
          ownedSet = new Set()
          return
        }
        try {
          const res = await fetch('/api/mine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken() },
            body: JSON.stringify({ action: 'list', token: authToken() }),
          })
          if (!res.ok) return
          const data = await res.json()
          ownedSet = new Set((data.works || []).map((w) => String(w.time)))
        } catch (e) {
          /* 忽略 */
        }
      }

      function loadMine() {
        try {
          return new Set(JSON.parse(localStorage.getItem('lw-mine') || '[]'))
        } catch (e) {
          return new Set()
        }
      }

      function addMine(time) {
        const arr = [...mineSet]
        if (arr.includes(String(time))) return
        arr.push(String(time))
        if (arr.length > 200) arr.splice(0, arr.length - 200)
        mineSet.clear()
        arr.forEach((t) => mineSet.add(t))
        try {
          localStorage.setItem('lw-mine', JSON.stringify(arr))
        } catch (e) {}
      }

      function loadOwn(rec) {
        const rs = rec.size === 32 || rec.size === 64 ? rec.size : 16
        if (rs !== size) {
          size = rs
          CELL = 512 / size
          document.querySelectorAll('.size-btn').forEach((b) =>
            b.classList.toggle('active', Number(b.dataset.size) === size)
          )
          resetCamera()
          refreshHint()
        }
        pixels = []
        for (let i = 0; i < rs * rs; i += rs) {
          const row = []
          for (let j = 0; j < rs; j++) {
            const p = rec.pixels[i + j] || [255, 255, 255]
            row.push([p[0], p[1], p[2]])
          }
          pixels.push(row)
        }
        fullDirty = true
        undoStack.length = 0
        updateUndoBtn()
        redraw()
        scheduleSave()
        toast('已载入你的作品，可继续编辑后重新上传')
      }

      async function fetchRecords() {
        await loadOwned()
        const myName = accountName()
        if (myName) {
          try {
            const res = await fetch('/api/get?limit=10&mine=' + encodeURIComponent(myName))
            if (!res.ok) return
            const data = await res.json()
            renderRecords(data.history || [], data.total || 0)
          } catch (err) {
            /* 忽略加载失败 */
          }
          return
        }
        const ids = [...mineSet]
        if (!ids.length) {
          renderRecords([], 0)
          return
        }
        try {
          const res = await fetch('/api/get?limit=200&minetimes=' + ids.join(','))
          if (!res.ok) return
          const data = await res.json()
          renderRecords(data.history || [], data.total || 0)
        } catch (err) {
          /* 忽略加载失败 */
        }
      }

      // 「我的绘画历史」已移除，数据统一在「我的」页查看
      function renderRecords() {
        if (!recordList) return
        recordList.innerHTML = ''
        if (moreBtn) moreBtn.hidden = true
      }

      function previewRecord(rec) {
        const rs = rec.size === 32 || rec.size === 64 ? rec.size : 16
        const c = document.getElementById('previewCanvas')
        c.width = rs
        c.height = rs
        const tc = c.getContext('2d')
        tc.clearRect(0, 0, rs, rs)
        for (let y = 0; y < rs; y++) {
          for (let x = 0; x < rs; x++) {
            const px = rec.pixels[y * rs + x]
            if (!px) continue
            tc.fillStyle = `rgb(${px[0]}, ${px[1]}, ${px[2]})`
            tc.fillRect(x, y, 1, 1)
          }
        }
        document.getElementById('previewTitle').textContent = rec.workName || rec.name || '未命名'
        document.getElementById('previewAuthor').textContent = '作者：' + (rec.author || rec.name || '匿名') + ' · ' + rs + '×' + rs
        document.getElementById('previewTime').textContent = formatTime(rec.time)
        previewOverlay.hidden = false
      }

      const previewOverlay = document.getElementById('previewOverlay')
      const previewClose = document.getElementById('previewClose')

      function closePreview() {
        previewOverlay.hidden = true
      }

      previewClose.addEventListener('click', closePreview)
      previewOverlay.addEventListener('click', (e) => {
        if (e.target === previewOverlay) closePreview()
      })
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePreview()
      })

      function pixelsToURL(px, n) {
        const cv = document.createElement('canvas')
        cv.width = n
        cv.height = n
        const tc = cv.getContext('2d')
        for (let y = 0; y < n; y++) {
          for (let x = 0; x < n; x++) {
            const p = px[y * n + x]
            if (!p) continue
            tc.fillStyle = `rgb(${p[0]},${p[1]},${p[2]})`
            tc.fillRect(x, y, 1, 1)
          }
        }
        return cv.toDataURL('image/png')
      }

      /* ---------- 帧动画 ---------- */
      const animEditor = document.getElementById('animEditor')
      const animFrameStrip = document.getElementById('animFrameStrip')
      const animCountBtns = document.querySelectorAll('.anim-count-btn')
      const animSpeedBtns = document.querySelectorAll('.anim-speed-btn')
      const animOverlay = document.getElementById('animOverlay')
      let animOpen = false
      let animActive = 0
      let animCount = 4
      let animDelay = 10
      let animLastActive = 0
      let animFrames = null

      function animInitFrames() {
        animFrames = []
        for (let i = 0; i < animCount; i++) animFrames.push(snapshot())
      }

      function animFlush() {
        if (!animFrames) return
        animFrames[animActive] = snapshot()
      }

      function animRenderStrip() {
        animFrameStrip.textContent = ''
        const cur = Math.min(animActive, animFrames.length - 1)
        for (let i = 0; i < animFrames.length; i++) {
          const btn = document.createElement('button')
          btn.type = 'button'
          btn.className = 'anim-frame' + (i === cur ? ' active' : '')
          const cv = document.createElement('canvas')
          cv.width = cv.height = 48
          const cx = cv.getContext('2d')
          const m = animFrames[i]
          cx.imageSmoothingEnabled = false
          for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
              const px = m[y][x]
              cx.fillStyle = 'rgb(' + px[0] + ',' + px[1] + ',' + px[2] + ')'
              cx.fillRect(x * 3, y * 3, 3, 3)
            }
          }
          btn.appendChild(cv)
          const tag = document.createElement('span')
          tag.textContent = '第 ' + (i + 1) + ' 帧'
          btn.appendChild(tag)
          btn.addEventListener('click', () => {
            if (i === animActive) return
            animFlush()
            animActive = i
            animLoad()
          })
          animFrameStrip.appendChild(btn)
        }
      }

      function animLoad() {
        const m = animFrames[animActive]
        pixels = m.map((r) => r.map((px) => [px[0], px[1], px[2]]))
        fullDirty = true
        undoStack.length = 0
        updateUndoBtn()
        redraw()
        scheduleSave()
        animLastActive = animActive
        animRenderStrip()
      }

      function animOpenEditor() {
        animEditor.hidden = false
        animOpen = true
        if (!animFrames) {
          animInitFrames()
          animActive = 0
          animLastActive = 0
        } else {
          animActive = animLastActive
        }
        animRenderStrip()
        toast('开始编辑帧动画 · 当前第 ' + (animActive + 1) + ' 帧')
      }

      function animCloseEditor() {
        animFlush()
        animEditor.hidden = true
        animOpen = false
      }

      document.getElementById('animClose').addEventListener('click', () => {
        if (animOpen) animCloseEditor()
      })

      animCountBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const n = Number(btn.dataset.count)
          if (n === animCount || !animOpen) return
          animFlush()
          animCount = n
          if (animFrames.length > n) {
            animFrames = animFrames.slice(0, n)
          } else {
            while (animFrames.length < n) {
              const last = animFrames[animFrames.length - 1]
              animFrames.push(last.map((r) => r.map((px) => [px[0], px[1], px[2]])))
            }
          }
          if (animActive >= animFrames.length) {
            animActive = animFrames.length - 1
            animLoad()
          } else {
            animRenderStrip()
          }
          animCountBtns.forEach((b) => b.classList.toggle('active', Number(b.dataset.count) === animCount))
          toast('帧数已切换为 ' + n + ' 帧')
        })
      })

      animSpeedBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          animDelay = Number(btn.dataset.delay)
          animSpeedBtns.forEach((b) => b.classList.toggle('active', b === btn))
          toast('播放速度已调整')
        })
      })

      document.getElementById('animCopy').addEventListener('click', () => {
        if (!animOpen || !animFrames) return
        animFlush()
        if (animActive === 0) {
          toast('已经是第一帧，无法复制上一帧')
          return
        }
        const src = animFrames[animActive - 1]
        animFrames[animActive] = src.map((r) => r.map((px) => [px[0], px[1], px[2]]))
        animLoad()
        toast('已把上一帧复制到第 ' + (animActive + 1) + ' 帧')
      })

      document.getElementById('animClear').addEventListener('click', () => {
        if (!animOpen || !animFrames) return
        animFrames[animActive] = Array.from({ length: 16 }, () =>
          Array.from({ length: 16 }, () => [255, 255, 255])
        )
        animLoad()
        toast('已清空第 ' + (animActive + 1) + ' 帧')
      })

      document.getElementById('animExport').addEventListener('click', () => {
        if (!animOpen || !animFrames) return
        animFlush()
        try {
          const dataURL = buildAnimGif(animFrames)
          document.getElementById('animImg').src = dataURL
          const dl = document.getElementById('animDownload')
          dl.href = dataURL
          animOverlay.hidden = false
        } catch (err) {
          toast('导出失败：' + err.message)
        }
      })

      document.getElementById('animOverlayClose').addEventListener('click', () => {
        animOverlay.hidden = true
      })
      animOverlay.addEventListener('click', (e) => {
        if (e.target === animOverlay) animOverlay.hidden = true
      })

      function buildAnimGif(frames) {
        const Q = (v) => Math.min(255, Math.round(v / 24) * 24)
        const keyOf = (px, q) => {
          const r = q ? Q(px[0]) : px[0]
          const g = q ? Q(px[1]) : px[1]
          const b = q ? Q(px[2]) : px[2]
          return (r << 16) | (g << 8) | b
        }
        let map = new Map()
        let ints = []
        const collect = (quant) => {
          map = new Map()
          ints = []
          for (const m of frames) for (const r of m) for (const px of r) {
            const key = keyOf(px, quant)
            if (map.has(key) || ints.length >= 256) continue
            map.set(key, ints.length)
            ints.push(key)
          }
        }
        collect(false)
        let q = false
        outer: for (const m of frames) {
          for (const r of m) {
            for (const px of r) {
              if (!map.has(keyOf(px, false))) { q = true; break outer }
            }
          }
        }
        if (q) collect(true)
        const nearestIdx = (key) => {
          const tr = (key >> 16) & 255, tg = (key >> 8) & 255, tb = key & 255
          let best = 0, bd = Infinity
          for (let i = 0; i < ints.length; i++) {
            const cr = (ints[i] >> 16) & 255, cg = (ints[i] >> 8) & 255, cb = ints[i] & 255
            const d = (tr - cr) * (tr - cr) + (tg - cg) * (tg - cg) + (tb - cb) * (tb - cb)
            if (d < bd) { bd = d; best = i }
          }
          return best
        }
        const idxOf = (px) => {
          const key = keyOf(px, q)
          return map.has(key) ? map.get(key) : nearestIdx(key)
        }
        const mats = frames.map((m) => m.map((r) => r.map(idxOf)))
        let p = 1
        while ((1 << p) < ints.length) p++
        const pad = new Uint32Array(1 << p)
        for (let i = 0; i < ints.length; i++) pad[i] = ints[i]
        const buf = new Uint8Array(1 << 21)
        const writer = new GifWriter(buf, 512, 512, { palette: pad, loop: 0 })
        for (const m of mats) {
          const up = new Uint8Array(262144)
          for (let y = 0; y < 16; y++) {
            const rowBase = y * 32 * 512
            for (let x = 0; x < 16; x++) {
              const v = m[y][x]
              const colBase = rowBase + x * 32
              for (let dy = 0; dy < 32; dy++) up.fill(v, colBase + dy * 512, colBase + dy * 512 + 32)
            }
          }
          writer.addFrame(0, 0, 512, 512, up, { delay: animDelay })
        }
        const end = writer.end()
        const bytes = buf.subarray(0, end)
        let s = ''
        const CHUNK = 0x8000
        for (let i = 0; i < bytes.length; i += CHUNK) {
          s += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + CHUNK, bytes.length)))
        }
        return 'data:image/gif;base64,' + btoa(s)
      }

      /* ---------- 赞赏 ---------- */

      const uploadBtn = document.getElementById('uploadBtn')

      async function doPublish(payload, btn) {
        btn.disabled = true
        try {
          const res = await fetch('/api/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          const data = await res.json().catch(() => ({}))
          if (res.ok) {
            if (data.time) addMine(data.time)
            // 发布有光尘奖励，把「得了几个」和「今天还剩几个额度」一起说清楚，
            // 不然用户不知道到底给没给
            let msg = '发布「' + (data.workName || '未命名') + '」成功'
            if (typeof data.dust === 'number') {
              if (data.dust > 0) {
                msg += '，得到 ' + data.dust + ' 个光尘'
                if (typeof data.dustCapToday === 'number') {
                  msg += '（今天靠发布已得 ' + data.dustTotalToday + '/' + data.dustCapToday + '）'
                }
                // 光尘到账了，让「我的」页的余额和角标跟上
                try {
                  window.dispatchEvent(new CustomEvent('lw-dust-changed', { detail: null }))
                } catch (e) {}
              } else if (data.dustCapped) {
                msg += '。今天靠发布的光尘已经拿满 ' + data.dustCapToday + ' 个了，明天再来～'
              }
            }
            toast(msg)
            fetchRecords()
            return true
          }
          if (res.status === 429) {
            // 发布间隔 30 秒，按秒倒计时让用户知道还要等多久
            startPublishCooldown(btn, Number(data.waitSec) || 30)
            toast('发布太频繁，' + (data.waitSec || 30) + ' 秒后再试')
            return false
          }
          if (res.status === 400 && data.hit && data.hit.length) {
            // 明确告诉用户是哪个字段、哪个词被判了，
            // 只说「不合规」的话根本不知道该改哪里
            const parts = []
            if (data.hitName && data.hitName.length) parts.push('作品名「' + data.hitName.join('、') + '」')
            if (data.hitAuthor && data.hitAuthor.length) parts.push('作者名「' + data.hitAuthor.join('、') + '」')
            if (data.hitTags && data.hitTags.length) parts.push('标签「' + data.hitTags.join('、') + '」')
            toast('发布失败：' + (parts.join('；') || data.error))
            if (window.console && console.warn) console.warn('[内容安全]', data)
          } else {
            toast('发布失败：' + (data.error || res.status))
          }
        } catch (err) {
          toast('发布失败：网络错误')
        } finally {
          btn.disabled = false
        }
        return false
      }

      /* 发布冷却：按钮上直接倒数，用完才恢复 */
      let coolTimer = null
      function startPublishCooldown(btn, sec) {
        if (coolTimer) clearInterval(coolTimer)
        const base = btn.textContent
        let left = Math.max(1, Math.round(sec))
        btn.disabled = true
        btn.textContent = left + 's'
        coolTimer = setInterval(() => {
          left -= 1
          if (left <= 0) {
            clearInterval(coolTimer)
            coolTimer = null
            btn.disabled = false
            btn.textContent = base
            return
          }
          btn.textContent = left + 's'
        }, 1000)
      }

      uploadBtn.addEventListener('click', async () => {
        if (!requireLogin()) return
        const author = resolveAuthor()

        let flat
        let pubSize = size
        if (sprayOn) {
          // 喷漆固定 64×64，直接取喷漆缓冲
          if (!spray || spray.isEmpty()) {
            toast('还什么都没喷呢')
            return
          }
          flat = spray.full().map(normalizePixel)
          pubSize = 64
        } else if (gravityOn) {
          // 颗粒只会往下掉，整块 64×64 的上半截必然是空的。
          // 裁到内容再按最小合适档（16/32/64）上传，
          // 社区里看到的就是这幅画本身，而不是一张下面一坨、上面全白的图。
          if (!gravity) {
            toast('画板还没准备好，稍等一下')
            return
          }
          const ex = gravity.exportData()
          if (!ex) {
            toast('还没撒东西呢')
            return
          }
          flat = ex.flat.map(normalizePixel)
          pubSize = ex.size
        } else {
          flat = []
          for (const row of pixels) for (const px of row) flat.push(normalizePixel(px))
        }
        const payload = { pixels: flat, size: pubSize, token: authToken() }
        // 告诉服务端这幅画是重力画的。比赛那道拦截在服务端也有一道，
        // 靠这个字段识别 —— 前端藏了 UI 不算数
        if (gravityOn) payload.ink = 'gravity'
        if (author) payload.author = author

        /* 重力绘画不参加任何比赛。
           这里必须真的把 contest / 每日挑战拦掉，不能只靠 CSS 把入口藏起来：
           藏了 UI 但 payload 里还带着 contest，服务端照样会把它记进本周榜单。
           （画板可能先在像素画下勾了比赛，再切到重力方向 —— 那时
             contestCheck.checked 仍然是 true，光藏按钮根本拦不住。） */
        const joinContest = !gravityOn && contestCheck.checked && !!contestTheme
        if (joinContest && contestWeek) payload.contest = contestWeek
        if (joinContest) {
          payload.workName = '《' + contestTheme + '》'
        } else if (titleInput.value.trim()) {
          payload.workName = titleInput.value.trim()
        }
        if (fromImage && !gravityOn) payload.fromImage = true

        /* 告诉服务端用的是哪套画板 —— 社区要按这个分区。

           喷漆和重力都固定 64×64，光靠 size 分不开。 */

        /* ★ 这里只能用**已经声明过**的变量。
           我一开始顺手写了个 animOn，但那玩意儿不存在 ——
           点发布时会抛 ReferenceError，画就发不出去了。
           animFrames 在 4959 行就声明了（早于这里），可以安全引用。 */
        if (animFrames && animFrames.length > 1) payload.method = 'anim'
        else if (gravityOn) payload.method = 'gravity'
        else if (sprayOn) payload.method = 'spray'
        else payload.method = 'pixel'
        const tg = readTags()
        if (tg.length) payload.tags = tg

        const done = await doPublish(payload, uploadBtn)
        if (done && wantDaily && dailyId && !gravityOn) joinDaily(done.time)
      })

      const animPublishBtn = document.getElementById('animPublish')
      animPublishBtn.addEventListener('click', async () => {
        if (!animOpen || !animFrames) return
        animFlush()
        const frames = animFrames.map((f) =>
          f.map((r) => r.map((px) => [px[0], px[1], px[2]]))
        )
        if (!requireLogin()) return
        const payload = {
          size: 16,
          anim: { frames, delay: animDelay },
          token: authToken(),
        }
        const author = resolveAuthor()
        if (author) payload.author = author
        const workName = (contestCheck.checked && contestTheme) ? '《' + contestTheme + '》' : titleInput.value.trim()
        if (workName) payload.workName = workName
        if (contestCheck.checked && contestWeek) payload.contest = contestWeek
        if (fromImage) payload.fromImage = true
        const done2 = await doPublish(payload, animPublishBtn)
        if (done2 && wantDaily && dailyId) joinDaily(done2.time)
      })

      let toastTimer
      function toast(msg) {
        const el = document.getElementById('toast')
        el.textContent = msg
        el.classList.add('show')
        clearTimeout(toastTimer)
        toastTimer = setTimeout(() => el.classList.remove('show'), 2200)
      }

      redraw()
      applyColor()
      initName()
      refreshHint()
      fetchRecords()

      /* ---------- 键盘快捷键 ---------- */
      document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return
        const tag = (e.target && e.target.tagName) || ''
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
        if (!consentOverlay.hidden || !previewOverlay.hidden) return
        const k = e.key.toLowerCase()
        if (k === 'b') setTool('brush')
        else if (k === 'e') setTool('eraser')
        else if (k === 'f') setTool('fill')
        else if (k === 'h') {
          e.preventDefault()
          setTool('pan')
        } else if (k === 'm') {
          e.preventDefault()
          if (mirrorBtn) mirrorBtn.click()
        } else if (k === 'i') {
          e.preventDefault()
          setTool('picker')
        } else if (k === 'c') {
          e.preventDefault()
          toolColorBtn.click()
        } else if (k === 'z') {
          e.preventDefault()
          undoBtn.click()
        }
      })

      /* ---------- 合规同意弹窗 ---------- */
      const consentOverlay = document.getElementById('consentOverlay')
      const consentYes = document.getElementById('consentYes')
      const consentNo = document.getElementById('consentNo')

      function hasConsent() {
        return document.cookie
          .split(';')
          .some((c) => c.trim().startsWith('paint_consent='))
      }

      function grantConsent() {
        document.cookie = 'paint_consent=1; max-age=' + 60 * 60 * 24 * 30 + '; path=/'
      }

      if (!hasConsent()) {
        document.body.style.overflow = 'hidden'
      } else {
        consentOverlay.hidden = true
        startCreation()
      }

      consentYes.addEventListener('click', () => {
        grantConsent()
        consentOverlay.hidden = true
        document.body.style.overflow = ''
        startCreation()
      })

      consentNo.addEventListener('click', () => {
        consentBox.innerHTML = `
          <h2>无法进入</h2>
          <div class="text">你已拒绝同意用户协议，根据规定无法使用本画板。若改变主意，可刷新页面重新选择。</div>`
      })

      /* ---------- 开局菜单 ---------- */
      function paintStartSelection() {
        document.querySelectorAll('.start-size').forEach((b) =>
          b.classList.toggle('on', Number(b.dataset.size) === startSize)
        )
        document.querySelectorAll('.start-mode').forEach((b) =>
          b.classList.toggle('on', b.dataset.mode === startMode)
        )
        document.querySelectorAll('.start-join').forEach((b) =>
          b.classList.toggle('on', b.dataset.join === startJoin)
        )
      }

      // 单选组：再点一次已选中的项即取消选择
      function bindSinglePick(containerSel, attr, onPick) {
        const box = document.querySelector(containerSel)
        if (!box) return
        box.querySelectorAll('[' + attr + ']').forEach((b) => {
          b.addEventListener('click', () => {
            const v = b.getAttribute(attr)
            if (b.classList.contains('on')) {
              onPick(null)
            } else {
              onPick(v)
            }
            paintStartSelection()
          })
        })
      }

      function applyStartChoices() {
        if (startSize !== size) switchSize(startSize)
        /* 重力绘画不参加任何比赛 —— 启动页里就已经不勾了，
           别让从上一次残留的勾选状态跟过来（那段 UI 是 data-for="pixel"，
           选重力时不显示，但状态可能还留着）。 */
        const allowJoin = startDir !== 'gravity'
        // 活动选择同步到画板上的勾选框
        const dc = document.getElementById('dailyCheck')
        const cc = document.getElementById('contestCheck')
        if (dc) dc.checked = allowJoin && startJoin === 'daily'
        if (cc) {
          cc.checked = allowJoin && startJoin === 'contest'
          syncContestFields()
        }
        wantDaily = allowJoin && startJoin === 'daily'
        // 图片工具
        const imgBtnEl = document.getElementById('imgBtn')
        const startImg = document.getElementById('startImage')
        if (imgBtnEl) imgBtnEl.hidden = !(feat.image && startImg && startImg.checked)
        syncJoinHighlight()
      }

      /* ---------- 像素喷漆（与像素画完全独立） ---------- */
      let spray = null
      let sprayOn = false
      function initSpray() {
        if (spray || !window.LWSpray) return
        const cv = document.getElementById('sprayBoard')
        if (!cv) return
        spray = window.LWSpray.create(cv, {
          size: 64,
          getColor: () => currentColor,
          onChange: () => {
            if (window.sfx && sprayOn) {
              // 喷的时候不每次都响，节流一下
              const now = Date.now()
              if (now - (initSpray._t || 0) > 90) {
                initSpray._t = now
                try { window.sfx('tick') } catch (e) {}
              }
            }
          },
          /* 吸管：取画布上的颜色，和预设色对得上就直接点亮那一格 */
          onPick: (rgb) => {
            setFromRgb(rgb)
            if (window.sfx) window.sfx('select')
          },
        })
      }
      /* 三块画布共用板子里同一个位置，谁开就显示谁。
         显隐只在这里算一次：早先让两个 setXxxMode 各自写 hidden，
         结果切方向时得互相把对方收起来，少写一处就是两个 canvas 叠在一起
         同时抢指针事件 —— 一次点击同时落在两块板上。

         sprayOn / gravityOn 是两个独立布尔量，光靠下面的
         「开关一个就关掉另一个」来保证互斥；所以这个函数可以假定
         它们不会同时为 true（否则三块全 hidden，页面直接空白）。 */
      function applyCanvasVisibility() {
        const board = document.getElementById('board')
        const sc = document.getElementById('sprayBoard')
        const gc = document.getElementById('gravityBoard')
        const sbar = document.getElementById('sprayBar')
        const gbar = document.getElementById('gravityBar')
        const alt = sprayOn || gravityOn // 「非像素画」状态
        if (board) board.hidden = alt
        if (sc) sc.hidden = !sprayOn
        if (gc) gc.hidden = !gravityOn
        if (sbar) sbar.hidden = !sprayOn
        if (gbar) gbar.hidden = !gravityOn
        document.body.classList.toggle('spray-on', sprayOn)
        document.body.classList.toggle('gravity-on', gravityOn)
        // 进入方向的瞬间就把顶部条上的「当前色」小方块与高亮刷出来，
        // 否则第一次手动换色前它一直是空白（喷漆/重力尤为明显）
        syncAuxPalette()
      }

      function setSprayMode(on) {
        sprayOn = !!on
        // 创作方向只能选一个：开喷漆就一定不是重力，反之亦然。
        // 少了这两行，两个标志可能同时为真，那时三块画布会一起被藏掉。
        if (sprayOn) gravityOn = false
        applyCanvasVisibility()
        if (sprayOn) {
          initSpray()
          if (spray) {
            const b = document.getElementById('startSprayBrush')
            if (b) spray.setBrush(Number(b.value) || 3)
            const m = document.getElementById('startSprayMirror')
            if (m) spray.setSym(m.checked ? 1 : 0)
            // 工具条上的对称高亮要跟着引擎的实际状态走
            if (typeof paintSym === 'function') paintSym()
            // 工具也重置成画笔：免得从上一轮留下来一个吸管，
            // 进画板想画一笔却只取到了颜色
            spray.setTool('brush')
            document.querySelectorAll('#sprayTools [data-tool]').forEach((x) => {
              x.setAttribute('aria-pressed', String(x.getAttribute('data-tool') === 'brush'))
            })
            spray.render()
          }
        }
      }

      /* ---------- 像素重力（与像素画、喷漆都独立） ---------- */
      let gravity = null
      let gravityOn = false
      let gravitySfxAt = 0
      function initGravity() {
        if (gravity || !window.LWGravity) return
        const cv = document.getElementById('gravityBoard')
        if (!cv) return
        gravity = window.LWGravity.create(cv, {
          size: 64,
          getColor: () => currentColor,
          onChange: () => {
            // 颗粒一帧落一格，会持续触发；每落一颗都响的话直接成噪音
            if (!window.sfx || !gravityOn) return
            const now = Date.now()
            if (now - gravitySfxAt > 140) {
              gravitySfxAt = now
              try { window.sfx('tick') } catch (e) {}
            }
          },
        })
      }
      function setGravityMode(on) {
        gravityOn = !!on
        // 同 setSprayMode：方向互斥，见上面的说明
        if (gravityOn) sprayOn = false
        applyCanvasVisibility()
        if (gravityOn) {
          initGravity()
          if (gravity) {
            const b = document.getElementById('startGravityBrush')
            if (b) gravity.setBrush(Number(b.value) || 2)
            gravity.render()
            syncAuxPalette()
          }
        }
      }

      /** 按方向显示/隐藏对应参数组 */
      function applyDir() {
        document.querySelectorAll('#modeOverlay [data-for]').forEach((el) => {
          el.hidden = el.getAttribute('data-for') !== startDir
        })
        document.querySelectorAll('#startDirs .start-dir').forEach((b) => {
          b.classList.toggle('on', b.getAttribute('data-dir') === startDir)
        })
      }

      function openStartMenu() {
        startSize = size
        startMode = 'free'
        startJoin = 'none'
        applyDir()
        const startImg = document.getElementById('startImage')
        if (startImg) startImg.checked = false
        const pBtn = document.querySelector('[data-mode="prompt"]')
        const aBtn = document.querySelector('[data-mode="anim"]')
        if (pBtn) pBtn.hidden = !feat.prompt
        if (aBtn) aBtn.hidden = !feat.anim
        document.querySelector('[data-join="daily"]').hidden = !feat.daily
        document.querySelector('[data-join="contest"]').hidden = !feat.contest
        document.getElementById('startToolSec').hidden = !feat.image
        const jSec = document.getElementById('startJoinSec')
        if (jSec) jSec.hidden = !(feat.daily || feat.contest)
        paintStartSelection()
        modeOverlay.hidden = false
      }

      document.getElementById('startDirs').addEventListener('click', (e) => {
        const b = e.target.closest('.start-dir')
        if (!b) return
        startDir = b.getAttribute('data-dir') || 'pixel'
        if (window.sfx) window.sfx('tick')
        applyDir()
      })
      const startSprayBrush = document.getElementById('startSprayBrush')
      if (startSprayBrush) {
        startSprayBrush.addEventListener('input', () => {
          document.getElementById('startSprayNum').textContent = startSprayBrush.value
        })
      }
      const startGravityBrush = document.getElementById('startGravityBrush')
      if (startGravityBrush) {
        startGravityBrush.addEventListener('input', () => {
          const n = document.getElementById('startGravityNum')
          if (n) n.textContent = startGravityBrush.value
          // 滑块直接在启动页调了，工具条上的那个跟着走
          if (gravity) gravity.setBrush(Number(startGravityBrush.value) || 2)
        })
      }

      bindSinglePick('#startSizes', 'data-size', (v) => {
        startSize = v ? Number(v) : startSize
      })
      bindSinglePick('#startModes', 'data-mode', (v) => {
        startMode = v || (startMode === 'free' ? 'free' : 'free')
      })
      bindSinglePick('#startJoins', 'data-join', (v) => {
        startJoin = v || 'none'
      })
      /* 喷漆工具条 */
      const sprayBrush = document.getElementById('sprayBrush')
      if (sprayBrush) {
        sprayBrush.addEventListener('input', () => {
          const n = sprayBrush.value
          const num = document.getElementById('sprayBrushNum')
          if (num) num.textContent = n
          if (spray) spray.setBrush(Number(n) || 1)
        })
      }
      const sprayUndo = document.getElementById('sprayUndo')
      if (sprayUndo) {
        sprayUndo.addEventListener('click', () => {
          if (spray && spray.undo() && window.sfx) window.sfx('undo')
        })
      }
      const sprayClear = document.getElementById('sprayClear')
      if (sprayClear) {
        sprayClear.addEventListener('click', () => {
          if (!spray) return
          spray.clear()
          if (window.sfx) window.sfx('clear')
        })
      }
      /* 选工具 + 对称档位。

         工具条上每个键都是「一次性动作、没有文字提示就等于没有」，
         所以按钮一律带下方文字；选中态用 aria-pressed 表达，
         样式和键盘可达性都跟原来的 checkbox 方案一致。 */
      document.querySelectorAll('#sprayTools [data-tool]').forEach((b) => {
        b.addEventListener('click', () => {
          const t = b.getAttribute('data-tool')
          document.querySelectorAll('#sprayTools [data-tool]').forEach((x) => {
            x.setAttribute('aria-pressed', String(x === b))
          })
          if (spray) spray.setTool(t)
          if (window.sfx) window.sfx('tick')
        })
      })
      const symBtns = Array.prototype.slice.call(document.querySelectorAll('#spraySym [data-sym]'))
      function paintSym() {
        const cur = spray ? spray.getSym() : 0
        symBtns.forEach((b) => b.classList.toggle('active', Number(b.getAttribute('data-sym')) === cur))
      }
      symBtns.forEach((b) => {
        b.addEventListener('click', () => {
          const v = Number(b.getAttribute('data-sym'))
          if (spray) spray.setSym(v)
          paintSym()
          if (window.sfx) window.sfx('tick')
        })
      })

      /* 重力工具条 */
      const gravityBrush = document.getElementById('gravityBrush')
      if (gravityBrush) {
        gravityBrush.addEventListener('input', () => {
          const n = gravityBrush.value
          const num = document.getElementById('gravityBrushNum')
          if (num) num.textContent = n
          if (gravity) gravity.setBrush(Number(n) || 2)
        })
      }
      const gravityUndo = document.getElementById('gravityUndo')
      if (gravityUndo) {
        gravityUndo.addEventListener('click', () => {
          if (gravity && gravity.undo() && window.sfx) window.sfx('undo')
        })
      }
      const gravityShake = document.getElementById('gravityShake')
      if (gravityShake) {
        gravityShake.addEventListener('click', () => {
          if (!gravity) return
          if (gravity.isEmpty()) {
            toast('还没撒东西呢')
            return
          }
          gravity.shake()
          if (window.sfx) window.sfx('tick')
        })
      }
      const gravityClear = document.getElementById('gravityClear')
      if (gravityClear) {
        gravityClear.addEventListener('click', () => {
          if (!gravity) return
          gravity.clear()
          if (window.sfx) window.sfx('clear')
        })
      }

      document.getElementById('startGo').addEventListener('click', () => {
        applyStartChoices()
        if (startDir === 'spray' || startDir === 'gravity') {
          const isG = startDir === 'gravity'
          setSprayMode(!isG)
          setGravityMode(isG)
          enterMode('free')
          if (modeChip) modeChip.textContent = isG ? '当前：像素重力' : '当前：像素喷漆'
          modeOverlay.hidden = true
          applyLayout()
          return
        }
        setSprayMode(false)
        setGravityMode(false)
        enterMode(startMode)
        applyLayout()
        modeOverlay.hidden = true
      })

      function startCreation() {
        applyFeatureVisibility()
        renderRecent()
        if (feat.drafts) renderSlots()
        // 有草稿就直接回到画板，不再要求重选参数
        if (loadDraft()) {
          toast('欢迎回来！你的数据已保存')
          const savedMode = localStorage.getItem('lw-mode')
          enterMode(modeAllowed(savedMode) ? savedMode : 'free')
          return
        }
        openStartMenu()
      }
  },
}
