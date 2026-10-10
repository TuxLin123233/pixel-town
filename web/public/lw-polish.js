// 视觉打磨层
//
// 和 lw-anim.js 分工：那边管「动」，这边管「静」——
// 设计令牌、焦点态、滚动条、悬浮、装饰、无障碍细节。
//
// 一次覆盖全站，页面不用改代码。
//
// 模块结构（CSS 与图标已拆出）：
//   ./lw-polish/polish-styles.js  全站打磨用的 CSS（注入成 <style id="lw-polish-style">）
//   ./lw-polish/polish-icons.js   像素风空状态图标（px 画格器 + 图标定义）
//   本文件                         打磨引擎：骨架屏 / 空状态 / 返回顶部 / 悬浮提示 / 长按…

import { polishStyles as CSS } from './lw-polish/polish-styles.js'
import { POLISH_ICONS as ICONS } from './lw-polish/polish-icons.js'

;(function () {
  if (window.__lwPolish) return
  window.__lwPolish = true

  var STYLE_ID = 'lw-polish-style'

  function inject() {
    if (document.getElementById(STYLE_ID)) return
    var st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    ;(document.head || document.documentElement).appendChild(st)
  }
  inject()

  var reduce = false
  try {
    reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  } catch (e) {}

  

  /* 找出「该用哪个图标」—— 按元素所在的上下文猜。
     猜不中就用默认的画框，不影响功能。 */
  function guessIcon(el) {
    var hay = ((el.className || '') + ' ' + (el.id || '') + ' ' + (el.parentNode ? el.parentNode.className || '' : '')).toLowerCase()
    if (/mail|msg-|letter|信/.test(hay)) return 'mail'
    if (/chat|ch-|msg|find/.test(hay)) return 'chat'
    if (/town|tw-|house|屋/.test(hay)) return 'house'
    if (/rank|list|ach|tk|task/.test(hay)) return 'list'
    return 'frame'
  }

  /* ================= 把「加载中…」换成骨架屏 ================= */
  var LOADING_RE = /^(加载中|读取中|载入中|请稍候)[.…·]*$/

  /* 骨架的形状要和真实内容对得上，不然填进去还是会觉得「跳了一下」。
     几种预设：
       cards  两列卡片墙（社区、我的作品、成就、图鉴）
       rows   带头像/缩略图的列表行（评论、邮件、通知、好友）
       stats  2×2 数据格
       feat   横滑的精选条
       text   兜底：三行字 */
  function skeletonHTML(kind) {
    var i
    if (kind === 'cards') {
      var cs = '<div class="lwp-sk lwp-sk-cards">'
      for (i = 0; i < 6; i++) {
        cs += '<div class="lwp-sk-card"><div class="pic"></div><div class="t1 lwp-sk-row"></div><div class="t2 lwp-sk-row"></div></div>'
      }
      return cs + '</div>'
    }
    if (kind === 'rows') {
      var rs = '<div class="lwp-sk lwp-sk-rows">'
      for (i = 0; i < 4; i++) {
        rs += '<div class="lwp-sk-rowitem"><div class="av"></div><div class="ln"><i></i><i></i></div></div>'
      }
      return rs + '</div>'
    }
    if (kind === 'stats') {
      var ss = '<div class="lwp-sk lwp-sk-stats">'
      for (i = 0; i < 4; i++) ss += '<div class="lwp-sk-stat"></div>'
      return ss + '</div>'
    }
    if (kind === 'feat') {
      var fs = '<div class="lwp-sk lwp-sk-feat">'
      for (i = 0; i < 5; i++) fs += '<div></div>'
      return fs + '</div>'
    }
    return (
      '<div class="lwp-sk">' +
      '<div class="lwp-sk-row" style="width:60%"></div>' +
      '<div class="lwp-sk-row" style="width:80%"></div>' +
      '<div class="lwp-sk-row" style="width:40%"></div>' +
      '</div>'
    )
  }

  /* 按容器 id / class 猜该用哪种骨架 */
  function kindFor(el) {
    var hay = ((el.id || '') + ' ' + (el.className || '') + ' ' +
      (el.parentNode ? (el.parentNode.id || '') + ' ' + (el.parentNode.className || '') : '')).toLowerCase()
    if (/gallery|mine-?grid|u-grid|bag|ach|bg-?body|tw-grid/.test(hay)) return 'cards'
    if (/stat/.test(hay)) return 'stats'
    if (/featured/.test(hay)) return 'feat'
    if (/cmt|mail|ban|mod-list|tk-list|chat|ch-|rank|list/.test(hay)) return 'rows'
    return 'text'
  }

  /* 给「先空后填」的容器预留高度。
     这一步不写内容，只是把位置占住 ——
     加载完成后内容填进同样大小的框里，页面不会往下跳。 */
  var HOLD_SEL = '#gallery, .mine-grid, .u-grid, .tw-grid, .bag-grid, #featuredRow, ' +
    '.featured-row, #statGrid, #cmtList, .cmt-list, #chMsgs, #mailList, .adm-mail-list, ' +
    '#banList, .mod-list, .tk-list, .u-ach-list, #twBody, #achBody, #bgBody'
  function reserveSpace() {
    var els = document.querySelectorAll(HOLD_SEL)
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      var hasSk = !!el.querySelector('.lwp-sk')
      var empty = !el.children.length
      /* ★ 只在「还没内容」或「只显示骨架」时占位。
         内容填进来就把占位撤掉 ——
         不然内容比预留高度矮的时候，页面会往回缩一下，
         那是另一种跳动，一样难受。 */
      if (hasSk || empty) {
        if (el.dataset.lwpHold !== '1') {
          el.dataset.lwpHold = '1'
          el.classList.add('lwp-hold')
        }
      } else if (el.dataset.lwpHold === '1') {
        el.dataset.lwpHold = ''
        el.classList.remove('lwp-hold')
      }
    }
  }

  function upgradeLoading() {
    var els = document.querySelectorAll('.status, .empty, .tw-empty, .u-empty, .bg-empty, .ch-empty')
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      var txt = (el.textContent || '').trim()
      if (!LOADING_RE.test(txt)) {
        if (el.dataset.lwpSkel === '1') {
          // 已经加载完了，把骨架摘掉、还原成正常内容
          el.dataset.lwpSkel = ''
          el.classList.remove('lwp-skel-host')
        }
        continue
      }
      if (el.dataset.lwpSkel === '1') continue
      el.dataset.lwpSkel = '1'
      el.innerHTML = skeletonHTML(kindFor(el))
    }
  }

  /* ================= 给干巴巴的空状态加像素插图 ================= */
  /* 只处理「内容很短、且看起来像空状态」的元素，不碰别的 */
  function upgradeEmpty() {
    var els = document.querySelectorAll('.empty, .tw-empty, .u-empty, .bg-empty, .ch-empty, .tk-empty')
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      if (el.dataset.lwpEmpty === '1') continue
      var txt = (el.textContent || '').trim()
      // 太长的不是空状态（可能是错误详情），跳过
      if (!txt || txt.length > 60) continue
      if (LOADING_RE.test(txt)) continue
      // 已经有插图了
      if (el.querySelector('svg')) continue
      el.dataset.lwpEmpty = '1'
      el.classList.add('lwp-empty')
      var icon = guessIcon(el)
      el.innerHTML =
        ICONS[icon] +
        '<div class="lwp-empty-t">' + escapeHTML(txt) + '</div>'
    }
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  /* ================= 返回顶部 + 滚动进度 ================= */
  var topBtn = null
  var progEl = null

  function ensureScrollUI() {
    // 页面太短就不需要这两个东西
    var need = document.documentElement.scrollHeight > window.innerHeight + 240
    if (!need) {
      if (topBtn) topBtn.classList.remove('on')
      if (progEl) progEl.classList.remove('on')
      return
    }
    if (!topBtn) {
      topBtn = document.createElement('button')
      topBtn.id = 'lwpTop'
      topBtn.type = 'button'
      topBtn.title = '回到顶部'
      topBtn.setAttribute('aria-label', '回到顶部')
      topBtn.textContent = '↑'
      topBtn.addEventListener('click', function () {
        try {
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
        } catch (e) {
          window.scrollTo(0, 0)
        }
      })
      document.body.appendChild(topBtn)
    }
    if (!progEl) {
      progEl = document.createElement('div')
      progEl.id = 'lwpProg'
      document.body.appendChild(progEl)
    }
  }

  function onScroll() {
    ensureScrollUI()
    var y = window.scrollY || document.documentElement.scrollTop || 0
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    var p = Math.min(1, y / max)
    if (topBtn) topBtn.classList.toggle('on', y > 420)
    if (progEl) {
      progEl.style.width = (p * 100).toFixed(2) + '%'
      progEl.classList.toggle('on', y > 24 && p < 1)
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  /* ================= 悬浮提示 ================= */
  var tipEl = null
  var tipTimer = 0

  function showTip(el) {
    var text = el.getAttribute('data-tip') || el.getAttribute('title')
    if (!text) return
    // title 会弹系统的，搬到 data-tip 上自己画
    if (el.getAttribute('title')) {
      el.setAttribute('data-tip', text)
      el.removeAttribute('title')
    }
    if (!tipEl) {
      tipEl = document.createElement('div')
      tipEl.id = 'lwpTip'
      document.body.appendChild(tipEl)
    }
    tipEl.textContent = text
    var r = el.getBoundingClientRect()
    tipEl.style.left = '0px'
    tipEl.style.top = '0px'
    tipEl.classList.add('on')
    var tw = tipEl.offsetWidth
    var th = tipEl.offsetHeight
    var left = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2))
    var top = r.top - th - 8
    if (top < 8) top = r.bottom + 8
    tipEl.style.left = left + 'px'
    tipEl.style.top = top + 'px'
  }

  function hideTip() {
    if (tipEl) tipEl.classList.remove('on')
  }

  document.addEventListener(
    'pointerenter',
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-tip], [title]') : null
      if (!el) return
      // 触屏不显示悬浮提示
      if (e.pointerType === 'touch') return
      clearTimeout(tipTimer)
      tipTimer = setTimeout(function () { showTip(el) }, 260)
    },
    true
  )
  document.addEventListener(
    'pointerleave',
    function () { clearTimeout(tipTimer); hideTip() },
    true
  )
  document.addEventListener('pointerdown', function () { clearTimeout(tipTimer); hideTip() }, true)

  /* ================= 触觉反馈 ================= */
  /* 手机上做「确认/删除」时轻轻震一下。没有 vibrate 的浏览器直接跳过。 */
  window.LWHaptic = {
    tap: function () { try { navigator.vibrate && navigator.vibrate(8) } catch (e) {} },
    ok: function () { try { navigator.vibrate && navigator.vibrate([10, 40, 18]) } catch (e) {} },
    bad: function () { try { navigator.vibrate && navigator.vibrate([26, 60, 26]) } catch (e) {} },
  }
  // 危险按钮点下去震一下 —— 用 data-danger 标记，不用每个页面改代码
  document.addEventListener(
    'click',
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-danger], .danger') : null
      if (el && window.LWHaptic) window.LWHaptic.tap()
    },
    true
  )

  /* ================= 表单校验反馈 ================= */
  window.LWForm = {
    /** 标红 + 抖一下 */
    bad: function (el, why) {
      if (!el) return
      el.classList.remove('lwp-bad')
      void el.offsetWidth
      el.classList.add('lwp-bad')
      if (window.LWAnim) window.LWAnim.shake(el)
      if (window.LWHaptic) window.LWHaptic.bad()
      if (why && window.lwAlert) window.lwAlert(why)
      setTimeout(function () { el.classList.remove('lwp-bad') }, 2400)
    },
    good: function (el) {
      if (!el) return
      el.classList.add('lwp-good')
      setTimeout(function () { el.classList.remove('lwp-good') }, 1600)
    },
    /** 给输入框挂密码强度条，返回一个更新函数 */
    strength: function (input) {
      if (!input) return null
      var bar = document.createElement('div')
      bar.className = 'lwp-pw'
      var fill = document.createElement('i')
      bar.appendChild(fill)
      input.parentNode.insertBefore(bar, input.nextSibling)
      return function (v) {
        var s = String(v == null ? input.value : v)
        var n = 0
        if (s.length >= 8) n++
        if (/[a-z]/.test(s) && /[A-Z]/.test(s)) n++
        if (/\\d/.test(s)) n++
        if (/[^A-Za-z0-9]/.test(s)) n++
        if (s.length >= 14) n++
        var pct = [0, 22, 45, 68, 86, 100][Math.min(5, n)]
        var col = n <= 1 ? '#e5574b' : n <= 2 ? '#e0973f' : n <= 3 ? '#d1b23f' : '#4caf7d'
        fill.style.width = pct + '%'
        fill.style.background = col
      }
    },
  }

  /* ================= 图片淡入 ================= */
  function fadeImages() {
    var imgs = document.querySelectorAll('img:not(.lwp-fadein)')
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i]
      im.classList.add('lwp-fadein')
      if (im.complete) {
        im.classList.add('lwp-on')
      } else {
        im.addEventListener('load', function () { this.classList.add('lwp-on') })
        im.addEventListener('error', function () { this.classList.add('lwp-on') })
      }
    }
  }

  /* ================= 长按进度环 ================= */
  /* 给带 data-hold="800" 的元素加长按进度视觉 */
  function bindHold() {
    var els = document.querySelectorAll('[data-hold]:not([data-hold-bound])')
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      el.setAttribute('data-hold-bound', '1')
      if (reduce) continue
      el.style.position = el.style.position || 'relative'
      var ring = document.createElement('div')
      ring.className = 'lwp-hold'
      el.appendChild(ring)
      var raf = 0
      var t0 = 0
      function step(now) {
        var dur = Number(el.getAttribute('data-hold')) || 800
        var p = Math.min(1, (now - t0) / dur)
        ring.style.setProperty('--p', p + 'turn')
        if (p < 1) raf = requestAnimationFrame(step)
      }
      el.addEventListener('pointerdown', function () {
        t0 = performance.now()
        raf = requestAnimationFrame(step)
      })
      ;['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
        el.addEventListener(ev, function () {
          cancelAnimationFrame(raf)
          ring.style.setProperty('--p', '0turn')
        })
      })
    }
  }

  /* ================= 定时扫描 ================= */
  var timer = 0
  function scan() {
    try {
      reserveSpace()
      upgradeLoading()
      upgradeEmpty()
      fadeImages()
      bindHold()
      onScroll()
    } catch (e) {}
  }
  function start() {
    if (timer) return
    timer = setInterval(scan, 600)
    scan()
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }

  window.LWPolish = {
    scan: scan,
    icons: ICONS,
    skeleton: skeletonHTML,
    glass: function (el) { if (el) el.classList.add('lwp-glass') },
    dither: function (el) { if (el) el.classList.add('lwp-dither') },
    corner: function (el) { if (el) el.classList.add('lwp-corner') },
  }
})()
