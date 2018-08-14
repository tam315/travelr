export type Store = {
  app: AppStore;
  user: UserStore;
  posts: PostsStore;
  filter: FilterStore;
};

export type AppStore = {
  snackbarQueue: string[];
  // progress bar is displayed if 'tasksInProgress' has a size.
  // 'tasksInProgress' will contains action.type or 'fetch'.
  tasksInProgress: Set<string>;
  mapLat: number;
  mapLng: number;
  mapZoomLevel: number;
  mapLatUpdated: number;
  mapLngUpdated: number;
  mapZoomLevelUpdated: number;
  dialogIsOpen: boolean;
  dialogTitle: string;
  dialogContent: string;
  dialogPositiveSelector: string;
  dialogNegativeSelector: string;
  dialogSuccessCallback: () => void;
};

export type UserStore = {
  userId: string;
  token: string; // from firebase
  displayName: string;
  isAdmin: boolean;
  emailVerified: boolean; // from firebase
  earnedLikes: number;
  earnedComments: number;
  earnedViews: number;
};

export type PostsStore = {
  all: Post[];
  limitCountOfGrid: number;
  myPosts: Post[];
  myPostsSelected: number[]; // postIds
  currentPost: Post | null;
};

export type FilterStore = {
  criterion: FilterCriterionReduced;
  criterionUntouched: FilterCriterion;
  rangeSetupDone: boolean;
};

export type Action<T> = {
  type: string;
  payload: T;
};

export type Comment = {
  commentId: number;
  userId: string;
  postId: number;
  datetime: string;
  comment: string;
  user: {
    displayName: string;
  };
};

export type Post = {
  postId: number;
  userId: string;
  oldImageUrl: string;
  newImageUrl: string;
  description?: string;
  shootDate: string;
  lng: number;
  lat: number;
  viewCount: number;
  createdAt: string;
  likedCount: number;
  commentsCount: number;
  comments: Comment[];
  likeStatus?: boolean;
  user: {
    displayName: string;
  };
};

export type NewPost = {
  oldImageFile: any;
  newImageFile: any;
  description?: string;
  shootDate: string;
  lng: number;
  lat: number;
};

export type PostToEdit = {
  postId: number;
  oldImageUrl?: string;
  newImageUrl?: string;
  description?: string;
  shootDate?: string;
  lng?: number;
  lat?: number;
};

export type NewUserInfo = {
  displayName: string;
};

export type FilterCriterionReduced = {
  shootDate?: {
    min?: number; // only A.D.
    max?: number; // only A.D.
  };
  likedCount?: {
    min?: number;
    max?: number;
  };
  commentsCount?: {
    min?: number;
    max?: number;
  };
  viewCount?: {
    min?: number;
    max?: number;
  };
  placeName?: string;
  radius?: string;
  displayName?: string;
  description?: string;
};

export type FilterCriterion = {
  shootDate: {
    min: number; // only A.D.
    max: number; // only A.D.
  };
  likedCount: {
    min: number;
    max: number;
  };
  commentsCount: {
    min: number;
    max: number;
  };
  viewCount: {
    min: number;
    max: number;
  };
  placeName: string;
  radius: string;
  displayName: string;
  description: string;
};

export type FilterCriterionFlatten = {
  displayName?: string;
  description?: string;
  minDate?: number;
  maxDate?: number;
  lng?: number;
  lat?: number;
  radius?: string;
  minViewCount?: number;
  maxViewCount?: number;
  minLikedCount?: number;
  maxLikedCount?: number;
  minCommentsCount?: number;
  maxCommentsCount?: number;
};

// required info to authenticate with the main API
export type AuthSeed = {
  token: string;
  displayName: string;
  emailVerified: boolean;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type MapZoomAndCenter = {
  zoom: number;
  center: LatLng;
};
