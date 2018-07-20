import * as firebase from 'firebase/app';
import { Dispatch } from 'redux';
import uuid from 'uuid/v4';
import wretch from 'wretch';
import config from '../config';
import {
  AuthSeed,
  Comment,
  FilterCriterion,
  FilterCriterionReduced,
  NewPost,
  NewUserInfo,
  Post,
  PostToEdit,
  UserStore,
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

actions.fetchAllPosts = (criterion: FilterCriterionReduced = {}) => async (
  dispatch: Dispatch<any>,
) => {
  dispatch({
    type: actionTypes.FETCH_ALL_POSTS,
  });

  const {
    displayName,
    description,
    shootDate,
    placeName,
    radius,
    viewCount,
    likedCount,
    commentsCount,
  } = criterion;

  let minDate;
  let maxDate;
  let lng;
  let lat;
  let minViewCount;
  let maxViewCount;
  let minLikedCount;
  let maxLikedCount;
  let minCommentsCount;
  let maxCommentsCount;

  if (shootDate) {
    minDate = shootDate.min;
    maxDate = shootDate.max;
  }
  if (placeName) {
    const position = await getPositionFromPlaceName(placeName);
    lng = position.lng;
    lat = position.lat;
  }
  if (viewCount) {
    minViewCount = viewCount.min;
    maxViewCount = viewCount.max;
  }
  if (likedCount) {
    minLikedCount = likedCount.min;
    maxLikedCount = likedCount.max;
  }
  if (commentsCount) {
    minCommentsCount = commentsCount.min;
    maxCommentsCount = commentsCount.max;
  }

  const params = [];

  if (displayName) params.push(`display_name=${displayName}`);
  if (description) params.push(`description=${description}`);
  if (minDate) params.push(`min_date=${minDate}-01-01`);
  if (maxDate) params.push(`max_date=${maxDate}-12-31`);
  if (lng) params.push(`lng=${lng}`);
  if (lat) params.push(`lat=${lat}`);
  if (radius) params.push(`radius=${radius}`);
  if (minViewCount) params.push(`min_view_count=${minViewCount}`);
  if (maxViewCount) params.push(`max_view_count=${maxViewCount}`);
  if (minLikedCount) params.push(`min_liked_count=${minLikedCount}`);
  if (maxLikedCount) params.push(`max_liked_count=${maxLikedCount}`);
  if (minCommentsCount) params.push(`min_comments_count=${minCommentsCount}`);
  if (maxCommentsCount) params.push(`max_comments_count=${maxCommentsCount}`);

  let queryParams = '';
  if (params.length) queryParams = `?${params.join('&')}`;

  try {
    const posts = await wretch(`${config.apiUrl}posts${queryParams}`)
      .get()
      .json();

    dispatch({
      type: actionTypes.FETCH_ALL_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_ALL_POSTS_FAIL,
      payload: err,
    });
  }
};

actions.updateFilterCriterion = (
  criterion: FilterCriterion,
  criterionUntouched: FilterCriterion,
) => async (dispatch: Dispatch<any>) => {
  // extract criteria actually changed by the user
  const criterionReduced: any = difference(criterion, criterionUntouched);

  // save the current criterion in the store
  dispatch({
    type: actionTypes.CHANGE_FILTER_CRITERION_SUCCESS,
    payload: { criterion, criterionReduced },
  });
  actions.fetchAllPosts(criterionReduced)(dispatch);
};

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

actions.fetchPost = (postId: number, user: UserStore) => ({
  type: actionTypes.FETCH_POST,
  payload: { postId, user },
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
      payload: { postId, user },
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
      payload: { postId, user },
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
      payload: { postId, user },
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

export default actions;
