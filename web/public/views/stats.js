// 数据统计：展示网站所有数据
export default {
  name: 'stats',
  title: '数据统计',
  css: `
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
                <div class="overview-num">{{ stats.totalViews }}</div>
                <div class="overview-label">访问</div>
              </div>
            </div>
          </div>

          <!-- 作品榜 -->
          <div class="stat-card">
            <div class="stat-title">🎨 最受欢迎作品</div>
            <div class="rank-list">
              <div v-for="(work, i) in stats.topWorks" :key="work.time" class="rank-item">
                <div class="rank-no" :class="i === 0 ? '' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal'">{{ i + 1 }}</div>
                <div class="rank-info">
                  <div class="rank-name">{{ work.name || '未命名' }}</div>
                  <div class="rank-meta">by {{ work.author }}</div>
                </div>
                <div class="rank-value">{{ work.likes }} ❤️</div>
              </div>
            </div>
          </div>

          <!-- 创作者榜 -->
          <div class="stat-card">
            <div class="stat-title">✨ 活跃创作者</div>
            <div class="rank-list">
              <div v-for="(user, i) in stats.topCreators" :key="user.uid" class="rank-item">
                <div class="rank-no" :class="i === 0 ? '' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal'">{{ i + 1 }}</div>
                <div class="rank-info">
                  <div class="rank-name">{{ user.username }}</div>
                  <div class="rank-meta">{{ user.works }} 部作品</div>
                </div>
                <div class="rank-value">{{ user.likes }} ❤️</div>
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
        totalViews: 0,
        topWorks: [],
        topCreators: [],
        sizeDistribution: [],
      },
    }
  },
}
