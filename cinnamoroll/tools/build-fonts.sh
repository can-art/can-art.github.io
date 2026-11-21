#!/usr/bin/env bash
# 从页面实际用到的字符重新生成字体子集（改文案后重跑一次）
set -euo pipefail
REPO="${1:-/home/yc/repos/can-art.github.io}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV=/home/yc/dsh-browser/venv
SRC_CN=/tmp/fonts-src/ZCOOLKuaiLe-Regular.ttf
SRC_EN=/tmp/fonts-src/Quicksand.ttf
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p "$ROOT/fonts"

"$VENV/bin/python" - "$ROOT/index.html" "$ROOT/app.js" > "$TMP/chars.txt" <<'PY'
import re, sys
text = ""
for p in sys.argv[1:]:
    try: text += open(p, encoding='utf-8').read()
    except FileNotFoundError: pass
body = re.sub(r'(?is)<(style|script).*?</\1>', '', text)
body = re.sub(r'(?s)<[^>]+>', '', body)
extra = ''.join(chr(c) for c in range(0x20, 0x7f)) + '·—★“”‘’、。：；！？（）《》…°'
chars = sorted({c for c in (body + extra) if c == ' ' or not c.isspace()})
sys.stdout.write(''.join(chars))
PY

echo "unique chars: $(wc -m < "$TMP/chars.txt")"

"$VENV/bin/pyftsubset" "$SRC_CN" --text-file="$TMP/chars.txt" --output-file="$ROOT/fonts/zcool-kuaile.woff2" \
  --flavor=woff2 --layout-features='*' --no-hinting --desubroutinize

"$VENV/bin/pyftsubset" "$SRC_EN" --text-file="$TMP/chars.txt" --output-file="$ROOT/fonts/quicksand.woff2" \
  --flavor=woff2 --layout-features='*' --no-hinting --desubroutinize --retain-gids

ls -l "$ROOT/fonts/"*.woff2 | awk '{printf "%s  %.1f KB\n", $9, $5/1024}'
