// @flow

export type Action<T> = {
  type: string,
  payload: T,
};

export type Post = {
  postId: number,
  oldImageUrl: string,
  newImageUrl: string,
  description?: string,
  shootDate: string,
  lng: number,
  lat: number,
  viewCount: number,
  displayName: string,
  likedCount: number,
  commentsCount: number,
  comments: [
    {
      commentId: number,
      userId: string,
      datetime: string,
      comment: string,
    },
  ],
};

export type UserStore = {
  userId: string,
  token: string,
  displayName: string,
  isAdmin: boolean,
};

export type PostsStore = {
  all: Array<Post>,
  allFilter: any, // TODO specify this
  myPosts: Array<Post>,
  myPostsSelected: Array<number>,
};

export type NewUserInfo = {
  displayName: string,
};

export type FilterCriterion = {
  userId?: string,
  displayName?: string,
  description?: string,
  minDate?: string,
  maxDate?: string,
  lng?: number,
  lat?: number,
  radius?: number,
  minViewCount?: number,
  maxViewCount?: number,
  minLikedCount?: number,
  maxLikedCount?: number,
  minCommentsCount?: number,
  maxCommentsCount?: number,
  limit?: number,
};
