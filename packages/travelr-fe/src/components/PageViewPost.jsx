// @flow
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconEdit from '@material-ui/icons/Edit';
import * as React from 'react';
import ReactCompareImage from 'react-compare-image';
import { Link } from 'react-router-dom';
import PageViewPostComments from './PageViewPostComments';
import StatusBadge from './StatusBadge';
import type { PostsStore, UserStore, Post } from '../config/types';
import type { Match } from 'react-router-dom';

const styles = theme => ({
  root: {
    maxWidth: 500,
    margin: 'auto',
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
    top: 72,
    zIndex: 10,
  },
  badges: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 2}px`,
    gridTemplateColumns: '1fr 1fr 1fr',
  },
});

type Props = {
  classes: any,
  match: Match,
  user: UserStore,
  posts: PostsStore,
  fetchPost: (postId: number, user: UserStore) => void,
  toggleLike: (user: UserStore, post: Post) => void,
  createComment: any => any,
  deleteComment: any => any,
};

export class PageViewPost extends React.Component<Props> {
  postId: number;

  constructor(props: Props) {
    super(props);

    const { postId } = this.props.match.params;

    if (postId) {
      this.postId = Number(postId);
    }
  }

  componentDidMount = () => {
    this.props.fetchPost(this.postId, this.props.user);
  };

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.user.userId !== this.props.user.userId) {
      this.props.fetchPost(this.postId, this.props.user);
    }
  };

  handleChange(e: SyntheticInputEvent<HTMLElement>, stateKeyName: string) {
    this.setState({ [stateKeyName]: e.target.value });
  }

  handleLikeButtonClick = () => {
    const { currentPost } = this.props.posts;

    if (currentPost) {
      this.props.toggleLike(this.props.user, currentPost);
    }
  };

  render() {
    const { classes } = this.props;
    const { currentPost } = this.props.posts;

    if (!currentPost) return <div />;
    const {
      postId,
      userId,
      oldImageUrl,
      newImageUrl,
      description,
      shootDate,
      lng,
      lat,
      viewCount,
      displayName,
      likedCount,
      commentsCount,
      likeStatus,
    } = currentPost;

    return (
      <div className={classes.root}>
        <ReactCompareImage leftImage={oldImageUrl} rightImage={newImageUrl} />

        {userId === this.props.user.userId && (
          <Link to={`/post/${postId}/edit`} className={classes.editButton}>
            <IconEdit />
          </Link>
        )}

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

          <div style={{ width: '100%', height: '150px', background: 'gray' }}>
            google maps goes here {lng} {lat}
          </div>

          <PageViewPostComments
            user={this.props.user}
            post={this.props.posts.currentPost}
            createComment={this.props.createComment}
            deleteComment={this.props.deleteComment}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageViewPost);
