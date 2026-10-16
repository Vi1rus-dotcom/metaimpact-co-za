#!/bin/bash
PDF="https://metaimpact.co.za/assets/docs/Meta-Impact-Company-Profile-2026.pdf"
for i in 1 2 3 4 5 6 7 8 9 10; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$PDF?v=$(date +%s)")
  size=$(curl -s "$PDF?v=$(date +%s)" | wc -c)
  echo "attempt $i: PDF HTTP $code size $size"
  if [ "$code" = "200" ] && [ "$size" -gt 600000 ]; then break; fi
  sleep 25
done
