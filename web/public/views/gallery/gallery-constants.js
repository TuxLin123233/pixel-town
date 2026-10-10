/**
 * Gallery 视图的常量定义
 *
 * 由 views/gallery.js 的 mounted() 拆出（表达式原样搬移）。
 * 这些都是纯字面量、且全程只读：不依赖 DOM，也不依赖挂载时的运行时状态，
 * 所以放在模块级和放在 mounted() 里行为完全一致。
 * 主文件通过 import 引入：见 views/gallery.js 顶部。
 */

/** 1 行 */
export const HOLD_MS = 1500

/** 1 行 */
export const CMT_PAGE = 20

/** 1 行 */
export const EXTRA_DEFS = [['liked', '我赞过的'], ['mine', '我画的'], ['tagged', '带标签的']]

/** 1 行 */
export const SORT_DEFS = [['new', '最新'], ['hot', '最热'], ['dust', '最多光尘'], ['big', '大画优先']]

/** 1 行 */
export const RANGE_DEFS = [['', '全部'], ['day', '今天'], ['week', '本周'], ['month', '本月']]

/** 1 行 */
export const SIZE_DEFS = [['', '全部'], ['16', '16×16'], ['32', '32×32'], ['64', '64×64']]

/** 8 行 */
export const METHOD_DEFS = [
        ['', '全部', ''],
        ['pixel', '逐格', '一格一格涂的像素画'],
        ['spray', '喷漆', '喷枪喷出来的'],
        ['gravity', '重力', '让像素自己落下来'],
        ['anim', '动画', '多帧循环的'],
        ['image', '图片', '从图片转过来的'],
      ]

/** 1 行 */
export const PAGE = 24

/** 11 行 */
export const PX_STAR = [
        '....X....',
        '...XXX...',
        '..XXXXX..',
        'XXXXXXXXX',
        '.XX.XXX.X',
        '..XXXXX..',
        '...X.X...',
        '...X.X...',
        '..X...X..',
      ]

/** 10 行 */
export const PX_HEART = [
        '..XX..XX..',
        '.XXXXXXXX.',
        'XXXXXXXXXX',
        'XXXXXXXXXX',
        'XXXXXXXXXX',
        '.XXXXXXXX.',
        '..XXXXXX..',
        '...XXXX...',
      ]
