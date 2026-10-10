/**
 * 画板 HTML 模板
 * 
 * 包含所有画板相关的 HTML 结构：
 * - 用户协议弹层
 * - 创作模式选择
 * - 命题卡片
 * - Pixel Studio 外壳（色板坞 + 画布 + 工具坞）
 * - 帧动画编辑器
 * - 预览弹层
 */

export const paintTemplate = `<div class="consent-overlay" id="consentOverlay" hidden>
      <div class="consent-box" id="consentBox">
        <h2>重要提示</h2>
        <div class="text">
          本画板仅用于个人学习与技术交流。<b>严禁上传、绘制、发布任何违反中华人民共和国法律法规的内容</b>，包括但不限于<b>色情、暴力、恐怖、赌博、涉政敏感、侵犯他人隐私或知识产权</b>等内容。<br><br>
          上传者须对自己发布的内容负全部法律责任。本平台有权在不事先通知的情况下删除违规内容，并保留追究法律责任的权利。<br><br>
          <router-link to="/terms">查看完整用户协议</router-link>
        </div>
        <div class="consent-actions">
          <button id="consentNo" type="button">不同意</button>
          <button id="consentYes" type="button">同意并进入</button>
        </div>
      </div>
    </div>
    <div class="mode-overlay" id="modeOverlay" hidden>
      <div class="mode-box start-box">
        <h2>🎨 像素小镇 · 画板</h2>
        <div class="mode-sub">先选方向，再选这次的具体参数</div>

        <div class="start-sec">
          <div class="start-label">创作方向</div>
          <div class="start-dirs" id="startDirs">
            <button type="button" class="start-dir on" data-dir="pixel">
              <span class="start-ico">🖌️</span>
              <span class="start-body"><b>像素画</b><i>逐格上色，可选题目与帧动画</i></span>
            </button>
            <button type="button" class="start-dir" data-dir="spray">
              <span class="start-ico">💨</span>
              <span class="start-body"><b>像素喷漆</b><i>按住拖着喷，64×64 出图</i></span>
            </button>
            <button type="button" class="start-dir" data-dir="gravity">
              <span class="start-ico">⏳</span>
              <span class="start-body"><b>像素重力</b><i>撒一把，看它自己往下堆</i></span>
            </button>
          </div>
        </div>

        <div class="start-sec" data-for="gravity">
          <div class="start-label">每次撒多少</div>
          <div class="start-spray">
            <input id="startGravityBrush" type="range" min="1" max="4" step="1" value="2"
                   aria-label="每次撒多少">
            <span class="start-spray-num" id="startGravityNum">2</span>
          </div>
          <p class="start-note">在画布上点一下或拖着划，颗粒会一颗颗落到下面，堆出沙坡。堆稳了可以抖一抖，把卡住、立着的部分摇塌。</p>
        </div>

        <div class="start-sec" data-for="pixel">
          <div class="start-label">画布尺寸</div>
          <div class="start-sizes" id="startSizes">
            <button type="button" class="start-size" data-size="16">16×16<em>默认</em></button>
            <button type="button" class="start-size" data-size="32">32×32<em>细腻</em></button>
            <button type="button" class="start-size" data-size="64">64×64<em>大幅</em></button>
          </div>
        </div>

        <div class="start-sec" data-for="pixel">
          <div class="start-label">创作方式</div>
          <div class="start-modes" id="startModes">
            <button type="button" class="start-mode" data-mode="free">
              <span class="start-ico">🖌️</span>
              <span class="start-body"><b>自由模式</b><i>想画什么就画什么</i></span>
            </button>
            <button type="button" class="start-mode" data-mode="prompt" hidden>
              <span class="start-ico">📝</span>
              <span class="start-body"><b>题目模式</b><i>按主题出题，可换题</i></span>
            </button>
            <button type="button" class="start-mode" data-mode="anim" hidden>
              <span class="start-ico">🎞️</span>
              <span class="start-body"><b>帧动画</b><i>逐帧作画导出 GIF</i></span>
            </button>
          </div>
        </div>

        <div class="start-sec" id="startJoinSec" data-for="pixel">
          <div class="start-label">参加活动<span class="start-tip">可不选</span></div>
          <div class="start-joins" id="startJoins">
            <button type="button" class="start-join" data-join="none">
              <span class="start-body"><b>暂不参加</b><i>只自己画</i></span>
            </button>
            <button type="button" class="start-join" data-join="daily" hidden>
              <span class="start-ico">⚡</span>
              <span class="start-body"><b>每日挑战</b><i id="startDailyText">每天一个题目</i></span>
            </button>
            <button type="button" class="start-join" data-join="contest" hidden>
              <span class="start-ico">🏆</span>
              <span class="start-body"><b>本周主题</b><i id="startContestText">每周一个主题</i></span>
            </button>
          </div>
        </div>

        <div class="start-sec" id="startToolSec" data-for="pixel" hidden>
          <div class="start-label">辅助工具</div>
          <label class="start-toggle">
            <input type="checkbox" id="startImage">
            <span class="start-body"><b>📷 像素相机</b><i>把照片变成像素画再手改（请只用自己的照片）</i></span>
          </label>
        </div>

        <div class="start-sec" data-for="spray">
          <div class="start-label">笔刷<span class="start-tip">画的时候也能调</span></div>
          <div class="start-spray">
            <input type="range" id="startSprayBrush" min="1" max="8" step="1" value="3" aria-label="笔刷大小">
            <span class="start-spray-num" id="startSprayNum">3</span>
          </div>
          <label class="start-toggle">
            <input type="checkbox" id="startSprayMirror">
            <span class="start-body"><b>🦋 左右镜像</b><i>只喷一半，另一边自动对称（进画板后还能改成上下或四角）</i></span>
          </label>
        </div>

        <button class="start-go" id="startGo" type="button">开始创作</button>
        <button class="start-cancel" id="startCancel" type="button" hidden>先不画了</button>
      </div>
    </div>

    <div class="mode-bar" id="modeBar" hidden>
      <span class="mode-chip" id="modeChip"></span>
      <button id="switchModeBtn" type="button">切换模式</button>
    </div>

    <div class="prompt-card" id="promptCard" hidden>
      <button class="prompt-roll" id="promptRoll" type="button" title="换一题">🎲</button>
      <div class="prompt-body">
        <div class="prompt-text" id="promptText">正在出题…</div>
        <div class="prompt-meta" id="promptMeta"></div>
      </div>
      <select class="prompt-cat" id="promptCat" title="命题分类" aria-label="命题分类">
        <option value="all">全部</option>
        <option value="0">日常与当下</option>
        <option value="1">心情与感受</option>
        <option value="2">喜好与厌恶</option>
        <option value="3">回忆与童年</option>
        <option value="4">梦想与未来</option>
        <option value="5">想象与创造</option>
        <option value="6">身体与变形</option>
        <option value="7">感官与抽象</option>
        <option value="8">日常物品与场景</option>
        <option value="9">情感与总结</option>
      </select>
    </div>

    <!-- Pixel Studio 风格外壳：顶色板坞 + 画布 + 底部方块工具坞 -->
    <div class="studio" id="studioFrame">

    <!-- 顶部色板坞（像素画） -->
    <div class="studio-pal" id="pixelDock">
      <div class="preset-row" id="presetRow"></div>
    </div>

    <!-- 喷漆工具条 -->
    <div class="spray-bar" id="sprayBar" hidden>
      <div class="spray-pal" id="sprayPal"></div>
      <div class="spray-pal-foot">
        <button class="spray-tool wide" type="button" id="sprayMoreColor" title="更多颜色">🎨 更多颜色</button>
        <span class="spray-cur">
          <span class="spray-cur-sw" id="sprayCurSw"></span>
          <span class="spray-cur-tx" id="sprayCurTx">#e53935</span>
        </span>
      </div>
      <div class="spray-tools" id="sprayTools">
        <button class="gtool" type="button" data-tool="brush" aria-pressed="true" title="画笔"><i class="pico" data-svg="brush"></i></button>
        <button class="gtool" type="button" data-tool="line" aria-pressed="false" title="直线：按住拖出一条线"><i class="pico" data-svg="line"></i></button>
        <button class="gtool" type="button" data-tool="rect" aria-pressed="false" title="矩形：按住拖出一个框"><i class="pico" data-svg="rect"></i></button>
        <button class="gtool" type="button" data-tool="circle" aria-pressed="false" title="圆：按住拖出一个圆"><i class="pico" data-svg="circle"></i></button>
        <button class="gtool" type="button" data-tool="eraser" aria-pressed="false" title="橡皮：擦掉涂过的地方"><i class="pico" data-svg="eraser"></i></button>
        <button class="gtool" type="button" data-tool="picker" aria-pressed="false" title="吸管：取画布上的颜色"><i class="pico" data-svg="picker"></i></button>
        <button class="gtool" type="button" id="sprayUndo" title="撤销"><i class="pico" data-svg="undo"></i></button>
        <button class="gtool" type="button" id="sprayClear" title="清空"><i class="pico" data-svg="trash"></i></button>
      </div>
      <div class="spray-size" id="spraySym">
        <span class="spray-size-label">对称</span>
        <button class="spray-sym-btn active" type="button" data-sym="0">关</button>
        <button class="spray-sym-btn" type="button" data-sym="1">左右</button>
        <button class="spray-sym-btn" type="button" data-sym="2">上下</button>
        <button class="spray-sym-btn" type="button" data-sym="3">四角</button>
      </div>
      <div class="spray-size">
        <span class="spray-size-label">笔刷</span>
        <input id="sprayBrush" type="range" min="1" max="8" step="1" value="3" aria-label="笔刷大小">
        <span class="spray-size-num" id="sprayBrushNum">3</span>
      </div>
    </div>

    <!-- 重力工具条 -->
    <div class="gravity-bar" id="gravityBar" hidden>
      <div class="gravity-pal" id="gravityPal"></div>
      <div class="gravity-pal-foot">
        <button class="spray-tool wide" type="button" id="gravityMoreColor" title="更多颜色">🎨 更多颜色</button>
        <span class="spray-cur">
          <span class="spray-cur-sw" id="gravityCurSw"></span>
          <span class="spray-cur-tx" id="gravityCurTx">#e53935</span>
        </span>
      </div>
      <div class="gravity-tools">
        <button class="gtool" type="button" id="gravityUndo" title="撤销"><i class="pico" data-svg="undo"></i></button>
        <button class="gtool" type="button" id="gravityShake" title="抖一抖：把卡住、立着的沙摇塌"><i class="pico" data-svg="shake"></i></button>
        <button class="gtool" type="button" id="gravityClear" title="清空"><i class="pico" data-svg="trash"></i></button>
      </div>
      <div class="spray-size">
        <span class="spray-size-label">一把</span>
        <input id="gravityBrush" type="range" min="1" max="4" step="1" value="2" aria-label="每次撒多少">
        <span class="spray-size-num" id="gravityBrushNum">2</span>
      </div>
    </div>

    <div class="board-wrap">
      <canvas id="board" width="512" height="512"
              title="也可以直接把照片拖到这里"></canvas>
      <canvas id="sprayBoard" hidden
              title="按住鼠标或手指拖着喷"></canvas>
      <canvas id="gravityBoard" hidden
              title="点一下撒一把，颗粒会自己落到下面"></canvas>
    </div>

    <!-- 底部方块工具坞 -->
    <div class="studio-dock">

    <div class="size-row">
      <span class="size-label">画布</span>
      <button data-size="16" class="size-btn active" type="button">16×16</button>
      <button data-size="32" class="size-btn" type="button">32×32</button>
      <button data-size="64" class="size-btn" type="button">64×64</button>
    </div>

    <div class="zoom-row" id="zoomRow" hidden>
      <span class="size-label">视图</span>
      <button id="zoomOut" class="zoom-btn" type="button" title="缩小">－</button>
      <span class="zoom-level" id="zoomLevel">100%</span>
      <button id="zoomIn" class="zoom-btn" type="button" title="放大">＋</button>
      <span class="zoom-tip">拖动平移 · 点击涂色</span>
    </div>

    <div class="mini-wrap" id="miniWrap" hidden>
      <button class="mini-hide" id="miniHide" type="button" title="收起小地图" aria-label="收起小地图">×</button>
      <button class="mini-size" id="miniSize" type="button" title="切换大小（小/中/大）" aria-label="切换小地图大小">⤢</button>
      <canvas id="miniCanvas" title="小地图：预览当前取景位置。按住边框可以拖动位置"></canvas>
    </div>
    <button class="mini-show" id="miniShow" type="button" title="显示小地图" aria-label="显示小地图" hidden>🗺</button>

    <div class="tools">
      <button id="toolBrush" class="tool active" type="button" data-tool="brush" title="画笔（B）"><i class="pico" data-svg="brush"></i></button>
      <button id="toolEraser" class="tool" type="button" data-tool="eraser" title="橡皮擦（E）"><i class="pico" data-svg="eraser"></i></button>
      <button id="toolFill" class="tool" type="button" data-tool="fill" title="颜料桶（F）"><i class="pico" data-svg="fill"></i></button>
      <button id="toolPick" class="tool" type="button" data-tool="picker" title="取色器（I）：点一下画布吸取该格颜色"><i class="pico" data-svg="picker"></i></button>
      <button id="toolPan" class="tool" type="button" data-tool="pan" title="移动画布（H）：只拖动不落笔，任何尺寸都能用"><i class="pico" data-svg="pan"></i></button>
      <button id="toolLock" class="tool" type="button" title="拖动锁：开启后不管用哪个工具，拖动都是移动画布而不落笔"><i class="pico" data-svg="lock"></i></button>
      <button id="toolColor" class="tool" type="button" title="颜色（C）"><span class="tool-swatch" id="toolSwatch"></span></button>
    </div>

    <div class="pick-wrap" id="pickWrap" hidden>
      <div class="cur">
        <span class="cur-swatch" id="curSwatch"></span>
        <span class="cur-label">当前色值</span>
        <input id="curHex" class="hex-input" value="#e53935" maxlength="7" autocomplete="off"
          aria-label="输入颜色代码" title="输入 #RRGGBB 使用自定义颜色">
      </div>
      <div class="custom-toggle">
        <button id="customBtn" type="button">自定义</button>
      </div>
      <div id="hsvBody" hidden>
        <div class="pick-main">
          <div class="sv-box" id="svBox">
            <canvas id="svCanvas"></canvas>
            <canvas id="svMarker"></canvas>
          </div>
          <div class="hue-box" id="hueBox">
            <canvas id="hueCanvas"></canvas>
            <canvas id="hueMarker"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作行 -->
    <div class="actions">
      <button id="undoBtn" type="button" title="撤销（Z）" disabled><i class="pico" data-svg="undo"></i></button>
      <button id="clearBtn" type="button" title="清空"><i class="pico" data-svg="trash"></i></button>
      <button id="imgBtn" type="button" title="把照片变成像素画" class="abtn">
        <i class="pico" data-svg="camera"></i>
      </button>
      <button id="mirrorBtn" type="button" title="左右镜像绘制（M）" aria-pressed="false" class="abtn">
        <i class="pico" data-svg="mirror"></i>
      </button>
      <input id="imgInput" type="file" accept="image/*" hidden>

    <div class="imgmode-overlay" id="imgModeOverlay" hidden>
      <div class="imgmode-box">
        <div class="imgmode-title">照片转成像素画后，颜色想怎么处理？</div>
        <div class="imgmode-warn">
          ⚠️ 请只处理<b>你自己拍的照片</b>或<b>已获得授权的图片</b>。<br>
          把他人作品转成像素画后发布，<b>仍然属于侵权</b>。
        </div>
        <button class="imgmode-opt" type="button" data-imgmode="palette">
          <span class="imgmode-name">只用画板的 32 种颜色</span>
          <span class="imgmode-desc">颜色更统一，看起来像老游戏画面</span>
        </button>
        <button class="imgmode-opt" type="button" data-imgmode="plain">
          <span class="imgmode-name">保留照片原来的颜色</span>
          <span class="imgmode-desc">颜色更丰富，画面更细腻</span>
        </button>
        <button class="imgmode-cancel" id="imgModeCancel" type="button">取消</button>
      </div>
    </div>
      <button id="savePngBtn" type="button" title="导出 PNG" class="abtn">
        <i class="pico" data-svg="download"></i>
      </button>
      <button id="uploadBtn" type="button"><i class="pico" data-svg="upload"></i><span class="abtn-tx">上传</span></button>
    </div>

    </div><!-- /.studio-dock -->
    </div><!-- /#studioFrame -->

    <router-link id="moreBtn" class="more-btn" to="/gallery" hidden>去社区看更多作品 →</router-link>

    <div class="join-card" id="joinCard" hidden>
      <div class="join-title">参加活动（只能选一个）</div>

      <label class="join-opt" id="dailyRow" hidden for="dailyCheck">
        <input type="radio" name="joinPick" id="dailyCheck" value="daily">
        <span class="join-ico">⚡</span>
        <span class="join-text">
          <span class="join-name" id="dailyLabel"></span>
          <span class="join-desc">每天一个题目，作品进当日榜</span>
        </span>
      </label>

      <label class="join-opt" id="contestRow" hidden for="contestCheck">
        <input type="radio" name="joinPick" id="contestCheck" value="contest">
        <span class="join-ico">🏆</span>
        <span class="join-text">
          <span class="join-name" id="contestLabel"></span>
          <span class="join-desc">每周一个主题，社区投票选本周最佳</span>
        </span>
      </label>
    </div>

    <div class="tag-row">
      <input id="tagsInput" type="text" placeholder="标签：最多 3 个，用空格或逗号分隔" maxlength="24">
    </div>

    <div class="name-row">
      <input id="titleInput" type="text" placeholder="作品名" maxlength="20">
      <span class="author-tag" id="authorTag" title="作者名取自你的账号">未登录</span>
    </div>

    <div class="recent-row" id="recentRow" hidden>
      <span class="recent-label">最近取色</span>
      <div class="recent-swatches" id="recentSwatches"></div>
    </div>

    <div class="draft-row" id="draftRow" hidden>
      <span class="recent-label">草稿</span>
      <div class="draft-slots" id="draftSlots"></div>
    </div>

    <div class="anim-editor" id="animEditor" hidden>
      <div class="anim-head">
        <span class="anim-title">🎞️ 帧动画</span>
        <div class="anim-count-group" id="animCountGroup">
          <button class="anim-count-btn active" data-count="4" type="button">4 帧</button>
          <button class="anim-count-btn" data-count="8" type="button">8 帧</button>
        </div>
        <button class="anim-close" id="animClose" type="button">完成</button>
      </div>
      <div class="anim-speed-row">
        <span class="anim-speed-label">速度</span>
        <button class="anim-speed-btn" data-delay="5" type="button">快 ×2</button>
        <button class="anim-speed-btn active" data-delay="10" type="button">标准</button>
        <button class="anim-speed-btn" data-delay="15" type="button">慢</button>
        <button class="anim-speed-btn" data-delay="20" type="button">更慢</button>
      </div>
      <div class="anim-frames" id="animFrameStrip"></div>
      <div class="anim-actions">
        <button id="animCopy" type="button">复制上一帧</button>
        <button id="animClear" type="button">清空本帧</button>
        <button id="animExport" type="button">导出 GIF</button>
        <button id="animPublish" class="primary" type="button">发布到社区</button>
      </div>
      <div class="anim-note">点选下面的帧号切换画布逐帧作画；可调整播放速度，导出为 512×512 循环 GIF。</div>
    </div>

    <div class="hint" id="hint">画笔：点按或滑动作画 · 画布 16/32/64× · B 画笔 / E 橡皮 / F 填充 / C 颜色 / Z 撤销 · 输入 #RRGGBB 自定义颜色</div>

    <details class="disclaimer">
      <summary>使用须知与免责声明</summary>
      <p>本画板仅用于个人学习与技术交流。请勿上传、绘制、发布任何违反中华人民共和国法律法规的内容，包括但不限于色情、暴力、恐怖、赌博、涉政敏感、侵犯他人隐私或知识产权的内容。上传者须对自己发布的内容负全部法律责任。本平台有权在不事先通知的情况下删除违规内容，并保留追究法律责任的权利。</p>
    </details>

    <div class="copyright">© 2026 像素小镇 · 版权所有 · 作者 Lin Sifan</div>

    <div class="card-overlay" id="animOverlay" hidden>
      <div class="card-box">
        <div class="card-head">
          <span class="card-title">帧动画 GIF</span>
          <button class="card-close" id="animOverlayClose" type="button">关闭</button>
        </div>
        <img id="animImg" alt="帧动画 GIF">
        <div class="card-actions">
          <a id="animDownload" class="card-btn" href="#" download="guangyu-anim.gif">⬇️ 保存 GIF</a>
        </div>
        <div class="card-note">长按图片也能保存到相册；GIF 会自动循环播放。</div>
      </div>
    </div>

    </div>

    <div class="preview-overlay" id="previewOverlay" hidden>
      <div class="preview-box">
        <div class="preview-head">
          <span class="preview-title" id="previewTitle">作品预览</span>
          <button class="preview-close" id="previewClose" type="button">关闭</button>
        </div>
        <canvas id="previewCanvas"></canvas>
        <div class="preview-info">
          <span id="previewAuthor"></span>
          <span id="previewTime" class="preview-time"></span>
        </div>
        <div class="preview-note">仅支持预览，不可载入作画。请勿抄袭或直接提交他人的作品。</div>
      </div>
    </div>`
