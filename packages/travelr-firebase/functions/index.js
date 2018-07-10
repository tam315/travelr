/* eslint no-console:0 comma-dangle:0 */

const functions = require('firebase-functions');
const os = require('os');
const path = require('path');

const gcs = require('@google-cloud/storage')();
const { spawn } = require('child-process-promise');

exports.onFileChange = functions.storage.object().onFinalize(object => {
  const bucketName = object.bucket;
  const fileName = object.name;

  console.log('File upload detected!');

  if (
    path.basename(fileName).startsWith('resized_1024w_') ||
    path.basename(fileName).startsWith('resized_96w_')
  ) {
    console.log('We already resized that file!');
    return true;
  }

  const bucket = gcs.bucket(bucketName);
  const tmpFilePathOriginal = path.join(os.tmpdir(), path.basename(fileName));

  const tmpFilePath1024w = path.join(
    os.tmpdir(),
    path.basename(`tmp1024w-${fileName}`)
  );
  const tmpFilePath96w = path.join(
    os.tmpdir(),
    path.basename(`tmp96w-${fileName}`)
  );

  return bucket
    .file(fileName)
    .download({
      destination: tmpFilePathOriginal
    })
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
        destination: `1024w/resized_1024w_${path.basename(fileName)}`
      })
    )
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
        destination: `96w/resized_96w_${path.basename(fileName)}`
      })
    );
});
