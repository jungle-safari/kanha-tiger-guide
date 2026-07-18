#!/usr/bin/env node
/**
 * Script to add deep links to all kanhasafaristay.com pages with keyword anchors
 * Each GitHub Pages page gets backlinks to 3 relevant kanhasafaristay.com pages
 */

const fs = require('fs');
const path = require('path');

// Target URLs on kanhasafaristay.com
const TARGET_PAGES = {
  homepage: 'https://kanhasafaristay.com/',
  blog: 'https://kanhasafaristay.com/blog/',
  faq: 'https://kanhasafaristay.com/faq/',
  wildlifeBlog: 'https://kanhasafaristay.com/blog/wildlife-of-kanha-national-park-beyond-the-tiger/',
  safariBookingBlog: 'https://kanhasafaristay.com/blog/kanha-safari-booking-guide-permits-timings-rules-tips/',
  accommodationBlog: 'https://kanhasafaristay.com/blog/where-to-stay-near-kanha-national-park/',
  zonesBlog: 'https://kanhasafaristay.com/blog/kanha-safari-zones-guide-kanha-mukki-kisli-sarhi/',
  bestTimeBlog: 'https://kanhasafaristay.com/blog/best-time-to-visit-kanha-national-park-for-tiger-safari/'
};

// Page-specific deep link configurations
const PAGE_LINKS = {
  // Homepage
  'src/pages/index.astro': {
    primary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Tiger Safari Package' },
    secondary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari FAQ' },
    tertiary: { url: TARGET_PAGES.blog, anchor: 'Kanha Safari Booking Guide' }
  },

  // Safari Guide pages
  'src/pages/safari-guide/index.astro': {
    primary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Safari Booking Guide' },
    secondary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Tiger Safari Package' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari Permit FAQ' }
  },
  'src/pages/safari-guide/jungle-safari.astro': {
    primary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Jungle Safari Booking Guide' },
    secondary: { url: TARGET_PAGES.homepage, anchor: 'Reserve Kanha Safari Package' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari FAQ' }
  },
  'src/pages/safari-guide/booking.astro': {
    primary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Safari Booking Process' },
    secondary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Safari Online' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari Booking FAQ' }
  },
  'src/pages/safari-guide/permits.astro': {
    primary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Safari Permits Guide' },
    secondary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari Permit FAQ' },
    tertiary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Safari with Permits' }
  },
  'src/pages/safari-guide/timings.astro': {
    primary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Safari Timings & Permits' },
    secondary: { url: TARGET_PAGES.homepage, anchor: 'Reserve Kanha Morning Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari Timing FAQ' }
  },
  'src/pages/safari-guide/pricing.astro': {
    primary: { url: TARGET_PAGES.homepage, anchor: 'View Kanha Safari Package Prices' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Safari Cost Guide' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari Pricing FAQ' }
  },

  // Resorts pages
  'src/pages/resorts/index.astro': {
    primary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Where to Stay Near Kanha Guide' },
    secondary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Resort Stay' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Accommodation FAQ' }
  },
  'src/pages/resorts/best-resort.astro': {
    primary: { url: TARGET_PAGES.homepage, anchor: 'Book Best Kanha Resort Stay' },
    secondary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Kanha Accommodation Guide' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Resort FAQ' }
  },
  'src/pages/resorts/luxury-resort.astro': {
    primary: { url: TARGET_PAGES.homepage, anchor: 'Reserve Luxury Kanha Resort' },
    secondary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Luxury Kanha Accommodation Guide' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Luxury Resort FAQ' }
  },
  'src/pages/resorts/budget-resort.astro': {
    primary: { url: TARGET_PAGES.homepage, anchor: 'Book Budget Kanha Resort' },
    secondary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Affordable Kanha Stays Guide' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Budget Stay FAQ' }
  },
  'src/pages/resorts/near-khatia-gate.astro': {
    primary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Resort Near Khatia Gate' },
    secondary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Kanha Gate Accommodation Guide' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Khatia Gate Resort FAQ' }
  },

  // Safari Zones pages
  'src/pages/safari-zones/index.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Kanha Safari Zones Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Kanha Zone Safari Booking' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari Zone FAQ' }
  },
  'src/pages/safari-zones/kanha-zone.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Kanha Zone Safari Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kanha Zone Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Zone Permit FAQ' }
  },
  'src/pages/safari-zones/kisli-zone.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Kisli Zone Safari Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kisli Zone Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kisli Zone FAQ' }
  },
  'src/pages/safari-zones/mukki-zone.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Mukki Zone Safari Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Mukki Zone Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Mukki Zone FAQ' }
  },
  'src/pages/safari-zones/sarhi-zone.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Sarhi Zone Safari Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Sarhi Zone Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Sarhi Zone FAQ' }
  },

  // Wildlife pages
  'src/pages/wildlife/index.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Wildlife Guide' },
    secondary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time for Kanha Wildlife' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Wildlife FAQ' }
  },
  'src/pages/wildlife/tigers.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Tigers Wildlife Guide' },
    secondary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time to See Tigers' },
    tertiary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Tiger Safari at Kanha' }
  },
  'src/pages/wildlife/barasingha.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Barasingha Wildlife Guide' },
    secondary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time for Kanha Barasingha' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Wildlife FAQ' }
  },
  'src/pages/wildlife/birds.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Birds Wildlife Guide' },
    secondary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time for Kanha Birding' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Birds FAQ' }
  },
  'src/pages/wildlife/leopards.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Leopards Wildlife Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kanha Leopard Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Big Cats FAQ' }
  },

  // Travel Info pages
  'src/pages/travel-info/index.astro': {
    primary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time to Visit Kanha Guide' },
    secondary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Kanha Travel Accommodation' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Travel FAQ' }
  },
  'src/pages/travel-info/how-to-reach.astro': {
    primary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Kanha Travel & Timing Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kanha Safari Transfer' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Travel FAQ' }
  },
  'src/pages/travel-info/best-time.astro': {
    primary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time to Visit Kanha' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kanha Seasonal Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Season FAQ' }
  },
  'src/pages/travel-info/places-near.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Kanha Multi-Park Safari Guide' },
    secondary: { url: TARGET_PAGES.accommodationBlog, anchor: 'Kanha Region Accommodation' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Nearby Parks FAQ' }
  },

  // Kanha National Park pages
  'src/pages/kanha-national-park/history.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Park History & Wildlife' },
    secondary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Heritage Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha History FAQ' }
  },
  'src/pages/kanha-national-park/geography.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Kanha Geography & Zones Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kanha Safari Package' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Geography FAQ' }
  },
  'src/pages/kanha-national-park/famous-for.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Famous Wildlife Guide' },
    secondary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time for Kanha Wildlife' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Wildlife FAQ' }
  },
  'src/pages/kanha-national-park/map.astro': {
    primary: { url: TARGET_PAGES.zonesBlog, anchor: 'Kanha Zone Map Guide' },
    secondary: { url: TARGET_PAGES.safariBookingBlog, anchor: 'Book Kanha Zone Safari' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Map FAQ' }
  },
  'src/pages/kanha-national-park/photos.astro': {
    primary: { url: TARGET_PAGES.wildlifeBlog, anchor: 'Kanha Wildlife Photography Guide' },
    secondary: { url: TARGET_PAGES.bestTimeBlog, anchor: 'Best Time for Kanha Photos' },
    tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Photography FAQ' }
  }
};

// Default fallback for any page not mapped
const DEFAULT_LINKS = {
  primary: { url: TARGET_PAGES.homepage, anchor: 'Book Kanha Tiger Safari Package' },
  secondary: { url: TARGET_PAGES.blog, anchor: 'Kanha Safari Booking Guide' },
  tertiary: { url: TARGET_PAGES.faq, anchor: 'Kanha Safari FAQ' }
};

function updatePage(filepath) {
  const relativePath = path.relative(process.cwd(), filepath);
  const links = PAGE_LINKS[relativePath] || DEFAULT_LINKS;

  let content = fs.readFileSync(filepath, 'utf8');

  // Skip if already has the new format
  if (content.includes('primaryUrl=')) {
    return false;
  }

  // Find all Backlink instances and add the custom props
  const backlinkRegex = /<Backlink\s*\/?>(?!\s*<\/Backlink>)|<Backlink\s*\n([^]*?)\s*\/>/g;
  let modified = false;

  content = content.replace(backlinkRegex, (match, innerContent) => {
    // Skip if already has primaryUrl
    if (match.includes('primaryUrl')) {
      return match;
    }
    modified = true;

    const propsBlock = `\n      primaryUrl="${links.primary.url}"\n      primaryAnchor="${links.primary.anchor}"\n      secondaryUrl="${links.secondary.url}"\n      secondaryAnchor="${links.secondary.anchor}"\n      tertiaryUrl="${links.tertiary.url}"\n      tertiaryAnchor="${links.tertiary.anchor}"\n    `;

    if (match.endsWith('/>')) {
      // Self-closing tag with attributes
      return `<Backlink ${innerContent}${propsBlock}/>`;
    } else {
      // Simple self-closing tag
      return `<Backlink${propsBlock}/>`;
    }
  });

  if (modified) {
    fs.writeFileSync(filepath, content);
    return true;
  }
  return false;
}

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

const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const files = findAstroFiles(pagesDir);

console.log(`Applying deep-link backlinks to ${files.length} pages...\n`);

let updated = 0;
files.forEach(file => {
  if (updatePage(file)) {
    updated++;
  }
});

console.log(`\n✅ Updated ${updated} pages with deep-link backlinks`);
console.log('Each page now has 3 contextual backlinks to specific kanhasafaristay.com pages');