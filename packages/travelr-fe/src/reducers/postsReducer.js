// @flow
import type { PostsStore } from '../config/types';
import actionTypes from '../actions/types';

const INITIAL_STATE: PostsStore = {
  all: [],
  allFilter: {},
  myPosts: [],
  myPostsSelected: [],
  currentPost: null,
};

const postsReducer = (
  state: PostsStore = INITIAL_STATE,
  action: any,
): PostsStore => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_POSTS_SUCCESS:
      return {
        ...state,
        all: action.payload,
      };
    case actionTypes.FETCH_POST_START: {
      // reset currentPost if the post to fetch is not the same as currentPost
      if (!!state.currentPost && state.currentPost.postId !== action.payload) {
        return {
          ...state,
          currentPost: null,
        };
      }
      return state;
    }
    case actionTypes.FETCH_POST_SUCCESS:
      return {
        ...state,
        currentPost: action.payload,
      };
    case actionTypes.FETCH_MY_POSTS_SUCCESS:
      return {
        ...state,
        myPosts: action.payload,
      };

    case actionTypes.DELETE_POSTS_SUCCESS: {
      return {
        ...state,
        myPostsSelected: [],
      };
    }

    case actionTypes.SELECT_MY_POSTS: {
      const postIds = action.payload;
      const { myPostsSelected } = state;
      const newChecked: Array<number> = [...myPostsSelected];

      if (!postIds) return state;

      postIds.forEach(postId => {
        const currentIndex = newChecked.indexOf(postId);

        if (currentIndex === -1) {
          newChecked.push(postId);
        } else {
          newChecked.splice(currentIndex, 1);
        }
      });

      return {
        ...state,
        myPostsSelected: newChecked,
      };
    }

    case actionTypes.SELECT_MY_POSTS_ALL: {
      const myAllPostsIds = state.myPosts.map(post => post.postId);
      return {
        ...state,
        myPostsSelected: myAllPostsIds,
      };
    }

    case actionTypes.SELECT_MY_POSTS_RESET: {
      return {
        ...state,
        myPostsSelected: [],
      };
    }

    default:
      return state;
  }
};

export default postsReducer;
