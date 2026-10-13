#!/usr/bin/env python3
"""Search images for each service and save URLs to a single JSON file."""
import json
import re
import subprocess
import sys
from pathlib import Path

OUT = Path("/home/z/my-project/tmp/image-search/results.json")
OUT.parent.mkdir(parents=True, exist_ok=True)

# Each query is a precise description of the exact procedure/service
QUERIES = {
    "laser": "professional woman receiving laser hair removal treatment on leg with handheld laser device in beauty clinic",
    "botox": "qualified medical practitioner administering botox injection with syringe on patient face in clinical aesthetic setting",
    "fillers": "doctor performing dermal filler injection with syringe on female patient cheek in clean clinic",
    "skin-boosters": "professional skincare practitioner performing mesotherapy skin booster injection on female patient face",
    "body-tightening": "client receiving professional radiofrequency body skin tightening treatment with aesthetic device in clinic",
    "body-contouring": "non-invasive cryolipolysis body contouring session with cooling device on client abdomen in aesthetic clinic",
    "rhinoplasty": "non-surgical rhinoplasty nose filler treatment by dermatologist with syringe in clinic close up",
    "hero-clinic": "luxury beauty aesthetic clinic interior with treatment bed modern spa clean professional",
    "doctor-female-1": "professional female dermatologist doctor portrait in white coat smiling",
    "doctor-female-2": "professional female aesthetic medicine doctor portrait in white coat",
    "doctor-female-3": "professional female skincare doctor portrait in clinical white coat",
    "doctor-male-1": "professional male plastic surgeon doctor portrait in white coat confident",
    "doctor-female-4": "professional female body contouring specialist doctor portrait white coat",
}

def search(query, count=3):
    """Run z-ai image-search and parse the JSON portion of the output."""
    try:
        result = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", str(count), "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=180,
        )
        output = result.stdout + result.stderr
        # Find the JSON object containing "success"
        # The JSON might span multiple lines
        json_match = re.search(r'\{[\s\S]*"success"[\s\S]*\}', output)
        if not json_match:
            print(f"  ! No JSON found for: {query}", file=sys.stderr)
            return None
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError as e:
            print(f"  ! JSON decode error: {e}", file=sys.stderr)
            return None
    except subprocess.TimeoutExpired:
        print(f"  ! Timeout for: {query}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  ! Error for {query}: {e}", file=sys.stderr)
        return None

def main():
    all_results = {}
    for key, query in QUERIES.items():
        print(f"\n[{key}] Searching: {query[:80]}...", flush=True)
        data = search(query)
        if not data or not data.get("success"):
            print(f"  ! Failed: {data.get('error') if data else 'no data'}")
            all_results[key] = None
            continue
        results = data.get("results", [])
        print(f"  ✓ Got {len(results)} images")
        for i, r in enumerate(results):
            print(f"    [{i}] {r.get('source')} - {r.get('original_width')}x{r.get('original_height')}")
        all_results[key] = [
            {
                "url": r.get("original_url"),
                "source": r.get("source"),
                "width": r.get("original_width"),
                "height": r.get("original_height"),
            }
            for r in results
        ]
        OUT.write_text(json.dumps(all_results, indent=2, ensure_ascii=False))
    print(f"\n✅ Done. Results saved to {OUT}")

if __name__ == "__main__":
    main()
