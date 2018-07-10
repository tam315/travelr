// @flow
import firebase from 'firebase/app';
// $FlowIgnore
import 'firebase/auth';
// $FlowIgnore
import 'firebase/storage';
import config from '../config';
import type { AuthSeed } from '../config/types';

firebase.initializeApp(config.firebase);

const getRedirectResult = async (): Promise<AuthSeed | null> => {
  const result = await firebase.auth().getRedirectResult();
  if (result.user) {
    const token = await result.user.getIdToken();
    const displayName = result.additionalUserInfo.profile.given_name;

    return { token, displayName };
  }
  return null;
};

const getCurrentUser = async (): Promise<AuthSeed | null> => {
  const user = firebase.auth().currentUser;
  if (user) {
    const token = await user.getIdToken();

    return { token, displayName: '' };
  }
  return null;
};

const canUserDeletedNow = async () => {
  const user = firebase.auth().currentUser;
  const signInDurationMinutes =
    (new Date() - new Date(user.metadata.lastSignInTime)) / 1000 / 60;

  if (signInDurationMinutes > 3) return false;
  return true;
};

const deleteUser = async () => {
  await firebase.auth().currentUser.delete();
};

const signOutUser = async () => {
  await firebase.auth().signOut();
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
  getRedirectResult,
  getCurrentUser,
  canUserDeletedNow,
  deleteUser,
  signInWithGoogle,
  signInWithFacebook,
  signOutUser,
  uploadImageFile,
  getImageUrl,
};
