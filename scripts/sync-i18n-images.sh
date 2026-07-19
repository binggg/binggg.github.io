#!/bin/bash
# sync-i18n-images.sh
# 构建前自动同步 blog/*/images/ 到 i18n/en/ 对应目录
# 从此不用手动 cp -r，不留尾巴

set -euo pipefail

BLOG_DIR="blog"
I18N_DIR="i18n/en/docusaurus-plugin-content-blog"

synced=0
skipped=0

for blog_path in "$BLOG_DIR"/*/; do
  slug=$(basename "$blog_path")
  images_src="${blog_path}images"

  # 没有 images 目录 → 跳过
  [ -d "$images_src" ] || { skipped=$((skipped+1)); continue; }

  i18n_path="$I18N_DIR/$slug"
  i18n_images="$i18n_path/images"

  # i18n 目录不存在 → 跳过（还没翻译）
  [ -d "$i18n_path" ] || { skipped=$((skipped+1)); continue; }

  # 已经存在完整 images → 跳过
  [ -d "$i18n_images" ] && { skipped=$((skipped+1)); continue; }

  # 同步
  cp -r "$images_src" "$i18n_images"
  count=$(ls "$i18n_images" 2>/dev/null | wc -l)
  echo "  ✅ $slug → ${count} images synced"
  synced=$((synced+1))
done

echo "Done: ${synced} synced, ${skipped} skipped"
