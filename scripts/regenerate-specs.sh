#!/usr/bin/env bash
# /var/www/chip-net/scripts/regenerate-specs.sh
# Еженедельная регенерация specs.jsonl и индекса.
# Запуск через cron: 0 3 * * 0 /var/www/chip-net/scripts/regenerate-specs.sh
# (каждое воскресенье в 3:00 ночи)

set -e

cd /var/www/chip-net
LOG=/var/www/chip-net/data/specs-cron.log
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[${TS}] === START weekly specs regeneration ===" >> $LOG

# 1. Запуск генератора (перезаписывает specs.jsonl)
echo "[${TS}] Running generate-all-specs.ts..." >> $LOG
if npx tsx scripts/generate-all-specs.ts >> $LOG 2>&1; then
  echo "[${TS}] generate-all-specs: OK" >> $LOG
else
  echo "[${TS}] generate-all-specs: FAILED" >> $LOG
  exit 1
fi

# 2. Перестроение индекса
echo "[${TS}] Building index..." >> $LOG
if npx tsx scripts/build-specs-index.ts >> $LOG 2>&1; then
  echo "[${TS}] build-specs-index: OK" >> $LOG
else
  echo "[${TS}] build-specs-index: FAILED" >> $LOG
  exit 1
fi

# 3. Перезапуск PM2 чтобы сбросить in-memory кэш индекса
echo "[${TS}] Reloading PM2..." >> $LOG
pm2 reload chip-net >> $LOG 2>&1

TS2=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "[${TS2}] === DONE ===" >> $LOG
