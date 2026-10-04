// 邀请码与邀请奖励
//
// 数据落法（Cloudflare KV，没有数据库唯一键/事务，靠「字段只写一次」做幂等）：
//   inv:<CODE>          邀请码 → 邀请人 uid（码是随机的，不可枚举）
//   ivs:<uid>           邀请人的战绩：{ count, rewarded, earned }
//   user.inviteCode     这个人自己的邀请码（生成一次不再变）
//   user.invitedBy      是谁邀请来的（uid）—— 一旦写上永不修改，也没有解绑接口
//   user.invitedAt      绑定时间
//   user.inviteRewardedAt 邀请人是否已因「我发第一幅作品」拿到奖励（阶段二幂等闸）
//
// 两段奖励：
//   ① 新人填码绑定：新人立刻得 INVITEE_REWARD（20）
//   ② 新人发布第一幅作品：邀请人得 INVITER_REWARD（100），每人只触发一次
// 阶段二要等「真的发了作品」才给钱，增加批量注册号刷奖励的成本。

import { readUser, writeUser } from './_auth.js'
import { creditDust } from './_dust.js'

/** 新人填码到账的见面礼 */
export const INVITEE_REWARD = 20
/** 好友发出第一幅作品后，邀请人拿到的巨额奖励 */
export const INVITER_REWARD = 100
/** 一个邀请人最多吃多少份「首作奖励」，防小号农场刷爆经济 */
export const INVITER_CAP = 50

const CODE_LEN = 7
// 去掉易混字符 0/O、1/I/L
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

const codeKey = (code) => 'inv:' + code
const statKey = (uid) => 'ivs:' + uid

function rndCode() {
  let s = ''
  const buf = new Uint8Array(CODE_LEN)
  crypto.getRandomValues(buf)
  for (const b of buf) s += CHARS[b % CHARS.length]
  return s
}

export function normalizeCode(raw) {
  return String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_LEN)
}

async function resolveInviterUid(kv, code) {
  const c = normalizeCode(code)
  if (c.length !== CODE_LEN) return ''
  return (await kv.get(codeKey(c))) || ''
}

/** 注册前校验邀请码：码必须存在、邀请人还在、不能是自己。不做任何写入。 */
export async function validateCode(kv, rawCode, selfUid) {
  const code = normalizeCode(rawCode)
  if (code.length !== CODE_LEN) return { ok: false, message: '邀请码格式不对，应该是 7 位字符' }
  const inviterUid = await kv.get(codeKey(code))
  if (!inviterUid) return { ok: false, message: '邀请码无效，没有找到对应的居民' }
  if (selfUid && inviterUid === String(selfUid)) {
    return { ok: false, message: '不能填写自己的邀请码' }
  }
  const inviter = await readUser(kv, inviterUid)
  if (!inviter) return { ok: false, message: '邀请码无效，没有找到对应的居民' }
  return { ok: true, code, inviterUid }
}

async function readStat(kv, uid) {
  const empty = { count: 0, rewarded: 0, earned: 0 }
  try {
    const raw = await kv.get(statKey(uid))
    if (!raw) return empty
    const o = JSON.parse(raw)
    return {
      count: Math.max(0, Number(o.count) || 0),
      rewarded: Math.max(0, Number(o.rewarded) || 0),
      earned: Math.max(0, Number(o.earned) || 0),
    }
  } catch {
    return empty
  }
}

async function writeStat(kv, uid, stat) {
  await kv.put(statKey(uid), JSON.stringify(stat))
}

/** 取（必要时生成）自己的邀请码 */
export async function ensureInviteCode(kv, user) {
  const existing = normalizeCode(user.inviteCode)
  if (existing.length === CODE_LEN && (await kv.get(codeKey(existing))) === user.uid) {
    return existing
  }
  // 随机码 + 撞码重试，直到拿到没被占用的
  for (let i = 0; i < 8; i++) {
    const code = rndCode()
    const taken = await kv.get(codeKey(code))
    if (taken) continue
    await kv.put(codeKey(code), user.uid)
    user.inviteCode = code
    await writeUser(kv, user)
    return code
  }
  return ''
}

/**
 * 把新人绑定到邀请人。硬约束：
 *   - 已经绑过（user.invitedBy 有值）一律拒绝，没有改绑入口
 *   - 码无效 / 邀请人已注销 / 邀请自己 一律拒绝
 * 绑定成功后立刻给新人发见面礼。
 * user 必须是刚从 KV 读出的完整记录，本函数会写回它。
 */
export async function bindByCode(kv, user, rawCode) {
  if (user.invitedBy) return { ok: false, reason: 'bound', message: '你已经绑定过邀请人了，不能更改' }

  const check = await validateCode(kv, rawCode, user.uid)
  if (!check.ok) return { ok: false, reason: 'badcode', message: check.message }

  // 先把不可变关系落库，再发钱：极端情况下发钱失败，顶多新人少拿一次奖励，
  // 绝不会出现「关系没写成却发了钱」或「同一人被反复发见面礼」。
  user.invitedBy = check.inviterUid
  user.invitedAt = Date.now()
  await writeUser(kv, user)

  try {
    await creditDust(kv, user.uid, INVITEE_REWARD, '邀请见面礼')
  } catch (e) {}

  // 邀请人战绩：多了一位已绑定的好友
  try {
    const stat = await readStat(kv, check.inviterUid)
    stat.count += 1
    await writeStat(kv, check.inviterUid, stat)
  } catch (e) {}

  return { ok: true, inviterUid: check.inviterUid, code: check.code, reward: INVITEE_REWARD }
}

/**
 * 阶段二：新人发布第一幅作品后，给邀请人发巨额奖励。
 * 用 user.inviteRewardedAt 当一次性闸门 —— 有值就直接返回，绝不重复发。
 * 在 set.js 发布成功后调用；本函数自己吞掉 KV 异常，不影响发布主流程。
 */
export async function rewardInviterFirstWork(kv, user) {
  if (!user || !user.uid) return { ok: false, reason: 'nouser' }
  if (user.inviteRewardedAt) return { ok: false, reason: 'already' }
  const inviterUid = user.invitedBy ? String(user.invitedBy) : ''
  if (!inviterUid) return { ok: false, reason: 'noinviter' }

  const stat = await readStat(kv, inviterUid)
  const capped = stat.rewarded >= INVITER_CAP

  // 先写一次性标记。宁可邀请人在 KV 故障时少拿一次，也不能重复发钱。
  user.inviteRewardedAt = Date.now()
  await writeUser(kv, user)

  let amount = 0
  const inviter = await readUser(kv, inviterUid)
  if (inviter && !capped) {
    amount = INVITER_REWARD
    try {
      await creditDust(kv, inviterUid, amount, '好友首作奖')
      stat.rewarded += 1
      stat.earned += amount
      await writeStat(kv, inviterUid, stat)
    } catch (e) {
      amount = 0
    }
  }
  return { ok: amount > 0, amount, capped }
}

export async function inviteView(kv, user) {
  const code = await ensureInviteCode(kv, user)
  const stat = await readStat(kv, user.uid)
  return {
    code,
    invitedBy: user.invitedBy || '',
    stat,
    rules: { invitee: INVITEE_REWARD, inviter: INVITER_REWARD, cap: INVITER_CAP },
  }
}
