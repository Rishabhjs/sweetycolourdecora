const https = require('https');

const candidates = [
  'https://runway-static-assets.s3.amazonaws.com/site/videos/hero.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/hero_desktop.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/home_hero.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/gen2.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/gen3.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/gen4.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/reel.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/reel_desktop.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/404_001.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/404_002.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/404_003.mp4',
  'https://runway-static-assets.s3.amazonaws.com/site/videos/banner.mp4'
];

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(res.statusCode, url);
      resolve(res.statusCode === 200 ? url : null);
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (const c of candidates) {
    await check(c);
  }
}
run();
