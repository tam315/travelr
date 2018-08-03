import {
  Button,
  FormControl,
  FormLabel,
  Input,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { LatLng, NewPost, UserStore } from '../config/types';
import MapsPickPosition from '../utils/MapsPickPosition';
import { getPositionFromPlaceName } from '../utils/mapsUtils';

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
  searchContainer: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
    '& > :first-child': {
      flex: '1 0 0',
      marginRight: theme.spacing.unit * 1,
    },
  },
});

type Props = {
  classes: any;
  user: UserStore;
  createPost: (user: UserStore, newPost: NewPost) => void;
  addSnackbarQueue: (message: string) => any;
};

type State = {
  oldImageFilePath: string;
  newImageFilePath: string;
  description: string;
  shootDate: string;
  lng: number;
  lat: number;
  placeName: string;
};

export class PageCreatePost extends React.Component<Props, State> {
  state = {
    oldImageFilePath: '',
    newImageFilePath: '',
    description: '',
    shootDate: '',
    lng: null,
    lat: null,
    placeName: '',
  };

  oldImage: React.RefObject<HTMLInputElement>;

  newImage: React.RefObject<HTMLInputElement>;

  mapRef: React.RefObject<HTMLDivElement>;

  mapsPickPosition: MapsPickPosition;

  constructor(props: Props) {
    super(props);

    this.oldImage = React.createRef();
    this.newImage = React.createRef();
    this.mapRef = React.createRef();
  }

  // @ts-ignore
  componentDidMount = () => {
    if (this.mapRef.current) {
      this.mapsPickPosition = new MapsPickPosition(
        this.mapRef.current,
        this.handlePinPositionChange,
      );
    }
  };

  getLatLngFromPlaceName = async () => {
    const { addSnackbarQueue } = this.props;
    const { placeName } = this.state;
    if (!placeName) return;

    try {
      const { lat, lng } = await getPositionFromPlaceName(placeName);
      this.setState({ lat, lng });
      this.mapsPickPosition.setPosition({ lng, lat });
    } catch (err) {
      addSnackbarQueue('住所・建物名から緯度経度を検索できませんでした');
    }
  };

  handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    stateKayName: string,
  ) {
    e.preventDefault();
    // @ts-ignore
    this.setState({ [stateKayName]: e.target.value });
  }

  handlePinPositionChange = (position: LatLng) => {
    this.setState({
      lng: position.lng,
      lat: position.lat,
    });
  };

  handleSubmit = async () => {
    const { user, addSnackbarQueue, createPost } = this.props;
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
      return addSnackbarQueue('入力項目が不足しています。');
    }

    if (!this.oldImage.current || !this.newImage.current) {
      return addSnackbarQueue('画像ファイルを取得できませんでした');
    }

    const oldImageFile = this.oldImage.current.files[0];
    const newImageFile = this.newImage.current.files[0];

    const newPost: NewPost = {
      oldImageFile,
      newImageFile,
      description,
      shootDate,
      lng,
      lat,
    };

    return createPost(user, newPost);
  };

  render() {
    const { classes } = this.props;
    const {
      oldImageFilePath,
      newImageFilePath,
      description,
      shootDate,
      placeName,
    } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="title">写真を投稿する</Typography>
        <FormControl required>
          <FormLabel component="legend">昔の写真</FormLabel>
          {oldImageFilePath && <Typography>{oldImageFilePath}</Typography>}
          <Button variant="contained" component="label">
            ファイルを選択
            <input
              ref={this.oldImage}
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              value={oldImageFilePath}
              onChange={e => this.handleChange(e, 'oldImageFilePath')}
            />
          </Button>
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">今の写真</FormLabel>
          {newImageFilePath && <Typography>{newImageFilePath}</Typography>}
          <Button variant="contained" component="label">
            ファイルを選択
            <input
              ref={this.newImage}
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              value={newImageFilePath}
              onChange={e => this.handleChange(e, 'newImageFilePath')}
            />
          </Button>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">説明文</FormLabel>
          <Input
            placeholder="説明文"
            multiline
            value={description}
            onChange={e => this.handleChange(e, 'description')}
          />
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">昔の写真の撮影日</FormLabel>
          <TextField
            type="date"
            value={shootDate}
            onChange={e => this.handleChange(e, 'shootDate')}
          />
        </FormControl>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">撮影場所</FormLabel>
          <div className={classes.searchContainer}>
            <Input
              placeholder="住所・建物名など"
              multiline
              value={placeName}
              onChange={e => this.handleChange(e, 'placeName')}
              // @ts-ignore
              dataenzyme="placeName"
            />
            <Button variant="contained" onClick={this.getLatLngFromPlaceName}>
              検索
            </Button>
          </div>
          <div
            ref={this.mapRef}
            style={{
              width: '100%',
              height: '200px',
              background: 'gray',
              marginBottom: '1rem',
            }}
          />
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

// @ts-ignore
export default withStyles(styles)(PageCreatePost);
