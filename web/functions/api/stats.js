import { readAllHistory } from './_history.js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=300' },
  })

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestGet(context) {
  const { env } = context
  if (!env.LIGHTFIELD_KV) return json({ error: 'LIGHTFIELD_KV is not configured' }, 500)

  const kv = env.LIGHTFIELD_KV

  try {
    // 从分块存储读取所有作品
    const { entries } = await readAllHistory(kv)

    // 总览数据
    const totalWorks = entries.length
    const totalLikes = entries.reduce((sum, e) => sum + (Number(e.likes) || 0), 0)

    // 从作品中提取唯一作者
    const authorSet = new Set()
    entries.forEach((e) => {
      if (e && e.author) authorSet.add(String(e.author).toLowerCase())
    })
    const totalUsers = authorSet.size

    // 访问量估算（作品数 × 10）
    const totalViews = totalWorks * 10

    // 最受欢迎作品 Top 10
    const topWorks = entries
      .filter((e) => e && e.author)
      .sort((a, b) => (Number(b.likes) || 0) - (Number(a.likes) || 0))
      .slice(0, 10)
      .map((e) => ({
        time: e.time,
        name: e.name || '未命名',
        author: e.author || '未知',
        likes: Number(e.likes) || 0,
      }))

    // 活跃创作者 Top 10（按作品数和点赞数综合排序）
    const creatorStats = {}
    entries.forEach((e) => {
      if (!e || !e.author) return
      const authorKey = String(e.author).toLowerCase()
      if (!creatorStats[authorKey]) {
        creatorStats[authorKey] = { author: e.author, works: 0, likes: 0 }
      }
      creatorStats[authorKey].works++
      creatorStats[authorKey].likes += Number(e.likes) || 0
    })

    const topCreators = Object.values(creatorStats)
      .sort((a, b) => b.likes - a.likes || b.works - a.works)
      .slice(0, 10)
      .map((c) => ({
        author: c.author,
        works: c.works,
        likes: c.likes,
      }))

    // 画布尺寸分布
    const sizeCounts = { '16×16': 0, '32×32': 0, '64×64': 0 }
    entries.forEach((e) => {
      if (!e) return
      const size = Number(e.size) || 16
      const key = `${size}×${size}`
      sizeCounts[key] = (sizeCounts[key] || 0) + 1
    })

    const sizeDistribution = Object.entries(sizeCounts)
      .map(([size, count]) => ({
        size,
        count,
        percent: totalWorks > 0 ? Math.round((count / totalWorks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return json({
      ok: true,
      stats: {
        totalUsers,
        totalWorks,
        totalLikes,
        totalViews,
        topWorks,
        topCreators,
        sizeDistribution,
      },
    })
  } catch (e) {
    console.error('Stats API error:', e)
    return json({ error: 'Failed to load stats' }, 500)
  }
}
