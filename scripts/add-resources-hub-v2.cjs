#!/usr/bin/env node
/**
 * Add ResourcesHub component to all pages - handles both nested (../../) and root (../) imports
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

function updateFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Skip if already has ResourcesHub
  if (content.includes("import ResourcesHub")) {
    return false;
  }

  // Determine relative path
  const relativePath = path.relative(path.join(__dirname, '..', 'src', 'pages'), filepath);
  const depth = relativePath.split(path.sep).length - 1;
  const componentPath = depth === 0
    ? '../components/ResourcesHub.astro'
    : '../../components/ResourcesHub.astro';

  // Find RelatedPages import path
  const relatedMatch = content.match(/import RelatedPages from ['"]([^'"]+)['"]/);
  if (!relatedMatch) return false;
  const relatedPath = relatedMatch[1];

  // Add ResourcesHub import right after RelatedPages
  const importBlock = `import ResourcesHub from '${componentPath}';`;
  content = content.replace(
    /import RelatedPages from ['"][^'"]+['"];/,
    `import RelatedPages from '${relatedPath}';\n${importBlock}`
  );

  // Add ResourcesHub component before RelatedPages
  if (content.includes('<RelatedPages pages={relatedPages}')) {
    content = content.replace(
      /(\s*)<RelatedPages pages=\{relatedPages\}/,
      '\n      <ResourcesHub />\n\n      <RelatedPages pages={relatedPages}'
    );
    fs.writeFileSync(filepath, content);
    return true;
  }

  return false;
}

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findAstroFiles(pagesDir);

console.log(`Adding ResourcesHub to ${files.length} pages...\n`);

let updated = 0;
files.forEach(file => {
  if (updateFile(file)) updated++;
});

console.log(`\n✅ Added ResourcesHub to ${updated} pages`);