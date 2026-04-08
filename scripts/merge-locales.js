const fs = require('fs');
const path = require('path');

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

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
    
    // Deep merge source into target
    const merged = mergeDeep(target, source);
    
    fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`Successfully deep merged ${sourcePath} into ${targetPath}`);
}

const lang = process.argv[2];
const baseDir = 'c:/Users/darak/Downloads/mvpm hackathon/apps/web';

const source = path.join(baseDir, `src/i18n/locales/${lang}.json`);
const target = path.join(baseDir, `public/locales/${lang}/translation.json`);

mergeJson(source, target);
