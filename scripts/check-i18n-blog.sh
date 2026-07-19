#!/bin/bash
# check-i18n-blog.sh
# CI 检查：每篇中文博客必须有对应的英文翻译
# 无逃生口 — 缺翻译就阻断构建
#
# 用法：在 GitHub Actions 中 build 前运行

set -euo pipefail

BLOG_DIR="blog"
I18N_DIR="i18n/en/docusaurus-plugin-content-blog"
MISSING=0

echo "🔍 Checking i18n blog coverage..."

for blog_path in "$BLOG_DIR"/*/; do
  slug=$(basename "$blog_path")
  index="${blog_path}index.md"
  [ -f "$index" ] || continue

  # 检查中文博客是否有对应的英文目录
  if [ ! -d "$I18N_DIR/$slug" ]; then
    title=$(head -20 "$index" | grep "^title:" | sed 's/^title: *//; s/"//g' || echo "$slug")
    echo ""
    echo "  ❌ Missing EN translation:  ${title}  →  ${slug}"
    echo "     Create:  ${I18N_DIR}/${slug}/index.md"
    echo ""
    # GitHub Actions error annotation
    if [ -n "${GITHUB_ACTIONS:-}" ]; then
      echo "::error file=${blog_path}index.md,title=Missing EN Translation::Create ${I18N_DIR}/${slug}/index.md"
    fi
    MISSING=$((MISSING+1))
  fi
done

echo ""
if [ "$MISSING" -eq 0 ]; then
  echo "✅ All blog posts have English translations."
else
  if [ -n "${GITHUB_ACTIONS:-}" ]; then
    echo "::error title=EN Translations Missing::${MISSING} blog post(s) need English translation. Build failed."
  fi
  echo "❌ ${MISSING} blog post(s) missing English translation — build aborted."
  exit 1
fi
