// 轻量音效 —— 由 index.html 的内联 <script> 拆分而来。
// 内容原样搬移（只去掉了首尾换行）。

      /* ---------- 轻量音效（WebAudio 实时合成，无音频文件） ---------- */
      ;(function () {
        let ac = null
        /* 主音量节点：所有音效都先汇到这里再去扬声器，
           这样音量滑块改一处就能整体生效（0~1）。 */
        let master = null
        const VOL_KEY = 'lw-sfx-vol'
        function readVol() {
          try {
            const raw = localStorage.getItem(VOL_KEY)
            if (raw === null || raw === '') return 0.8
            const n = Number(raw)
            return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0.8
          } catch (e) {
            return 0.8
          }
        }
        let volume = readVol()
        function ctx() {
          if (!ac) {
            const C = window.AudioContext || window.webkitAudioContext
            if (!C) return null
            ac = new C()
            master = ac.createGain()
            master.gain.value = volume
            master.connect(ac.destination)
          }
          if (ac.state === 'suspended') ac.resume().catch(function () {})
          return ac
        }
        let on = true
        try {
          const v = localStorage.getItem('lw-sfx')
          if (v === '0') on = false
        } catch (e) {}
        const isSilent = () => {
          try {
            return localStorage.getItem('lw-sfx') === '0'
          } catch (e) {
            return false
          }
        }
        /* 每次播放整体微调音高（±3.5%）：同一个音效连按很多次也不会一模一样，
           避免机械感 —— 游戏音效的常见做法。整条音效共用一个偏移量，
           所以琶音、和弦内部的音程关系不会被打乱。 */
        let curPitch = 1
        function jitterPitch() {
          curPitch = 1 + (Math.random() * 2 - 1) * 0.035
        }

        /* 一个音符：正弦 + 快速衰减，听起来就是「叮」 */
        function note(freq, at, dur, vol, type) {
          const c = ctx()
          if (!c) return
          const t0 = c.currentTime + at
          const osc = c.createOscillator()
          const gain = c.createGain()
          osc.type = type || 'sine'
          osc.frequency.setValueAtTime(freq * curPitch, t0)
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
          osc.connect(gain)
          gain.connect(master || c.destination)
          osc.start(t0)
          osc.stop(t0 + dur + 0.02)
        }

        /* 滑音：频率从 f1 平滑滑到 f2，做「升级 / 获得 / 弹出」的上扬感 */
        function glide(f1, f2, at, dur, vol, type) {
          const c = ctx()
          if (!c) return
          const t0 = c.currentTime + at
          const osc = c.createOscillator()
          const gain = c.createGain()
          osc.type = type || 'sine'
          osc.frequency.setValueAtTime(Math.max(20, f1 * curPitch), t0)
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, f2 * curPitch), t0 + dur)
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
          osc.connect(gain)
          gain.connect(master || c.destination)
          osc.start(t0)
          osc.stop(t0 + dur + 0.02)
        }

        /* 琶音：一串音符按 step 间隔依次播放，音符比步进略长，形成连贯感 */
        function seq(freqs, at, step, vol, type) {
          for (let i = 0; i < freqs.length; i++) {
            note(freqs[i], at + i * step, step * 1.8, vol, type)
          }
        }

        /* 和弦：多个音符同时发声 */
        function chord(freqs, at, dur, vol, type) {
          for (let i = 0; i < freqs.length; i++) {
            note(freqs[i], at, dur, vol, type)
          }
        }

        /* 柔和噪声：低通滤波的白噪声，做「沙沙 / 翻页 / 扫掉」的质感 */
        let noiseBuf = null
        function noise(at, dur, vol, cutoff) {
          const c = ctx()
          if (!c) return
          if (!noiseBuf) {
            const len = Math.floor(c.sampleRate * 0.5)
            noiseBuf = c.createBuffer(1, len, c.sampleRate)
            const d = noiseBuf.getChannelData(0)
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
          }
          const t0 = c.currentTime + at
          const src = c.createBufferSource()
          src.buffer = noiseBuf
          src.loop = true
          const flt = c.createBiquadFilter()
          flt.type = 'lowpass'
          flt.frequency.value = cutoff || 1000
          const gain = c.createGain()
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
          src.connect(flt)
          flt.connect(gain)
          gain.connect(master || c.destination)
          src.start(t0)
          src.stop(t0 + dur + 0.02)
        }

        /* 颤音：音高轻微波动，成就解锁那种「余韵」感 */
        function vib(freq, at, dur, vol, type, depth, rate) {
          const c = ctx()
          if (!c) return
          const t0 = c.currentTime + at
          const osc = c.createOscillator()
          const gain = c.createGain()
          const lfo = c.createOscillator()
          const lfoGain = c.createGain()
          osc.type = type || 'sine'
          osc.frequency.value = freq * curPitch
          lfo.frequency.value = rate || 6
          lfoGain.gain.value = depth || 3
          lfo.connect(lfoGain)
          lfoGain.connect(osc.frequency)
          gain.gain.setValueAtTime(0.0001, t0)
          gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
          osc.connect(gain)
          gain.connect(master || c.destination)
          osc.start(t0)
          lfo.start(t0)
          osc.stop(t0 + dur + 0.02)
          lfo.stop(t0 + dur + 0.02)
        }
        const SFX = {
          /* ---------- 基础反馈 ---------- */
          /* 轻点：短促柔和一声 */
          tap: () => note(880, 0, 0.06, 0.045, 'sine'),
          /* 切换：极短一记「咔」，用于开关、标签 */
          tick: () => note(1046, 0, 0.035, 0.035, 'sine'),
          /* 选中：清脆一记，带一点泛音 */
          select: () => {
            note(1174, 0, 0.06, 0.05, 'sine')
            note(1760, 0, 0.04, 0.02, 'sine')
          },
          /* 弹出：气泡感，短促上扬 */
          pop: () => glide(520, 920, 0, 0.07, 0.05, 'sine'),
          /* 滑动/翻页：柔和沙沙 */
          swish: () => noise(0, 0.12, 0.04, 1500),

          /* ---------- 打开 / 关闭 ---------- */
          /* 打开：上扬三音，像盒子打开 */
          open: () => seq([523, 659, 784], 0, 0.05, 0.05, 'sine'),
          /* 关闭/取消：下行两音 */
          close: () => {
            note(784, 0, 0.07, 0.045, 'sine')
            note(523, 0.06, 0.09, 0.045, 'sine')
          },

          /* ---------- 成功（由弱到强） ---------- */
          /* 一般成功：清脆双音 */
          ding: () => {
            note(880, 0, 0.08, 0.055, 'sine')
            note(1174, 0.06, 0.12, 0.04, 'sine')
          },
          /* 较成功：上行三音 */
          ok: () => seq([659, 784, 1046], 0, 0.06, 0.055, 'sine'),
          /* 重大成功/升级：上行四音琶音，收在明亮处 */
          win: () => {
            seq([523, 659, 784, 1046], 0, 0.07, 0.055, 'sine')
            note(1318, 0.28, 0.22, 0.05, 'sine')
          },
          /* 成就解锁：华丽琶音 + 颤音余韵 */
          achieve: () => {
            seq([523, 659, 784, 1046, 1318], 0, 0.06, 0.05, 'triangle')
            vib(1318, 0.3, 0.28, 0.05, 'sine', 4, 6)
          },

          /* ---------- 奖励 / 获得 ---------- */
          /* 获得光尘/奖励：上扬滑音 + 高音叮，像捡到金币但柔和 */
          coin: () => {
            glide(700, 1500, 0, 0.1, 0.05, 'sine')
            note(2093, 0.09, 0.14, 0.045, 'sine')
          },
          /* 保存/发布成功：轻快两音上行 */
          save: () => {
            note(784, 0, 0.08, 0.05, 'sine')
            note(1046, 0.06, 0.14, 0.05, 'sine')
          },
          /* 发送成功：短促上扬，像消息飞出 */
          send: () => glide(600, 1000, 0, 0.07, 0.05, 'sine'),

          /* ---------- 否定 / 警示 ---------- */
          /* 否定/不可操作：柔和下行，不刺耳 */
          no: () => {
            note(659, 0, 0.06, 0.04, 'sine')
            note(494, 0.05, 0.08, 0.04, 'sine')
          },
          /* 警示：低沉一记，用于清空等破坏性操作 */
          warn: () => note(330, 0, 0.14, 0.05, 'triangle'),
          /* 错误：两声低沉短促 */
          error: () => {
            note(233, 0, 0.08, 0.05, 'triangle')
            note(196, 0.09, 0.12, 0.05, 'triangle')
          },

          /* ---------- 社交互动 ---------- */
          /* 点赞：可爱上扬双音 */
          like: () => {
            note(880, 0, 0.07, 0.05, 'sine')
            note(1318, 0.05, 0.12, 0.045, 'sine')
          },
          /* 关注：轻快上行三音 */
          follow: () => seq([659, 784, 880], 0, 0.05, 0.05, 'sine'),
          /* 收到消息/通知：两粒上行铃音 */
          receive: () => {
            note(988, 0, 0.08, 0.05, 'sine')
            note(1318, 0.07, 0.16, 0.045, 'sine')
          },

          /* ---------- 游戏化 / 趣味 ---------- */
          /* 连续签到：连击感，快速上行 */
          streak: () => seq([523, 659, 784, 1046], 0, 0.06, 0.055, 'sine'),
          /* 任务完成：干脆双音 + 上扬 */
          task: () => {
            note(784, 0, 0.07, 0.05, 'sine')
            note(988, 0.06, 0.07, 0.05, 'sine')
            note(1174, 0.12, 0.14, 0.045, 'sine')
          },
          /* 投票：短促上扬 */
          vote: () => glide(800, 1200, 0, 0.06, 0.05, 'sine'),
          /* 上榜：上行音阶，像登顶 */
          rank: () => seq([523, 659, 784, 880, 1046], 0, 0.06, 0.05, 'triangle'),
          /* 撤销：下行两音 */
          undo: () => {
            note(659, 0, 0.07, 0.05, 'triangle')
            note(494, 0.06, 0.12, 0.05, 'triangle')
          },
          /* 清空：下滑长音 + 轻噪声，像扫掉 */
          clear: () => {
            glide(900, 320, 0, 0.18, 0.05, 'sine')
            noise(0.02, 0.12, 0.025, 900)
          },

          /* ---------- 导航 / 环境 / 联机 ---------- */
          /* 切页：柔和一记，谁都能听见但不吵 */
          nav: () => {
            note(1046, 0, 0.05, 0.04, 'sine')
            note(1318, 0.035, 0.09, 0.035, 'sine')
          },
          /* 新消息（旧名，与 receive 相同） */
          msg: () => {
            note(988, 0, 0.08, 0.05, 'sine')
            note(1318, 0.07, 0.16, 0.045, 'sine')
          },
          /* 载入：轻柔上行小琶音 */
          load: () => seq([392, 523, 659, 784], 0, 0.06, 0.045, 'sine'),
          /* 倒计时：短促一声 */
          beep: () => note(784, 0, 0.05, 0.045, 'sine'),
          /* 加入：欢迎上行的双音 */
          join: () => {
            note(587, 0, 0.08, 0.05, 'sine')
            note(880, 0.07, 0.14, 0.05, 'sine')
          },
          /* 离开：下行双音 */
          leave: () => {
            note(880, 0, 0.08, 0.045, 'sine')
            note(587, 0.07, 0.13, 0.045, 'sine')
          },
          /* 心跳：低低一记，联机时有人动笔 */
          heartbeat: () => note(196, 0, 0.16, 0.035, 'sine'),
        }
        /* gamersounds.com 的音效：有的场景直接用真实文件，
           没有文件的退回上面的合成音。
           用法：window.sfx('hit') / ('fire') / ('coin') / ('fail') / ('levelup') / ('buy') */
        /* eat 和 success 这两个不在这里了 ——
             用户反馈大锅饭和「游戏成功」的音效要换一个，
             改成用下面的合成音（ding / win / achieve），
             音色更贴像素风，也省掉两个 mp3 的下载。 */
          const AUDIO_SFX = {
            hit: '/audio/hit.mp3', fire: '/audio/fire.mp3',
            coin: '/audio/coin.mp3', fail: '/audio/fail.mp3',
            levelup: '/audio/levelup.mp3', buy: '/audio/buy.mp3',
            click: '/audio/click.mp3', button: '/audio/button.mp3',
          }
        window.sfx = function (name) {
          if (isSilent()) return
          const src = AUDIO_SFX[name]
          if (src) {
            try { new Audio(src).play() } catch (e) {}
            try { window.__lwSfxAt = performance.now() } catch (e) {}
            return
          }

          if (isSilent()) return
          const fn = SFX[name]
          if (fn) {
            jitterPitch()
            /* 记下最后发声的时刻：全局按钮音效靠它判断「这一下点击视图里
               已经自己配过音了」，从而避免同一个按钮响两次。 */
            window.__lwSfxAt = performance.now()
            try {
              fn()
            } catch (e) {}
          }
        }
        window.setSfx = function (v) {
          // 广播出去，设置页的音效波形靠它同步
          try { window.dispatchEvent(new CustomEvent('lw-sfx-changed', { detail: !!v })) } catch (e) {}
          on = !!v
          try {
            localStorage.setItem('lw-sfx', v ? '1' : '0')
          } catch (e) {}
          if (v) SFX.tap()
        }
        window.getSfx = function () {
          return !isSilent()
        }
        /* 音量：0~1，存 localStorage，下次打开还是这个值 */
        window.getSfxVolume = function () {
          return volume
        }
        window.setSfxVolume = function (v) {
          const n = Number(v)
          if (Number.isFinite(n)) volume = Math.max(0, Math.min(1, n))
          try {
            localStorage.setItem(VOL_KEY, String(volume))
          } catch (e) {}
          if (master) {
            try {
              master.gain.value = volume
            } catch (e) {}
          }
        }

        /* ---------- 全局按钮音效：让站里每个按钮都有反馈 ----------
           逐个页面给按钮配音不现实（站里有上百个按钮），所以这里在 document
           上做一次事件委托，按按钮的语义挑音效。已经自己配过音的视图不会响
           两次：视图的处理器是同步执行的，而这里推迟到 setTimeout(0) 才发声，
           只要这期间 window.sfx 被调用过，就说明这一下点击已经有音效了。 */
        ;(function () {
          const BTN =
            'button, [role="button"], a[href], input[type="button"], input[type="submit"], summary, [data-sfx]'
          /* 底部导航有专门的切页音效，交给 app.js，全局不插手 */
          const SKIP = '#appNav a'

          /* 找出这次点击该由哪个元素负责发声。
             站里有一半「按钮」其实是 div/span/i（画廊卡片、分页圆点等），
             它们没有语义标签，所以再用样式兜一层：
               cursor:pointer     → 可点
               cursor:not-allowed → 不可点（发「不行」的反馈）
             画布的 cursor 是 crosshair / grab，天然落不进这两个分支，
             所以在画布上落笔不会触发通用按钮音效。 */
          function resolveTarget(node) {
            const semantic = node.closest ? node.closest(BTN) : null
            if (semantic) {
              /* 语义按钮也要看一眼样式：没加 disabled 属性、只是被 CSS 画成
                 cursor:not-allowed 的按钮，点下去同样该给「不行」的反馈 */
              let c = ''
              try {
                c = getComputedStyle(semantic).cursor
              } catch (e) {}
              return { el: semantic, blocked: c === 'not-allowed' }
            }
            let n = node
            let hops = 0
            while (n && n.nodeType === 1 && n !== document.body && hops < 6) {
              if (n.tagName === 'CANVAS') return null
              let cur = ''
              try {
                cur = getComputedStyle(n).cursor
              } catch (e) {}
              if (cur === 'not-allowed') return { el: n, blocked: true }
              if (cur === 'pointer') return { el: n, blocked: false }
              n = n.parentElement
              hops++
            }
            return null
          }

          /* 语义分类：先判危险 / 关闭 / 切换这类明确的，再落到通用 */
          function pick(el) {
            const cls = typeof el.className === 'string' ? el.className : el.getAttribute('class') || ''
            const txt =
              (el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.title || '')
            const all = (cls + ' ' + (el.id || '')).toLowerCase()
            if (
              /del|delete|remove|clear|danger|wipe|logout|unsub|block|ban/.test(all) ||
              /删除|清空|移除|注销|退出登录|取消关注|拉黑/.test(txt)
            )
              return 'warn'
            if (/cancel|close|dismiss|back|exit/.test(all) || /取消|关闭|返回|收起|退出/.test(txt)) return 'close'
            if (
              /tab|toggle|switch|seg|filter|chip|opt|radio|check/.test(all) ||
              el.hasAttribute('aria-pressed') ||
              el.classList.contains('on') ||
              el.classList.contains('active') ||
              el.getAttribute('role') === 'tab'
            )
              return 'tick'
            if (
              /save|submit|publish|confirm|primary|send|upload|post/.test(all) ||
              /保存|发布|提交|发送|确定|确认|上传|立即/.test(txt)
            )
              return 'save'
            if (/add|create|new|plus|open|expand|more/.test(all) || /新建|添加|创建|打开|展开|更多/.test(txt))
              return 'open'
            if (/like|heart|fav|star|upvote/.test(all) || /点赞|喜欢|收藏/.test(txt)) return 'like'
            if (/share|copy|link|invite/.test(all) || /分享|复制|链接|邀请/.test(txt)) return 'select'
            return 'tap'
          }

          document.addEventListener(
            'click',
            (event) => {
              const node = event.target
              if (!node || !node.closest) return
              const hit = resolveTarget(node)
              if (!hit) return
              const el = hit.el
              if (el.closest && el.closest(SKIP)) return
              const blocked =
                hit.blocked || el.disabled || el.getAttribute('aria-disabled') === 'true'
              /* 推迟到本轮同步流程跑完再判断：视图若已自己配音，这里就跳过。
                 注意 lastAt 未定义时不能当成 0 —— performance.now() 在页面刚
                 加载时数值很小，那样会把「还没响过」误判成「刚刚响过」。 */
              setTimeout(() => {
                const lastAt = window.__lwSfxAt
                if (lastAt && performance.now() - lastAt < 220) return
                /* 灰掉的按钮也给个「不行」的反馈，比点了毫无动静友好 */
                if (blocked) return window.sfx('no')
                /* data-sfx 可显式指定音效，留给以后按需覆盖 */
                const want = el.getAttribute && el.getAttribute('data-sfx')
                window.sfx(want || pick(el))
              }, 0)
            },
            true
          )
        })()

        /* 首次交互解锁音频（浏览器自动播放策略） */
        const unlock = function () {
          ctx()
          document.removeEventListener('pointerdown', unlock)
        }
        document.addEventListener('pointerdown', unlock, { once: true })
      })()
