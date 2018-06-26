import Typography from '@material-ui/core/Typography';
import IconComment from '@material-ui/icons/Comment';
import IconView from '@material-ui/icons/Visibility';
import PropTypes from 'prop-types';
import React from 'react';
import IconLike from '../icons/like.svg';

const propTypes = {
  count: PropTypes.number.isRequired,
  // true: space-between, false: flex-start
  dense: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  // margin between icon and count. only works if 'dense' is true
  iconMargin: PropTypes.number,
  noBorder: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'normal']),
};

const defaultProps = {
  dense: false,
  iconMargin: 4,
  noBorder: false,
  size: 'normal',
};

function StatusBadge(props) {
  const { icon, count, size, noBorder, iconMargin, dense } = props;

  const isNormalSize = size === 'normal';

  const stylesSmallSize = {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 8,
      paddingLeft: 8,
      backgroundColor: 'white',
      opacity: 0.8,
      borderRadius: 4,
      alignItems: 'center',
      width: '100%',
    },
    icon: {
      display: 'block',
      height: 8,
      marginRight: iconMargin,
    },
  };

  const stylesNormalSize = {
    root: {
      alignItems: 'center',
      border: noBorder ? null : '1px solid gray',
      borderRadius: 8,
      display: 'flex',
      justifyContent: dense ? 'flex-start' : 'space-between',
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
    },
    icon: {
      display: 'block',
      height: 24,
      width: 24,
      marginRight: iconMargin,
    },
  };

  let iconElement;
  switch (icon) {
    case 'like':
      iconElement = (
        <IconLike
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      );
      break;
    case 'comment':
      iconElement = (
        <IconComment
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      );
      break;
    case 'view':
      iconElement = (
        <IconView
          style={isNormalSize ? stylesNormalSize.icon : stylesSmallSize.icon}
        />
      );
      break;
    default:
      iconElement = null;
  }

  return (
    <div style={isNormalSize ? stylesNormalSize.root : stylesSmallSize.root}>
      {iconElement}
      <Typography variant={isNormalSize ? 'body1' : 'caption'} color="inherit">
        {count}
      </Typography>
    </div>
  );
}

StatusBadge.propTypes = propTypes;
StatusBadge.defaultProps = defaultProps;

export default StatusBadge;
