// 作品收藏
//
//   fav:<uid> = { times: number[] }   收藏的作品时间戳，新收藏在前
//
// 只存时间戳：作品内容一律从历史里按时间戳取（/api/get?minetimes=...），
// 作品被作者删除后收藏夹里自然就取不到，不会存到一份删不掉的副本。

const KEY = (uid) => 'fav:' + uid
export const FAV_MAX = 200

async function readTimes(kv, uid) {
  try {
    const raw = await kv.get(KEY(uid))
    if (!raw) return []
    const o = JSON.parse(raw)
    const arr = o && Array.isArray(o.times) ? o.times : []
    return arr.map(Number).filter((t) => t > 0)
  } catch (e) {
    return []
  }
}

export async function listFavs(kv, uid) {
  const times = await readTimes(kv, uid)
  return { times, total: times.length }
}

/** 切换收藏；返回 {fav:true/false, total}。fav=false 表示已取消 */
export async function toggleFav(kv, uid, time) {
  const t = Number(time)
  if (!Number.isFinite(t) || t <= 0) return { ok: false, reason: 'bad_time' }
  let times = await readTimes(kv, uid)
  const idx = times.indexOf(t)
  let fav
  if (idx >= 0) {
    times.splice(idx, 1)
    fav = false
  } else {
    times.unshift(t)
    if (times.length > FAV_MAX) times = times.slice(0, FAV_MAX)
    fav = true
  }
  await kv.put(KEY(uid), JSON.stringify({ times }))
  return { ok: true, fav, total: times.length }
}
