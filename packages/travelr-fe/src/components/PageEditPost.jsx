// @flow
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import * as React from 'react';
import type {
  LatLng,
  PostsStore,
  PostToEdit,
  UserStore,
} from '../config/types';
import type { Match, RouterHistory } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MapsPickPosition from '../utils/MapsPickPosition';

const styles = theme => ({
  root: {
    maxWidth: 500,
    margin: 'auto',
    '& .googlemap': {
      marginTop: theme.spacing.unit * 1,
    },
  },
  container: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 3}px`,
    marginTop: `${theme.spacing.unit * 4}px`,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
  },
});

type ReactObjRef<ElementType: React.ElementType> = {
  current: null | React.ElementRef<ElementType>,
};

type Props = {
  classes: any,
  match: Match,
  history: RouterHistory,
  user: UserStore,
  posts: PostsStore,
  editPost: (
    user: UserStore,
    postToEdit: PostToEdit,
    successCallback: (any) => any,
  ) => void,
  fetchPost: (postId: number) => void,
  deletePost: (
    user: UserStore,
    postId: number,
    successCallback: (void) => void,
  ) => void,
};

type State = {
  postId: number,
  oldImageUrl: string,
  newImageUrl: string,
  description: string,
  shootDate: string,
  lng: number,
  lat: number,
};

export class PageEditPost extends React.Component<Props, State> {
  mapRef: ReactObjRef<'div'>;
  mapsPickPosition: MapsPickPosition;
  postId: number;

  constructor(props: Props) {
    super(props);

    this.mapRef = React.createRef();

    const { postId } = this.props.match.params;

    if (postId) {
      this.postId = Number(postId);
    }
  }

  componentDidMount = () => {
    this.props.fetchPost(this.postId);
    this.refreshMap();
  };

  componentDidUpdate = (prevProps: any) => {
    const { currentPost } = this.props.posts;

    // set state when the data is fetched from the API
    if (currentPost !== prevProps.posts.currentPost) {
      if (!currentPost) return;
      this.setState({
        postId: currentPost.postId,
        oldImageUrl: currentPost.oldImageUrl,
        newImageUrl: currentPost.newImageUrl,
        description: currentPost.description,
        shootDate: currentPost.shootDate,
        lng: currentPost.lng,
        lat: currentPost.lat,
      });
    }
    this.refreshMap();
  };

  refreshMap = () => {
    // render the map if the DOM is ready and the map is not instantiated yet
    if (this.mapRef.current && !this.mapsPickPosition && this.state) {
      const options = {
        defaultPosition: { lat: this.state.lat, lng: this.state.lng },
      };

      this.mapsPickPosition = new MapsPickPosition(
        this.mapRef.current,
        this.handlePinPositionChange,
        options,
      );
    }
  };

  handleChange(e: SyntheticInputEvent<HTMLElement>, stateKeyName: string) {
    this.setState({ [stateKeyName]: e.target.value });
  }

  handlePinPositionChange = (position: LatLng) => {
    this.setState({
      lng: position.lng,
      lat: position.lat,
    });
  };

  handleSubmit = () => {
    const { editPost, user, history } = this.props;

    const postToEdit: PostToEdit = {
      postId: this.state.postId,
      oldImageUrl: this.state.oldImageUrl,
      newImageUrl: this.state.newImageUrl,
      description: this.state.description,
      shootDate: this.state.shootDate,
      lng: this.state.lng,
      lat: this.state.lat,
    };

    const successCallback = (postId: number): void => {
      history.push(`/post/${postId}`);
    };
    editPost(user, postToEdit, successCallback);
  };

  handleDeletePost = () => {
    const { deletePost, user, history } = this.props;

    const successCallback = () => {
      history.push('/all-grid');
    };

    // eslint-disable-next-line
    if (confirm('本当に削除してよろしいですか？')) {
      // TODO: dialog
      deletePost(user, this.state.postId, successCallback);
    }
  };

  render() {
    const { classes } = this.props;

    if (!this.state) return <div />;
    const { description, shootDate, lng, lat } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography variant="title">写真の情報を編集する</Typography>

          <FormControl component="fieldset" required>
            <FormLabel component="legend">説明文</FormLabel>
            <Input
              value={description || ''}
              multiline
              onChange={e => this.handleChange(e, 'description')}
            />
          </FormControl>

          <FormControl component="fieldset" required>
            <FormLabel component="legend">昔の写真の撮影日</FormLabel>
            <TextField
              type="date"
              value={new Date(shootDate || '').toISOString().substr(0, 10)}
              onChange={e => this.handleChange(e, 'shootDate')}
            />
          </FormControl>

          <FormControl component="fieldset" required>
            <FormLabel component="legend">撮影場所</FormLabel>
            <div
              ref={this.mapRef}
              style={{ width: '100%', height: '150px', background: 'gray' }}
              className="googlemap"
            >
              google maps goes here {lng} {lat}
            </div>
          </FormControl>

          <FormControl component="fieldset" required>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={this.handleSubmit}
            >
              編集完了
            </Button>
          </FormControl>

          <Typography
            color="secondary"
            variant="body2"
            onClick={this.handleDeletePost}
          >
            投稿を削除する
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageEditPost);
