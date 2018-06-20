import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  container: {
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing.unit * 4,
  },
});

function PageLanding(props) {
  const { classes } = props;
  return (
    <div className={classes.container}>
      <Typography variant="display3" color="inherit" align="center">
        Travelr
      </Typography>
      <Typography color="inherit" align="center">
        今と昔の写真を比べて楽しみましょう。
      </Typography>
      <Button
        size="large"
        component={Link}
        to="/all-grid"
        variant="contained"
        color="primary"
        className={classes.button}
      >
        <Typography color="inherit">写真を見てみる</Typography>
      </Button>
    </div>
  );
}

PageLanding.propTypes = propTypes;

export default withStyles(styles)(PageLanding);
