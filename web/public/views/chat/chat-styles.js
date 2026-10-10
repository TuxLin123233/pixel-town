/**
 * Chat 视图的CSS 样式
 *
 * 由 views/chat.js 拆分而来（内容原样搬移，未做任何改动）。
 * 主文件通过 import 引入：见 views/chat.js 顶部。
 */

export const chatStyles = `
      [hidden] { display: none !important; }
      :root {
        --bg: #faf5ef;
        --surface: #ffffff;
        --surface-2: #efe9e0;
        --text: #3b342c;
        --text-muted: #6b5f50;
        --text-faint: #b0a697;
        --border: #efe7da;
        --border-strong: #e0d3c0;
        --accent: #5b8def;
        --ok: #4caf7d;
      }
      .ch-wrap { max-width: 460px; margin: 0 auto; padding: 14px 16px 96px; }
      /* ---------- 对话模式：整屏 flex，消息滚动、输入框钉在底部 ----------
         必须用 fixed 脱离文档流：body 上有 padding: 16px 16px 112px（给底部
         导航留位），普通流里的元素会从 y=16 开始、高度再取一整屏，底部就正好
         溢出 16px —— 表现是「输入框跑到屏幕外，只看到一半」，同时 body 总高
         超过视口，手指一滑滚动的是整页而不是消息区（「滑不动」）。
         fixed 之后相对视口定位，完全不受 body 内边距影响。
         高度优先用 dvh（会随键盘收缩），JS 里再用 visualViewport 兜一层。 */
      .ch-wrap.thread {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 100vh;
        height: 100dvh;
        max-width: 460px;
        margin: 0 auto;
        padding: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      /* fixed 之后顶部会贴到视口最上沿，得让开刘海/状态栏 */
      .ch-wrap.thread .ch-bar {
        padding: calc(14px + env(safe-area-inset-top, 0px)) 16px 0;
        flex: none;
      }
      .ch-wrap.thread .ch-note { margin: 8px 16px 0; flex: none; }
      .ch-wrap.thread #chBody {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 0 16px;
      }
      .ch-wrap.thread .ch-empty {
        flex: 1 1 auto;
        display: flex; flex-direction: column; justify-content: center;
      }
      /* 消息区用负 margin 撑到整屏宽：手指落在最左/最右也能滑，
         不是只有中间那条能滑。内边距再补回来，视觉不变。 */
      .ch-wrap.thread .ch-msgs {
        flex: 1 1 auto;
        min-height: 0;
        margin-left: -16px;
        margin-right: -16px;
        padding-left: 16px;
        padding-right: 16px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
      .ch-wrap.thread .ch-del { flex: none; }
      .ch-wrap.thread .ch-sendbar {
        flex: none;
        padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      }
      .ch-bar { display: flex; align-items: center; margin-bottom: 4px; }
      .ch-bar > * + * { margin-left: 10px; }
      .ch-back {
        display: inline-flex; align-items: center;
        border: 1px solid var(--border-strong); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 6px 13px;
        font-size: 12px; font-weight: 700; text-decoration: none; flex: none;
      }
      /* 顶栏的图标按钮（清空对话）。挪到顶栏是因为：原来它贴在发送框正上方，
         手指够发送键时很容易点到它，而它是个不可恢复的破坏性操作。 */
      .ch-icon-btn {
        flex: none;
        width: 34px; height: 30px;
        border: 1px solid var(--border-input);
        background: var(--surface-2);
        color: var(--text-muted);
        border-radius: 999px;
        font-size: 14px; line-height: 1;
        cursor: pointer; font-family: inherit;
      }
      .ch-icon-btn:active { background: var(--border); }
      .ch-icon-btn[hidden] { display: none; }
      .ch-bar-main { flex: 1; min-width: 0; }
      .ch-title { font-size: 17px; font-weight: 800; color: var(--text); }
      /* 对话里的名字可以点：去对方主页看资料（性别、生日、作品墙都那儿） */
      .ch-title.link { cursor: pointer; text-decoration: underline; text-decoration-style: dotted;
        text-underline-offset: 4px; text-decoration-thickness: 1px; }
      .ch-sub { font-size: 11px; color: var(--text-faint); }
      .ch-note {
        font-size: 11px; color: var(--text-faint); background: var(--surface-2);
        border-radius: 10px; padding: 7px 10px; margin: 10px 0 4px; line-height: 1.7;
      }
      .ch-note b { color: var(--text-muted); }

      .ch-list { display: flex; flex-direction: column; margin-top: 10px; }
      .ch-list > * + * { margin-top: 8px; }
      /* 不用 flex 的 gap：微信 X5 内核不支持，间距会整个塌成 0，
         所以头像和文字之间一律靠 margin 撑开。 */
      .ch-row {
        display: flex; align-items: center; text-decoration: none;
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 13px; padding: 10px 12px; color: inherit;
      }
      .ch-av {
        position: relative;
        width: 42px; height: 42px; flex: 0 0 42px; border-radius: 12px; overflow: hidden;
        background: var(--surface-2); border: 1px solid var(--border-strong);
        margin-right: 11px;   /* ← 头像和「名字 + 最新消息」之间的间距，之前漏了 */
      }
      .ch-av canvas { width: 100%; height: 100%; image-rendering: pixelated; display: block; }
      .ch-main { flex: 1; min-width: 0; }
      .ch-name {
        font-size: 14px; font-weight: 700; color: var(--text);
        display: block; line-height: 1.35;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ch-last {
        font-size: 12px; color: var(--text-faint); display: block;
        margin-top: 3px; line-height: 1.45;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ch-last.mine { color: var(--text-muted); }
      /* 右侧一列：时间在上，未读在下 */
      .ch-side {
        flex: none; margin-left: 9px; min-height: 42px;
        display: flex; flex-direction: column; align-items: flex-end; justify-content: center;
      }
      .ch-time { font-size: 10px; color: var(--text-faint); white-space: nowrap; }
      /* 未读：红点 + 条数。1 条时是一个小圆点，多了才显示数字 */
      .ch-unread {
        margin-top: 5px;
        min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box;
        border-radius: 999px; background: #e5574b; color: #fff;
        font-size: 11px; font-weight: 800; line-height: 18px; text-align: center;
      }
      .ch-unread.dot { min-width: 10px; width: 10px; height: 10px; padding: 0; }

      /* ---------- 加好友 ---------- */
      .ch-find { margin-top: 10px; }
      .ch-find-btn {
        display: block; width: 100%;
        border: 1px dashed var(--border-strong); background: var(--surface);
        color: var(--accent); border-radius: 13px; padding: 11px;
        font-size: 13px; font-weight: 800; font-family: inherit; cursor: pointer;
      }
      .ch-find-btn.on {
        border-style: solid; background: var(--surface-2); color: var(--text-muted);
      }
      .ch-find-panel { margin-top: 8px; }
      .ch-panel {
        background: var(--surface); border: 1px solid var(--border);
        border-radius: 13px; padding: 12px;
      }
      .ch-panel h4 { margin: 0 0 6px; font-size: 13px; font-weight: 800; color: var(--text); }
      .ch-panel h4.ch-find-h2 { margin-top: 14px; }
      .ch-panel-n { color: var(--accent); }
      .ch-find-empty { font-size: 12px; color: var(--text-faint); padding: 8px 2px; line-height: 1.7; }
      .ch-friend-row { display: flex; align-items: center; padding: 8px 0; }
      .ch-friend-row + .ch-friend-row { border-top: 1px solid var(--border); }
      .ch-friend-row .ch-av { width: 36px; height: 36px; flex: 0 0 36px; margin-right: 9px; }
      .ch-friend-main { flex: 1; min-width: 0; }
      .ch-friend-name {
        font-size: 13px; font-weight: 700; color: var(--text); display: block;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ch-friend-bio {
        font-size: 11px; color: var(--text-faint); display: block; margin-top: 2px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ch-friend-act {
        flex: none; margin-left: 8px;
        border: 0; border-radius: 999px; padding: 7px 13px;
        background: var(--accent); color: #fff;
        font-size: 12px; font-weight: 800; font-family: inherit; cursor: pointer;
      }
      .ch-friend-act[disabled] { opacity: 0.6; cursor: default; }
      .ch-search { display: flex; margin-top: 2px; }
      .ch-search input {
        flex: 1; min-width: 0;
        border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text); border-radius: 10px; padding: 9px 11px;
        font-size: 13px; font-family: inherit;
      }
      .ch-search > * + * { margin-left: 7px; }
      .ch-search button {
        flex: none; border: 0; border-radius: 10px; padding: 0 14px;
        background: var(--accent); color: #fff;
        font-size: 13px; font-weight: 800; font-family: inherit; cursor: pointer;
      }


      /* 这里用子元素 margin 而不是 flex 的 gap。
         flex 的 gap 要 Chrome 84 才支持，个别手机上的浏览器（微信里的 X5 内核）
         不支持就会让间距整个塌成 0。margin 没有这个兼容问题，两边都稳妥。 */
      /* 对话气泡 */
      .ch-msgs {
        display: flex; flex-direction: column;
        margin: 12px 0; min-height: 90px;
        max-width: 100%; min-width: 0;
      }
      .ch-msgs > * + * { margin-top: 9px; }
      /* min-width: 0 不能省：flex 子项默认 min-width:auto，
         不许缩到比内容还窄，里面再窄的容器也拦不住。
         overflow-wrap:anywhere 比 word-break:break-word 兼容性好 ——
         后者在老 Safari / WebView 上不被支持，会退化成 normal，
         一条长网址就能把气泡顶出屏幕（用户反馈「消息框溢出到右边」）。 */
      /* 「对方正在输入」：跟在消息列表末尾，不占固定高度 */
      .ch-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px 2px;
        animation: lwa-fade .22s ease-out both;
      }
      .ch-typing-t {
        font-size: 11.5px;
        color: var(--text-faint);
      }

      .ch-msg {
        display: flex; align-items: flex-start; max-width: 88%; min-width: 0;
        animation: chIn 0.18s ease-out;
      }
      @keyframes chIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ch-msg { animation: none; } }
      .ch-msg.mine { align-self: flex-end; flex-direction: row-reverse; }
      .ch-msg-av {
        width: 28px; height: 28px; flex: 0 0 28px; border-radius: 9px; overflow: hidden;
        background: var(--surface-2); border: 1px solid var(--border-strong);
        margin-right: 7px; margin-top: 2px;
      }
      .ch-msg-av canvas { width: 100%; height: 100%; image-rendering: pixelated; display: block; }
      .ch-bubble-col { min-width: 0; display: flex; flex-direction: column; }
      .ch-msg.mine .ch-bubble-col { align-items: flex-end; }
      .ch-bubble {
        padding: 9px 13px; border-radius: 16px; font-size: 13.5px; line-height: 1.65;
        max-width: 100%; min-width: 0;
        overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap;
        background: var(--surface); border: 1px solid var(--border); color: var(--text);
        box-shadow: 0 1px 2px rgba(80, 60, 40, 0.06);
      }
      .ch-msg.mine .ch-bubble {
        background: var(--accent); color: #fff; border-color: var(--accent);
        border-bottom-right-radius: 5px;
      }
      .ch-msg:not(.mine) .ch-bubble { border-bottom-left-radius: 5px; }
      .ch-mtime { font-size: 10px; color: var(--text-faint); margin-top: 4px; padding: 0 3px; }
      .ch-msg.mine .ch-mtime { text-align: right; }
      /* 跨天时插一条日期分隔 */
      .ch-day {
        align-self: center; font-size: 10.5px; color: var(--text-faint);
        background: var(--surface-2); border-radius: 999px; padding: 3px 11px;
        margin: 4px 0 2px;
      }
      .ch-new {
        align-self: center; font-size: 11px; color: var(--accent);
        background: color-mix(in srgb, var(--accent) 12%, var(--surface));
        border-radius: 999px; padding: 4px 11px; font-weight: 700;
      }
      .ch-sendbar { display: flex; margin-top: 10px; min-width: 0; position: relative; }
      .ch-in {
        /* min-width: 0 必须写：<input> 有 size 属性带来的固有宽度，
           作为 flex 子项默认 min-width:auto 缩不下去，窄屏会把「发送」挤出屏幕。 */
        flex: 1 1 auto; min-width: 0;
        border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text); border-radius: 12px; padding: 10px 12px;
        font-size: 13px; font-family: inherit; line-height: 1.5;
      }
      .ch-sendbar > * + * { margin-left: 8px; }
      .ch-in:focus { outline: 2px solid var(--accent); outline-offset: -1px; }
      .ch-send {
        flex: 0 0 auto; border: 0; border-radius: 12px; padding: 0 17px;
        font-size: 13px; font-weight: 800; font-family: inherit;
        background: var(--accent); color: #fff; cursor: pointer;
      }
      .ch-send[disabled] { background: var(--surface-2); color: var(--text-faint); cursor: default; }
      .ch-empty { font-size: 13px; color: var(--text-faint); text-align: center; padding: 30px 10px; line-height: 1.9; }
      .ch-msg-box {
        margin-top: 12px; font-size: 12px; border-radius: 10px; padding: 9px 11px;
        background: var(--surface-2); color: var(--text-muted);
      }
      .ch-msg-box.bad { background: #fdecea; color: #c0392b; }
      .ch-del { margin-left: auto; font-size: 11px; }

      /* ---------- 表情面板 ---------- */
      .ch-emoji-btn {
        flex: 0 0 auto; width: 42px;
        border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text); border-radius: 12px; font-size: 18px; line-height: 1;
        cursor: pointer; font-family: inherit;
      }
      .ch-emoji-btn.on {
        border-color: var(--accent);
        background: color-mix(in srgb, var(--accent) 14%, var(--surface));
      }
      .ch-emoji {
        position: absolute; left: 0; right: 0; bottom: calc(100% + 8px);
        background: var(--surface); border: 1px solid var(--border-strong);
        border-radius: 14px; box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
        padding: 8px; z-index: 30;
      }
      .ch-emoji[hidden] { display: none; }
      .ch-emoji-tabs { display: flex; margin-bottom: 6px; }
      .ch-emoji-tabs button {
        flex: 1; border: 0; background: transparent; color: var(--text-muted);
        font-size: 12px; font-weight: 700; font-family: inherit;
        padding: 5px 0; border-radius: 8px; cursor: pointer;
      }
      .ch-emoji-tabs button.on { background: var(--surface-2); color: var(--text); }
      .ch-emoji-grid {
        display: grid; grid-template-columns: repeat(8, 1fr);
        max-height: 170px; overflow-y: auto; -webkit-overflow-scrolling: touch;
      }
      .ch-emoji-grid button {
        border: 0; background: transparent; font-size: 20px; line-height: 1;
        padding: 6px 0; border-radius: 8px; cursor: pointer;
      }
      .ch-emoji-grid button:active { background: var(--surface-2); }

      /* ---------- 更多功能 ---------- */
      .ch-plus-btn {
        flex: none; width: 36px; height: 36px; border-radius: 50%;
        border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text-muted); font-size: 19px; line-height: 1;
        font-family: inherit; cursor: pointer;
      }
      .ch-plus-btn.on { background: var(--accent); border-color: var(--accent); color: #fff; }
      .ch-plus {
        position: absolute; left: 0; right: 0; bottom: 46px;
        background: var(--surface); border: 1px solid var(--border-strong);
        border-radius: 14px; padding: 10px; z-index: 6;
        box-shadow: 0 8px 26px rgba(0,0,0,.16);
      }
      .ch-plus[hidden] { display: none; }
      .ch-plus-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .ch-plus-i {
        border: 1px solid var(--border-input); background: var(--surface-2);
        border-radius: 12px; padding: 9px 4px; cursor: pointer;
        display: flex; flex-direction: column; align-items: center; font-family: inherit;
      }
      .ch-plus-i span:first-child { font-size: 20px; line-height: 1.3; }
      .ch-plus-i span:last-child { font-size: 10px; color: var(--text-muted); margin-top: 3px; }
      .ch-plus-i.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--surface)); }
      .ch-pane { margin-top: 10px; }
      .ch-pane[hidden] { display: none; }
      .ch-pane-h { font-size: 12px; font-weight: 800; color: var(--text); margin-bottom: 7px; }
      .ch-chips { display: flex; flex-wrap: wrap; }
      .ch-chip {
        border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text-muted); border-radius: 999px; padding: 6px 13px;
        font-size: 12px; font-weight: 700; font-family: inherit;
        cursor: pointer; margin: 0 6px 6px 0;
      }
      .ch-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
      .ch-pane-act { display: flex; margin-top: 8px; }
      .ch-pane-act > * + * { margin-left: 8px; }
      .ch-go {
        flex: 1; border: 0; border-radius: 10px; padding: 10px;
        background: var(--accent); color: #fff; font-size: 13px;
        font-weight: 800; font-family: inherit; cursor: pointer;
      }
      .ch-go[disabled] { opacity: .5; cursor: default; }
      .ch-go.ghost { background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border-input); flex: none; padding: 10px 15px; }
      .ch-pane-tip { font-size: 11px; color: var(--text-faint); line-height: 1.7; margin-top: 6px; }
      /* 涂鸦板 */
      .ch-pad { display: flex; }
      .ch-pad canvas {
        width: 168px; height: 168px; flex: none; image-rendering: pixelated;
        border: 1px solid var(--border-strong); border-radius: 10px;
        background: #fff; touch-action: none; cursor: crosshair;
      }
      .ch-pad-colors { flex: 1; min-width: 0; margin-left: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; align-content: start; }
      .ch-pad-c { width: 100%; aspect-ratio: 1; border-radius: 7px; border: 1px solid var(--border-input); cursor: pointer; }
      .ch-pad-c.on { outline: 2px solid var(--accent); outline-offset: 1px; }
      /* 画作选择 */
      .ch-works { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; max-height: 190px; overflow-y: auto; }
      .ch-works button {
        border: 1px solid var(--border-input); background: var(--surface-2);
        border-radius: 9px; padding: 4px; cursor: pointer; font-family: inherit;
      }
      .ch-works button.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--surface)); }
      .ch-works canvas { width: 100%; aspect-ratio: 1; image-rendering: pixelated; display: block; border-radius: 5px; background: var(--surface); }
      .ch-works span { display: block; font-size: 9px; color: var(--text-muted); margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

      /* ---------- 气泡里的各种消息 ---------- */
      .ch-gift {
        display: flex; align-items: center; padding: 4px 2px;
      }
      .ch-gift-ico { font-size: 26px; margin-right: 8px; }
      .ch-gift-amt { font-size: 17px; font-weight: 800; color: #b8860b; }
      .ch-gift-note { font-size: 12px; opacity: .82; margin-top: 5px; }
      .ch-doodle {
        width: 128px; height: 128px; image-rendering: pixelated;
        border-radius: 8px; display: block; background: #fff;
      }
      .ch-work {
        display: block; width: 128px; cursor: pointer;
        border-radius: 8px; overflow: hidden; background: var(--surface-2);
      }
      .ch-work canvas { width: 128px; height: 128px; image-rendering: pixelated; display: block; background: #fff; }
      .ch-work-n { font-size: 10px; padding: 4px 6px; color: var(--text-muted); background: var(--surface-2); }
      .ch-rps { font-size: 12px; line-height: 1.7; }
      .ch-rps-h { font-weight: 800; margin-bottom: 6px; }
      .ch-rps-btns { display: flex; }
      .ch-rps-b {
        flex: 1; border: 1px solid var(--border-input); background: var(--surface-2);
        color: var(--text); border-radius: 9px; padding: 8px 0; font-size: 17px;
        font-family: inherit; cursor: pointer;
      }
      .ch-rps-b + .ch-rps-b { margin-left: 6px; }
      .ch-rps-row { display: flex; align-items: center; font-size: 15px; }
      .ch-rps-row span { font-size: 17px; }
      .ch-rps-row b { font-size: 10px; color: var(--text-faint); margin: 0 8px; }
      .ch-rps-res { font-size: 12px; font-weight: 800; margin-top: 5px; }
      .ch-rps-res.win { color: #2e8b57; }
      .ch-rps-res.lose { color: #c0392b; }
      /* 引用 */
      .ch-quote {
        border-left: 3px solid var(--border-strong); padding: 3px 8px;
        margin-bottom: 6px; font-size: 11px; color: var(--text-faint);
        background: rgba(0,0,0,.03); border-radius: 0 6px 6px 0;
        max-width: 190px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      /* 表情回应 */
      .ch-reacts { display: flex; flex-wrap: wrap; margin-top: 4px; }
      .ch-react {
        border: 1px solid var(--border); background: var(--surface);
        border-radius: 999px; padding: 1px 7px; font-size: 12px;
        font-family: inherit; cursor: pointer; margin: 0 4px 3px 0; line-height: 1.7;
      }
      .ch-react.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, var(--surface)); }
      /* 引用 / 回应 的操作条 */
      .ch-msgacts {
        display: flex; margin-top: 4px;
      }
      .ch-msgacts button {
        border: 1px solid var(--border-input); background: var(--surface);
        border-radius: 999px; padding: 2px 9px; font-size: 11px;
        color: var(--text-muted); font-family: inherit; cursor: pointer;
        margin-right: 5px;
      }
      .ch-msgacts button.on { border-color: var(--accent); color: var(--accent); }
      .ch-replybar {
        display: flex; align-items: center; margin-bottom: 6px;
        background: var(--surface-2); border-radius: 9px; padding: 6px 9px;
        font-size: 11px; color: var(--text-muted);
      }
      .ch-replybar b { color: var(--text); font-weight: 700; margin-right: 6px; }
      .ch-replybar span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .ch-replybar button {
        flex: none; border: 0; background: transparent; color: var(--text-faint);
        font-size: 14px; cursor: pointer; padding: 0 0 0 8px; font-family: inherit;
      }
    `
