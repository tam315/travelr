import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconLeft from '@material-ui/icons/KeyboardArrowLeft';
import IconRight from '@material-ui/icons/KeyboardArrowRight';
import * as React from 'react';
import ReactCompareImage from 'react-compare-image';
import { Post } from '../config/types';
import firebaseUtils from '../utils/firebaseUtils';
import history from '../utils/history';

const styles = theme => ({
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2,
  },
  circularProgress: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 1,
  },
  paper: {
    maxHeight: '100%',
    maxWidth: 500,
    outline: 'none',
    overflow: 'auto',
    padding: theme.spacing.unit * 1,
    position: 'relative',
    width: '100%',
  },
  pagerContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2,
    '& p': {
      marginRight: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 2,
    },
  },
  buttonsContainer: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 1}px`,
    gridTemplateColumns: '1fr 1fr',
    marginTop: theme.spacing.unit * 1,
  },
});

type Props = {
  posts: Post[];
  classes: any;
  onClose: any;
};

type State = {
  currentIndex: number;
};

export class PageViewPostsMapDetail extends React.Component<Props, State> {
  state = {
    currentIndex: 0,
  };

  handlePrevious = () => {
    const { currentIndex } = this.state;
    if (currentIndex === 0) return;
    this.setState({ currentIndex: currentIndex - 1 });
  };

  handleNext = () => {
    const { posts } = this.props;
    const { currentIndex } = this.state;
    if (currentIndex === posts.length - 1) return;
    this.setState({ currentIndex: currentIndex + 1 });
  };

  handleClose = () => {
    this.setState({ currentIndex: 0 });
    this.props.onClose();
  };

  handleKeyPress = e => {
    // left arrow
    if (e.keyCode === 37) this.handlePrevious();

    // right arrow
    if (e.keyCode === 39) this.handleNext();
  };

  handleShowPostPage = postId => {
    history.push(`/post/${postId}`);
  };

  // @ts-ignore
  render = () => {
    const { classes, posts } = this.props;
    const { currentIndex } = this.state;

    // this component is shown when the `posts` props has the length
    if (!posts || !(posts.length > 0)) return null;

    return (
      <Modal
        open={true}
        onClose={this.handleClose}
        classes={{ root: classes.modal }}
        onKeyDown={this.handleKeyPress}
      >
        <Paper className={classes.paper}>
          <ReactCompareImage
            leftImage={firebaseUtils.getImageUrl(
              posts[currentIndex].oldImageUrl,
              '192w',
            )}
            rightImage={firebaseUtils.getImageUrl(
              posts[currentIndex].newImageUrl,
              '192w',
            )}
            hover
            skeleton={
              <div className={classes.circularProgress}>
                <CircularProgress />
              </div>
            }
          />

          {/* hide pager if the posts has the only one post */}
          {posts.length > 1 && (
            <div
              className={classes.pagerContainer}
              // @ts-ignore
              dataenzyme="pager-container"
            >
              <Button
                onClick={this.handlePrevious}
                // @ts-ignore
                dataenzyme="button-previous"
              >
                <IconLeft />
              </Button>
              <Typography>
                {currentIndex + 1} / {posts.length}
              </Typography>
              <Button
                onClick={this.handleNext}
                // @ts-ignore
                dataenzyme="button-next"
              >
                <IconRight />
              </Button>
            </div>
          )}

          <div className={classes.buttonsContainer}>
            <Button
              className={classes.button}
              onClick={() =>
                this.handleShowPostPage(posts[currentIndex].postId)
              }
              fullWidth
              color="primary"
            >
              詳細を見る
            </Button>
            <Button
              className={classes.button}
              onClick={this.handleClose}
              fullWidth
              color="primary"
            >
              閉じる
            </Button>
          </div>
        </Paper>
      </Modal>
    );
  };
}

// @ts-ignore
export default withStyles(styles)(PageViewPostsMapDetail);
