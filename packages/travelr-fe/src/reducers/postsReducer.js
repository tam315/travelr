import types from '../actions/types';

const INITIAL_STATE = {
  all: [],
  allFilter: {},
  myPosts: [],
  myPostsSelected: [],
  currentPost: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_ALL_POSTS_SUCCESS:
      return {
        ...state,
        all: action.payload,
      };

    case types.FETCH_MY_POSTS_SUCCESS:
      return {
        ...state,
        myPosts: action.payload,
      };

    case types.DELETE_MY_POSTS_SUCCESS: {
      return {
        ...state,
        myPostsSelected: [],
      };
    }

    case types.SELECT_MY_POSTS: {
      const postIds = action.payload;
      const { myPostsSelected } = state;
      const newChecked = [...myPostsSelected];

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

    case types.SELECT_MY_POSTS_ALL: {
      const myAllPostsIds = state.myPosts.map(post => post.postId);
      return {
        ...state,
        myPostsSelected: myAllPostsIds,
      };
    }

    case types.SELECT_MY_POSTS_RESET: {
      return {
        ...state,
        myPostsSelected: [],
      };
    }

    default:
      return state;
  }
};
