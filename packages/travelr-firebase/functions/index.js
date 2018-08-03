/* eslint no-console:0 comma-dangle:0 */

const functions = require('firebase-functions');
const os = require('os');
const path = require('path');

const storage = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision');
const { spawn } = require('child-process-promise');

const visionClient = new vision.ImageAnnotatorClient();

// Blurs the given image using ImageMagick.
const blurImage = async file => {
  try {
    // download the image
    const tempLocalFilename = path.join(os.tmpdir(), path.basename(file.name));
    await file.download({ destination: tempLocalFilename });

    // blur the image
    await spawn('convert', [
      tempLocalFilename,
      '-type',
      'GrayScale',
      '-blur',
      '0x48',
      tempLocalFilename
    ]);

    // upload the image to the `/sanitized/` folder
    await file.bucket.upload(tempLocalFilename, {
      destination: `sanitized/${path.basename(file.name)}`
    });

    console.log(`Blurred image has been uploaded to ${file.name}.`);
    return { sanitized: true };
  } catch (err) {
    console.error('bluring image failed: ', err);
    return false;
  }
};

// Blurs uploaded images that are flagged as Adult or Violence.
// https://cloud.google.com/vision/docs/detecting-safe-search
const blurOffensiveImages = async object => {
  try {
    const file = storage.bucket(object.bucket).file(object.name);
    const bucketName = object.bucket;
    const fileName = object.name;

    // do nothing for already sanitized image
    if (fileName.startsWith('sanitized/')) {
      console.log('skipping sanitization as already sanitized: ', fileName);
      return { sanitized: false };
    }

    // analyze image
    console.log(`Analyzing ${fileName}.`);
    const result = await visionClient.safeSearchDetection(
      `gs://${bucketName}/${fileName}`
    );
    const [safeSearch] = result;

    // blur the image if the image is offensive
    if (
      safeSearch.safeSearchAnnotation.adult === 'VERY_LIKELY' ||
      safeSearch.safeSearchAnnotation.violence === 'VERY_LIKELY'
    ) {
      console.log(`The image ${file.name} has been detected as inappropriate.`);
      return await blurImage(file);
    }

    console.log(`The image ${fileName} has been detected as OK.`);
    return { sanitized: false };
  } catch (err) {
    console.error('failed image analyzation: ', err);
    return false;
  }
};

exports.onFileChange = functions
  .region('asia-northeast1')
  .storage.bucket('travelr-images')
  .object()
  .onFinalize(async object => {
    try {
      const bucketName = object.bucket;
      const fileName = object.name;

      console.log('File upload detected!');

      if (
        fileName.startsWith('1024w/') ||
        fileName.startsWith('192w/') ||
        fileName.startsWith('96w/')
      ) {
        console.log('Ignoreing already resized files!', fileName);
        return true;
      }

      // check if the image is offensive and sanitize it if necessary
      const { sanitized } = await blurOffensiveImages(object);

      // do nothing if the image was sanitized.
      // as the new image will be uploaded that kicks this function again.
      if (sanitized) {
        console.log('sanitized file was created, end function.');
        return true;
      }

      // download the original file
      const bucket = storage.bucket(bucketName);
      const tmpFilePathOriginal = path.join(
        os.tmpdir(),
        path.basename(fileName)
      );
      await bucket.file(fileName).download({
        destination: tmpFilePathOriginal
      });

      // 1024w
      const tmpFilePath1024w = path.join(
        os.tmpdir(),
        `tmp1024w-${path.basename(fileName)}`
      );
      await spawn('convert', [
        tmpFilePathOriginal,
        '-resize',
        '1024x1024>',
        '-quality',
        '70',
        tmpFilePath1024w
      ]);
      await bucket.upload(tmpFilePath1024w, {
        destination: `1024w/${path.basename(fileName)}`
      });

      // 192w
      const tmpFilePath192w = path.join(
        os.tmpdir(),
        `tmp192w-${path.basename(fileName)}`
      );
      /*
       * 横が 1000px になるようにリサイズ
       * 縦が 1000px に満たなかったら，150px になるようにリサイズ (これで縦か横のどちらも 1000px 以上になる)
       * 30%に縮小 (短辺が 300px になる)
       * 次の操作基準点を真ん中に設定．
       * 300x300 ピクセルの領域を切り出す
       */
      // prettier-ignore
      await spawn('convert', [
        tmpFilePathOriginal,
        '-resize', '1000x',
        '-resize', 'x1000<',
        '-resize', '30%',
        '-gravity', 'center',
        '-crop', '300x300+0+0',
        '-quality', '70',
        tmpFilePath192w
      ]);
      await bucket.upload(tmpFilePath192w, {
        destination: `192w/${path.basename(fileName)}`
      });

      // 96w
      const tmpFilePath96w = path.join(
        os.tmpdir(),
        `tmp96w-${path.basename(fileName)}`
      );
      // prettier-ignore
      await spawn('convert', [
        tmpFilePathOriginal,
        '-resize', '1000x',
        '-resize', 'x1000<',
        '-resize', '10%',
        '-gravity', 'center',
        '-crop', '100x100+0+0',
        '-quality', '70',
        tmpFilePath96w
      ]);
      await bucket.upload(tmpFilePath96w, {
        destination: `96w/${path.basename(fileName)}`
      });

      // complete
      console.log('resized files created!');
      return true;
    } catch (err) {
      console.error('an error occured!: ', err);
      return false;
    }
  });
