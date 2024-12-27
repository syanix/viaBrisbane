import fs from 'fs/promises';
import path from 'path';

// Define your base URL
const BASE_URL = 'https://www.viabrisbane.com';

// Define static entries
const staticUrls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about-us', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact-us', changefreq: 'monthly', priority: 0.8 },
  { url: '/parking-meters', changefreq: 'daily', priority: 0.9 },
  { url: '/resources', changefreq: 'weekly', priority: 0.7 }, // Added resources page
  { url: '/events', changefreq: 'daily', priority: 0.9 }, // Added events page
];

// Function to remove trailing slashes
function removeTrailingSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// Fetch dynamic URLs from a JSON file
async function fetchDynamicUrls() {
  const filePath = path.resolve('./data/url_parking_meters.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const parkingMeterData = JSON.parse(jsonData);

  return parkingMeterData.map((entry) => ({
    url: removeTrailingSlash(entry.URL),
    changefreq: 'daily',
    priority: 0.8,
  }));
}

// Generate the XML content for the sitemap
function generateSitemapXml(urls) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const urlsetClose = `</urlset>`;

  const urlEntries = urls
    .map(
      (entry) => `
    <url>
      <loc>${BASE_URL}${entry.url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${entry.changefreq}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`
    )
    .join('');

  return `${xmlHeader}${urlsetOpen}${urlEntries}${urlsetClose}`;
}

// Generate the XML content for the sitemap index
function generateSitemapIndexXml(files) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
  const sitemapIndexOpen = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const sitemapIndexClose = `</sitemapindex>`;

  const sitemapEntries = files
    .map(
      (file) => `
    <sitemap>
      <loc>${BASE_URL}/${file}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`
    )
    .join('');

  return `${xmlHeader}${sitemapIndexOpen}${sitemapEntries}${sitemapIndexClose}`;
}

// Main function to generate the sitemaps
async function generateSitemap() {
  try {
    // Ensure the output directory exists
    const outputDir = path.resolve('./dist');
    await fs.mkdir(outputDir, { recursive: true });

    const dynamicUrls = await fetchDynamicUrls();
    const allUrls = [...staticUrls, ...dynamicUrls];

    // Split into multiple sitemap files if necessary
    const maxUrlsPerFile = 50000;
    const sitemapFiles = [];
    for (let i = 0; i < allUrls.length; i += maxUrlsPerFile) {
      const chunk = allUrls.slice(i, i + maxUrlsPerFile);
      const filename = `sitemap-${sitemapFiles.length}.xml`;
      const sitemapXml = generateSitemapXml(chunk);
      await fs.writeFile(path.join(outputDir, filename), sitemapXml, 'utf8');
      sitemapFiles.push(filename);
    }

    // Generate sitemap index file
    const sitemapIndexXml = generateSitemapIndexXml(sitemapFiles);
    await fs.writeFile(path.join(outputDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf8');

    console.log('Sitemaps generated successfully:');
    console.log(sitemapFiles.map((file) => `${BASE_URL}/${file}`).join('\n'));
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Execute the function
generateSitemap();