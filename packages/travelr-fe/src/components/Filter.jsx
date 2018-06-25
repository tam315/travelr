import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import InputRange from 'react-input-range';
import '../css/reactInputRange.css';

const propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const defaultProps = {
  isOpen: false,
  onClose: null,
};

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

export class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      isListGroup1Open: false, // 「場所で探す」
      isListGroup2Open: false, // 「その他の条件で探す」
    };
  }

  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  }

  callbackWithCriterion = () => {
    const { onClose } = this.props;
    const criterion = {};

    criterion.displayName = this.state.displayName || null;
    criterion.description = this.state.description || null;
    criterion.minDate = this.state.shootDate.min || null;
    criterion.maxDate = this.state.shootDate.max || null;
    // TODO: lat lng radius
    criterion.lat = 40;
    criterion.lng = 140;
    criterion.radius = this.state.radius || null;
    criterion.minViewCount = this.state.viewCount.min || null;
    criterion.maxViewCount = this.state.viewCount.max || null;
    criterion.minLikedCount = this.state.likedCount.min || null;
    criterion.maxLikedCount = this.state.likedCount.max || null;
    criterion.minCommentsCount = this.state.commentsCount.min || null;
    criterion.maxCommentsCount = this.state.commentsCount.max || null;

    onClose(criterion);
  };

  renderListItem = item => {
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
            value={this.state[stateKeyName]}
            onChange={value => this.setState({ [stateKeyName]: value })}
            formatLabel={formatLabel}
          />
        </div>
      </ListItem>
    );
  };

  render() {
    const { isOpen, classes } = this.props;

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
          onClick={() =>
            this.setState({ isListGroup1Open: !this.state.isListGroup1Open })
          }
        >
          <ListItemText primary="場所で探す" />
          {this.state.isListGroup1Open ? (
            <IconExpandLess />
          ) : (
            <IconExpandMore />
          )}
        </ListItem>
        <Collapse in={this.state.isListGroup1Open} timeout="auto" unmountOnExit>
          <List>
            <ListItem>
              <TextField
                placeholder="市町村名・建物名"
                onChange={e => this.handleChange(e, 'placeName')}
                value={this.state.placeName}
              />
              <Typography variant="body1">から</Typography>
            </ListItem>
            <ListItem>
              <TextField
                placeholder="半径"
                onChange={e => this.handleChange(e, 'radius')}
                value={this.state.radius}
              />
              <Typography variant="body1">km以内</Typography>
            </ListItem>
          </List>
        </Collapse>

        <Divider />

        <ListItem
          button
          onClick={() =>
            this.setState({ isListGroup2Open: !this.state.isListGroup2Open })
          }
        >
          <ListItemText primary="その他の条件で探す" />
          {this.state.isListGroup2Open ? (
            <IconExpandLess />
          ) : (
            <IconExpandMore />
          )}
        </ListItem>
        <Collapse in={this.state.isListGroup2Open} timeout="auto" unmountOnExit>
          <List>
            <ListItem>
              <TextField
                placeholder="ユーザ名で探す"
                onChange={e => this.handleChange(e, 'displayName')}
                value={this.state.displayName}
              />
            </ListItem>
            <ListItem>
              <TextField
                placeholder="説明文で探す"
                onChange={e => this.handleChange(e, 'description')}
                value={this.state.description}
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

Filter.propTypes = propTypes;
Filter.defaultProps = defaultProps;

export default withStyles(styles)(Filter);
