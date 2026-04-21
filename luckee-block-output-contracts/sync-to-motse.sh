#!/usr/bin/env bash
# Sync luckee-block-output-contracts → motse_skills/skills/luckee-block-output-contracts
# Usage: ./sync-to-motse.sh [commit message]

set -e

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST="/Users/yuanmanxue/live/motse_skills/skills/luckee-block-output-contracts"
MSG="${1:-sync: update from luckee-block-output-contracts}"

echo "▶ Syncing $SRC → $DEST"

# 1. rsync（排除 .git 和脚本本身）
rsync -av --delete \
  --exclude='.git' \
  --exclude='sync-to-motse.sh' \
  "$SRC/" "$DEST/"

# 2. commit & push in motse_skills
cd /Users/yuanmanxue/live/motse_skills

if git diff --quiet && git diff --cached --quiet; then
  echo "✓ Nothing changed in motse_skills, skip commit."
else
  git add "skills/luckee-block-output-contracts"
  git commit -m "$MSG"
  echo "✓ Committed in motse_skills."
  read -r -p "Push to motse_skills remote? [y/N] " confirm
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    git push
    echo "✓ Pushed."
  fi
fi

echo "✓ Done."
