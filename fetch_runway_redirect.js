const https = require('https');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return resolve(getUrl(redirectUrl));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const html = await getUrl('https://runway.com/');
    console.log('Fetched runway.com length:', html.length);
    const videoMatches = html.match(/https:\/\/[^"'\s<>]+\.(?:mp4|webm)/gi) || [];
    console.log('Runway.com direct mp4/webm:', [...new Set(videoMatches)].slice(0, 15));
    
    // Also check for cdn assets or vimeo / cloudflare streams
    const cdnMatches = html.match(/https:\/\/[^"'\s<>]*(?:cdn|asset|media|video)[^"'\s<>]*\.(?:mp4|webm)/gi) || [];
    console.log('CDN videos:', [...new Set(cdnMatches)].slice(0, 15));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

run();
