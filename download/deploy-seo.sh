#!/bin/bash
# Deploy SEO update to chip-net.ru production server
# Run this on the production server (45.155.52.105)

set -e
cd /var/www/chip-net

echo "=== Pulling latest code from GitHub ==="
git stash 2>/dev/null || true
git fetch origin master
git reset --hard origin/master

echo "=== Building Next.js ==="
npm run build

echo "=== Restarting PM2 ==="
pm2 restart chipnet

echo "=== Deploy complete! ==="
echo "Verifying pages..."
sleep 3
for path in / /brands /analogs /obsolete /datasheets /bom /industries /knowledge-base /catalog /importozameshchenie; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${path}")
  echo "  ${path}: ${STATUS}"
done
