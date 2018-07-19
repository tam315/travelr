import Button from '@material-ui/core/Button';
import {
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import InputRange from 'react-input-range';
import { FilterCriterion } from '../config/types';
import '../css/reactInputRange.css';

const styles = {
  paper: {
    display: 'block',
    overflowY: 'scroll',
    paddingBottom: 100,
  },
  drawerWidth: {
    width: 300,
  },
  rangeSelectorTitle: {
    flex: '2 0 0',
  },
  rangeSelector: {
    flex: '4 0 0',
    paddingRight: 50,
  },
  spacer: {
    marginTop: 16,
  },
  filterButtonContainer: {
    justifyContent: 'center',
    marginTop: '1rem',
  },
};

type Props = {
  isOpen: boolean;
  onClose: (filterCriterion: FilterCriterion) => void;
  classes: any;
};

type State = {
  shootDate: {
    min: number;
    max: number;
  };
  likedCount: {
    min: number;
    max: number;
  };
  commentsCount: {
    min: number;
    max: number;
  };
  viewCount: {
    min: number;
    max: number;
  };
  placeName: string;
  radius: string;
  displayName: string;
  description: string;
  isListGroup1Open: boolean; // 「場所で探す」
  isListGroup2Open: boolean; // 「その他の条件で探す」
};

export class Filter extends React.Component<Props, State> {
  state = {
    shootDate: {
      min: 0,
      max: 100,
    },
    likedCount: {
      min: 0,
      max: 100,
    },
    commentsCount: {
      min: 0,
      max: 100,
    },
    viewCount: {
      min: 0,
      max: 100,
    },
    placeName: '',
    radius: '',
    displayName: '',
    description: '',
    isListGroup1Open: false,
    isListGroup2Open: false,
  };

  handleChange(e: React.ChangeEvent<HTMLInputElement>, stateKeyName: string) {
    // @ts-ignore
    this.setState({ [stateKeyName]: e.target.value });
  }

  callbackWithCriterion = () => {
    const { onClose } = this.props;
    const criterion: FilterCriterion = {};

    const {
      displayName,
      description,
      shootDate,
      radius,
      viewCount,
      likedCount,
      commentsCount,
    } = this.state;

    if (displayName) criterion.displayName = displayName;
    if (description) criterion.description = description;
    if (shootDate.min) criterion.minDate = String(shootDate.min); // TODO 日付に変換
    if (shootDate.max) criterion.maxDate = String(shootDate.max); // TODO 日付に変換
    if (radius) criterion.radius = Number(radius);
    if (viewCount.min) criterion.minViewCount = viewCount.min;
    if (viewCount.max) criterion.maxViewCount = viewCount.max;
    if (likedCount.min) criterion.minLikedCount = likedCount.min;
    if (likedCount.max) criterion.maxLikedCount = likedCount.max;
    if (commentsCount.min) criterion.minCommentsCount = commentsCount.min;
    if (commentsCount.max) criterion.maxCommentsCount = commentsCount.max;
    criterion.lat = 40;
    criterion.lng = 140;
    // TODO: lat lng radius

    onClose(criterion);
  };

  renderListItem = (item: {
    title: string;
    stateKeyName: string;
    min?: number;
    max?: number;
    formatLabel?: (num: number) => string;
  }) => {
    const {
      title,
      stateKeyName,
      max = 100,
      min = 0,
      formatLabel = null,
    } = item;
    const { classes } = this.props;
    return (
      <ListItem>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ variant: 'body1' }}
          className={classes.rangeSelectorTitle}
        />
        <div className={classes.rangeSelector}>
          <InputRange
            maxValue={max}
            minValue={min}
            // eslint-disable-next-line
            value={this.state[stateKeyName]}
            onChange={
              // @ts-ignore
              value => this.setState({ [stateKeyName]: value })
            }
            formatLabel={formatLabel}
          />
        </div>
      </ListItem>
    );
  };

  render() {
    const { isOpen, classes } = this.props;
    const {
      placeName,
      radius,
      displayName,
      description,
      isListGroup1Open,
      isListGroup2Open,
    } = this.state;

    const menu = (
      <React.Fragment>
        <List className={classes.drawerWidth}>
          <ListItem>
            <ListItemText
              primary="フィルタ"
              primaryTypographyProps={{ variant: 'title' }}
            />
          </ListItem>
        </List>

        <Divider />

        <List>
          {this.renderListItem({
            title: '撮影日',
            stateKeyName: 'shootDate',
            min: 0,
            max: 1529789723000,
            formatLabel: value => new Date(value).toISOString().substr(0, 7),
          })}
          <div className={classes.spacer} />
          {this.renderListItem({ title: 'いいね', stateKeyName: 'likedCount' })}
          <div className={classes.spacer} />
          {this.renderListItem({
            title: 'コメント',
            stateKeyName: 'commentsCount',
          })}
          <div className={classes.spacer} />
          {this.renderListItem({ title: '閲覧数', stateKeyName: 'viewCount' })}
        </List>

        <Divider />

        <ListItem
          button
          onClick={() => this.setState({ isListGroup1Open: !isListGroup1Open })}
        >
          <ListItemText primary="場所で探す" />
          {isListGroup1Open ? <IconExpandLess /> : <IconExpandMore />}
        </ListItem>
        <Collapse in={isListGroup1Open} timeout="auto" unmountOnExit>
          <List>
            <ListItem>
              <TextField
                placeholder="市町村名・建物名"
                onChange={e => this.handleChange(e, 'placeName')}
                value={placeName}
              />
              <Typography variant="body1">から</Typography>
            </ListItem>
            <ListItem>
              <TextField
                placeholder="半径"
                onChange={e => this.handleChange(e, 'radius')}
                value={radius}
              />
              <Typography variant="body1">km以内</Typography>
            </ListItem>
          </List>
        </Collapse>

        <Divider />

        <ListItem
          button
          onClick={() => this.setState({ isListGroup2Open: !isListGroup2Open })}
        >
          <ListItemText primary="その他の条件で探す" />
          {isListGroup2Open ? <IconExpandLess /> : <IconExpandMore />}
        </ListItem>
        <Collapse in={isListGroup2Open} timeout="auto" unmountOnExit>
          <List>
            <ListItem>
              <TextField
                placeholder="ユーザ名で探す"
                onChange={e => this.handleChange(e, 'displayName')}
                value={displayName}
              />
            </ListItem>
            <ListItem>
              <TextField
                placeholder="説明文で探す"
                onChange={e => this.handleChange(e, 'description')}
                value={description}
              />
            </ListItem>
          </List>
        </Collapse>

        <Divider />

        <ListItem classes={{ root: classes.filterButtonContainer }}>
          <Button
            color="primary"
            size="large"
            variant="contained"
            className={classes.button}
            onClick={this.callbackWithCriterion}
          >
            フィルタする
          </Button>
        </ListItem>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={this.callbackWithCriterion}
          classes={{ paper: classes.paper }}
        >
          {menu}
        </Drawer>
      </React.Fragment>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(Filter);
