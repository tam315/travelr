// @flow
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import ReactCompareImage from 'react-compare-image';
import StatusBadge from './StatusBadge';
import type { PostsStore, UserStore } from '../config/types';
import type { Match } from 'react-router-dom';
import PageViewPostComments from './PageViewPostComments';

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
  createComment: (user: UserStore, postId: number, comment: string) => void,
  fetchPost: (postId: number) => void,
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
    this.props.fetchPost(this.postId); // TODO: pass userId as 2nd arg
  };

  handleChange(e: SyntheticInputEvent<HTMLElement>, stateKeyName: string) {
    this.setState({ [stateKeyName]: e.target.value });
  }

  handleCreateComment = (comment: string) => {
    this.props.createComment(this.props.user, this.postId, comment);
  };

  render() {
    const { classes } = this.props;
    const { currentPost } = this.props.posts;

    if (!currentPost) return <div />;
    const {
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
      comments,
    } = currentPost;

    return (
      <div className={classes.root}>
        <ReactCompareImage leftImage={oldImageUrl} rightImage={newImageUrl} />

        <div className={classes.container}>
          <div className={classes.badges}>
            <StatusBadge icon="like" count={likedCount} />
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
            comments={comments}
            onCreateComment={this.handleCreateComment}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageViewPost);
