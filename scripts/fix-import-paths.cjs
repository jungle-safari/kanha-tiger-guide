#!/usr/bin/env node
/**
 * Fix ResourcesHub import paths in pages where path is wrong
 */

const fs = require('fs');
const path = require('path');

function findAstroFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findAstroFiles(filePath, fileList);
    } else if (file.endsWith('.astro')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function fixFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Determine correct path
  const relativePath = path.relative(path.join(__dirname, '..', 'src', 'pages'), filepath);
  const depth = relativePath.split(path.sep).length - 1;
  const correctPath = depth === 0
    ? '../components/ResourcesHub.astro'
    : '../../components/ResourcesHub.astro';

  // Check if import exists with wrong path
  const wrongPath = depth === 0
    ? '../../components/ResourcesHub.astro'
    : '../components/ResourcesHub.astro';

  if (content.includes(`import ResourcesHub from '${wrongPath}'`)) {
    content = content.replace(
      `import ResourcesHub from '${wrongPath}'`,
      `import ResourcesHub from '${correctPath}'`
    );
    fs.writeFileSync(filepath, content);
    return true;
  }
  return false;
}

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findAstroFiles(pagesDir);

console.log(`Fixing import paths...\n`);

let fixed = 0;
files.forEach(file => {
  if (fixFile(file)) {
    console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
    fixed++;
  }
});

console.log(`\n✅ Fixed ${fixed} files`);