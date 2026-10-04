// 数据统计：展示网站所有数据
export default {
  name: 'stats',
  title: '数据统计',
  css: `
      [hidden] { display: none !important; }

      :root {
        --bg: #faf5ef;
        --surface: #ffffff;
        --surface-2: #efe9e0;
        --surface-3: #f0ece4;
        --text: #3b342c;
        --text-muted: #6b5f50;
        --text-faint: #b0a697;
        --border: #efe7da;
        --border-strong: #e0d3c0;
        --shadow: rgba(80, 60, 40, 0.08);
        --accent: #5b8def;
      }
      [data-mood="dark"] {
        --bg: #181512;
        --surface: #262220;
        --surface-2: #332e29;
        --surface-3: #322c25;
        --text: #ece5da;
        --text-muted: #b8ac9b;
        --text-faint: #7d7266;
        --border: #3a342f;
        --border-strong: #4a433c;
        --shadow: rgba(0, 0, 0, 0.4);
        --accent: #6f9fff;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        padding: 24px 16px 116px;
        transition: background 0.25s ease, color 0.25s ease;
      }

      .container { width: 100%; max-width: 560px; margin: 0 auto; }
      .stats-wrap { width: 100%; }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 14px;
    }
    .stat-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 12px;
    }

    /* 总览数字 */
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .overview-item {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 12px;
      text-align: center;
    }
    .overview-num {
      font-size: 28px;
      font-weight: 800;
      color: var(--accent);
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
    }
    .overview-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* 排行榜 */
    .rank-list { display: flex; flex-direction: column; gap: 10px; }
    .rank-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 12px;
    }
    .rank-no {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex: none;
    }
    .rank-no.silver { background: #a8a8a8; }
    .rank-no.bronze { background: #cd7f32; }
    .rank-no.normal { background: var(--surface-3); color: var(--text-muted); }
    .rank-info { flex: 1; min-width: 0; }
    .rank-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rank-meta {
      font-size: 11px;
      color: var(--text-faint);
      margin-top: 2px;
    }
    .rank-value {
      font-size: 15px;
      font-weight: 700;
      color: var(--accent);
      flex: none;
    }

    /* 条形图 */
    .chart-bars { display: flex; flex-direction: column; gap: 10px; }
    .chart-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chart-label {
      width: 80px;
      font-size: 12px;
      color: var(--text-muted);
      flex: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chart-bar-wrap {
      flex: 1;
      height: 24px;
      background: var(--surface-2);
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }
    .chart-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, white) 100%);
      border-radius: 6px;
      transition: width 0.6s ease;
    }
    .chart-value {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 11px;
      font-weight: 600;
      color: var(--text);
    }

    /* 加载状态 */
    .stat-loading {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      font-size: 13px;
    }

    /* 错误状态 */
    .stat-error {
      text-align: center;
      padding: 40px 20px;
    }
    .stat-error-ico {
      font-size: 40px;
      margin-bottom: 12px;
    }
    .stat-error-msg {
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .stat-retry {
      padding: 10px 24px;
      border-radius: 999px;
      border: 1px solid var(--border-strong);
      background: var(--surface-2);
      color: var(--text);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .stat-retry:active { transform: scale(0.96); }

    /* 冷知識格 */
    .fact-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .fact-item {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
    }
    .fact-num {
      font-size: 20px;
      font-weight: 800;
      color: var(--text);
      font-variant-numeric: tabular-nums;
      line-height: 1.2;
    }
    .fact-num small { font-size: 12px; font-weight: 600; color: var(--text-muted); }
    .fact-label {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 3px;
    }

    /* 主题比赛 */
    .contest-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
    }
    .contest-theme { font-size: 16px; font-weight: 800; color: var(--accent); }
    .contest-week { font-size: 11px; color: var(--text-faint); }
    .contest-prompt { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
    .contest-sum { display: flex; gap: 16px; font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
    .contest-sum b { color: var(--text); font-size: 15px; margin-right: 3px; }

    /* 趋势柱图 */
    .trend-bars {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 96px;
      padding-top: 8px;
    }
    .trend-col {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
      height: 100%;
    }
    .trend-bar {
      width: 100%;
      max-width: 18px;
      background: linear-gradient(180deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 55%, white) 100%);
      border-radius: 4px 4px 0 0;
      min-height: 2px;
      transition: height 0.6s ease;
    }
    .trend-bar.is-today { background: linear-gradient(180deg, #ff8a5b 0%, #ffb27a 100%); }
    .trend-x {
      width: 100%;
      text-align: center;
      font-size: 8px;
      color: var(--text-faint);
      transform: scale(0.9);
      white-space: nowrap;
    }
    .trend-note { font-size: 11px; color: var(--text-muted); margin-top: 8px; }

    /* 标签云 */
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 11px;
      border-radius: 999px;
      background: var(--surface-2);
      border: 1px solid var(--border-strong);
      font-size: 12px;
      color: var(--text);
    }
    .tag-chip .tag-n {
      font-size: 10px;
      font-weight: 700;
      color: var(--accent);
    }
    .tag-chip.hot { background: color-mix(in srgb, var(--accent) 14%, var(--surface)); }
  `,
  template: `
    <div class="container">
      <div class="stats-wrap">
        <div v-if="loading" class="stat-loading">加载中...</div>
        <div v-else-if="error" class="stat-error">
          <div class="stat-error-ico">😕</div>
          <div class="stat-error-msg">{{ error }}</div>
          <button class="stat-retry" @click="loadData">重试</button>
        </div>
        <template v-else>
          <!-- 总览 -->
          <div class="stat-card">
            <div class="stat-title">📊 总览</div>
            <div class="overview-grid">
              <div class="overview-item">
                <div class="overview-num">{{ stats.totalUsers }}</div>
                <div class="overview-label">居民</div>
              </div>
              <div class="overview-item">
                <div class="overview-num">{{ stats.totalWorks }}</div>
                <div class="overview-label">作品</div>
              </div>
              <div class="overview-item">
                <div class="overview-num">{{ stats.totalLikes }}</div>
                <div class="overview-label">点赞</div>
              </div>
              <div class="overview-item">
                <div class="overview-num">{{ stats.totalComments }}</div>
                <div class="overview-label">评论</div>
              </div>
            </div>
          </div>

          <!-- 小镇冷知识 -->
          <div class="stat-card">
            <div class="stat-title">🏷️ 小镇冷知识</div>
            <div class="fact-grid">
              <div class="fact-item">
                <div class="fact-num">{{ stats.totalPixels.toLocaleString() }} <small>格</small></div>
                <div class="fact-label">大家一共涂了多少像素</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.townDays }} <small>天</small></div>
                <div class="fact-label">从第一幅作品到现在</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.creatorCount }} <small>位</small></div>
                <div class="fact-label">真正动过笔的创作者</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.avgLikes }} <small>个</small></div>
                <div class="fact-label">平均每幅作品收获的赞</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.animWorks }} <small>幅</small></div>
                <div class="fact-label">会动的帧动画</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.cameraWorks }} <small>幅</small></div>
                <div class="fact-label">照片转像素画</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.zeroLikeWorks }} <small>幅</small></div>
                <div class="fact-label">还在等第一个赞</div>
              </div>
              <div class="fact-item">
                <div class="fact-num">{{ stats.busiestTime }}</div>
                <div class="fact-label">最高产的创作时段</div>
              </div>
            </div>
          </div>

          <!-- 近 14 天创作趋势 -->
          <div class="stat-card">
            <div class="stat-title">📈 近 14 天创作热度</div>
            <div class="trend-bars">
              <div v-for="(d, i) in stats.trend" :key="i" class="trend-col" :title="d.label + '：' + d.count + ' 幅'">
                <div
                  class="trend-bar"
                  :class="{ 'is-today': i === stats.trend.length - 1 }"
                  :style="{ height: Math.round((d.count / stats.trendMax) * 72) + 'px' }"
                ></div>
                <div class="trend-x">{{ d.label }}</div>
              </div>
            </div>
            <div class="trend-note">最近 7 天 {{ stats.recent7 }} 幅，上一个 7 天 {{ stats.prev7 }} 幅 —— 今天那根是橙色</div>
          </div>

          <!-- 本周主题比赛 -->
          <div class="stat-card">
            <div class="stat-title">🏆 本周主题赛</div>
            <div class="contest-head">
              <span class="contest-theme">{{ stats.contest.theme }}</span>
              <span class="contest-week">{{ stats.contest.week }}</span>
            </div>
            <div class="contest-prompt">{{ stats.contest.prompt }}</div>
            <div class="contest-sum">
              <span><b>{{ stats.contest.joined }}</b>幅参赛</span>
              <span><b>{{ stats.contest.votes }}</b>票投出</span>
            </div>
            <div v-if="stats.contest.top.length" class="rank-list">
              <div v-for="(w, i) in stats.contest.top" :key="w.time" class="rank-item">
                <div class="rank-no" :class="i === 0 ? '' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal'">{{ i + 1 }}</div>
                <div class="rank-info">
                  <div class="rank-name">{{ w.name }}</div>
                  <div class="rank-meta">by {{ w.author }}</div>
                </div>
                <div class="rank-value">{{ w.votes }} 🗳️</div>
              </div>
            </div>
            <div v-else class="trend-note">本周还没有人参赛，来当第一个？</div>
          </div>

          <!-- 创作方式分布 -->
          <div class="stat-card">
            <div class="stat-title">🖌️ 大家都怎么画</div>
            <div class="chart-bars">
              <div v-for="item in stats.methodDistribution" :key="item.key" class="chart-row">
                <div class="chart-label">{{ item.label }}</div>
                <div class="chart-bar-wrap">
                  <div class="chart-bar" :style="{ width: item.percent + '%' }"></div>
                  <div class="chart-value">{{ item.count }} ({{ item.percent }}%)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 画布尺寸分布 -->
          <div class="stat-card">
            <div class="stat-title">📐 画布尺寸分布</div>
            <div class="chart-bars">
              <div v-for="item in stats.sizeDistribution" :key="item.size" class="chart-row">
                <div class="chart-label">{{ item.size }}</div>
                <div class="chart-bar-wrap">
                  <div class="chart-bar" :style="{ width: item.percent + '%' }"></div>
                  <div class="chart-value">{{ item.count }} ({{ item.percent }}%)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门标签 -->
          <div v-if="stats.topTags.length" class="stat-card">
            <div class="stat-title">🔖 热门标签</div>
            <div class="tag-cloud">
              <span
                v-for="(t, i) in stats.topTags"
                :key="t.name"
                class="tag-chip"
                :class="{ hot: i < 6 }"
              >#{{ t.name }} <span class="tag-n">{{ t.count }}</span></span>
            </div>
          </div>
        </template>
      </div>
    </div>
  `,
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(text || ('请求失败 (' + res.status + ')'))
        }
        const data = await res.json()
        if (data.ok) {
          this.stats = data.stats
        } else {
          throw new Error(data.error || '加载失败')
        }
      } catch (e) {
        console.error('Failed to load stats:', e)
        this.error = e.message || '网络错误，请稍后重试'
      } finally {
        this.loading = false
      }
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      stats: {
        totalUsers: 0,
        totalWorks: 0,
        totalLikes: 0,
        totalComments: 0,
        totalPixels: 0,
        creatorCount: 0,
        animWorks: 0,
        cameraWorks: 0,
        zeroLikeWorks: 0,
        townDays: 0,
        avgLikes: 0,
        busiestTime: '—',
        trend: [],
        trendMax: 1,
        recent7: 0,
        prev7: 0,
        methodDistribution: [],
        sizeDistribution: [],
        topTags: [],
        contest: { week: '', theme: '', prompt: '', joined: 0, votes: 0, top: [] },
      },
    }
  },
}
