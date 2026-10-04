import { checkOrigin } from './_origin.js'
import { readActiveUser, BANNED_ERROR } from './_auth.js'
import { bindByCode, inviteView } from './_invite.js'

// 邀请：
//   GET            我的邀请码、战绩、奖励规则、我是否已绑定邀请人
//   POST bind      老用户一次性补绑邀请码（绑定后不可更改）

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
  if (!who) return json({ error: '请先登录', code: 'noauth' }, 401)
  if (who.banned) return json(BANNED_ERROR, 403)
  if (who.gone) return json({ error: '账号不存在', code: 'gone' }, 401)

  const view = await inviteView(env.LIGHTFIELD_KV, who.user)
  return json({ ok: true, ...view })
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
  const action = String((body && body.action) || '')
  if (action !== 'bind') return json({ error: '未知操作' }, 400)

  const who = await readActiveUser(env, '', request.headers.get('authorization'))
  if (!who) return json({ error: '请先登录', code: 'noauth' }, 401)
  if (who.banned) return json(BANNED_ERROR, 403)
  if (who.gone) return json({ error: '账号不存在', code: 'gone' }, 401)

  const kv = env.LIGHTFIELD_KV
  const r = await bindByCode(kv, who.user, body && body.code)
  if (!r.ok) return json({ ok: false, error: r.message, code: r.reason }, 400)

  const view = await inviteView(kv, who.user)
  return json({ ok: true, bound: true, reward: r.reward, ...view })
}
