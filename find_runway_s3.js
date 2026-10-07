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
    // look for s3.amazonaws, mux, cloudflarestream, or runway-static-assets
    const s3Matches = html.match(/https:\/\/[^"'\s<>]*(?:s3\.amazonaws|runway-static|mux\.com|cloudfront)[^"'\s<>]*/gi) || [];
    console.log('S3/Cloudfront matches count:', s3Matches.length);
    const videoExt = s3Matches.filter(u => u.includes('video') || u.includes('.mp4') || u.includes('.webm') || u.includes('stream'));
    console.log('Video related URLs:', [...new Set(videoExt)].slice(0, 20));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

run();
