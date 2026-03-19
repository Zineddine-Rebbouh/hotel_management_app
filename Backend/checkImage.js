const https = require('https');

const url = 'https://res.cloudinary.com/drqvw9hqm/image/upload/v1710500000/hotel_1.jpg';

https.get(url, (res) => {
  console.log('status', res.statusCode);
  console.log('type', res.headers['content-type']);
  res.destroy();
}).on('error', (e) => {
  console.error('err', e.message);
  process.exit(1);
});
