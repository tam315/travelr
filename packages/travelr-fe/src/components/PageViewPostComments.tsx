import { Button, Input, Menu, MenuItem, Typography } from '@material-ui/core';
import * as React from 'react';
import { Comment, Post, UserStore } from '../config/types';

type Props = {
  user: UserStore;
  post: Post;
  createComment: (user: UserStore, postId: number, comment: string) => void;
  deleteComment: (user: UserStore, comment: Comment) => void;
};

type State = {
  comment: string;
  deleteCommentMenuAnchor: HTMLElement | null;
  deleteCommentMenuCommentId: number | null;
};

export class PageViewPostComments extends React.Component<Props, State> {
  state = {
    comment: '',
    deleteCommentMenuAnchor: null,
    deleteCommentMenuCommentId: null,
  };

  // @ts-ignore
  componentDidUpdate = () => {
    const { post } = this.props;
    const { comment } = this.state;

    if (!post) return;

    // clear comment form if the comment is created successfully
    const { comments } = post;
    const commentCreated = comments.find(item => item.comment === comment);
    if (commentCreated) this.setState({ comment: '' });
  };

  handleChange(e: React.ChangeEvent<HTMLElement>, stateKeyName: string) {
    // @ts-ignore
    this.setState({ [stateKeyName]: e.target.value });
  }

  handleCreateComment = () => {
    const { user, post, createComment } = this.props;
    const { comment } = this.state;

    if (!post) return;

    createComment(user, post.postId, comment);
  };

  handleCommentClick = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
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

  renderComments = (comments: Comment[]): JSX.Element[] => {
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

export default PageViewPostComments;
