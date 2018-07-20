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
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import InputRange from 'react-input-range';
import { FilterCriterion, FilterStore } from '../config/types';
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
    paddingRight: 20,
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
  onClose: () => void;
  onFilter: (
    criterion: FilterCriterion,
    criterionUntouched: FilterCriterion,
  ) => void;
  classes: any;
  filter: FilterStore;
};

type State = {
  criterion: FilterCriterion;
  isListGroup1Open: boolean; // 「場所で探す」
  isListGroup2Open: boolean; // 「その他の条件で探す」
};

export class Filter extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { filter } = this.props;

    this.state = {
      criterion: filter.criterion,
      isListGroup1Open: false,
      isListGroup2Open: false,
    };
  }

  // @ts-ignore
  componentDidUpdate = (prevProps: Props) => {
    // update component's criterion:
    // - when user updated the criterion (did filter)
    // - when GET_FILTER_SELECTOR_RANGE_SUCCESS
    const newCriterion = JSON.stringify(this.props.filter.criterion);
    const oldCriterion = JSON.stringify(prevProps.filter.criterion);
    if (newCriterion !== oldCriterion) {
      this.setState({
        criterion: this.props.filter.criterion,
      });
    }
  };

  handleChange(e: React.ChangeEvent<HTMLInputElement>, stateKeyName: string) {
    this.setState({
      criterion: {
        ...this.state.criterion,
        [stateKeyName]: e.target.value,
      },
    });
  }

  handleSliderChange = (stateKeyName: string, value: number) => {
    this.setState({
      criterion: {
        ...this.state.criterion,
        [stateKeyName]: value,
      },
    });
  };

  handleFilter = () => {
    const { onClose, onFilter, filter } = this.props;
    const { criterion } = this.state;

    onFilter(criterion, filter.criterionUntouched);
    onClose();
  };

  handleClose = () => {
    const { onClose, filter } = this.props;

    // reset criterions to the store state if the user just closed the filter
    this.setState({
      criterion: {
        ...filter.criterion,
      },
    });

    onClose();
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
            value={this.state.criterion[stateKeyName]}
            onChange={(value: number) =>
              this.handleSliderChange(stateKeyName, value)
            }
            formatLabel={formatLabel}
          />
        </div>
      </ListItem>
    );
  };

  render() {
    const { isOpen, classes, filter } = this.props;
    const {
      criterion,
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
            min: 1900,
            max: 2018,
          })}

          <div className={classes.spacer} />
          {this.renderListItem({
            title: 'いいね',
            stateKeyName: 'likedCount',
            min: 0,
            max: filter.criterionUntouched.likedCount.max,
          })}

          <div className={classes.spacer} />
          {this.renderListItem({
            title: 'コメント',
            stateKeyName: 'commentsCount',
            min: 0,
            max: filter.criterionUntouched.commentsCount.max,
          })}

          <div className={classes.spacer} />
          {this.renderListItem({
            title: '閲覧数',
            stateKeyName: 'viewCount',
            min: 0,
            max: filter.criterionUntouched.viewCount.max,
          })}
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
                value={criterion.placeName}
              />
              <Typography variant="body1">から</Typography>
            </ListItem>
            <ListItem>
              <TextField
                placeholder="半径"
                onChange={e => this.handleChange(e, 'radius')}
                value={criterion.radius}
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
                value={criterion.displayName}
              />
            </ListItem>
            <ListItem>
              <TextField
                placeholder="説明文で探す"
                onChange={e => this.handleChange(e, 'description')}
                value={criterion.description}
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
            onClick={this.handleFilter}
          >
            フィルタする
          </Button>
        </ListItem>
      </React.Fragment>
    );

    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={this.handleClose}
        classes={{ paper: classes.paper }}
      >
        {menu}
      </Drawer>
    );
  }
}

// @ts-ignore
export default withStyles(styles)(Filter);
