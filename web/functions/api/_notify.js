// 通知中心（与我相关）
//
// 谁给我的作品送了光尘、谁评论了我、谁关注了我，都进这里。
// KV 无列表结构，每个收件人一个键存最近 N 条（读-改-写）。
// 通知是低频行为，且偶发并发丢一条远好过引入复杂分块，故用单键数组。
//
//   ntf:<uid>  = [{ id, type, text, at, read, work?, from? }]
//
// type: like（收到光尘）/ comment（评论）/ follow（新粉丝）

const KEY = (uid) => 'ntf:' + uid
const MAX = 30

const TYPES = { like: 1, comment: 1, follow: 1 }

async function readAll(kv, uid) {
  try {
    const raw = await kv.get(KEY(uid))
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    return []
  }
}

/**
 * 投递一条通知。调用方负责判断「该不该通知」
 * （自己给自己的行为不发、封禁账号不发）。本函数吞掉异常，
 * 通知失败绝不能影响点赞/评论/关注主流程。
 */
export async function pushNotify(kv, toUid, n) {
  try {
    const to = String(toUid || '')
    if (!to || !/^[A-Za-z0-9_-]{1,40}$/.test(to)) return false
    const type = TYPES[n && n.type] ? n.type : 'like'
    const list = await readAll(kv, to)
    list.unshift({
      id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type,
      text: String((n && n.text) || '').slice(0, 120),
      at: Date.now(),
      read: false,
      work: Number(n && n.work) || 0,
      from: String((n && n.from) || '').slice(0, 40),
    })
    await kv.put(KEY(to), JSON.stringify(list.slice(0, MAX)))
    return true
  } catch (e) {
    return false
  }
}

export async function listNotify(kv, uid) {
  const items = await readAll(kv, uid)
  return {
    items: items.slice(0, MAX),
    unread: items.reduce((s, n) => s + (n.read ? 0 : 1), 0),
  }
}

/** 全部标记已读 */
export async function markAllRead(kv, uid) {
  const list = await readAll(kv, uid)
  if (!list.some((n) => !n.read)) return 0
  let n = 0
  for (const it of list) {
    if (!it.read) { it.read = true; n++ }
  }
  await kv.put(KEY(uid), JSON.stringify(list.slice(0, MAX)))
  return n
}
