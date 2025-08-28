import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

async function fetchPinterestMeta() {
  try {
    console.log('Fetching Pinterest page...');

    const response = await fetch('https://www.pinterest.com/pin/211174978486592/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('Page fetched, parsing HTML...');

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract all meta tags related to social sharing
    const metaTags = {
      og: {},
      twitter: {},
      other: {},
    };

    // Find all meta tags
    const allMetas = document.querySelectorAll('meta');

    allMetas.forEach((meta) => {
      const property = meta.getAttribute('property');
      const name = meta.getAttribute('name');
      const content = meta.getAttribute('content');

      if (property && property.startsWith('og:')) {
        metaTags.og[property] = content;
      } else if (name && name.startsWith('twitter:')) {
        metaTags.twitter[name] = content;
      } else if ((property || name) && content) {
        // Capture other important meta tags
        const key = property || name;
        if (key.includes('image') || key.includes('title') || key.includes('description')) {
          metaTags.other[key] = content;
        }
      }
    });

    console.log('Pinterest Meta Tags Structure:');
    console.log('================================');
    console.log('Open Graph Tags:');
    console.log(JSON.stringify(metaTags.og, null, 2));
    console.log('\nTwitter Tags:');
    console.log(JSON.stringify(metaTags.twitter, null, 2));
    console.log('\nOther Relevant Tags:');
    console.log(JSON.stringify(metaTags.other, null, 2));

    // Generate optimized meta tags for our use case
    generateOptimizedMeta(metaTags);
  } catch (error) {
    console.error('Error fetching Pinterest meta:', error);
  }
}

function generateOptimizedMeta(metaTags) {
  console.log('\n================================');
  console.log('RECOMMENDED META TAGS FOR SUIFEST:');
  console.log('================================');

  const template = `
        <!-- Essential Meta Tags -->
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SuiFest Card</title>
        <meta name="description" content="Check out this amazing SuiFest Card! Create your own and join the community.">
        
        <!-- Open Graph Tags -->
        <meta property="og:type" content="article">
        <meta property="og:url" content="\${shareUrl}">
        <meta property="og:site_name" content="SuiFest">
        <meta property="og:title" content="SuiFest Card">
        <meta property="og:description" content="Check out this amazing SuiFest Card! Create your own and join the community.">
        <meta property="og:image" content="\${directImageUrl}">
        <meta property="og:image:secure_url" content="\${directImageUrl}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="SuiFest Card">
        
        <!-- Twitter Card Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="\${shareUrl}">
        <meta name="twitter:title" content="SuiFest Card">
        <meta name="twitter:description" content="Check out this amazing SuiFest Card! Create your own and join the community.">
        <meta name="twitter:image" content="\${directImageUrl}">
        <meta name="twitter:image:alt" content="SuiFest Card">
        
        <!-- Additional Tags for Better Compatibility -->
        <link rel="canonical" href="\${shareUrl}">
  `;

  console.log(template);
}

// Run the script
fetchPinterestMeta();
