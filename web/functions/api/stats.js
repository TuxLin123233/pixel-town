import { readAllHistory } from './_history.js'
import { contestInfo } from './_contest.js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const TZ8 = 8 * 3600 * 1000
const DAY_MS = 86400000

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=300' },
  })

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

// KV 的 list 一次最多返回 1000 个 key，要翻页才能数全
async function listAllKeys(kv, prefix) {
  let cursor
  const names = []
  do {
    const page = await kv.list({ prefix, cursor, limit: 1000 })
    for (const k of page.keys) names.push(k.name)
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  return names
}

export async function onRequestGet(context) {
  const { env } = context
  if (!env.LIGHTFIELD_KV) return json({ error: 'LIGHTFIELD_KV is not configured' }, 500)

  const kv = env.LIGHTFIELD_KV
  const now = Date.now()

  try {
    const { entries } = await readAllHistory(kv)
    const totalWorks = entries.length
    const totalLikes = entries.reduce((s, e) => s + (Number(e.likes) || 0), 0)
    const totalPixels = entries.reduce(
      (s, e) => s + (Array.isArray(e.pixels) ? e.pixels.length : 0),
      0
    )

    // 真实注册账号数：acc:<uid> 一个账号一个 key（不再拿署名凑数）
    const totalUsers = (await listAllKeys(kv, 'acc:')).length

    // 评论总数：评论按 cmt:<作品时间> 分 key 存，数 key 后把每条列表长度加起来
    let totalComments = 0
    const cmtNames = await listAllKeys(kv, 'cmt:')
    for (const name of cmtNames) {
      const raw = await kv.get(name)
      if (!raw) continue
      try {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) totalComments += arr.length
      } catch {}
    }

    // —— 创作者：按账号 uid 聚合，改名也不拆开；老作品没有 uid 才退回署名 ——
    const creators = {}
    const uidSet = new Set()
    entries.forEach((e) => {
      if (!e) return
      const uid = e.ownerUser ? String(e.ownerUser) : ''
      const key = uid ? 'u:' + uid : 'n:' + String(e.author || '匿名').toLowerCase()
      if (uid) uidSet.add(uid)
      if (!creators[key]) {
        creators[key] = { author: e.ownerName || e.author || '匿名', works: 0, likes: 0 }
      }
      creators[key].works++
      creators[key].likes += Number(e.likes) || 0
    })
    const topCreators = Object.values(creators)
      .sort((a, b) => b.likes - a.likes || b.works - a.works)
      .slice(0, 10)

    const topWorks = entries
      .slice()
      .sort((a, b) => (Number(b.likes) || 0) - (Number(a.likes) || 0))
      .slice(0, 10)
      .map((e) => ({
        time: e.time,
        name: e.workName || e.name || '未命名',
        author: e.ownerName || e.author || '匿名',
        likes: Number(e.likes) || 0,
      }))

    // —— 画布尺寸分布 ——
    const sizeCounts = { '16×16': 0, '32×32': 0, '64×64': 0 }
    entries.forEach((e) => {
      const size = Number(e && e.size) || 16
      const key = `${size}×${size}`
      sizeCounts[key] = (sizeCounts[key] || 0) + 1
    })
    const sizeDistribution = Object.entries(sizeCounts)
      .map(([size, count]) => ({
        size,
        count,
        percent: totalWorks ? Math.round((count / totalWorks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    // —— 创作方式：动画先看 type，其余看 method（老数据缺省当逐格上色）——
    const METHOD_LABEL = {
      pixel: '逐格上色',
      spray: '喷漆涂鸦',
      gravity: '重力撒沙',
      anim: '帧动画',
    }
    const methodCounts = { pixel: 0, spray: 0, gravity: 0, anim: 0 }
    let animWorks = 0
    let cameraWorks = 0
    let zeroLikeWorks = 0
    const tagCounts = {}
    const hourBuckets = { 深夜: 0, 上午: 0, 下午: 0, 晚上: 0 }

    entries.forEach((e) => {
      if (!e) return
      const m = e.type === 'anim' ? 'anim' : e.method === 'spray' || e.method === 'gravity' ? e.method : 'pixel'
      methodCounts[m] = (methodCounts[m] || 0) + 1
      if (m === 'anim') animWorks++
      if (e.fromImage) cameraWorks++
      if (!(Number(e.likes) > 0)) zeroLikeWorks++
      if (Array.isArray(e.tags)) {
        for (const t of e.tags) tagCounts[t] = (tagCounts[t] || 0) + 1
      }
      const hour = new Date((Number(e.time) || 0) + TZ8).getUTCHours()
      const bucket = hour < 6 ? '深夜' : hour < 12 ? '上午' : hour < 18 ? '下午' : '晚上'
      hourBuckets[bucket]++
    })

    const methodDistribution = Object.entries(methodCounts)
      .map(([key, count]) => ({
        key,
        label: METHOD_LABEL[key] || key,
        count,
        percent: totalWorks ? Math.round((count / totalWorks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    const topTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    const busiestTime = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0]

    // —— 近 14 天创作趋势（东八区按天）——
    const todayD = Math.floor((now + TZ8) / DAY_MS)
    const dayCounts = new Array(14).fill(0)
    entries.forEach((e) => {
      const d = Math.floor(((Number(e.time) || 0) + TZ8) / DAY_MS)
      const idx = todayD - d
      if (idx >= 0 && idx < 14) dayCounts[idx]++
    })
    const trend = dayCounts.map((count, i) => {
      const date = new Date((todayD - (13 - i)) * DAY_MS - TZ8 + 12 * 3600 * 1000)
      return {
        label: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
        count,
      }
    })
    const recent7 = dayCounts.slice(7).reduce((a, b) => a + b, 0)
    const prev7 = dayCounts.slice(0, 7).reduce((a, b) => a + b, 0)
    const trendMax = Math.max(1, ...dayCounts)

    // —— 小镇年龄：从最早一幅作品算起 ——
    const times = entries.map((e) => Number(e.time) || 0).filter(Boolean)
    const firstTime = times.length ? Math.min(...times) : 0
    const townDays = firstTime ? Math.max(1, Math.round((now - firstTime) / DAY_MS)) : 0

    // —— 本周主题比赛 ——
    const cinfo = contestInfo(now)
    const contestWorks = entries.filter((e) => e && e.contest === cinfo.week)
    const contestVotes = contestWorks.reduce((s, e) => s + (Number(e.contestVotes) || 0), 0)
    const contestTop = contestWorks
      .slice()
      .sort((a, b) => (Number(b.contestVotes) || 0) - (Number(a.contestVotes) || 0))
      .slice(0, 5)
      .map((e) => ({
        time: e.time,
        name: e.workName || e.name || '未命名',
        author: e.ownerName || e.author || '匿名',
        votes: Number(e.contestVotes) || 0,
      }))

    return json({
      ok: true,
      stats: {
        // 总览
        totalUsers,
        totalWorks,
        totalLikes,
        totalComments,
        totalPixels,
        creatorCount: uidSet.size,
        // 冷知识
        animWorks,
        cameraWorks,
        zeroLikeWorks,
        townDays,
        avgLikes: totalWorks ? Math.round((totalLikes / totalWorks) * 10) / 10 : 0,
        busiestTime: busiestTime ? busiestTime[0] : '—',
        // 趋势
        trend,
        trendMax,
        recent7,
        prev7,
        // 榜单
        topWorks,
        topCreators,
        // 分布
        methodDistribution,
        sizeDistribution,
        topTags,
        // 本周主题赛
        contest: {
          week: cinfo.week,
          theme: cinfo.theme.zh,
          prompt: cinfo.theme.prompt,
          joined: contestWorks.length,
          votes: contestVotes,
          top: contestTop,
        },
      },
    })
  } catch (e) {
    console.error('Stats API error:', e)
    return json({ error: 'Failed to load stats' }, 500)
  }
}
