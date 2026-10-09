import { writeFileSync } from 'fs';

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

writeFileSync('public/pwa-192x192.png', png);
writeFileSync('public/pwa-512x512.png', png);
console.log('Icons created');
