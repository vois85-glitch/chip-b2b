#!/usr/bin/env python3
import json, sys, hashlib, requests

url = "https://xqyynlafxoeqkuyhukbq.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeXlubGFmeG9lcWt1eWh1a2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjM3NDcsImV4cCI6MjA5NDczOTc0N30.JE73oMerYXijqjqwUf3Kr0w6gBrcGHUPwQR0vo_0gR4"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Get existing SKUs
print("Fetching existing SKUs...")
all_skus = set()
page = 0
while True:
    r = requests.get(f"{url}/rest/v1/components?select=sku&order=id&offset={page}&limit=500", headers=headers, timeout=30)
    if r.status_code != 200:
        break
    data = r.json()
    if not data:
        break
    for item in data:
        all_skus.add(item['sku'])
    page += 500
print(f"Existing: {len(all_skus)}")

with open('/home/z/my-project/download/parsed_components.json', 'r', encoding='utf-8') as f:
    components = json.load(f)

# Deduplicate
new = []
seen = set(all_skus)
for c in components:
    sku = c['sku']
    if sku in seen:
        h = hashlib.md5(c['name'].encode()).hexdigest()[:6]
        c['sku'] = f"{sku}-{h}"
    if c['sku'] in seen:
        continue
    seen.add(c['sku'])
    new.append(c)

print(f"To insert: {len(new)}")

# Insert batch of 10
batch_size = 10
inserted = 0
errors = 0

for i in range(0, len(new), batch_size):
    batch = new[i:i+batch_size]
    try:
        r = requests.post(f"{url}/rest/v1/components", headers=headers, json=batch, timeout=30)
        if r.status_code in (200, 201):
            inserted += len(batch)
        else:
            for item in batch:
                try:
                    r2 = requests.post(f"{url}/rest/v1/components", headers=headers, json=item, timeout=15)
                    if r2.status_code in (200, 201):
                        inserted += 1
                    else:
                        errors += 1
                except:
                    errors += 1
    except:
        errors += len(batch)
    
    if (i // batch_size) % 10 == 0:
        print(f"  {inserted}/{len(new)} (err:{errors})")
        sys.stdout.flush()

print(f"\nInserted: {inserted}, Errors: {errors}")

# Count
r = requests.get(f"{url}/rest/v1/components?select=id&limit=0", headers={**headers, "Prefer": "count=exact"}, timeout=15)
cr = r.headers.get('Content-Range', '0/0')
total = cr.split('/')[1] if '/' in cr else '?'
print(f"Total in DB: {total}")
