import {
  AppStore,
  Comment,
  FilterCriterion,
  NewPost,
  Post,
  PostsStore,
  PostToEdit,
  UserStore,
} from './types';

export const DUMMY_COMMENTS: Comment[] = [
  {
    commentId: 701,
    userId: 'dummy_userId1',
    datetime: '1985-03-01',
    comment: 'dummy_comment1',
    postId: 1,
    displayName: 'dummy_comment_displayName1',
  },
  {
    commentId: 791,
    userId: 'dummy_userId1',
    datetime: '1985-03-01',
    comment: 'dummy_comment1',
    postId: 1,
    displayName: 'dummy_comment_displayName1',
  },
  {
    commentId: 781,
    userId: 'dummy_userId1',
    datetime: '1985-03-01',
    comment: 'dummy_comment1',
    postId: 1,
    displayName: 'dummy_comment_displayName1',
  },
];

// the same format as:
//   - the data that 'store' has
//   - the data that API returns
export const DUMMY_POSTS: Post[] = [
  {
    postId: 1,
    userId: 'dummy_userId1',
    oldImageUrl: 'dummy_oldImageUrl1',
    newImageUrl: 'dummy_newImageUrl1',
    description: 'dummy_description1',
    shootDate: '1999-09-01',
    lng: 201,
    lat: 301,
    viewCount: 401,
    createdAt: '2017-10-12T15:00:00.000Z',
    displayName: 'dummy_displayName1',
    likedCount: 501,
    commentsCount: 601,
    comments: DUMMY_COMMENTS,
  },
  {
    postId: 2,
    userId: 'dummy_userId2',
    oldImageUrl: 'dummy_oldImageUrl2',
    newImageUrl: 'dummy_newImageUrl2',
    description: 'dummy_description2',
    shootDate: '2999-09-02',
    lng: 202,
    lat: 302,
    viewCount: 402,
    createdAt: '2017-10-12T15:00:00.000Z',
    displayName: 'dummy_displayName2',
    likedCount: 502,
    commentsCount: 602,
    comments: [
      {
        commentId: 702,
        userId: 'dummy_userId2',
        datetime: '2985-03-02',
        comment: 'dummy_comment2',
        postId: 2,
        displayName: 'dummy_comment_displayName2',
      },
    ],
  },
  {
    postId: 3,
    userId: 'dummy_userId3',
    oldImageUrl: 'dummy_oldImageUrl3',
    newImageUrl: 'dummy_newImageUrl3',
    description: 'dummy_description3',
    shootDate: '3999-09-03',
    lng: 203,
    lat: 303,
    viewCount: 403,
    createdAt: '2017-10-12T15:00:00.000Z',
    displayName: 'dummy_displayName3',
    likedCount: 503,
    commentsCount: 603,
    comments: [
      {
        commentId: 703,
        userId: 'dummy_userId3',
        datetime: '3985-03-03',
        comment: 'dummy_comment3',
        postId: 3,
        displayName: 'dummy_comment_displayName3',
      },
    ],
  },
  {
    postId: 4,
    userId: 'dummy_userId4',
    oldImageUrl: 'dummy_oldImageUrl4',
    newImageUrl: 'dummy_newImageUrl4',
    description: 'dummy_description4',
    shootDate: '4999-09-04',
    lng: 204,
    lat: 304,
    viewCount: 404,
    createdAt: '2017-10-12T15:00:00.000Z',
    displayName: 'dummy_displayName4',
    likedCount: 504,
    commentsCount: 604,
    comments: [
      {
        commentId: 704,
        userId: 'dummy_userId4',
        datetime: '4985-03-04',
        comment: 'dummy_comment4',
        postId: 4,
        displayName: 'dummy_comment_displayName4',
      },
    ],
  },
  {
    postId: 5,
    userId: 'dummy_userId5',
    oldImageUrl: 'dummy_oldImageUrl5',
    newImageUrl: 'dummy_newImageUrl5',
    description: 'dummy_description5',
    shootDate: '5999-09-05',
    lng: 205,
    lat: 305,
    viewCount: 405,
    createdAt: '2017-10-12T15:00:00.000Z',
    displayName: 'dummy_displayName5',
    likedCount: 505,
    commentsCount: 605,
    comments: [
      {
        commentId: 705,
        userId: 'dummy_userId5',
        datetime: '5985-03-05',
        comment: 'dummy_comment5',
        postId: 5,
        displayName: 'dummy_comment_displayName5',
      },
    ],
  },
];

export const DUMMY_POSTS_IDS: number[] = DUMMY_POSTS.map(post => post.postId);

export const DUMMY_NEW_POST: NewPost = {
  oldImageFile: { type: 'image/jpeg' },
  newImageFile: { type: 'image/png' },
  description: 'dummy_description',
  shootDate: '1985-3-31',
  lng: 135.0,
  lat: 35.0,
};

export const DUMMY_POST_TO_EDIT: PostToEdit = {
  postId: 123,
  oldImageUrl: 'dummy',
  newImageUrl: 'dummy',
  description: 'dummy_description',
  shootDate: '1985-3-31',
  lng: 135.0,
  lat: 35.0,
};

export const DUMMY_FILTER_CRITERION: FilterCriterion = {
  userId: 'dummy_userId',
  displayName: 'dummy_displayName',
  description: 'dummy_description',
  minDate: '1990-01-01',
  maxDate: '1999-12-31',
  lng: 1,
  lat: 2,
  radius: 3,
  minViewCount: 4,
  maxViewCount: 5,
  minLikedCount: 6,
  maxLikedCount: 7,
  minCommentsCount: 8,
  maxCommentsCount: 9,
  limit: 10,
};

export const DUMMY_APP_STORE: AppStore = {
  snackbarQueue: [],
  showProgress: false,
};

export const DUMMY_POSTS_STORE: PostsStore = {
  all: DUMMY_POSTS,
  allFilter: DUMMY_FILTER_CRITERION,
  limitCountOfGrid: 21,
  myPosts: DUMMY_POSTS,
  myPostsSelected: [],
  currentPost: DUMMY_POSTS[0],
};

export const DUMMY_USER_STORE: UserStore = {
  userId: 'DUMMY_USER_ID',
  displayName: 'DUMMY_USER_DISPLAY_NAME',
  isAdmin: false,
  token: 'DUMMY_USER_TOKEN',
  emailVerified: true,
  earnedLikes: 123,
  earnedComments: 456,
  earnedViews: 789,
};

export const DUMMY_USER_STORE_UNAUTHORIZED: UserStore = {
  userId: '',
  token: '',
  displayName: '',
  isAdmin: false,
  emailVerified: false,
  earnedLikes: 0,
  earnedComments: 0,
  earnedViews: 0,
};
