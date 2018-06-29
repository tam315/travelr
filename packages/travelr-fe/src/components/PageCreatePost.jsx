// @flow
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import config from '../config';
import type { RouterHistory } from 'react-router-dom';
import type { UserStore, NewPost } from '../config/types';

const styles = theme => ({
  root: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 4}px`,
    flexDirection: 'column',
    maxWidth: 500,
    margin: 'auto',
    padding: theme.spacing.unit * 2,
    '& legend': {
      marginBottom: theme.spacing.unit * 1,
    },
  },
});

type Props = {
  classes: any,
  history: RouterHistory,
  user: UserStore,
};

type State = {
  oldImageFilePath: string,
  newImageFilePath: string,
  description: string,
  shootDate: string,
  lng: ?number,
  lat: ?number,
};

export class PageCreatePost extends React.Component<Props, State> {
  state = {
    oldImageFilePath: '',
    newImageFilePath: '',
    description: '',
    shootDate: '',
    lng: null,
    lat: null,
  };

  getCurrentPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(geom => {
        this.setState({
          lng: geom.coords.longitude,
          lat: geom.coords.latitude,
        });
      });
    } else {
      // TODO: toast 'gpsが利用できない環境です。'
    }
  };

  handleChange(e: SyntheticInputEvent<>, stateKayName: string) {
    e.preventDefault();
    this.setState({ [stateKayName]: e.target.value });
  }

  handleSubmit = () => {
    const {
      oldImageFilePath,
      newImageFilePath,
      description,
      shootDate,
      lng,
      lat,
    } = this.state;

    if (
      !oldImageFilePath ||
      !newImageFilePath ||
      // missing description is OK
      !shootDate ||
      !lng ||
      !lat
    ) {
      return; // TODO: toast '入力項目が不足しています。'
    }

    // TODO: upload images to firebase and get the url

    const post: NewPost = {
      oldImageUrl: 'dummyurl1',
      newImageUrl: 'dummyurl2',
      description,
      shootDate,
      lng,
      lat,
    };

    const successCallback = (postId: number): void => {
      this.props.history.push(`/post/${postId}`);
    };

    this.createPost(post, successCallback);
  };

  createPost = async (post: NewPost, successCallback: number => any) => {
    try {
      const response = await fetch(`${config.apiUrl}posts`, {
        method: 'POST',
        headers: {
          authorization: this.props.user.token,
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        // TODO: toast
        return;
      }

      const { postId } = await response.json();
      // TODO: toast
      successCallback(postId);
    } catch (err) {
      // TODO: toast
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="title">写真を投稿する</Typography>
        <FormControl required>
          <FormLabel component="legend">昔の写真</FormLabel>
          <Button variant="contained" component="label">
            ファイルを選択
            <input
              style={{ display: 'none' }}
              type="file"
              value={this.state.oldImageFilePath}
              onChange={e => this.handleChange(e, 'oldImageFilePath')}
            />
          </Button>
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">今の写真</FormLabel>
          <Button variant="contained" component="label">
            ファイルを選択
            <input
              style={{ display: 'none' }}
              type="file"
              value={this.state.newImageFilePath}
              onChange={e => this.handleChange(e, 'newImageFilePath')}
            />
          </Button>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">説明文</FormLabel>
          <Input
            placeholder="説明文"
            multiline
            value={this.state.description}
            onChange={e => this.handleChange(e, 'description')}
          />
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">昔の写真の撮影日</FormLabel>
          <TextField
            type="date"
            value={this.state.shootDate}
            onChange={e => this.handleChange(e, 'shootDate')}
          />
        </FormControl>
        <FormControl component="fieldset" required>
          {/* TODO: create map */}
          <Typography placeholder="緯度経度">
            {this.state.lng &&
              this.state.lat &&
              `${this.state.lng} ${this.state.lat}`}
          </Typography>
          <FormLabel component="legend">撮影場所</FormLabel>
          <Button
            variant="contained"
            fullWidth
            onClick={this.getCurrentPosition}
          >
            現在地から位置を取得
          </Button>
        </FormControl>
        <FormControl component="fieldset" required>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.handleSubmit}
          >
            投稿する
          </Button>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(PageCreatePost);
