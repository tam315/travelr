// @flow
import { Button, Input, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import type { Comment, UserStore, Post } from '../config/types';

const styles = () => ({});

type Props = {
  user: UserStore,
  post: Post,
  createComment: (user: UserStore, postId: number, comment: string) => void,
  deleteComment: (user: UserStore, comment: Comment) => void,
};

type State = {
  comment: string,
  deleteCommentMenuAnchor: ?HTMLElement,
  deleteCommentMenuCommentId: ?number,
};

export class PageViewPostComments extends React.Component<Props, State> {
  state = {
    comment: '',
    deleteCommentMenuAnchor: null,
    deleteCommentMenuCommentId: null,
  };

  componentDidUpdate = () => {
    if (!this.props.post) return;

    // clear comment form if the comment is created successfully
    const { comments } = this.props.post;
    const commentCreated = comments.find(
      comment => comment.comment === this.state.comment,
    );
    if (commentCreated) this.setState({ comment: '' });
  };

  handleChange(e: SyntheticInputEvent<HTMLElement>, stateKeyName: string) {
    this.setState({ [stateKeyName]: e.target.value });
  }

  handleCreateComment = () => {
    if (!this.props.post) return;

    this.props.createComment(
      this.props.user,
      this.props.post.postId,
      this.state.comment,
    );
  };

  handleCommentClick = (
    event: SyntheticEvent<HTMLElement>,
    comment: Comment,
  ) => {
    if (comment.userId === this.props.user.userId) {
      this.setState({
        deleteCommentMenuAnchor: event.currentTarget,
        deleteCommentMenuCommentId: comment.commentId,
      });
    }
  };

  handleDeleteCommentMenuClose = () => {
    this.setState({
      deleteCommentMenuAnchor: null,
      deleteCommentMenuCommentId: null,
    });
  };

  handleDeleteComment = (comment: Comment) => {
    const { user, post } = this.props;

    if (!post) return;

    this.props.deleteComment(user, comment);
    this.handleDeleteCommentMenuClose();
  };

  renderComments = (comments: Array<Comment>): Array<React.Element<any>> =>
    comments.map(comment => (
      <React.Fragment key={comment.commentId}>
        <div
          className="comment"
          onClick={e => this.handleCommentClick(e, comment)}
          onKeyDown={e =>
            e.keyCode === 46 && this.handleCommentClick(e, comment)
          }
          role="button"
          tabIndex={0}
        >
          <Typography variant="body2">{comment.displayName}</Typography>
          <Typography>{comment.comment}</Typography>
          <Typography variant="caption">
            {new Date(comment.datetime).toISOString().substr(0, 10)}
          </Typography>
        </div>
        <Menu
          anchorEl={this.state.deleteCommentMenuAnchor}
          open={this.state.deleteCommentMenuCommentId === comment.commentId}
          onClose={this.handleDeleteCommentMenuClose}
        >
          <MenuItem onClick={() => this.handleDeleteComment(comment)}>
            コメントを削除する
          </MenuItem>
        </Menu>
      </React.Fragment>
    ));

  render() {
    if (!this.props.post) return <div />;

    const { comments } = this.props.post;

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
