import Typography from '@material-ui/core/Typography';
import IconComment from '@material-ui/icons/Comment';
import IconView from '@material-ui/icons/Visibility';
import PropTypes from 'prop-types';
import React from 'react';
import IconLike from '../icons/like.svg';

const propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'normal']),
};

const defaultProps = {
  size: 'normal',
};

function StatusBadge(props) {
  const { icon, count, size } = props;

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
      marginRight: 4,
    },
  };

  const stylesNormalSize = {
    root: {
      alignItems: 'center',
      backgroundColor: 'white',
      border: '1px solid gray',
      borderRadius: 8,
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
      width: '100%',
    },
    icon: {
      display: 'block',
      height: 24,
      width: 24,
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
