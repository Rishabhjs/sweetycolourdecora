const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const html = await fetchUrl('https://runwayml.com/research/introducing-runway-gen-4.5');
    console.log('HTML length:', html.length);
    const videoTags = html.match(/<video[\s\S]*?<\/video>/gi) || [];
    console.log('Video tags count:', videoTags.length);
    const srcMatches = html.match(/https:\/\/[^"'\s<>]+\.(?:mp4|webm|mov)[^"'\s<>]*/gi) || [];
    console.log('Video URLs in Gen-4.5:', [...new Set(srcMatches)].slice(0, 10));
    
    // Also check product page
    const productHtml = await fetchUrl('https://runwayml.com/product');
    const productVideos = productHtml.match(/https:\/\/[^"'\s<>]+\.(?:mp4|webm|mov)[^"'\s<>]*/gi) || [];
    console.log('Video URLs in Product:', [...new Set(productVideos)].slice(0, 10));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

run();
