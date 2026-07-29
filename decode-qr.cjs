const fs = require('fs');
const { Jimp } = require('jimp');
const jsQR = require('jsqr');

async function decode() {
  try {
    const buffer = fs.readFileSync('public/payment-qr.png');
    const image = await Jimp.read(buffer);
    const value = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);
    if (value) {
      console.log('QR_CONTENT_FOUND:', value.data);
    } else {
      console.log('QR_CONTENT_NOT_FOUND');
    }
  } catch (err) {
    console.error(err);
  }
}
decode();
