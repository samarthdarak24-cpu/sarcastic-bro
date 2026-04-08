#!/bin/bash

# Script to find hardcoded text in React components
# Usage: bash scripts/find-hardcoded-text.sh

echo "🔍 Finding hardcoded text in components..."
echo "=========================================="
echo ""

# Find all TSX files
find apps/web/src/components -name "*.tsx" | while read file; do
    # Check if file contains useTranslation
    if ! grep -q "useTranslation" "$file"; then
        # Count hardcoded strings (simple heuristic)
        count=$(grep -o '"[A-Z][a-zA-Z ]*"' "$file" | wc -l)
        
        if [ "$count" -gt 0 ]; then
            echo "📄 $file"
            echo "   ⚠️  Not using translations ($count potential strings found)"
            echo ""
        fi
    fi
done

echo "=========================================="
echo "✅ Scan complete!"
echo ""
echo "To implement translations in a component:"
echo "1. Import: import { useTranslation } from 'react-i18next';"
echo "2. Use hook: const { t } = useTranslation();"
echo "3. Replace text: <h1>{t('key.name')}</h1>"
echo "4. Add translations to all 3 JSON files"
