#!/usr/bin/env bash
#
# Download every demo video + thumbnail referenced in data/exercises.json into
# ./videos/{male,female}/ and ./thumbnails/{male,female}/.
#
# Idempotent: files already on disk are skipped, so you can re-run to resume.
# Requires: bash, curl, jq.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$ROOT/data/exercises.json"

command -v jq   >/dev/null || { echo "error: jq is required (brew install jq)"; exit 1; }
command -v curl >/dev/null || { echo "error: curl is required"; exit 1; }
[ -f "$DATA" ] || { echo "error: $DATA not found"; exit 1; }

mkdir -p "$ROOT/videos/male" "$ROOT/videos/female" \
         "$ROOT/thumbnails/male" "$ROOT/thumbnails/female"

# "<dir> <url>" lines for every video + thumbnail across both genders.
JQ='
  .[] |
  ( .videos.male       // empty | "videos/male "       + . ),
  ( .videos.female     // empty | "videos/female "     + . ),
  ( .thumbnails.male   // empty | "thumbnails/male "   + . ),
  ( .thumbnails.female // empty | "thumbnails/female " + . )
'

total=$(jq -r "$JQ" "$DATA" | wc -l | tr -d ' ')
done=0
skipped=0
failed=0

echo "Downloading $total files into $ROOT …"

# Process substitution (not a pipe) keeps counters in the current shell — and
# works on bash 3.2 (macOS default), which lacks mapfile/readarray.
while IFS=' ' read -r dir url; do
  [ -n "$url" ] || continue
  file="$ROOT/$dir/$(basename "$url")"
  done=$((done + 1))
  if [ -s "$file" ]; then
    skipped=$((skipped + 1))
    continue
  fi
  if curl -fsSL --create-dirs -o "$file" "$url"; then
    printf '\r[%d/%d] %s            ' "$done" "$total" "$dir/$(basename "$url")"
  else
    echo "FAIL: $url"
    failed=$((failed + 1))
  fi
done < <(jq -r "$JQ" "$DATA")

echo ""
echo "Done. $total total · $((total - skipped - failed)) downloaded · $skipped already present · $failed failed."
