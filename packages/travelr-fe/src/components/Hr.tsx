import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

const styles = theme => ({
  withInnerText: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    fontSize: '0.8rem',
    ':before,:after': {
      borderTop: '1px solid',
      content: ' ',
      flexGrow: 1,
    },
    ':before': {
      marginRight: '0.5rem',
    },
    ':after': {
      marginLeft: '0.5rem',
    },
  },
  withoutInnerText: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  text: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
});

type Props = {
  classes: any;
  text?: string;
};

const defaultProps = {
  text: null,
};

const Hr: React.SFC<Props> = ({ text, classes }) => {
  if (text) {
    return (
      <div className={classes.withInnerText}>
        <Divider className={classes.grow} />
        <Typography variant="caption" className={classes.text}>
          {text}
        </Typography>
        <Divider className={classes.grow} />
      </div>
    );
  }

  return (
    <div className={classes.withInnerText}>
      <Divider className={classes.grow} />
    </div>
  );
};

Hr.defaultProps = defaultProps;

export default withStyles(styles)(Hr);
