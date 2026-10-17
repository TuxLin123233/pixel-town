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
        { key: 'prompt', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 4h16v2H4zm0 14h16v2H4zM2 6h2v12H2zm18 0h2v12h-2zM8 9h2v6H8z"/> <path d="M6 11h6v2H6zm8-2h2v2h-2zm2 4h2v2h-2z"/> </svg>', label: '题目模式', desc: '按主题出题创作，顶部有换题按钮' },
        { key: 'anim', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 4h16v2H4zm0 14h16v2H4zM2 6h2v12H2zm18 0h2v12h-2zM8 9h2v6H8z"/> <path d="M6 11h6v2H6zm8-2h2v2h-2zm2 4h2v2h-2z"/> </svg>', label: '帧动画', desc: '逐帧作画并导出循环 GIF' },
        { key: 'daily', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M5 4h14v2H5zm0 16h14v2H5zM3 10h2v10H3zm0-4h2v2H3zm16 0h2v2h-2zm0 4h2v10h-2zM3 8h18v2H3zm12-6h2v2h-2zM7 2h2v2H7z"/> </svg>', label: '每日挑战', desc: '每天一个题目，作品进当日榜' },
        { key: 'contest', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/> </svg>', label: '本周主题比赛', desc: '每周一个主题，社区投票选最佳' },
        { key: 'image', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z"/> <path d="M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z"/> </svg>', label: '像素相机', desc: '把照片变成像素画再继续手改' },
        { key: 'mirror', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/> <path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/> </svg>', label: '镜像绘制', desc: '落笔自动左右对称' },
  { key: 'drafts', ico: '', label: '多草稿槽', desc: '同时保存 3 幅草稿，随时切换' },
  { key: 'tags', ico: '', label: '作品标签', desc: '给作品加标签，方便别人搜到' },
      ]

/** 10 行 */
export const LAYOUTS = [
  { key: 'size', ico: '', label: '画布尺寸栏', desc: '切换 16/32/64 的按钮' },
  { key: 'tools', ico: '', label: '工具栏', desc: '画笔、橡皮、颜料桶等' },
  { key: 'history', ico: '', label: '我的绘画历史', desc: '画板下方的历史作品区' },
        { key: 'join', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M16 17H13V19H15V21H9V19H11V17H8V15H16V17ZM18 5H22V11H20V7H18V11H20V13H18V15H16V5H8V15H6V13H4V11H6V7H4V11H2V5H6V3H18V5Z"/> </svg>', label: '参赛卡片', desc: '每日挑战 / 本周主题的勾选卡' },
        { key: 'name', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16H6V18H8V20H10V22H2V14H4V16ZM12 20H10V18H12V20ZM14 18H12V16H14V18ZM10 16H8V14H10V16ZM16 16H14V14H16V16ZM6 14H4V12H6V14ZM12 14H10V12H12V14ZM18 14H16V12H18V14ZM8 12H6V10H8V12ZM14 12H12V10H14V12ZM20 12H18V10H20V12ZM10 10H8V8H10V10ZM18 10H16V8H18V10ZM22 10H20V8H22V10ZM12 8H10V6H12V8ZM16 8H14V6H16V8ZM20 8H18V6H20V8ZM14 6H12V4H14V6ZM18 6H16V4H18V6ZM16 4H14V2H16V4Z"/></svg>', label: '作品名与作者名', desc: '上传前的两个输入框' },
  { key: 'actions', ico: '', label: '操作按钮', desc: '撤销、清空、导出、上传' },
  { key: 'hint', ico: '', label: '操作提示', desc: '画布下方那行说明文字' },
  { key: 'disclaimer', ico: '', label: '使用须知与版权', desc: '底部说明与赞赏支持' },
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
        { path: '/paint', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M7 2h10v2H7zM5 4h2v10H5zm12-2h2v12h-2z"/> <path d="M13 2h2v6h-2zM9 2h2v4H9zm-4 8h14v2H5zm2 4h10v2H7zm2 2h2v4H9zm4 0h2v4h-2zm-4 4h6v2H9z"/> </svg>', name: '画板' },
  { path: '/gallery', ico: '', name: '社区' },
        { path: '/town', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 20h16v2H4zm16-10h2v10h-2zM2 10h2v10H2zm2-2h2v2H4zm2-2h2v2H6zm2-2h2v2H8zm2-2h4v2h-4zm4 2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zM8 14h2v6H8zm2-2h4v2h-4zm4 2h2v6h-2z"/> </svg>', name: '小镇' },
        { path: '/stats', ico: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM7 11h2v6H7zm4-4h2v10h-2zm4 6h2v4h-2z"/> </svg>', name: '数据' },
  { path: '/mine', ico: '', name: '我的' },
      ]
