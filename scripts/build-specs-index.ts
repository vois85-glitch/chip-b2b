// /var/www/chip-net/scripts/build-specs-index.ts
// Создаёт индексный файл для specs.jsonl:
//   /var/www/chip-net/data/specs-index.json
// Формат: { "SKU1": byteOffset, "SKU2": byteOffset, ... }
//
// Запуск:
//   cd /var/www/chip-net && npx tsx scripts/build-specs-index.ts

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = '/var/www/chip-net/data';
const INPUT = path.join(DATA_DIR, 'specs.jsonl');
const INDEX_FILE = path.join(DATA_DIR, 'specs-index.json');

async function main() {
  console.log(`Building index from ${INPUT}...`);
  const start = Date.now();

  const fd = fs.openSync(INPUT, 'r');
  const stats = fs.statSync(INPUT);
  const totalSize = stats.size;

  const BUFFER_SIZE = 64 * 1024;  // 64KB chunks
  const buffer = Buffer.alloc(BUFFER_SIZE);
  let bytesRead = 0;
  let lineStart = 0;
  let totalRead = 0;
  let pending = Buffer.alloc(0);

  const index: Record<string, number> = {};
  let lineCount = 0;

  while (bytesRead < totalSize) {
    const len = fs.readSync(fd, buffer, 0, BUFFER_SIZE, bytesRead);
    if (len === 0) break;
    bytesRead += len;
    totalRead += len;

    pending = Buffer.concat([pending, buffer.subarray(0, len)]);

    // Ищем переводы строк
    let pos = 0;
    while (true) {
      const nlPos = pending.indexOf('\n', pos);
      if (nlPos === -1) break;

      const line = pending.subarray(pos, nlPos).toString('utf8');
      if (line.length > 0) {
        try {
          const obj = JSON.parse(line);
          if (obj.sku) {
            index[obj.sku] = lineStart;
            lineCount++;
          }
        } catch {}
      }

      lineStart += nlPos - pos + 1;
      pos = nlPos + 1;
    }

    // Сдвинуть pending
    pending = pending.subarray(pos);

    if (lineCount % 5000 === 0 && lineCount > 0) {
      const pct = ((bytesRead / totalSize) * 100).toFixed(1);
      console.log(`  ${lineCount} indexed (${pct}%)`);
    }
  }

  fs.closeSync(fd);

  // Сохранить индекс
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index));
  const elapsed = (Date.now() - start) / 1000;
  console.log(`\n✅ Done in ${elapsed.toFixed(1)}s`);
  console.log(`  Index entries: ${lineCount}`);
  console.log(`  Index size: ${(fs.statSync(INDEX_FILE).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
