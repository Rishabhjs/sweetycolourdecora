const https = require('https');

https.get('https://texture.ai/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const regex = /https:\/\/[^"']+\.mp4[^"']*/g;
    const matches = html.match(regex) || [];
    console.log('Texture.ai MP4 count:', matches.length);
    const unique = Array.from(new Set(matches));
    console.log('Texture.ai unique videos:\n' + unique.join('\n'));
  });
});
