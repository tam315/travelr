import * as firebase from 'firebase/app';
import { Dispatch } from 'redux';
import uuid from 'uuid/v4';
import wretch from 'wretch';
import config from '../config';
import {
  AuthSeed,
  Comment,
  FilterCriterionReduced,
  NewPost,
  NewUserInfo,
  Post,
  PostToEdit,
  UserStore,
  MapZoomAndCenter,
  FilterCriterion,
} from '../config/types';
import firebaseUtils from '../utils/firebaseUtils';
import { difference } from '../utils/general';
import { getPositionFromPlaceName } from '../utils/mapsUtils';
import actionTypes from './types';

const { authRef } = firebaseUtils;

const actions: any = {};

actions.initAuth = () => ({
  type: actionTypes.INIT_AUTH,
});

actions.updateUserInfo = (user: UserStore, newUserInfo: NewUserInfo) => async (
  dispatch: Dispatch<any>,
) => {
  const { userId, token } = user;
  const { displayName } = newUserInfo;
  try {
    await wretch(`${config.apiUrl}users/${userId}`)
      .headers({ authorization: token })
      .put({ displayName })
      .res();

    dispatch({
      type: actionTypes.UPDATE_USER_INFO_SUCCESS,
      payload: { displayName },
    });
  } catch (err) {
    dispatch({
      type: actionTypes.UPDATE_USER_INFO_FAIL,
    });
  }
};

actions.deleteUser = (user: UserStore) => async (dispatch: Dispatch<any>) => {
  const { userId, token } = user;

  try {
    const canUserDeletedNow = await firebaseUtils.canUserDeletedNow();
    if (!canUserDeletedNow) {
      dispatch({
        type: actionTypes.ADD_SNACKBAR_QUEUE,
        payload:
          'アカウントを削除するには再認証が必要です。一度サインアウトしてから、もう一度サインインしたあとに、同じ操作を行ってください。',
      });
      return;
    }

    if (
      // TODO: dialog
      // eslint-disable-next-line
      !confirm(
        '本当にアカウントを削除してよろしいですか？すべてのデータが失われます。',
      )
    ) {
      return;
    }

    await wretch(`${config.apiUrl}users/${userId}`)
      .headers({ authorization: token })
      .delete()
      .res();

    await authRef.currentUser.delete();

    dispatch({
      type: actionTypes.DELETE_USER_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_USER_FAIL,
    });
  }
};

actions.increaseLimitCountOfGrid = () => ({
  type: actionTypes.INCREASE_LIMIT_COUNT_OF_GRID,
});

actions.signInWithGoogle = () => async (dispatch: Dispatch<any>) => {
  dispatch({ type: actionTypes.SIGN_IN_WITH_GOOGLE });
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  await authRef.signInWithRedirect(provider);
};

actions.signInWithFacebook = () => async (dispatch: Dispatch<any>) => {
  dispatch({ type: actionTypes.SIGN_IN_WITH_FACEBOOK });
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  await authRef.signInWithRedirect(provider);
};

actions.signInWithEmail = (email: string, password: string) => async (
  dispatch: Dispatch<any>,
) => {
  try {
    dispatch({ type: actionTypes.SIGN_IN_WITH_EMAIL });

    await authRef.signInWithEmailAndPassword(email, password);

    const user = authRef.currentUser;
    const token = await user.getIdToken();
    const { emailVerified } = user;

    const authSeed: AuthSeed = {
      token,
      emailVerified,
      displayName: 'newuser',
    };

    dispatch({
      type: actionTypes.SIGN_IN_WITH_EMAIL_SUCCESS,
      payload: authSeed,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SIGN_IN_WITH_EMAIL_FAIL,
      payload: err,
    });
  }
};

actions.signUpWithEmail = (
  email: string,
  password: string,
  displayName: string,
) => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({ type: actionTypes.SIGN_UP_WITH_EMAIL });

    const result = await authRef.createUserWithEmailAndPassword(
      email,
      password,
    );
    await result.user.sendEmailVerification();

    const user = authRef.currentUser;
    const token = await user.getIdToken();
    const { emailVerified } = user;

    const authSeed: AuthSeed = { token, displayName, emailVerified };

    dispatch({
      type: actionTypes.SIGN_UP_WITH_EMAIL_SUCCESS,
      payload: authSeed,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SIGN_UP_WITH_EMAIL_FAIL,
      payload: err,
    });
  }
};

actions.sendEmailVerification = () => async (dispatch: Dispatch<any>) => {
  dispatch({
    type: actionTypes.SEND_EMAIL_VERIFICATION,
  });

  try {
    await authRef.currentUser.sendEmailVerification();
    dispatch({
      type: actionTypes.SEND_EMAIL_VERIFICATION_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SEND_EMAIL_VERIFICATION_FAIL,
      payload: err,
    });
  }
};

actions.sendPasswordResetEmail = (email: string) => async (
  dispatch: Dispatch<any>,
) => {
  dispatch({ type: actionTypes.SEND_PASSWORD_RESET_EMAIL });

  try {
    await authRef.sendPasswordResetEmail(email);
    dispatch({
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SEND_PASSWORD_RESET_EMAIL_FAIL,
      payload: err,
    });
  }
};

actions.signOutUser = () => async (dispatch: Dispatch<any>) => {
  try {
    await authRef.signOut();

    dispatch({
      type: actionTypes.SIGN_OUT_USER_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.SIGN_OUT_USER_FAIL,
    });
  }
};

actions.fetchAllPosts = () => ({
  type: actionTypes.FETCH_ALL_POSTS,
});

actions.updateFilterCriterion = (
  criterion: FilterCriterionReduced,
  criterionUntouched: FilterCriterion,
) => async (dispatch: Dispatch<any>) => {
  // extract criteria actually changed by the user
  const criterionReduced = difference(criterion, criterionUntouched);

  // save the current criterion in the store
  dispatch({
    type: actionTypes.CHANGE_FILTER_CRITERION_SUCCESS,
    payload: criterionReduced,
  });
};

actions.clearFilterCriterion = () => ({
  type: actionTypes.CLEAR_FILTER_CRITERION_SUCCESS,
});

actions.getFilterSelectorRange = () => async (dispatch: Dispatch<any>) => {
  try {
    const stats = await wretch(`${config.apiUrl}posts/stats`)
      .get()
      .json();
    dispatch({
      type: actionTypes.GET_FILTER_SELECTOR_RANGE_SUCCESS,
      payload: stats,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_FILTER_SELECTOR_RANGE_FAIL,
      payload: err,
    });
  }
};

actions.fetchPost = (postId: number) => ({
  type: actionTypes.FETCH_POST,
  payload: +postId,
});

actions.createPost = (user: UserStore, newPost: NewPost) => async (
  dispatch: Dispatch<any>,
) => {
  const {
    oldImageFile,
    newImageFile,
    description,
    shootDate,
    lng,
    lat,
  } = newPost;
  const extentionOf = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
  };

  dispatch({ type: actionTypes.CREATE_POST });

  try {
    const oldImageFileName = uuid() + extentionOf[oldImageFile.type];
    const newImageFileName = uuid() + extentionOf[newImageFile.type];

    await firebaseUtils.uploadImageFile(oldImageFile, oldImageFileName, user);
    await firebaseUtils.uploadImageFile(newImageFile, newImageFileName, user);

    // TODO: change API key names
    const newPostForApi = {
      shootDate,
      lng,
      lat,
      oldImageUrl: oldImageFileName,
      newImageUrl: newImageFileName,
      description: description || '',
    };

    const { postId } = await wretch(`${config.apiUrl}posts`)
      .headers({ authorization: user.token })
      .post(newPostForApi)
      .json();

    dispatch({
      type: actionTypes.CREATE_POST_SUCCESS,
      payload: postId,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.CREATE_POST_FAIL,
      payload: err,
    });
  }
};

actions.editPost = (user: UserStore, postToEdit: PostToEdit) => async (
  dispatch: Dispatch<any>,
) => {
  dispatch({ type: actionTypes.EDIT_POST });

  try {
    await wretch(`${config.apiUrl}posts/${postToEdit.postId}`)
      .headers({ authorization: user.token })
      .put(postToEdit)
      .res();

    dispatch({
      type: actionTypes.EDIT_POST_SUCCESS,
      payload: postToEdit.postId,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.EDIT_POST_FAIL,
      payload: err,
    });
  }
};

actions.deletePost = (user: UserStore, postId: number) => async (
  dispatch: Dispatch<any>,
) => {
  const { token } = user;

  try {
    await wretch(`${config.apiUrl}posts/${postId}`)
      .headers({ authorization: token })
      .delete()
      .res();

    dispatch({
      type: actionTypes.DELETE_POST_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_POST_FAIL,
      payload: err,
    });
  }
};

actions.deletePosts = (user: UserStore, postIds: number[]) => async (
  dispatch: Dispatch<any>,
) => {
  const { token } = user;

  try {
    await wretch(`${config.apiUrl}posts`)
      .headers({ authorization: token })
      .json(postIds)
      .delete()
      .res();

    dispatch({
      type: actionTypes.DELETE_POSTS_SUCCESS,
      payload: postIds,
    });
    actions.fetchMyPosts(user)(dispatch);
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_POSTS_FAIL,
    });
  }
};

actions.fetchMyPosts = (user: UserStore) => async (dispatch: Dispatch<any>) => {
  const { userId } = user;
  if (!userId) return;
  try {
    const myPosts = await wretch(`${config.apiUrl}posts?user_id=${userId}`)
      .get()
      .json();

    dispatch({
      type: actionTypes.FETCH_MY_POSTS_SUCCESS,
      payload: myPosts,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_MY_POSTS_FAIL,
    });
  }
};

actions.selectMyPosts = (postIds: number[]) => ({
  type: actionTypes.SELECT_MY_POSTS,
  payload: postIds,
});

actions.selectMyPostsAll = () => ({
  type: actionTypes.SELECT_MY_POSTS_ALL,
});

actions.selectMyPostsReset = () => ({
  type: actionTypes.SELECT_MY_POSTS_RESET,
});

actions.createComment = (
  user: UserStore,
  postId: number,
  comment: string,
) => async (dispatch: Dispatch<any>) => {
  try {
    await wretch(`${config.apiUrl}posts/${postId}/comments`)
      .headers({ authorization: user.token })
      .post({ comment })
      .res();

    dispatch({
      type: actionTypes.CREATE_COMMENT_SUCCESS,
      payload: postId,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.CREATE_COMMENT_FAIL,
    });
  }
};

actions.deleteComment = (user: UserStore, comment: Comment) => async (
  dispatch: Dispatch<any>,
) => {
  const { postId, commentId } = comment;
  try {
    await wretch(`${config.apiUrl}posts/comments/${commentId}`)
      .headers({ authorization: user.token })
      .delete()
      .res();

    dispatch({
      type: actionTypes.DELETE_COMMENT_SUCCESS,
      payload: postId,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_COMMENT_FAIL,
    });
  }
};

actions.toggleLike = (user: UserStore, post: Post) => async (
  dispatch: Dispatch<any>,
) => {
  const { token } = user;
  const { postId } = post;

  try {
    await wretch(`${config.apiUrl}posts/${postId}/like/toggle`)
      .headers({ authorization: token })
      .post()
      .res();

    dispatch({
      type: actionTypes.TOGGLE_LIKE_SUCCESS,
      payload: postId,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.TOGGLE_LIKE_FAIL,
    });
  }
};

actions.reduceSnackbarQueue = () => ({
  type: actionTypes.REDUCE_SNACKBAR_QUEUE,
});

actions.addSnackbarQueue = (message: string) => ({
  type: actionTypes.ADD_SNACKBAR_QUEUE,
  payload: message,
});

actions.startProgress = () => ({
  type: actionTypes.START_PROGRESS,
});

actions.finishProgress = () => ({
  type: actionTypes.FINISH_PROGRESS,
});

actions.saveMapZoomAndCenter = (zoomAndCenter: MapZoomAndCenter) => ({
  type: actionTypes.SAVE_MAP_ZOOM_AND_CENTER,
  payload: zoomAndCenter,
});

export default actions;
