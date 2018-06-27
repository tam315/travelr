export const DUMMY_USER_STORE = {
  userId: 'DUMMY_USER_ID',
  displayName: 'DUMMY_USER_DISPLAY_NAME',
  isAdmin: false,
  token: 'DUMMY_USER_TOKEN',
};

// the same format as:
//   - the data that 'store' has
//   - the data that API returned
export const DUMMY_POSTS = [
  {
    postId: 1,
    oldImageUrl: 'dummy_oldImageUrl1',
    newImageUrl: 'dummy_newImageUrl1',
    description: 'dummy_description1',
    shootDate: '1999-09-01',
    lng: 201,
    lat: 301,
    viewCount: 401,
    displayName: 'dummy_displayName1',
    likedCount: 501,
    commentsCount: 601,
    comments: [
      {
        commentId: 701,
        userId: 801,
        datetime: new Date('1985-03-01'),
        comment: 'dummy_comment1',
      },
    ],
  },
  {
    postId: 2,
    oldImageUrl: 'dummy_oldImageUrl2',
    newImageUrl: 'dummy_newImageUrl2',
    description: 'dummy_description2',
    shootDate: '2999-09-02',
    lng: 202,
    lat: 302,
    viewCount: 402,
    displayName: 'dummy_displayName2',
    likedCount: 502,
    commentsCount: 602,
    comments: [
      {
        commentId: 702,
        userId: 802,
        datetime: new Date('2985-03-02'),
        comment: 'dummy_comment2',
      },
    ],
  },
  {
    postId: 3,
    oldImageUrl: 'dummy_oldImageUrl3',
    newImageUrl: 'dummy_newImageUrl3',
    description: 'dummy_description3',
    shootDate: '3999-09-03',
    lng: 203,
    lat: 303,
    viewCount: 403,
    displayName: 'dummy_displayName3',
    likedCount: 503,
    commentsCount: 603,
    comments: [
      {
        commentId: 703,
        userId: 803,
        datetime: new Date('3985-03-03'),
        comment: 'dummy_comment3',
      },
    ],
  },
  {
    postId: 4,
    oldImageUrl: 'dummy_oldImageUrl4',
    newImageUrl: 'dummy_newImageUrl4',
    description: 'dummy_description4',
    shootDate: '4999-09-04',
    lng: 204,
    lat: 304,
    viewCount: 404,
    displayName: 'dummy_displayName4',
    likedCount: 504,
    commentsCount: 604,
    comments: [
      {
        commentId: 704,
        userId: 804,
        datetime: new Date('4985-03-04'),
        comment: 'dummy_comment4',
      },
    ],
  },
  {
    postId: 5,
    oldImageUrl: 'dummy_oldImageUrl5',
    newImageUrl: 'dummy_newImageUrl5',
    description: 'dummy_description5',
    shootDate: '5999-09-05',
    lng: 205,
    lat: 305,
    viewCount: 405,
    displayName: 'dummy_displayName5',
    likedCount: 505,
    commentsCount: 605,
    comments: [
      {
        commentId: 705,
        userId: 805,
        datetime: new Date('5985-03-05'),
        comment: 'dummy_comment5',
      },
    ],
  },
];

export const DUMMY_POSTS_IDS = DUMMY_POSTS.map(post => post.postId);
