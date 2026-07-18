#!/usr/bin/env node
/**
 * Script to upgrade sub-pages with the new UI/UX pattern
 * - Adds new imports
 * - Wraps content in 3-column grid with sidebar
 * - Adds TrustBar after H1
 * - Adds Testimonials + AuthorBox before closing
 */

const fs = require('fs');
const path = require('path');

const NEW_IMPORTS = `import Hero from '../../components/Hero.astro';
import AuthorBox from '../../components/AuthorBox.astro';
import TrustBar from '../../components/TrustBar.astro';
import Newsletter from '../../components/Newsletter.astro';
import Sidebar from '../../components/Sidebar.astro';
import Testimonials from '../../components/Testimonials.astro';`;

// Process a file
function upgradeFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Skip if already upgraded (has TrustBar import)
  if (content.includes('import TrustBar')) {
    console.log(`⏭  Skipped (already upgraded): ${filepath}`);
    return false;
  }

  // Skip if not an Astro file
  if (!filepath.endsWith('.astro')) return false;

  // Add new imports after the last existing import
  const importRegex = /^import .+;$/gm;
  let lastImportMatch = null;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportMatch = match;
  }

  if (lastImportMatch) {
    const insertPos = lastImportMatch.index + lastImportMatch[0].length;
    content = content.slice(0, insertPos) + '\n' + NEW_IMPORTS + content.slice(insertPos);
  }

  // Wrap content in grid layout
  // Replace <main ...> with grid layout
  content = content.replace(
    /<main class="max-w-5xl mx-auto px-4 py-8">/g,
    '<main class="max-w-7xl mx-auto px-4 py-6">\n    <div class="grid lg:grid-cols-3 gap-8">\n      <div class="lg:col-span-2">'
  );

  // Replace closing </main> to include sidebar and grid closure
  content = content.replace(
    /<\/main>\n\n  <Footer \/>/g,
    `      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-32">
          <Sidebar currentPath={Astro.url.pathname} />
        </div>
      </div>
    </div>

    <RelatedPages pages={relatedPages} />

  </main>

  <Footer />`
  );

  // Add TrustBar after H1 if not present
  if (!content.includes('<TrustBar')) {
    content = content.replace(
      /(<h1[^>]*>[^<]+<\/h1>)\s*\n\s*(<p class="text-lg italic)/g,
      '$1\n\n        <TrustBar category="$2" readingTime={8} />\n\n        <p class="text-lg italic'
    );
  }

  // Add AuthorBox before FAQ closing
  if (!content.includes('<AuthorBox')) {
    content = content.replace(
      /(<FAQ faqs=\{faqs\} \/>)/g,
      '$1\n\n        <Testimonials />\n\n        <AuthorBox />'
    );
  }

  fs.writeFileSync(filepath, content);
  console.log(`✅ Upgraded: ${filepath}`);
  return true;
}

// Find all sub-pages
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

// Process all pages
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findAstroFiles(pagesDir);

console.log(`Found ${files.length} Astro files. Upgrading sub-pages...\n`);

let upgraded = 0;
files.forEach(file => {
  if (upgradeFile(file)) upgraded++;
});

console.log(`\n✅ Upgraded ${upgraded} pages`);
console.log('Run "npm run build" to verify everything works.');