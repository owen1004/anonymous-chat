#!/bin/bash

echo ""
echo "=== 🔍 Anonymous Chat 專案進階同步檢查 V3.0 ==="
echo ""

# 1. 檢查 .env.local 是否存在
echo "🔎 檢查 .env.local"
if [ -f ".env.local" ]; then
  echo "✅ .env.local 存在"
else
  echo "❌ 缺少 .env.local，請補上環境變數！"
fi

# 2. 檢查 Firebase 必要環境變數
echo ""
echo "🔎 檢查 Firebase 必要環境變數"
REQUIRED_KEYS=("NEXT_PUBLIC_FIREBASE_API_KEY" "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "NEXT_PUBLIC_FIREBASE_APP_ID")
for key in "${REQUIRED_KEYS[@]}"; do
  if grep -q "$key=" .env.local; then
    echo "✅ $key 已設定"
  else
    echo "❌ $key 缺失"
  fi
done

# 3. 檢查 package.json 是否存在基本 scripts
echo ""
echo "🔎 檢查 package.json 基本健康"
if [ -f "package.json" ]; then
  if grep -q '"build"' package.json && grep -q '"dev"' package.json; then
    echo "✅ package.json 有基本 scripts"
  else
    echo "❌ package.json 缺少 build 或 dev 指令"
  fi
else
  echo "❌ 缺少 package.json！"
fi

# 4. 檢查 pnpm-lock.yaml 是否存在
echo ""
echo "🔎 檢查 pnpm-lock.yaml"
if [ -f "pnpm-lock.yaml" ]; then
  echo "✅ pnpm-lock.yaml 存在"
else
  echo "❌ 缺少 pnpm-lock.yaml，建議鎖定依賴版本！"
fi

# 5. Git 狀態檢查
echo ""
echo "🔎 Git 狀態檢查"
git status

if [[ $(git status --porcelain) ]]; then
  echo "❗ 有尚未提交的變更，請先 git add / commit / push！"
else
  echo "✅ 所有變更已提交"
fi

# 6. 目前所在分支
echo ""
echo "🌿 目前所在分支：$(git branch --show-current)"

# 7. MCP Checkpoint 檢查
echo ""
echo "🔎 MCP Checkpoint 檢查"
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)

if [ -z "$LAST_TAG" ]; then
  echo "❌ 尚未設定任何 MCP Checkpoint"
else
  echo "✅ 最近 MCP Checkpoint 是：$LAST_TAG"
fi

# 8. 必要頁面檢查
echo ""
echo "🔎 檢查必要頁面存在"
NECESSARY_PAGES=("app/login/page.tsx" "app/about/page.tsx" "app/contact/page.tsx" "app/chat/page.tsx" "app/page.tsx")
for page in "${NECESSARY_PAGES[@]}"; do
  if [ -f "$page" ]; then
    echo "✅ $page 存在"
  else
    echo "❌ 缺失頁面：$page"
  fi
done

# 9. 檢查 .next 資料夾
echo ""
if [ -d ".next" ]; then
  echo "📦 .next 資料夾存在，提示：建議 build 完上 Vercel 前手動清除以避免錯誤"
else
  echo "✅ 沒有多餘的 .next 資料夾"
fi

# 10. Vercel 環境同步提醒
echo ""
echo "🌐 Vercel 環境同步提醒"
echo "👉 請手動確認 https://vercel.com/dashboard 是否已同步最新 Environment Variables！"

# 完成
echo ""
echo "🎯 同步檢查完成，請依提示逐一修正，祝順利部署！" 