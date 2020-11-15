import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { HeadsetTwoTone } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(2)
  }
}));

const Navbar = () => {

  const classes = useStyles();

  return (
    <AppBar color="primary" position="fixed">
      <Toolbar>
        <HeadsetTwoTone />
        <Typography variant="h6" component="h1" className={classes.title}>
          Music Share
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;
