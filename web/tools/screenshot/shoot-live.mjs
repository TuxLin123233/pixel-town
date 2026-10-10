// 从**线上站点**渲染宣传图用的手机截图（真实作品），与 shoot.sh 的分工：
//
//   shoot.sh        → 打本地 mock 服务器，用假数据渲染（不需要网络、内容可控）
//   shoot-live.mjs  → 打线上站点，用真实作品渲染（发帖/宣传用这个）
//
// 线上没有 mock 的 /__boot 注入页，所以同意 cookie、画板草稿这些
// 都得自己用 CDP 写进 localStorage —— 这也是这里不用 chromium 命令行截图的原因。
//
// 用法：
//   node web/tools/screenshot/shoot-live.mjs                     # 默认打主站，截 6 个公开页面
//   node web/tools/screenshot/shoot-live.mjs https://xxx pages... # 换站点 / 换页面
//
// 说明：只截「不登录也好看」的页面。我的 / 画头像要登录，用 shoot.sh 那套本地渲染。
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '../../..')
const OUT = path.join(REPO, 'ui-shots')

const BASE = process.argv[2] && process.argv[2].startsWith('http') ? process.argv[2] : 'https://art.xgcc.fun'
const argPages = process.argv.slice(2).filter((a) => a.includes(':') && !a.startsWith('http'))

// 默认 6 个公开页面（uid 是从线上真实数据里挑的：家具最多的小屋 / 作品最多的画师）
const DEFAULT_PAGES = [
  'paint:/paint',
  'gallery:/gallery',
  'town:/town',
  'home:/town/home?uid=uaaf66bff4fcb65da',   // 作者大大，10 件家具
  'user:/u?uid=ud47106081ca432f1',           // Alpha-Robot，5 件作品
  'changelog:/changelog',
]
const PAGES = (argPages.length ? argPages : DEFAULT_PAGES).map((p) => {
  const i = p.indexOf(':')
  return { name: p.slice(0, i), route: p.slice(i + 1) }
})

fs.mkdirSync(OUT, { recursive: true })

const PORT = 9200 + Math.floor(Math.random() * 700)
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lw-live-'))
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run',
  '--disable-dev-shm-usage', '--hide-scrollbars', '--mute-audio',
  '--window-size=390,844', '--user-data-dir=' + profile,
  '--remote-debugging-port=' + PORT, 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitVersion() {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      if (r.ok) return await r.json()
    } catch (e) {}
    await sleep(150)
  }
  throw new Error('chromium 未能启动')
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = []
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data)
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id)
        this.pending.delete(m.id)
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)
      } else if (m.method) this.handlers.forEach((h) => h(m))
    })
  }
  send(method, params = {}) {
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }
  on(fn) { this.handlers.push(fn) }
}

/** 读 PNG 尺寸（IHDR 固定在第 16 字节起，大端） */
function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
}

let failed = 0
try {
  await waitVersion()
  const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
  const cdp = new CDP(ws)
  const pageErrors = []
  cdp.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') {
      const d = m.params.exceptionDetails
      pageErrors.push((d.exception && (d.exception.description || d.exception.value)) || d.text)
    }
  })
  await cdp.send('Runtime.enable')
  await cdp.send('Page.enable')
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true })

  // 先在源上写一次状态：同意画板提示、关掉「装到桌面」横幅、塞一张画板草稿
  async function seed() {
    const draft = JSON.stringify({
      size: 16,
      // 16×16 的爱心（和 mock 那套同一张图），塞进去 /paint 才直接进编辑器
      pixels: (() => {
        const rows = ['..rr....rr..', '.rRRr..rRRr.', 'rRRRRrrRRRRr', 'rRRRRRRRRRRr', 'rRRRRRRRRRRr',
          '.rRRRRRRRRr.', '..rRRRRRRr..', '...rRRRRr...', '....rRRr....', '.....rr.....']
        const PAL = { r: [229, 87, 75], R: [180, 52, 44], '.': [255, 255, 255] }
        const out = []
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
          const ch = rows[Math.floor(y * rows.length / 16)][Math.floor(x * rows[0].length / 16)]
          out.push(PAL[ch] || [255, 255, 255])
        }
        return out
      })(),
    })
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        document.cookie = 'paint_consent=1; path=/; max-age=86400';
        try {
          localStorage.setItem('lw-pwa-hint-dismissed', '1');
          localStorage.setItem('paintDraft', ${JSON.stringify(draft)});
        } catch (e) {}
        return document.cookie;
      })()`,
      returnByValue: true,
    })
  }

  await cdp.send('Page.navigate', { url: BASE + '/' })
  await sleep(2500)
  await seed()

  for (const { name, route } of PAGES) {
    pageErrors.length = 0
    await cdp.send('Page.navigate', { url: BASE + route })
    // 页面内容是 XHR 回来后才渲染的，等它稳定下来
    await sleep(4000)
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' })
    const buf = Buffer.from(shot.data, 'base64')
    const { w, h } = pngSize(buf)
    const file = path.join(OUT, `${name}-手机.png`)
    fs.writeFileSync(file, buf)
    const ok = w === 1170 && h === 2532
    if (!ok || pageErrors.length) failed++
    console.log(`  ${ok && !pageErrors.length ? '✓' : '✗'} ${name.padEnd(10)} ${w}×${h}  ${(buf.length / 1024).toFixed(0)} KB` +
      (pageErrors.length ? '  报错: ' + pageErrors[0].split('\n')[0].slice(0, 80) : ''))
  }
  ws.close()
} finally {
  chrome.kill('SIGKILL')
}

console.log(failed ? `\n${failed} 个页面有问题` : `\n截图已就绪 → ${OUT}`)
process.exit(failed ? 1 : 0)
