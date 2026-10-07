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
  const urls = [
    'https://runway.com/',
    'https://runway.com/product',
    'https://runway.com/research'
  ];
  
  for (const u of urls) {
    const html = await getUrl(u);
    const muxMatches = html.match(/https:\/\/stream\.mux\.com\/([a-zA-Z0-9]+)\.m3u8/g) || [];
    console.log(u, 'found mux streams:', [...new Set(muxMatches)]);
  }
}

run();
