/* eslint no-console:0 comma-dangle:0 */

const functions = require('firebase-functions');
const os = require('os');
const path = require('path');

const storage = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision');
const { spawn } = require('child-process-promise');

const visionClient = new vision.ImageAnnotatorClient();

// Blurs the given file using ImageMagick.
function blurImage(file) {
  const tempLocalFilename = path.join(os.tmpdir(), path.basename(file.name));

  return file
    .download({ destination: tempLocalFilename })
    .then(() =>
      spawn('convert', [
        tempLocalFilename,
        '-type',
        'GrayScale',
        '-blur',
        '0x48',
        tempLocalFilename
      ])
    )
    .then(() =>
      file.bucket.upload(tempLocalFilename, {
        destination: `sanitized/${path.basename(file.name)}`
      })
    )
    .then(() => {
      console.log(`Blurred image has been uploaded to ${file.name}.`);

      return { sanitized: true };
    })
    .catch(err => console.error('bluring image failed: ', err));
}

// Blurs uploaded images that are flagged as Adult or Violence.
// https://cloud.google.com/vision/docs/detecting-safe-search
function blurOffensiveImages(object) {
  const file = storage.bucket(object.bucket).file(object.name);
  const bucketName = object.bucket;
  const fileName = object.name;

  if (fileName.startsWith('sanitized/')) {
    console.log('skipping sanitization as already sanitized: ', fileName);
    return Promise.resolve({ sanitized: false });
  }

  console.log(`Analyzing ${fileName}.`);

  return visionClient
    .safeSearchDetection(`gs://${bucketName}/${fileName}`)
    .then(([safeSearch]) => {
      if (
        safeSearch.safeSearchAnnotation.adult === 'VERY_LIKELY' ||
        safeSearch.safeSearchAnnotation.violence === 'VERY_LIKELY'
      ) {
        console.log(
          `The image ${file.name} has been detected as inappropriate.`
        );
        return blurImage(file);
      }

      console.log(`The image ${fileName} has been detected as OK.`);
      return { sanitized: false };
    })
    .catch(err => console.error('failed image analyzation: ', err));
}

exports.onFileChange = functions.storage.object().onFinalize(object => {
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

  return blurOffensiveImages(object)
    .then(({ sanitized }) => {
      // do nothing if the image was sanitized.
      // as the new image will be uploaded that kicks this function again.
      if (sanitized) {
        console.log('sanitized file was created, end function.');
        return true;
      }

      const bucket = storage.bucket(bucketName);
      const tmpFilePathOriginal = path.join(
        os.tmpdir(),
        path.basename(fileName)
      );

      const tmpFilePath1024w = path.join(
        os.tmpdir(),
        path.basename(`tmp1024w-${fileName}`)
      );
      const tmpFilePath192w = path.join(
        os.tmpdir(),
        path.basename(`tmp192w-${fileName}`)
      );
      const tmpFilePath96w = path.join(
        os.tmpdir(),
        path.basename(`tmp96w-${fileName}`)
      );

      return (
        bucket
          .file(fileName)
          .download({
            destination: tmpFilePathOriginal
          })
          // 1024w
          .then(() =>
            spawn('convert', [
              tmpFilePathOriginal,
              '-resize',
              '1024x1024>',
              '-quality',
              '70',
              tmpFilePath1024w
            ])
          )
          .then(() =>
            bucket.upload(tmpFilePath1024w, {
              destination: `1024w/${path.basename(fileName)}`
            })
          )

          // 192w
          .then(() =>
            spawn('convert', [
              tmpFilePathOriginal,
              '-resize',
              '192x192w>',
              '-quality',
              '70',
              tmpFilePath192w
            ])
          )
          .then(() =>
            bucket.upload(tmpFilePath192w, {
              destination: `192w/${path.basename(fileName)}`
            })
          )

          // 96w
          .then(() =>
            spawn('convert', [
              tmpFilePathOriginal,
              '-resize',
              '96x96',
              '-quality',
              '70',
              tmpFilePath96w
            ])
          )
          .then(() =>
            bucket.upload(tmpFilePath96w, {
              destination: `96w/${path.basename(fileName)}`
            })
          )

          // complete
          .then(() => console.log('resized files created!'))
      );
    })
    .catch(err => console.error('an error occured!: ', err));
});
