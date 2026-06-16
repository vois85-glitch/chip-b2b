#!/usr/bin/env python3
import json, sys, time, hashlib, requests

url = "https://xqyynlafxoeqkuyhukbq.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeXlubGFmeG9lcWt1eWh1a2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNjM3NDcsImV4cCI6MjA5NDczOTc0N30.JE73oMerYXijqjqwUf3Kr0w6gBrcGHUPwQR0vo_0gR4"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Get existing SKUs using REST API directly
print("Fetching existing SKUs...")
all_skus = set()
page = 0
while True:
    r = requests.get(
        f"{url}/rest/v1/components?select=sku&order=id&offset={page}&limit=500",
        headers=headers
    )
    if r.status_code != 200:
        print(f"Error fetching: {r.status_code} {r.text[:200]}")
        break
    data = r.json()
    if not data:
        break
    for item in data:
        all_skus.add(item['sku'])
    page += 500

print(f"Existing SKUs: {len(all_skus)}")

# Load components
with open('/home/z/my-project/download/parsed_components.json', 'r', encoding='utf-8') as f:
    components = json.load(f)

print(f"Components in file: {len(components)}")

# Deduplicate and make unique SKUs
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

print(f"New to insert: {len(new)}")

# Insert using REST API in batches of 25
batch_size = 25
inserted = 0
errors = 0

for i in range(0, len(new), batch_size):
    batch = new[i:i+batch_size]
    try:
        r = requests.post(
            f"{url}/rest/v1/components",
            headers=headers,
            json=batch
        )
        if r.status_code in (200, 201):
            inserted += len(batch)
        else:
            # Try one by one
            for item in batch:
                try:
                    r2 = requests.post(
                        f"{url}/rest/v1/components",
                        headers=headers,
                        json=item
                    )
                    if r2.status_code in (200, 201):
                        inserted += 1
                    else:
                        errors += 1
                except:
                    errors += 1
    except:
        errors += len(batch)
    
    if (i // batch_size) % 5 == 0:
        print(f"  Progress: {inserted}/{len(new)} (errors: {errors})")
        sys.stdout.flush()

print(f"\nDone! Inserted: {inserted}, Errors: {errors}")

# Final count
r = requests.get(
    f"{url}/rest/v1/components?select=id&limit=1",
    headers={**headers, "Prefer": "count=exact"}
)
total = int(r.headers.get('Content-Range', '0').split('/')[1]) if 'Content-Range' in r.headers else '?'
print(f"Total in DB: {total}")
