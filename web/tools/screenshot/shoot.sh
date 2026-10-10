#!/bin/bash
# 批量截图：每个页面两套规格，供 make-poster.py 拼宣传长图。
#
#   手机 390×844 @3x → 1170×2532     （README 里的手机长图用这套）
#   桌面 1440×900 @2x → 2880×1800
#
# 应用本身的 max-width 是 460px，所以「桌面版」实际就是手机界面居中显示。
#
# 前置：先起 mock 服务器（页面要有假数据才渲染得出内容）
#   node web/tools/screenshot/server.mjs &
# 用法：
#   bash web/tools/screenshot/shoot.sh            # 两套都截
#   bash web/tools/screenshot/shoot.sh 手机        # 只截手机
#
# 路径一律从脚本位置推导 —— 仓库目录改过名（光域 → 像素小镇），
# 以前写死的绝对路径会让这个脚本直接跑不起来。
set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../.." && pwd)"
OUT="$REPO/ui-shots"            # 输出目录（.gitignore 已忽略）
PROF="$REPO/.lw-shoot-profile"  # 浏览器 profile，跑完就删
PORT="${PORT:-8791}"
WANT="${1:-all}"

mkdir -p "$OUT"

# 页面清单：文件名:路由
PAGES="paint:/paint gallery:/gallery town:/town home:/town/home mine:/mine avatar:/avatar user:/u?uid=u1 changelog:/changelog"

shot() {  # name path label W H scale
  local name="$1" to="$2" label="$3" w="$4" h="$5" sc="$6"
  local file="$OUT/$name-$label.png" prof="$PROF-$name-$label"
  rm -rf "$prof"
  timeout 90 chromium --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$prof" \
    --virtual-time-budget=8000 --force-device-scale-factor="$sc" \
    --window-size="$w,$h" \
    --screenshot="$file" \
    "http://127.0.0.1:$PORT/__boot?to=$to" >/dev/null 2>&1
  if [ -f "$file" ]; then
    python3 - "$file" <<'PY'
import sys
from PIL import Image
im = Image.open(sys.argv[1])
print('  ✓ %-26s %d×%d' % (sys.argv[1].split('/')[-1], im.width, im.height))
PY
  else
    echo "  ✗ $name-$label 失败"
    return 1
  fi
}

fails=0
for spec in "桌面 1440 900 2" "手机 390 844 3"; do
  set -- $spec
  LABEL="$1"; W="$2"; H="$3"; SC="$4"
  [ "$WANT" = "all" ] || [ "$WANT" = "$LABEL" ] || continue
  echo "=== $LABEL（${W}×${H} @${SC}x）==="
  for pg in $PAGES; do
    n="${pg%%:*}"; p="${pg#*:}"
    shot "$n" "$p" "$LABEL" "$W" "$H" "$SC" || fails=$((fails + 1))
  done
done

rm -rf "$PROF"-*
echo
if [ "$fails" -eq 0 ]; then
  echo "截图已就绪 → $OUT"
  echo "下一步：python3 web/tools/screenshot/make-poster.py            # 手机长图"
else
  echo "$fails 张截图失败（mock 服务器起了吗？端口 $PORT）"
  exit 1
fi
