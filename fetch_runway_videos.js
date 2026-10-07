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
    const html = await fetchUrl('https://runwayml.com');
    const matches = html.match(/https:\/\/[^"'\s<>]+\.(?:mp4|webm)/gi) || [];
    const unique = [...new Set(matches)];
    console.log('Found Runway video files count:', unique.length);
    console.log('Video URLs:', unique.slice(0, 15));
  } catch (e) {
    console.error('Error fetching runway:', e.message);
  }
}

run();
