import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import IconLike from '../icons/like.svg';

const propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

const defaultProps = {};

function StatusBadge(props) {
  const { icon, count } = props;

  const styles = {
    root: {
      display: 'flex',
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 8,
      paddingLeft: 8,
      backgroundColor: 'white',
      opacity: 0.8,
      borderRadius: 4,
      alignItems: 'center',
    },
    icon: {
      display: 'block',
      height: 8,
      marginRight: 4,
    },
  };

  let iconElement;
  switch (icon) {
    case 'like':
      iconElement = <IconLike style={styles.icon} />;
      break;
    case 'comment':
      iconElement = <div>comment</div>;
      break;
    case 'view':
      iconElement = <div>view</div>;
      break;
    default:
      iconElement = null;
  }

  return (
    <div style={styles.root}>
      {iconElement}
      <Typography variant="caption" color="inherit">
        {count}
      </Typography>
    </div>
  );
}

StatusBadge.propTypes = propTypes;
StatusBadge.defaultProps = defaultProps;

export default StatusBadge;
