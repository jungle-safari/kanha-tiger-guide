#!/usr/bin/env node
/**
 * Add ResourcesHub component to all pages with color-coded kanhasafaristay.com backlinks
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

  // Add the import
  const importBlock = "import ResourcesHub from '../../components/ResourcesHub.astro';\n";

  // Find the RelatedPages import and add ResourcesHub after it
  if (content.includes("import RelatedPages")) {
    content = content.replace(
      /import RelatedPages from ['"][^'"]+['"];/,
      `import RelatedPages from '${content.match(/import RelatedPages from ['"]([^'"]+)['"]/)[1]}';\n${importBlock.trim()}`
    );
  }

  // Add the ResourcesHub component before RelatedPages
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
console.log('Each page now displays color-coded backlinks to ALL kanhasafaristay.com pages');