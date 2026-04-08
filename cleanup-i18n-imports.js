const fs = require('fs');
const path = require('path');

// Function to clean i18n imports and hooks from a file
function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove import statements for i18n
  const importPatterns = [
    /import\s+{\s*useTranslation\s*}\s+from\s+['"]react-i18next['"];\s*\n/g,
    /import\s+['"]@\/lib\/i18n['"];\s*\n/g,
    /import\s+i18n\s+from\s+['"]@\/lib\/i18n['"];\s*\n/g,
  ];

  importPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });

  // Remove useTranslation hook declarations
  const hookPatterns = [
    /const\s+{\s*t\s*}\s*=\s*useTranslation\(\);\s*\n/g,
    /const\s+{\s*t,\s*i18n\s*}\s*=\s*useTranslation\(\);\s*\n/g,
  ];

  hookPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned: ${filePath}`);
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
console.log('🧹 Cleaning i18n imports and hooks...\n');
const files = findFiles('apps/web/src');

let cleanedCount = 0;
files.forEach(file => {
  if (cleanFile(file)) {
    cleanedCount++;
  }
});

console.log(`\n✅ Cleaned ${cleanedCount} files!`);
