import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import ReactCompareImage from 'react-compare-image';
import config from '../config';
import StatusBadge from './StatusBadge';

const propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  token: PropTypes.string,
};

const defaultProps = { token: null };

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

export class PageViewPost extends React.Component {
  constructor(props) {
    super(props);

    this.postId = this.props.match.params.postId;
    this.state = {
      post: {},
      comment: '',
    };
  }

  componentDidMount = () => {
    this.fetchPost(this.postId); // TODO: pass userId as 2nd arg
  };

  fetchPost = async postId => {
    try {
      const response = await fetch(`${config.apiUrl}posts/${postId}`);

      if (!response.ok) {
        // TODO: toast
        return;
      }

      const post = await response.json();
      this.setState({ post });
    } catch (err) {
      // TODO: toast
    }
  };

  createComment = async (postId, comment) => {
    try {
      const response = await fetch(`${config.apiUrl}posts/${postId}/comments`, {
        method: 'POST',
        headers: { authorization: this.props.token }, // TODO: replace token
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        // TODO: toast
        return;
      }

      await this.fetchPost(this.postId);
    } catch (err) {
      // TODO: toast
    }
  };

  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  }

  renderComments = comments =>
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
    const { classes } = this.props;
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
    } = this.state.post;

    // return nothing if the data is not fetched yet
    if (!oldImageUrl) return <div />;

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
            google maps goes here
          </div>

          <Input
            placeholder="コメントを書く"
            value={this.state.comment}
            onChange={e => this.handleChange(e, 'comment')}
          />
          {this.state.comment && (
            <Button
              onClick={() =>
                this.createComment(this.postId, this.state.comment)
              }
              color="primary"
              size="large"
              variant="contained"
            >
              コメントする
            </Button>
          )}

          {this.renderComments(comments)}
        </div>
      </div>
    );
  }
}

PageViewPost.propTypes = propTypes;
PageViewPost.defaultProps = defaultProps;

export default withStyles(styles)(PageViewPost);
