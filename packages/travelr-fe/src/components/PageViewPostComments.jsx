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
    const { post } = this.props;
    const { comment } = this.state;

    if (!post) return;

    // clear comment form if the comment is created successfully
    const { comments } = post;
    const commentCreated = comments.find(item => item.comment === comment);
    if (commentCreated) this.setState({ comment: '' });
  };

  handleChange(e: SyntheticInputEvent<HTMLElement>, stateKeyName: string) {
    this.setState({ [stateKeyName]: e.target.value });
  }

  handleCreateComment = () => {
    const { user, post, createComment } = this.props;
    const { comment } = this.state;

    if (!post) return;

    createComment(user, post.postId, comment);
  };

  handleCommentClick = (
    event: SyntheticEvent<HTMLElement>,
    comment: Comment,
  ) => {
    const { user } = this.props;

    if (comment.userId === user.userId) {
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
    const { user, post, deleteComment } = this.props;

    if (!post) return;

    deleteComment(user, comment);
    this.handleDeleteCommentMenuClose();
  };

  renderComments = (comments: Array<Comment>): Array<React.Element<any>> => {
    const { deleteCommentMenuAnchor, deleteCommentMenuCommentId } = this.state;

    return comments.map(comment => (
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
          anchorEl={deleteCommentMenuAnchor}
          open={deleteCommentMenuCommentId === comment.commentId}
          onClose={this.handleDeleteCommentMenuClose}
        >
          <MenuItem onClick={() => this.handleDeleteComment(comment)}>
            コメントを削除する
          </MenuItem>
        </Menu>
      </React.Fragment>
    ));
  };

  render() {
    const { post } = this.props;
    const { comment } = this.state;

    if (!post) return <div />;

    const { comments } = post;

    return (
      <React.Fragment>
        <Input
          placeholder="コメントを書く"
          value={comment}
          onChange={e => this.handleChange(e, 'comment')}
        />
        {comment && (
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
