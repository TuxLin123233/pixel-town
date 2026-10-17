// 视图共用的两个小工具：页面级缓存 + 手动刷新按钮
//
// 为什么需要：以前每个视图在 mounted 里都直接 fetch，
// 于是「切到这一页 → 请求一次」，来回切几次就把 Cloudflare 的
// 免费请求额度烧光了。现在改成：
//   · 第一次进这一页才请求
//   · 数据放在内存缓存里，切回来直接重画，不发请求
//   · 旁边给一个「刷新」按钮，想更新时自己点
//
// 缓存是内存的（刷新整页就没了），这样数据不会一直不更新，
// 只是不会因为「切了个页面」就自动重新拉。

/** 按 key 存一份数据。返回 true 表示这次是真的去请求了。 */
function cached(key, fetcher) {
  const store = window.__lwCache || (window.__lwCache = {})
  if (store[key] !== undefined) return false
  store[key] = null // 占位，避免并发重复请求
  fetcher()
  return true
}

/** 写缓存（在拿到数据后调） */
function put(key, data) {
  const store = window.__lwCache || (window.__lwCache = {})
  store[key] = data
}

/** 读缓存 */
function get(key) {
  const store = window.__lwCache || (window.__lwCache = {})
  return store[key]
}

/** 手动作废某一页的缓存（下次进入会重新请求） */
function drop(key) {
  const store = window.__lwCache || (window.__lwCache = {})
  delete store[key]
}

/**
 * 刷新按钮里的图标：站内的扁平图标（Pixelarticons reload，MIT）。
 * 以前这里写的是 "⟳" 文字符号 —— 它跟着字体走，不同平台粗细/形状不一样，
 * 而且跟站里其他扁平像素图标不是一套，所以换成内联 SVG。
 */
const REFRESH_ICO =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M16 4h2v6h-2zm-2-2h2v2h-2zm0 2h2v8h-2zM4 8H2v5h2z"/>' +
  '<path d="M4 6h16v2H4zm4 14H6v-6h2zm2 2H8v-2h2zm0-2H8v-8h2zm10-4h2v-5h-2z"/>' +
  '<path d="M20 18H4v-2h16z"/>' +
  '</svg>'

/**
 * 绑一个「刷新」按钮。
 *   el      按钮元素
 *   run     真正干活的函数，返回 Promise
 *   onDone  拿到结果后的回调（可选）
 *   silent  true 表示没网/失败时不弹提示（页面自己会显示错误）
 */
function bindRefresh(el, run, onDone, silent) {
  if (!el) return
  const label = el.getAttribute('data-label') || '刷新'
  el.innerHTML = '<span class="lr-ico">' + REFRESH_ICO + '</span><span class="lr-tx">' + label + '</span>'
  el.disabled = false
  el.addEventListener('click', async () => {
    if (el.disabled) return
    el.disabled = true
    el.classList.add('busy')
    try {
      const r = await run()
      if (onDone) onDone(r)
    } catch (e) {
      if (!silent && window.toast) window.toast('刷新失败：' + ((e && e.message) || '网络错误'))
    } finally {
      el.disabled = false
      el.classList.remove('busy')
    }
  })
}

/**
 * 视图初始化统一入口：第一次进来自动加载一次（带缓存），
 * 之后切回来只重画缓存、不发请求。
 *   key     缓存键
 *   load    真正请求的函数
 *   paint   拿到数据后渲染
 */
function setupView(key, load, paint) {
  const has = cached(key, () => {
    load().then(
      (d) => {
        put(key, d)
        paint(d)
      },
      () => {
        // 失败就把占位清掉，下次进来还能重试
        drop(key)
        paint(null)
      }
    )
  })
  if (has) return
  const d = get(key)
  if (d !== undefined && d !== null) paint(d)
}

window.LWCache = { cached, put, get, drop, bindRefresh, setupView }
