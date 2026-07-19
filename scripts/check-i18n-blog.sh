#!/bin/bash
# check-i18n-blog.sh
# CI 检查：中文博客是否有对应的英文翻译
# 不阻断构建，只打印警告
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

  # 检查 frontmatter 中是否标记了不需要翻译
  if head -20 "$index" | grep -q "^i18n_skip:"; then
    continue
  fi

  # 检查中文博客是否有对应的英文目录
  if [ ! -d "$I18N_DIR/$slug" ]; then
    # 从 index.md 提取标题
    title=$(head -20 "$index" | grep "^title:" | sed 's/^title: *//; s/"//g' || echo "$slug")
    echo "  ⚠️  Missing EN translation:  ${title}  →  ${slug}"
    echo "     Create:  ${I18N_DIR}/${slug}/index.md"
    MISSING=$((MISSING+1))
  fi
done

echo ""
if [ "$MISSING" -eq 0 ]; then
  echo "✅ All blog posts have English translations."
else
  echo "⚠️  ${MISSING} blog post(s) missing English translation (build not blocked)"
fi
