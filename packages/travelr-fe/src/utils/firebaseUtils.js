// @flow
import firebase from 'firebase/app';
// $FlowIgnore
import 'firebase/auth';
// $FlowIgnore
import 'firebase/storage';
import config from '../config';

firebase.initializeApp(config.firebase);

const onAuthStateChanged = async (
  callback: (token: string, displayName: string) => void,
) => {
  try {
    // callback is called in the following cases:
    //   - case1: when unauthorized user successfully redirected from OAuth provider
    //   - case2: when authorized user reload / re-visit the page
    firebase.auth().onAuthStateChanged(async user => {
      const redirectResult = await firebase.auth().getRedirectResult();

      // case1
      if (user && redirectResult.user) {
        const token = await user.getIdToken();
        const displayName =
          redirectResult.additionalUserInfo.profile.given_name;

        callback(token, displayName);
        return;
      }

      // case2
      if (user && !redirectResult.user) {
        const token = await user.getIdToken();

        callback(token, '');
      }
    });
  } catch (err) {
    if (err.code === 'auth/account-exists-with-different-credential') {
      throw new Error(
        'このメールアドレスは別のログイン方法に紐づけされています',
      ); // TODO: link account, snackbar
    }
    throw new Error(err);
  }
};

const deleteUser = async () => {
  await firebase.auth().currentUser.delete();
};

const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  await firebase.auth().signInWithRedirect(provider);
};

const signInWithFacebook = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  await firebase.auth().signInWithRedirect(provider);
};

const uploadImageFile = async (file: File, filename: string) => {
  const storageRef = firebase.storage().ref();
  const storageFileRef = storageRef.child(filename);
  const result = await storageFileRef.put(file);

  return result;
};

const getImageUrl = (filename: string, option?: 'thumb') => {
  // TODO: delete this (showing absolute pass as is)
  if (filename.indexOf('http') !== -1) return filename;

  // TODO: generate thumb
  if (option === 'thumb') return '';

  return `https://firebasestorage.googleapis.com/v0/b/travelr-a75c4.appspot.com/o/${filename}?alt=media`;
};

export default {
  onAuthStateChanged,
  deleteUser,
  signInWithGoogle,
  signInWithFacebook,
  uploadImageFile,
  getImageUrl,
};
