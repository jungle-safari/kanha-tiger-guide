#!/usr/bin/env node
/**
 * Fix script - removes duplicate imports and fixes TrustBar category extraction
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
  let changed = false;

  // Fix 1: Remove duplicate Hero imports
  const heroImportRegex = /import Hero from '[^']+';\n/g;
  const matches = [...content.matchAll(heroImportRegex)];
  if (matches.length > 1) {
    // Keep only the first one
    let firstFound = false;
    content = content.replace(heroImportRegex, (match) => {
      if (!firstFound) {
        firstFound = true;
        return match;
      }
      return ''; // Remove duplicates
    });
    changed = true;
    console.log(`✅ Removed duplicate Hero imports: ${filepath}`);
  }

  // Fix 2: Fix TrustBar category prop - it captured the next line as category
  const brokenTrustBar = /<TrustBar category="<p class="text-lg italic" readingTime=\{8\} \/>/g;
  if (brokenTrustBar.test(content)) {
    content = content.replace(brokenTrustBar, '<TrustBar category="Travel Guide" readingTime={8} />');
    changed = true;
    console.log(`✅ Fixed TrustBar category: ${filepath}`);
  }

  // Fix 3: Handle missing closing tags - the script may have broken some HTML structure
  // Check if there's a missing </div> before closing
  const brokenStructure = /(<section class="answer-block">[\s\S]*?<\/section>)([\s\S]*?)(<\/main>)/g;
  if (brokenStructure.test(content)) {
    // Ensure structure is valid by checking for unclosed tags
    const mainOpenCount = (content.match(/<main /g) || []).length;
    const mainCloseCount = (content.match(/<\/main>/g) || []).length;
    if (mainOpenCount === mainCloseCount) {
      // Structure looks fine
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, content);
  }
  return changed;
}

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findAstroFiles(pagesDir);

console.log(`Checking ${files.length} files for issues...\n`);

let fixed = 0;
files.forEach(file => {
  if (fixFile(file)) fixed++;
});

console.log(`\n✅ Fixed ${fixed} files`);
console.log('Now run "npm run build" to verify.');