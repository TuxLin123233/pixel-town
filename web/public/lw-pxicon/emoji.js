// 自绘像素图标 · emoji 替换
//
// 由 lw-pxicon.js 拆分而来（内容原样搬移，未做任何改动，缩进也保持原样）。
// 只做一件事：把界面文本节点里的 emoji 换成 <i data-px> 宿主，
// 再由引擎画成像素图标。它不依赖引擎内部状态，所以能独立成模块。

/* ================= emoji → 像素图标 =================
     把界面里的 emoji 换掉，但**不是全换**：
       · 设置页整个不动（用户明确要求）
       · 更新日志不动 —— 那是历史记录
       · 聊天里的表情选择器不动 —— 那是用户主动发的贴纸，
         换成图标等于把这个功能删了
       · <input> / <textarea> / <option> 里的不动 —— 那里不是图标是文本
     替换发生在**文本节点**上，只认整颗 emoji，不动周围的文字。

     on 指定这些图标怎么动：界面图标默认 active（选中/悬停才动），
     避免一屏几十个东西一起动。 */
  var EMOJI_MAP = {
    '✨': ['dust', 'idle'],
    '🎨': ['palette', 'hover'],
    '🏆': ['trophy', 'hover'],
    '🏠': ['house', 'hover'],
    '🏘': ['town', 'hover'],
    '💬': ['chat', 'hover'],
    '🖼': ['frame', 'hover'],
    '🛡': ['shield', 'hover'],
    '🏅': ['medal', 'hover'],
    '👤': ['user', 'hover'],
    '🖌': ['brush', 'hover'],
    '✏': ['pencil', 'hover'],
    '✍': ['pencil', 'hover'],
    '✒': ['pencil', 'hover'],
    '🗑': ['trash', 'press'],
    '♻': ['undo', 'press'],
    '↩': ['undo', 'press'],
    '↺': ['undo', 'press'],
    '🔄': ['undo', 'press'],
    '✅': ['check', 'press'],
    '✔': ['check', 'press'],
    '☑': ['check', 'press'],
    '❌': ['cross', 'press'],
    '✖': ['cross', 'press'],
    '✕': ['cross', 'press'],
    '⚠': ['question', 'hover'],
    '❓': ['question', 'hover'],
    '❔': ['question', 'hover'],
    '🎞': ['film', 'hover'],
    '🎬': ['film', 'hover'],
    '🦋': ['butterfly', 'idle'],
    '🎁': ['gift', 'hover'],
    '🎲': ['dice', 'press'],
    '🎂': ['cake', 'idle'],
    '📢': ['announce', 'press'],
    '📣': ['announce', 'press'],
    '🤝': ['handshake', 'hover'],
    '🙋': ['raise', 'hover'],
    '🎉': ['party', 'press'],
    '🎊': ['party', 'press'],
    '🔗': ['link', 'press'],
    '🔍': ['question', 'hover'],
    '⬇': ['download', 'press'],
    '📥': ['download', 'press'],
    '⚡': ['bolt', 'idle'],
    '🔥': ['fire', 'idle'],
    '🚩': ['flag', 'hover'],
    '🏳': ['flag', 'hover'],
    '🚫': ['ban', 'hover'],
    '⛔': ['ban', 'hover'],
    '🚪': ['arrowRight', 'hover'],
    '♡': ['heart', 'idle'],
    '♥': ['heart', 'idle'],
    '❤': ['heart', 'idle'],
    '💛': ['heart', 'idle'],
    '💙': ['heart', 'idle'],
    '💚': ['heart', 'idle'],
    '💜': ['heart', 'idle'],
    '🤍': ['heart', 'idle'],
    '🖤': ['heart', 'idle'],
    '🧡': ['heart', 'idle'],
    '☀': ['sun', 'idle'],
    '🌤': ['sun', 'idle'],
    '🌞': ['sun', 'idle'],
    '⛅': ['sun', 'idle'],
    '🌧': ['sun', 'idle'],
    '❄': ['sun', 'idle'],
    '🔒': ['lock', 'hover'],
    '🔓': ['lock', 'hover'],
    '✉': ['mail', 'hover'],
    '📧': ['mail', 'hover'],
    '📬': ['mail', 'hover'],
    '📩': ['mail', 'hover'],
    '🗺': ['map', 'hover'],
    '📷': ['frame', 'press'],
    '🎯': ['frame', 'press'],
    '📏': ['line', 'hover'],
    '📐': ['line', 'hover'],
    '▭': ['rect', 'none'],
    '▯': ['rect', 'none'],
    '◯': ['circle', 'none'],
    '○': ['circle', 'none'],
    '🧽': ['eraser', 'press'],
    '🩹': ['eraser', 'press'],
    '💧': ['fill', 'press'],
    '🪣': ['fill', 'press'],
    '🎨': ['palette', 'hover'],
    '💉': ['picker', 'press'],
    '💊': ['picker', 'press'],
    '✋': ['hand', 'hover'],
    '🤚': ['hand', 'hover'],
    '🫂': ['hand', 'hover'],
    '🤏': ['hand', 'hover'],
    '✥': ['move', 'hover'],
    '✛': ['move', 'hover'],
    '⤢': ['move', 'hover'],
    '⤡': ['move', 'hover'],
    '⬛': ['frame', 'none'],
    '⬜': ['frame', 'none'],
    '📌': ['flag', 'hover'],
    '📋': ['frame', 'hover'],
    '📄': ['frame', 'hover'],
    '📜': ['frame', 'hover'],
    '📦': ['gift', 'hover'],
    '⑦': ['bolt', 'none'],
    '→': ['arrowRight', 'hover'],
    '←': ['arrowLeft', 'hover'],
    '↓': ['arrowDown', 'hover'],
    '↑': ['arrowDown', 'hover'],
    '➡': ['arrowRight', 'hover'],
    '⬅': ['arrowLeft', 'hover'],
    '⬆': ['arrowDown', 'hover'],
    '▶': ['arrowRight', 'hover'],
    '◀': ['arrowLeft', 'hover'],
    '▸': ['arrowRight', 'hover'],
    '◂': ['arrowLeft', 'hover'],
    '›': ['arrowRight', 'hover'],
    '‹': ['arrowLeft', 'hover'],
    '…': ['question', 'none'],
    '★': ['star', 'idle'],
    '☆': ['star', 'idle'],
    '⭑': ['star', 'idle'],
  }

  /* 这些容器下面的 emoji 一律不换 —— 加了 data-px-skip 也可以。
     script / style 也排除：它们的文本不是给用户看的。
     以前 index.html 里的内联脚本混着 emoji，会被换成 <i data-px>，
     等于白改一堆没有意义的 DOM（脚本早跑完了，所以页面上看不出问题）。 */
  var SKIP_SELECTOR = '[data-px-skip], script, style, input, textarea, select, option, code, pre, .ch-emoji, .emoji-pick, .ch-sticker'
  var SKIP_PATH = ['/settings', '/changelog']

  function shouldSkipTextNode(node) {
    var el = node.parentNode
    if (!el || el.nodeType !== 1) return true
    if (el.closest && el.closest(SKIP_SELECTOR)) return true
    // 已经在图标宿主里了
    if (el.closest && el.closest('[data-px-done]')) return true
    return false
  }

  function pathSkipped() {
    var p = location.pathname || ''
    for (var i = 0; i < SKIP_PATH.length; i++) {
      if (p.indexOf(SKIP_PATH[i]) === 0) return true
    }
    return false
  }

  var EMOJI_RE = null
  function buildRe() {
    if (EMOJI_RE) return EMOJI_RE
    var keys = Object.keys(EMOJI_MAP)
    // 长的排前面，避免「🖼️」被「🖼」先吃掉
    keys.sort(function (a, b) { return b.length - a.length })
    var esc = keys.map(function (k) {
      return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    })
    EMOJI_RE = new RegExp('(' + esc.join('|') + ')\\uFE0F?', 'g')
    return EMOJI_RE
  }

  /**
   * 把一段范围内的 emoji 换成像素图标。
   * 只处理文本节点，不动 input 的值和代码块。
   */
  function swapEmoji(root) {
    if (pathSkipped()) return 0
    var scope = root || document.body
    if (!scope) return 0
    var re = buildRe()
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !/[\u2000-\uFFFF]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT
        if (shouldSkipTextNode(n)) return NodeFilter.FILTER_REJECT
        re.lastIndex = 0
        return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      },
    })
    var targets = []
    while (walker.nextNode()) targets.push(walker.currentNode)
    if (!targets.length) return 0

    var count = 0
    for (var i = 0; i < targets.length; i++) {
      var node = targets[i]
      var text = node.nodeValue
      re.lastIndex = 0
      if (!re.test(text)) continue
      var frag = document.createDocumentFragment()
      var last = 0
      var m
      re.lastIndex = 0
      while ((m = re.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)))
        var hit = EMOJI_MAP[m[1]]
        if (hit) {
          var ic = document.createElement('i')
          ic.className = 'px-ico-host px-ico-inline'
          ic.setAttribute('data-px', hit[0])
          /* 不写 data-px-size —— 让 sizeFor 按所在位置的字号算。
             emoji 本来就是跟着 font-size 走的，写死会大小不一。 */
          ic.setAttribute('data-px-on', hit[1])
          ic.setAttribute('aria-hidden', 'true')
          frag.appendChild(ic)
          count++
        } else {
          frag.appendChild(document.createTextNode(m[0]))
        }
        last = m.index + m[0].length
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)))
      if (node.parentNode) node.parentNode.replaceChild(frag, node)
    }
    return count
  }

export { EMOJI_MAP, swapEmoji }
