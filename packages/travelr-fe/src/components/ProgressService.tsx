import { Fade, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { AppStore } from '../config/types';

const styles = {
  root: {
    position: 'fixed',
    top: 0,
    zIndex: 1110,
    width: '100%',
  },
};

type Props = {
  classes: any;
  app: AppStore;
};

export const ProgressService = (props: Props) => {
  const { classes } = props;
  const {
    app: { tasksInProgress },
  } = props;

  return (
    <div className={classes.root}>
      <Fade
        in={!!tasksInProgress.length}
        style={{
          transitionDelay: '0ms',
        }}
        unmountOnExit
      >
        {/* $FlowIgnore */}
        <LinearProgress color="secondary" />
      </Fade>
    </div>
  );
};

// @ts-ignore
export default withStyles(styles)(ProgressService);
