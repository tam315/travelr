// @flow
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import type { Comment, UserStore, PostsStore } from '../config/types';

const styles = () => ({});

type Props = {
  user: UserStore,
  posts: PostsStore,
  createComment: (
    user: UserStore,
    postId: number,
    comment: string,
    successCallback: (void) => void,
  ) => void,
};

type State = {
  comment: string,
};

export class PageViewPostComments extends React.Component<Props, State> {
  state = {
    comment: '',
  };

  handleChange(e: SyntheticInputEvent<HTMLElement>, stateKeyName: string) {
    this.setState({ [stateKeyName]: e.target.value });
  }

  handleCreateComment = () => {
    if (!this.props.posts.currentPost) return;

    const successCallback = () => {
      this.setState({ comment: '' });
    };

    this.props.createComment(
      this.props.user,
      this.props.posts.currentPost.postId,
      this.state.comment,
      successCallback,
    );
  };

  renderComments = (comments: Array<Comment>): Array<React.Element<any>> =>
    comments.map(item => (
      <div key={item.commentId} className="comment">
        <Typography variant="body2">{item.displayName}</Typography>
        <Typography>{item.comment}</Typography>
        <Typography variant="caption">
          {new Date(item.datetime).toISOString().substr(0, 10)}
        </Typography>
        {/* TODO: add comment edit & delete button */}
      </div>
    ));

  render() {
    if (!this.props.posts.currentPost) return <div />;

    const { comments } = this.props.posts.currentPost;

    return (
      <React.Fragment>
        <Input
          placeholder="コメントを書く"
          value={this.state.comment}
          onChange={e => this.handleChange(e, 'comment')}
        />
        {this.state.comment && (
          <Button
            onClick={this.handleCreateComment}
            color="primary"
            size="large"
            variant="contained"
          >
            コメントする
          </Button>
        )}

        {this.renderComments(comments)}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PageViewPostComments);
