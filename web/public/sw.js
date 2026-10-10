// 像素小镇 · Service Worker
// 目标：装到桌面后，没网也能打开画板继续画。
// 策略：
//   - /api/ 一律走网络，绝不缓存（作品、投票这类数据必须实时）
//   - 页面导航、JS/CSS/清单：网络优先 + 缓存兜底。
//     这一条很关键：之前用「缓存优先」，导致 push 之后用户仍拿到旧版代码，
//     表现为「改了但没变化」。代码正确性比离线速度重要。
//   - 图标、图片：缓存优先（体积大、变动少）

const VERSION = 'lw-v1.25.6'
const SHELL_CACHE = 'lw-shell-' + VERSION

/* 预缓存清单。
   注意：视图拆出来的子模块、以及从 index.html 挪出去的样式/脚本都要列进来 ——
   它们是 import / <link> 拉进来的，一旦没被缓存，断网时那次请求会回退到
   index.html（SW 的 fallback），浏览器拿到一坨 HTML 当 JS/CSS 用，页面就残了。 */
const SHELL = [
  '/',
  '/index.html',
  '/404.html',
  '/app.js',
  '/manifest.webmanifest',
  '/vue.global.prod.js',
  '/vue-router.global.prod.js',
  '/omggif.js',
  '/qrcode.js',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/styles/site.css',
  '/styles/detail.css',
  '/lw-sfx.js',
  '/lw-dust.js',
  '/views/paint.js',
  '/views/paint/paint-styles.js',
  '/views/paint/paint-template.js',
  '/views/paint/paint-constants.js',
  '/views/gallery.js',
  '/views/gallery/gallery-styles.js',
  '/views/gallery/gallery-template.js',
  '/views/gallery/gallery-constants.js',
  '/views/settings.js',
  '/views/settings/settings-styles.js',
  '/views/settings/settings-template.js',
  '/views/settings/settings-constants.js',
  '/views/changelog.js',
  '/views/admin.js',
  '/views/admin/admin-styles.js',
  '/views/admin/admin-template.js',
  '/views/terms.js',
  '/views/faq.js',
  '/views/tasks.js',
  '/views/rank.js',
  '/views/user.js',
  '/views/chat.js',
  '/views/chat/chat-styles.js',
  '/views/town.js',
  '/views/town/town-styles.js',
  '/views/bag.js',
  '/views/mine.js',
  '/views/mine/mine-styles.js',
  '/views/mine/mine-template.js',
  '/views/intro.js',
  '/views/avatar.js',
  '/views/achieve.js',
  '/views/mail.js',
  '/views/notifications.js',
  '/views/dustlog.js',
  '/views/stats.js',
  '/views/card.js',
  '/views/hotpot.js',
  '/views/mod.js',
  '/views/copyright.js',
  '/views/login.js',
  '/lw-avatar.js',
  '/lw-spray.js',
  '/lw-gravity.js',
  '/lw-thumb.js',
  '/lw-cache.js',
  '/lw-dialog.js',
  '/lw-polish.js',
  '/lw-polish/polish-styles.js',
  '/lw-polish/polish-icons.js',
  '/lw-pxicon.js',
  '/lw-pxicon/icons.js',
  '/lw-pxicon/emoji.js',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) =>
        // 逐个添加：任何一个 404 都不应该让整个安装失败
        Promise.all(
          SHELL.map((url) =>
            cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
          )
        )
      )
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== SHELL_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // 接口永远走网络，不缓存
  if (url.pathname.startsWith('/api/')) return

  // 导航请求：网络优先，断网时回退到缓存的外壳
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put('/index.html', copy))
          return res
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    )
    return
  }

  // 代码与样式：网络优先，拿到新的就顺手更新缓存；断网才用旧缓存
  const CODE = /\.(?:js|css|mjs|webmanifest|json)$/i
  if (CODE.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone()
            caches.open(SHELL_CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    )
    return
  }

  // 图片等体积大、变动少的资源：缓存优先 + 后台更新
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone()
            caches.open(SHELL_CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
