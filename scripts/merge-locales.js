const fs = require('fs');
const path = require('path');

function mergeJson(sourcePath, targetPath) {
    if (!fs.existsSync(sourcePath)) {
        console.error(`Source file not found: ${sourcePath}`);
        return;
    }
    if (!fs.existsSync(targetPath)) {
        console.error(`Target file not found: ${targetPath}`);
        return;
    }

    const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    
    // Deep merge source into target for specific top-level keys
    // or just overwrite overlapping top-level keys if that's safer.
    // Given the dashboard structure, overwriting top-level keys defined in source is usually what we want.
    const merged = { ...target, ...source };
    
    fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`Successfully merged ${sourcePath} into ${targetPath}`);
}

const lang = process.argv[2];
const baseDir = 'c:/Users/darak/Downloads/mvpm hackathon/apps/web';

const source = path.join(baseDir, `src/i18n/locales/${lang}.json`);
const target = path.join(baseDir, `public/locales/${lang}/translation.json`);

mergeJson(source, target);
