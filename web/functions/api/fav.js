import { checkOrigin } from './_origin.js'
import { readActiveUser, BANNED_ERROR } from './_auth.js'
import { listFavs, toggleFav, FAV_MAX } from './_fav.js'

// 收藏：
//   GET                 我收藏的作品时间戳列表
//   POST {time}         切换收藏（已藏则取消）

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestGet(context) {
  const { request, env } = context
  if (!env.LIGHTFIELD_KV) return json({ error: 'LIGHTFIELD_KV is not configured' }, 500)
  const who = await readActiveUser(env, '', request.headers.get('authorization'))
  if (!who) return json({ error: '未登录', code: 'noauth' }, 401)
  if (who.banned) return json(BANNED_ERROR, 403)
  if (who.gone) return json({ error: '账号不存在', code: 'gone' }, 401)
  const r = await listFavs(env.LIGHTFIELD_KV, who.uid)
  return json({ ok: true, times: r.times, total: r.total, max: FAV_MAX })
}

export async function onRequestPost(context) {
  const { request, env } = context
  {
    const g = checkOrigin(request)
    if (!g.ok) return json(g.body, g.status)
  }
  if (!env.LIGHTFIELD_KV) return json({ error: 'LIGHTFIELD_KV is not configured' }, 500)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const who = await readActiveUser(env, '', request.headers.get('authorization'))
  if (!who) return json({ error: '未登录', code: 'noauth' }, 401)
  if (who.banned) return json(BANNED_ERROR, 403)
  if (who.gone) return json({ error: '账号不存在', code: 'gone' }, 401)

  const r = await toggleFav(env.LIGHTFIELD_KV, who.uid, body && body.time)
  if (!r.ok) return json({ error: '作品时间戳不对' }, 400)
  return json({ ok: true, fav: r.fav, total: r.total })
}
