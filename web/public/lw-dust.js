// 光尘账本 —— 由 index.html 的内联 <script> 拆分而来。
// 内容原样搬移（只去掉了首尾换行）。

      /* ---------- 光尘账本（只走服务端） ----------
         签到和送光尘都是互动行为，一律要求登录。
         早期版本未登录时也存在本机记账，那样换个设备就清零，
         改 localStorage 还能凭空造余额，所以本机账本已整体移除。
         DUST_PER_SIGNIN：每次签到赠送的数量
         DUST_COST：送一次光尘的消耗                    */
      ;(function () {
        var KEY_TOKEN = 'lw-token'
        var DUST_PER_SIGNIN = 5
        var DUST_COST = 1

        // 服务端账本镜像；为 null 表示未登录或尚未拉取
        var server = null
        var inflight = false

        function token() {
          try {
            return localStorage.getItem(KEY_TOKEN) || ''
          } catch (e) {
            return ''
          }
        }
        var listeners = []
        function applyBook(book) {
          var prevBal = server && typeof server.bal === 'number' ? server.bal : null
          server = book && typeof book.bal === 'number' ? book : null
          for (var i = 0; i < listeners.length; i++) {
            try {
              listeners[i](server)
            } catch (e) {}
          }
          /* 余额变了就把页面上显示光尘的地方弹一下。
             各页面用的类名不统一，所以列一组常见选择器一起找。
             金额没变（比如只是刷新了一次账本）就不弹，免得无意义的动效 */
          var nowBal = server ? server.bal : null
          if (nowBal !== null && prevBal !== null && nowBal !== prevBal) {
            /* 余额变了：数字滚过去 + 元素弹一下。
               必须放在 listeners 之后 —— 各页面是在 listener 里重绘余额的，
               先滚就会被随后的重绘盖掉，动画根本看不见。
               各页面类名不统一，列一组常见选择器一起找。 */
            var sels = ['.dust-bal', '.tw-dust', '.mine-dust', '[data-dust]', '.aw-num', '.dh-dust', '.tk-dust']
            var seen = []
            for (var si = 0; si < sels.length; si++) {
              var els = document.querySelectorAll(sels[si])
              for (var ei = 0; ei < els.length; ei++) {
                var el = els[ei]
                if (seen.indexOf(el) >= 0) continue
                seen.push(el)
                /* 元素里只有纯数字才滚，带「光尘」这类前缀的只弹不滚
                   （滚动会把自己写的文字覆盖掉） */
                var raw = (el.textContent || '').trim()
                if (/^-?\d+$/.test(raw)) {
                  if (window.LWAnim) window.LWAnim.count(el, nowBal, 560)
                } else if (window.LWDialog && window.LWDialog.pop) {
                  window.LWDialog.pop(el)
                }
              }
            }
          }
        }

        /* 拉取服务端账本；未登录或令牌失效时把 server 置空 */
        function sync() {
          var t = token()
          if (!t) {
            applyBook(null)
            return Promise.resolve(null)
          }
          return fetch('/api/dust', { headers: { Authorization: 'Bearer ' + t }, cache: 'no-store' })
            .then(function (r) {
              if (r.status === 401) {
                applyBook(null)
                return null
              }
              return r.json()
            })
            .then(function (d) {
              if (d && d.ok && d.book) applyBook(d.book)
              return server
            })
            .catch(function () {
              return server
            })
        }

        window.dust = {
          perSignin: DUST_PER_SIGNIN,
          cost: DUST_COST,
          /* 服务端刚返回了一份新账本，直接喂进来。
             各页面拿到 d.book 后调一下这个，全局账本立刻就是新的。
             以前有的地方只更新了自己页面里的局部变量（比如改头像扣光尘），
             全局账本还是旧值，换个页面看余额就还是老的。 */
          take: function (book) {
            if (book && typeof book.bal === 'number') applyBook(book)
            return book
          },
          /* 是否已登录（账本是否来自服务端） */
          isServer: function () {
            return server !== null
          },
          /* 是否已登录：光尘的一切都以登录为前提 */
          logged: function () {
            return !!token()
          },
          /* 登录/退出后调用 */
          refresh: sync,
          /* 签到：完全由服务端裁决发放 */
          sign: function () {
            var t = token()
            if (!t) return Promise.resolve({ ok: false, needLogin: true })
            if (inflight) return Promise.resolve(null)
            inflight = true
            return fetch('/api/dust', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
              body: JSON.stringify({ action: 'sign' }),
            })
              .then(function (r) {
                return r.json().catch(function () {
                  return {}
                })
              })
              .then(function (d) {
                if (d && d.ok && d.book) applyBook(d.book)
                if (d && d.code === 'noauth') applyBook(null)
                return d
              })
              .catch(function () {
                return null
              })
              .finally(function () {
                inflight = false
              })
          },
          /* 赠送：扣分与记账在服务端一次完成 */
          giveRemote: function (time) {
            var t = token()
            if (!t) return Promise.resolve({ ok: false, needLogin: true })
            return fetch('/api/dust', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
              body: JSON.stringify({ action: 'give', time: time }),
            })
              .then(function (r) {
                return r.json().catch(function () {
                  return {}
                })
              })
              .then(function (d) {
                if (d && d.book) applyBook(d.book)
                if (d && d.code === 'noauth') applyBook(null)
                return d
              })
              .catch(function () {
                return null
              })
          },
          balance: function () {
            return server ? Math.max(0, server.bal) : 0
          },
          /* 让所有页面把余额重画一遍。
             账本是全局的，但以前只有「我的」页在挂载时读它，
             别的页面（画板顶部、简介、头像）要等整页刷新才看得到新数字 ——
             切页不过是不发请求的切页，账本没变但界面没重画。
             路由 afterEach 会调这个，纯内存操作，不发任何请求。 */
          repaint: function () {
            for (var i = 0; i < listeners.length; i++) {
              try {
                listeners[i](server)
              } catch (e) {}
            }
          },
          /* 订阅余额变化。
             头像页、简介页各自存了一份 balance 用来判断「够不够花」，
             以前谁都不监听变化：不领任务直接切过去，或者在别处领了再回来，
             那个数还是旧的，会平白无故把人拦在门外。
             传进来的 book 就是最新的账本；立即调一次，页面刚挂载时也能拿到当前值。 */
          onChange: function (fn) {
            if (typeof fn !== 'function') return function () {}
            listeners.push(fn)
            if (server) {
              try {
                fn(server)
              } catch (e) {}
            }
            return function () {
              var i = listeners.indexOf(fn)
              if (i >= 0) listeners.splice(i, 1)
            }
          },
          /* 累计收到的光尘（别人送到自己作品上的） */
          received: function () {
            return server ? Number(server.got) || 0 : 0
          },
          /* 未登录一律视为没送过，避免误显示「已送」 */
          gave: function (time) {
            if (!server) return false
            var k = String(time)
            return Array.isArray(server.gifted) && server.gifted.indexOf(k) >= 0
          },
          giftedList: function () {
            return server && Array.isArray(server.gifted) ? server.gifted : []
          },
          giftedCount: function () {
            return server ? Number(server.giftedCount) || 0 : 0
          },
          /* 服务端账本里的签到状态，供「我的」页渲染 */
          signState: function () {
            return server
              ? { signed: !!server.signedToday, streak: server.streak || 0, total: server.total || 0 }
              : null
          },
        }
        /* 余额被别人改了要立刻跟上。
           以前只有「派发方」没有「接收方」：领每日任务、送光尘、领附件、
           领成就奖励都会派发 lw-dust-changed，有的还带上了服务端返回的新账本，
           但账本模块自己根本没监听，server 一直拿着签到时的旧余额。
           加上切页缓存之后这个陈旧值还会一直留着 —— 领了任务回「我的」页
           数字还是老的。 */
        /* 账本变化的统一入口：任何会改光尘的操作都该走这里。
           带上新账本就直接用（省一次请求），没带就重新拉一次。
           lw-mail-claimed 也接上 —— 领信箱附件走的是那个事件，这边以前没接，
           于是领完光尘全局账本一直是旧值，余额怎么都不变。 */
        function onDustChanged(e) {
          var b = e && e.detail
          // 领附件带过来的是 { dust, title, book }，账本在 book 里
          if (b && b.book && typeof b.book.bal === 'number') b = b.book
          if (b && typeof b.bal === 'number') {
            applyBook(b)
          } else {
            sync()
          }
        }
        window.addEventListener('lw-dust-changed', onDustChanged)
        window.addEventListener('lw-mail-claimed', onDustChanged)
        // 启动时静默拉一次，登录用户直接显示真实余额
        sync()
      })()

      /* ---------- 成就提示 ----------
         成就要在「做完事之后」就通知，而不是等用户特意去成就页才发现。
         所以发布作品、送出光尘、签到之后都调 window.achSync()，
         它去服务端重新统计，有新解锁就弹提示。 */
      ;(function () {
        var KEY_TOKEN = 'lw-token'
        var busy = false
        var STYLE_ID = 'lw-ach-style'
        var BOX_ID = 'lw-ach-box'

        function token() {
          try {
            return localStorage.getItem(KEY_TOKEN) || ''
          } catch (e) {
            return ''
          }
        }

        function ensureStyle() {
          if (document.getElementById(STYLE_ID)) return
          var st = document.createElement('style')
          st.id = STYLE_ID
          st.textContent =
            '#' + BOX_ID + '{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));' +
            'transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:8px;' +
            'width:min(320px,88vw);pointer-events:none}' +
            '.lw-ach{background:var(--surface,#fff);border:1px solid var(--accent,#5b8def);' +
            'border-radius:14px;padding:11px 13px;box-shadow:0 8px 26px rgba(0,0,0,.18);' +
            'display:flex;gap:10px;align-items:flex-start;' +
            'animation:lwAchIn .3s ease;transition:opacity .3s,transform .3s}' +
            '.lw-ach.out{opacity:0;transform:translateY(-8px)}' +
            '@keyframes lwAchIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}' +
            '.lw-ach-ico{font-size:24px;line-height:1.2;flex:none}' +
            '.lw-ach-b{flex:1;min-width:0}' +
            '.lw-ach-t{font-size:12px;font-weight:800;color:var(--accent,#5b8def);letter-spacing:.4px}' +
            '.lw-ach-n{font-size:14px;font-weight:800;color:var(--text,#222);margin-top:2px;line-height:1.4}' +
            '.lw-ach-d{font-size:12px;color:var(--text-muted,#888);margin-top:2px;line-height:1.5}' +
            '.lw-ach-r{display:inline-block;margin-top:5px;font-size:11px;font-weight:800;color:#b8860b}'
          document.head.appendChild(st)
        }

        function box() {
          ensureStyle()
          var b = document.getElementById(BOX_ID)
          if (!b) {
            b = document.createElement('div')
            b.id = BOX_ID
            document.body.appendChild(b)
          }
          return b
        }

        function esc(t) {
          return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
          })
        }

        /* 弹一条成就提示；同一批多个会依次堆叠 */
        function show(list, reward) {
          if (!list || !list.length) return
          var host = box()
          list.slice(0, 4).forEach(function (a, i) {
            var el = document.createElement('div')
            el.className = 'lw-ach'
            el.innerHTML =
              '<div class="lw-ach-ico">' + esc(a.ico || '🏅') + '</div>' +
              '<div class="lw-ach-b">' +
              '<div class="lw-ach-t">成就达成</div>' +
              '<div class="lw-ach-n">' + esc(a.name) + '</div>' +
              '<div class="lw-ach-d">' + esc(a.desc || '') + '</div>' +
              (a.reward ? '<div class="lw-ach-r">+' + a.reward + ' ✨ 光尘</div>' : '') +
              '</div>'
            host.appendChild(el)
            setTimeout(function () {
              el.classList.add('out')
              setTimeout(function () {
                if (el.parentNode) el.parentNode.removeChild(el)
              }, 320)
            }, 3200 + i * 180)
          })
          if (window.sfx) {
            try {
              window.sfx('achieve')
            } catch (e) {}
          }
          // 奖励光尘已由服务端加到账本上，通知余额刷新
          if (reward) window.dispatchEvent(new CustomEvent('lw-dust-changed'))
          window.dispatchEvent(new CustomEvent('lw-achieve-changed', { detail: list }))
        }

        /**
         * 重新统计成就并提示。
         * opts.silent 为 true 时只静默同步（例如角标刷新），不弹提示。
         * opts.then 回调拿到完整结果。
         */
        window.achSync = function (opts) {
          var o = opts || {}
          var t = token()
          if (!t) return Promise.resolve(null)
          if (busy) {
            return o.then ? Promise.resolve(null) : Promise.resolve(null)
          }
          busy = true
          return fetch('/api/achieve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
            body: JSON.stringify({ action: 'sync' }),
            cache: 'no-store',
          })
            .then(function (r) {
              if (r.status === 401) return null
              return r.json().catch(function () {
                return null
              })
            })
            .then(function (d) {
              if (d && d.ok && !o.silent && d.fresh && d.fresh.length) show(d.fresh, d.reward)
              if (o.then && d) o.then(d)
              return d
            })
            .catch(function () {
              return null
            })
            .finally(function () {
              busy = false
            })
        }

        // 成就页在别处被打开过时，角标要跟着变
        window.addEventListener('lw-achieve-changed', function () {})
      })()

      /* ---------- 导航栏样式/位置：尽早应用，避免刷新后闪一下默认值 ---------- */
      ;(function () {
        try {
          var st = localStorage.getItem('lw-nav-style')
          if (st) document.documentElement.setAttribute('data-nav-style', st)
        } catch (e) {}
      })()

      /* ---------- 导航栏位置：尽早应用 ---------- */
      ;(function () {
        try {
          if (localStorage.getItem('lw-nav-pos') === 'top') {
            document.documentElement.setAttribute('data-nav-pos', 'top')
          }
        } catch (e) {}
      })()

      /* ---------- 底部导航透明度：尽早应用，避免刷新后闪一下默认值 ---------- */
      ;(function () {
        try {
          var raw = localStorage.getItem('lw-nav-op')
          if (raw !== null && raw !== '') {
            var n = Math.max(0, Math.min(100, Number(raw) || 0))
            document.documentElement.style.setProperty('--nav-op', (n / 100).toFixed(3))
          }
        } catch (e) {}
      })()

      /* ---------- PWA：注册 Service Worker，支持离线使用 ---------- */
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js?v=' + window.__LW_VER).catch(function () {})
        })
      }

      /* 安装到桌面：Android/桌面 Chrome 走 beforeinstallprompt */
      ;(function () {
        var deferred = null
        var KEY = 'lw-pwa-hint-dismissed'
        window.addEventListener('beforeinstallprompt', function (e) {
          e.preventDefault()
          deferred = e
          try { if (localStorage.getItem(KEY) === '1') return } catch (err) {}
          if (!document.body) return
          var tip = document.createElement('div')
          tip.className = 'pwa-tip'
          tip.innerHTML =
            '<span>把像素小镇装到桌面，没网也能画画</span>' +
            '<button class="pwa-go" type="button">安装</button>' +
            '<button class="pwa-x" type="button" aria-label="关闭">×</button>'
          document.body.appendChild(tip)
          tip.querySelector('.pwa-go').addEventListener('click', function () {
            tip.remove()
            if (deferred) {
              deferred.prompt()
              deferred.userChoice.then(function () { deferred = null })
            }
          })
          tip.querySelector('.pwa-x').addEventListener('click', function () {
            try { localStorage.setItem(KEY, '1') } catch (err) {}
            tip.remove()
          })
        })
        window.addEventListener('appinstalled', function () {
          try { localStorage.setItem(KEY, '1') } catch (err) {}
          if (window.toast) window.toast('已添加到桌面，以后可以直接打开 🎉')
        })
      })()
