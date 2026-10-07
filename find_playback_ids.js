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
  const html = await getUrl('https://runway.com/');
  // Match script tags with next.js data or json
  const jsonMatches = html.match(/"playbackId":"([^"]+)"/g) || [];
  console.log('Found playbackIds in runway.com:', [...new Set(jsonMatches)]);

  const videoSrcMatches = html.match(/"https:\/\/[^"]+\.(?:mp4|webm)"/g) || [];
  console.log('Direct video URLs:', [...new Set(videoSrcMatches)]);
  
  // also check research Gen-4.5
  const genHtml = await getUrl('https://runway.com/research/introducing-runway-gen-4.5');
  const genVideos = genHtml.match(/"https:\/\/[^"]+\.(?:mp4|webm)"/g) || [];
  console.log('Gen-4.5 direct videos:', [...new Set(genVideos)]);
  
  const genPlayback = genHtml.match(/"playbackId":"([^"]+)"/g) || [];
  console.log('Gen-4.5 playbackIds:', [...new Set(genPlayback)]);
}

run();
