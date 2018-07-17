import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconEdit from '@material-ui/icons/Edit';
import * as React from 'react';
import ReactCompareImage from 'react-compare-image';
import { Link } from 'react-router-dom';
import firebaseUtils from '../utils/firebaseUtils';
import PageViewPostComments from './PageViewPostComments';
import StatusBadge from './StatusBadge';
import { PostsStore, UserStore, Post } from '../config/types';
import { match } from 'react-router';
import MapsShowPosition from '../utils/MapsShowPosition';

const styles = theme => ({
  root: {
    maxWidth: 500,
    margin: 'auto',
  },
  imageContainer: {
    maxWidth: 468,
    margin: 'auto',
    position: 'relative',
  },
  container: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 3}px`,
    marginTop: `${theme.spacing.unit * 4}px`,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
  },
  editButton: {
    background: 'white',
    borderRadius: 5,
    color: 'black',
    opacity: 0.7,
    padding: theme.spacing.unit * 1,
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
  },
  badges: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 2}px`,
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  skeleton: {
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  classes: any;
  match: match<{ postId: string }>;
  user: UserStore;
  posts: PostsStore;
  fetchPost: (postId: number, user: UserStore) => void;
  toggleLike: (user: UserStore, post: Post) => void;
  createComment: any;
  deleteComment: any;
};

export class PageViewPost extends React.Component<Props> {
  mapRef: React.RefObject<HTMLDivElement>;

  mapsShowPosition: MapsShowPosition;

  postId: number;

  constructor(props: Props) {
    super(props);

    const { match } = this.props;

    if (match.params.postId) {
      this.postId = Number(match.params.postId);
    }

    // div element refs for google maps
    this.mapRef = React.createRef();
  }

  // @ts-ignore
  componentDidMount = () => {
    const { user, fetchPost } = this.props;
    fetchPost(this.postId, user);
    this.refreshMap();
  };

  // @ts-ignore
  componentDidUpdate = (prevProps: Props) => {
    const { user, posts, fetchPost } = this.props;

    if (prevProps.user.userId !== user.userId) {
      fetchPost(this.postId, user);
    }

    // do nothing if post is not fetched yet
    const { currentPost } = posts;
    if (!currentPost) return;

    // do nothing if position is not changed
    if (
      prevProps.posts.currentPost &&
      currentPost.lng === prevProps.posts.currentPost.lng &&
      currentPost.lat === prevProps.posts.currentPost.lat
    ) {
      return;
    }

    this.refreshMap();
  };

  refreshMap = () => {
    const { posts } = this.props;

    // do nothing if post is not fetched yet
    const { currentPost } = posts;
    if (!currentPost) return;

    const { lng, lat } = currentPost;

    if (lng && lat && this.mapRef.current) {
      this.mapsShowPosition = new MapsShowPosition(this.mapRef.current, {
        lng,
        lat,
      });
    }
  };

  handleLikeButtonClick = () => {
    const {
      user,
      posts: { currentPost },
      toggleLike,
    } = this.props;

    if (currentPost) {
      toggleLike(user, currentPost);
    }
  };

  render() {
    const { classes } = this.props;
    const {
      user,
      posts: { currentPost },
      createComment,
      deleteComment,
    } = this.props;

    if (!currentPost) return <div />;
    const {
      postId,
      userId,
      oldImageUrl,
      newImageUrl,
      description,
      shootDate,
      viewCount,
      displayName,
      likedCount,
      commentsCount,
      likeStatus,
    } = currentPost;

    return (
      <div className={classes.root}>
        <div className={classes.imageContainer}>
          <ReactCompareImage
            leftImage={firebaseUtils.getImageUrl(oldImageUrl, '1024w')}
            rightImage={firebaseUtils.getImageUrl(newImageUrl, '1024w')}
            skeleton={<div className={classes.skeleton}>loading...</div>}
          />
          {userId === user.userId && (
            <Link to={`/post/${postId}/edit`} className={classes.editButton}>
              <IconEdit />
            </Link>
          )}
        </div>

        <div className={classes.container}>
          <div className={classes.badges}>
            <StatusBadge
              icon="like"
              count={likedCount}
              active={likeStatus}
              onClick={this.handleLikeButtonClick}
            />
            <StatusBadge icon="comment" count={commentsCount} />
            <StatusBadge icon="view" count={viewCount} />
          </div>

          <div>
            <Typography variant="body2">{displayName}</Typography>
            <Typography>{description}</Typography>
          </div>
          <Typography>
            撮影日：{new Date(shootDate).toISOString().substr(0, 10)}
          </Typography>

          <div
            ref={this.mapRef}
            style={{ width: '100%', height: '200px', background: 'gray' }}
          />

          <PageViewPostComments
            user={user}
            post={currentPost}
            createComment={createComment}
            deleteComment={deleteComment}
          />
        </div>
      </div>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(PageViewPost);
