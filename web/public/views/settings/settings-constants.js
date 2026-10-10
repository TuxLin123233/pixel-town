/**
 * Settings 视图的常量定义
 *
 * 由 views/settings.js 的 mounted() 拆出（表达式原样搬移）。
 * 这些都是纯字面量、且全程只读：不依赖 DOM，也不依赖挂载时的运行时状态，
 * 所以放在模块级和放在 mounted() 里行为完全一致。
 * 主文件通过 import 引入：见 views/settings.js 顶部。
 */

/** 1 行 */
export const NAV_OP_KEY = 'lw-nav-op'

/** 1 行 */
export const GUIDE_KEY = 'lw-guide-seen'

/** 1 行 */
export const FOLD_KEY = 'lw-settings-fold'

/** 10 行 */
export const FEATURES = [
        { key: 'prompt', ico: '🎲', label: '题目模式', desc: '按主题出题创作，顶部有换题按钮' },
        { key: 'anim', ico: '🎞️', label: '帧动画', desc: '逐帧作画并导出循环 GIF' },
        { key: 'daily', ico: '📅', label: '每日挑战', desc: '每天一个题目，作品进当日榜' },
        { key: 'contest', ico: '🏆', label: '本周主题比赛', desc: '每周一个主题，社区投票选最佳' },
        { key: 'image', ico: '📷', label: '像素相机', desc: '把照片变成像素画再继续手改' },
        { key: 'mirror', ico: '🦋', label: '镜像绘制', desc: '落笔自动左右对称' },
        { key: 'drafts', ico: '📑', label: '多草稿槽', desc: '同时保存 3 幅草稿，随时切换' },
        { key: 'tags', ico: '🏷️', label: '作品标签', desc: '给作品加标签，方便别人搜到' },
      ]

/** 10 行 */
export const LAYOUTS = [
        { key: 'size', ico: '🔢', label: '画布尺寸栏', desc: '切换 16/32/64 的按钮' },
        { key: 'tools', ico: '🖌️', label: '工具栏', desc: '画笔、橡皮、颜料桶等' },
        { key: 'history', ico: '🗂️', label: '我的绘画历史', desc: '画板下方的历史作品区' },
        { key: 'join', ico: '🏆', label: '参赛卡片', desc: '每日挑战 / 本周主题的勾选卡' },
        { key: 'name', ico: '✏️', label: '作品名与作者名', desc: '上传前的两个输入框' },
        { key: 'actions', ico: '🎛️', label: '操作按钮', desc: '撤销、清空、导出、上传' },
        { key: 'hint', ico: '💡', label: '操作提示', desc: '画布下方那行说明文字' },
        { key: 'disclaimer', ico: '📜', label: '使用须知与版权', desc: '底部说明与赞赏支持' },
      ]

/** 1 行 */
export const NAV_ORDER_KEY = 'lw-nav-order'

/** 8 行 */
export const NAV_STYLES = [
        { v: 'glass', name: '玻璃' },
        { v: 'solid', name: '实心' },
        { v: 'outline', name: '描边' },
        { v: 'pill', name: '药丸' },
        { v: 'segmented', name: '分段' },
        { v: 'gradient', name: '渐变' },
      ]

/** 1 行 */
export const NAV_POS_KEY = 'lw-nav-pos'

/** 1 行 */
export const ENTRANCE_KEY = 'lw-entrance'

/** 7 行 */
export const NAV_ITEMS = [
        { path: '/paint', ico: '🎨', name: '画板' },
        { path: '/gallery', ico: '🌆', name: '社区' },
        { path: '/town', ico: '🏘️', name: '小镇' },
        { path: '/stats', ico: '📊', name: '数据' },
        { path: '/mine', ico: '🌱', name: '我的' },
      ]
