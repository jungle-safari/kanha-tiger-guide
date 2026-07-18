#!/usr/bin/env node
/**
 * Script to replace Backlink components with keyword-rich anchor text variations
 */

const fs = require('fs');
const path = require('path');

const ANCHOR_VARIATIONS = [
  {
    title: 'Book Kanha Tiger Safari Stay at Khatia Gate',
    description: 'For the best Kanha tiger safari packages near Khatia Gate — including AC accommodation, all meals, forest permits, and guided jeep tours — check Kanha Safari Stay at Wildmark Resort.',
    anchorText: 'Book Kanha Tiger Safari Package',
    ctaText: 'Reserve Kanha Resort Stay'
  },
  {
    title: 'Plan Your Kanha Jungle Safari Package',
    description: 'Looking for complete Kanha jungle safari packages with accommodation, meals, and forest permits? Wildmark Resort near Khatia Gate offers all-inclusive Kanha safari booking.',
    anchorText: 'Book Kanha Jungle Safari Package',
    ctaText: 'Kanha Safari Booking Online'
  },
  {
    title: 'Best Kanha Tiger Safari Packages 2026',
    description: 'Get the best Kanha tiger safari packages starting from ₹X,XXX per person. Wildmark Resort near Khatia Gate provides comfortable stays with safari permits, jeep, and guide included.',
    anchorText: 'View Kanha Safari Package Deals',
    ctaText: 'Kanha Tiger Safari Booking'
  },
  {
    title: 'Kanha Accommodation Near Khatia Gate',
    description: 'Looking for Kanha accommodation near Khatia Gate? Wildmark Resort offers the closest stays to the safari entry with complete packages and expert naturalist guides.',
    anchorText: 'Book Kanha Resort Near Khatia Gate',
    ctaText: 'Kanha Resort Booking'
  },
  {
    title: 'Reserve Your Kanha Safari Holiday Package',
    description: 'Plan your Kanha safari holiday with all-inclusive packages at Wildmark Resort. Includes AC rooms, multi-cuisine dining, swimming pool, and tiger safari permits.',
    anchorText: 'Reserve Kanha Safari Holiday',
    ctaText: 'Kanha Tiger Safari Package 2026'
  }
];

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

function updateBacklinks(filepath, index) {
  let content = fs.readFileSync(filepath, 'utf8');
  const variation = ANCHOR_VARIATIONS[index % ANCHOR_VARIATIONS.length];

  // Find Backlink instances and add custom props
  const backlinkRegex = /<Backlink\s*(\/?>|\s+([^>]*?)\/?>)/g;
  let modified = false;

  content = content.replace(backlinkRegex, (match, endPart, attrs) => {
    // If already has custom props, skip
    if (attrs && attrs.includes('title=')) {
      return match;
    }
    modified = true;

    // Add new attributes
    const props = `\n      title="${variation.title}"\n      description="${variation.description}"\n      anchorText="${variation.anchorText}"\n      ctaText="${variation.ctaText}"\n    `;
    return `<Backlink${props}/>`;
  });

  if (modified) {
    fs.writeFileSync(filepath, content);
    return true;
  }
  return false;
}

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findAstroFiles(pagesDir);

console.log(`Updating ${files.length} files with keyword-rich anchors...\n`);

let updated = 0;
files.forEach((file, index) => {
  if (updateBacklinks(file, index)) {
    updated++;
  }
});

console.log(`\n✅ Updated ${updated} pages with keyword anchor variations`);