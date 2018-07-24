import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import config from '../config';
import { AuthSeed, UserStore } from '../config/types';

firebase.initializeApp(config.firebase);

const authRef = firebase.auth();

const getRedirectedUserAuthSeed = async (): Promise<AuthSeed | null> => {
  const result = await authRef.getRedirectResult();
  if (result.user) {
    const token = await result.user.getIdToken();
    // @ts-ignore
    const displayName = result.additionalUserInfo.profile.given_name;
    const { emailVerified } = result.user;

    return { token, displayName, emailVerified };
  }
  return null;
};

const getCurrentUserAuthSeed = async (): Promise<AuthSeed | null> => {
  const user = authRef.currentUser;
  if (user) {
    const token = await user.getIdToken();
    const { emailVerified } = user;

    return { emailVerified, token, displayName: '' };
  }
  return null;
};

const canUserDeletedNow = async () => {
  const user = authRef.currentUser;

  const currentTime = +new Date();
  const lastSignInTime = +new Date(user.metadata.lastSignInTime);
  const signInDurationMinutes = (currentTime - lastSignInTime) / 1000 / 60;

  if (signInDurationMinutes > 3) return false;
  return true;
};

const uploadImageFile = async (
  file: File,
  filename: string,
  user: UserStore,
) => {
  const storageRef = firebase.storage().ref();
  const storageFileRef = storageRef.child(
    `/original/${user.userId}/${filename}`,
  );
  const result = await storageFileRef.put(file);

  return result;
};

const getImageUrl = (filename: string, option: '1024w' | '192w' | '96w') => {
  // TODO: delete this (showing absolute pass as is)
  if (filename.indexOf('http') !== -1) return filename;

  const folder = `${option}%2F`;

  // tslint:disable-next-line:max-line-length
  return `https://firebasestorage.googleapis.com/v0/b/travelr-a75c4.appspot.com/o/${folder}${filename}?alt=media`;
};

export default {
  authRef,
  getRedirectedUserAuthSeed,
  getCurrentUserAuthSeed,
  canUserDeletedNow,
  uploadImageFile,
  getImageUrl,
};
