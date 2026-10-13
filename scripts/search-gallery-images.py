#!/usr/bin/env python3
"""Search before/after gallery images and save to existing results.json."""
import json
import re
import subprocess
import sys
from pathlib import Path

OUT = Path("/home/z/my-project/tmp/image-search/results.json")
existing = json.loads(OUT.read_text() or "{}")

QUERIES = {
    "gallery-laser-before": "womans leg with hair growth before laser hair removal",
    "gallery-laser-after": "womans leg with smooth skin after laser hair removal treatment",
    "gallery-botox-before": "womans forehead with frown lines wrinkles close up before botox",
    "gallery-botox-after": "womans forehead smooth and youthful after botox treatment close up",
    "gallery-fillers-before": "womans thin lips close up before dermal filler",
    "gallery-fillers-after": "womans full plump lips after dermal filler treatment close up",
    "gallery-skin-before": "womans face dull tired skin before mesotherapy skin booster",
    "gallery-skin-after": "womans face glowing radiant skin after skin booster treatment",
    "gallery-body-before": "womans abdomen loose skin before body contouring",
    "gallery-body-after": "womans abdomen toned slim after body contouring treatment",
    "gallery-nose-before": "womans nose profile with bump before non-surgical rhinoplasty",
    "gallery-nose-after": "womans nose profile straight after non-surgical rhinoplasty filler",
}

def search(query, count=2):
    try:
        result = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", str(count), "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=180,
        )
        output = result.stdout + result.stderr
        json_match = re.search(r'\{[\s\S]*"success"[\s\S]*\}', output)
        if not json_match:
            return None
        return json.loads(json_match.group(0))
    except Exception as e:
        print(f"  ! Error: {e}", file=sys.stderr)
        return None

def main():
    all_results = dict(existing)
    for key, query in QUERIES.items():
        print(f"\n[{key}] Searching: {query[:80]}...", flush=True)
        data = search(query)
        if not data or not data.get("success"):
            print(f"  ! Failed")
            all_results[key] = None
            continue
        results = data.get("results", [])
        print(f"  ✓ Got {len(results)} images")
        for i, r in enumerate(results):
            print(f"    [{i}] {r.get('source')} - {r.get('original_width')}x{r.get('original_height')}")
        all_results[key] = [
            {"url": r.get("original_url"), "source": r.get("source"),
             "width": r.get("original_width"), "height": r.get("original_height")}
            for r in results
        ]
        OUT.write_text(json.dumps(all_results, indent=2, ensure_ascii=False))
    print(f"\n✅ Done.")

if __name__ == "__main__":
    main()
