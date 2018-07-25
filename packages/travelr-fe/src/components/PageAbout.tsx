import { Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
// @ts-ignore
import TermsOfService from '../config/termsOfService.md';

const styles = theme => ({
  root: {
    display: 'grid',
    gridGap: `${theme.spacing.unit * 3}px`,
    margin: 'auto',
    marginTop: `${theme.spacing.unit * 4}px`,
    maxWidth: 500,
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    '& h1': {
      fontSize: '1.3125rem',
    },
    '& h2': {
      fontSize: '1rem',
    },
    // normal fonts
    '& p, li': {
      fontSize: '0.875rem',
      lineHeight: '1.46429em',
    },
    // adjust spacing of list item
    '& li': {
      marginTop: theme.spacing.unit * 1,
    },
    // shorten padding of lv1 list item
    '& > ol': {
      paddingLeft: '1rem',
    },
    // shorten padding of lv2 list item
    '& ol li ol': {
      paddingLeft: '1.5rem',
    },
    // change heading of lv2 list item
    '& ol li ol li': {
      listStyleType: 'lower-roman',
    },
  },
});

const PageAbout = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography variant="title">Travelrについて</Typography>
      <Typography variant="body1">
        このサービスは、<a href="https://www.yuuniworks.com">Yuuniworks</a>が開発したものです。
      </Typography>
      <Typography variant="body1">
        商談用に開発したサンプルのサービスではありますが、下記の利用規約の範囲内で自由にお使いいただけます。
      </Typography>
      <Paper>
        <div
          dangerouslySetInnerHTML={{ __html: TermsOfService }}
          className={classes.paper}
        />
      </Paper>
    </div>
  );
};

export default withStyles(styles)(PageAbout);
