#!/bin/bash
# Script to upgrade all sub-pages to use the new UI/UX layout
# This script applies the pattern shown in pillar pages to sub-pages

# For each sub-page, we need to:
# 1. Add new imports (Sidebar, AuthorBox, TrustBar, Newsletter, Testimonials)
# 2. Wrap content in grid layout
# 3. Add TrustBar after H1
# 4. Add Testimonials + AuthorBox near end

echo "Pattern script created. Each sub-page needs manual update with the same pattern as pillar pages."
echo "Pattern reference: src/pages/safari-guide/index.astro"
echo ""
echo "Sub-pages to update:"
find src/pages -name "*.astro" | grep -v "index.astro" | sort