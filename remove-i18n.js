const fs = require('fs');
const path = require('path');

// Load English translations
const translations = JSON.parse(
  fs.readFileSync('apps/web/public/locales/en/translation.json', 'utf8')
);

// Function to get nested value from object using dot notation
function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o || {})[k], obj);
}

// Function to process a file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Match t('key') or t("key") patterns
  const regex = /t\(['"]([^'"]+)['"]\)/g;
  
  content = content.replace(regex, (match, key) => {
    const value = getNestedValue(translations, key);
    if (value) {
      modified = true;
      // Escape quotes in the value
      const escapedValue = value.replace(/"/g, '\\"');
      return `"${escapedValue}"`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Function to recursively find all .tsx and .ts files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, and other build directories
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main execution
console.log('🔍 Finding all TypeScript/React files...\n');
const files = findFiles('apps/web/src');

console.log(`📝 Processing ${files.length} files...\n`);
let updatedCount = 0;

files.forEach(file => {
  if (processFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Complete! Updated ${updatedCount} files.`);
console.log('\n📌 Next steps:');
console.log('1. Remove i18n imports and hooks from components');
console.log('2. Remove I18nProvider from layout.tsx');
console.log('3. Restart the frontend server');
