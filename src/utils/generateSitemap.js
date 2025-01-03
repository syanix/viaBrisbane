import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.viabrisbane.com';

// Define static entries
const staticUrls = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about-us', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact-us', changefreq: 'monthly', priority: 0.8 },
    { url: '/parking-meters', changefreq: 'daily', priority: 0.9 },
    { url: '/resources', changefreq: 'weekly', priority: 0.7 },
    { url: '/events', changefreq: 'daily', priority: 0.9 },
];

// Function to generate the XML content for a sitemap
function generateSitemapXml(urls) {
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
    const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    const urlsetClose = `</urlset>`;

    const urlEntries = urls
        .map(entry => `
    <url>
        <loc>${BASE_URL}${entry.url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
    </url>`).join('');

    return `${xmlHeader}${urlsetOpen}${urlEntries}${urlsetClose}`;
}

// Main function to generate the sitemaps
async function generateSitemap() {
    try {
        const outputDir = path.resolve('./dist');
        await fs.mkdir(outputDir, { recursive: true });

        // Generate static pages sitemap
        const staticSitemapXml = generateSitemapXml(staticUrls);
        await fs.writeFile(path.join(outputDir, 'sitemap-static.xml'), staticSitemapXml, 'utf8');

        // Generate parking meters sitemap
        const parkingMetersJson = await fs.readFile('./data/url_parking_meters.json', 'utf8');
        const parkingMeters = JSON.parse(parkingMetersJson);
        const parkingUrls = parkingMeters.map(entry => ({
            url: `/parking-meters/${entry.URL}`,
            changefreq: 'weekly',
            priority: 0.7
        }));
        const parkingSitemapXml = generateSitemapXml(parkingUrls);
        await fs.writeFile(path.join(outputDir, 'sitemap-parking.xml'), parkingSitemapXml, 'utf8');

        // Generate events sitemap
        const eventsJson = await fs.readFile('./data/url_events.json', 'utf8');
        const events = JSON.parse(eventsJson);
        const eventUrls = events.map(entry => ({
            url: `/events/${entry.URL}`,
            changefreq: 'daily',
            priority: 0.8
        }));
        const eventsSitemapXml = generateSitemapXml(eventUrls);
        await fs.writeFile(path.join(outputDir, 'sitemap-events.xml'), eventsSitemapXml, 'utf8');

        // Generate food trucks sitemap
        const foodTrucksJson = await fs.readFile('./data/url_food_trucks.json', 'utf8');
        const foodTrucks = JSON.parse(foodTrucksJson);
        const foodTruckUrls = foodTrucks.map(entry => ({
            url: `/${entry.URL}`,  // URL already includes food-trucks/ prefix
            changefreq: 'weekly',
            priority: 0.7
        }));
        const foodTrucksSitemapXml = generateSitemapXml(foodTruckUrls);
        await fs.writeFile(path.join(outputDir, 'sitemap-food-trucks.xml'), foodTrucksSitemapXml, 'utf8');

        // Generate sitemap index with new food trucks sitemap
        const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${BASE_URL}/sitemap-static.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${BASE_URL}/sitemap-parking.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${BASE_URL}/sitemap-events.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${BASE_URL}/sitemap-food-trucks.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
</sitemapindex>`;

        await fs.writeFile(path.join(outputDir, 'sitemap-index.xml'), sitemapIndex, 'utf8');

        console.log('Sitemaps generated successfully:');
        console.log(`${BASE_URL}/sitemap-index.xml`);
        console.log(`${BASE_URL}/sitemap-static.xml`);
        console.log(`${BASE_URL}/sitemap-parking.xml`);
        console.log(`${BASE_URL}/sitemap-events.xml`);
        console.log(`${BASE_URL}/sitemap-food-trucks.xml`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();