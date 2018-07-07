import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import config from '../config';

firebase.initializeApp(config.firebase);

const setupInitialAuth = async () => {
  try {
    // this function is called in the following cases:
    //   - case1: when unauthorized user successfully redirected from OAuth provider
    //   - case2: when authorized user reload / re-visit the page
    firebase.auth().onAuthStateChanged(async user => {
      const redirectResult = await firebase.auth().getRedirectResult();

      // case1
      if (user && redirectResult.user) {
        const token = await user.getIdToken();
        const displayName =
          redirectResult.additionalUserInfo.profile.given_name;

        this.props.getOrCreateUserInfo(token, displayName);
        return;
      }

      // case2
      if (user && !redirectResult.user) {
        const token = await user.getIdToken();

        this.props.getOrCreateUserInfo(token);
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

export default {
  setupInitialAuth,
  deleteUser,
  signInWithGoogle,
  signInWithFacebook,
};
