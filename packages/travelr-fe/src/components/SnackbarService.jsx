// @flow
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import type { AppStore } from '../config/types';

type Props = {
  app: AppStore,
  reduceSnackbarQueue: void => void,
};

type State = {
  message: string,
  isOpen: boolean,
};

export class SnackbarService extends React.Component<Props, State> {
  // this variable is required since 'this.state' is asynchronous
  // and not suitable for judging the current processing state
  isProcessing: boolean = false;

  state = {
    message: '',
    isOpen: false,
  };

  componentDidUpdate = () => {
    const { snackbarQueue } = this.props.app;

    if (snackbarQueue.length) this.processQueue();
  };

  processQueue = () => {
    const { snackbarQueue } = this.props.app;

    // we do not need to do anything if snackbar is currently open.
    // because remaining queues will be prosessed
    // on the snackbars 'onExited' callback.
    // (in other words, this function will be called again automatically later)
    if (this.isProcessing) return;

    if (snackbarQueue.length) {
      this.isProcessing = false;

      this.setState({
        message: snackbarQueue[0],
        isOpen: true,
      });
      this.props.reduceSnackbarQueue();
    }
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  // this fucntion will be called AFTER snackbar is completely closed
  handleExited = () => {
    this.isProcessing = false;
    this.processQueue();
  };

  render() {
    return (
      <React.Fragment>
        <Snackbar
          open={this.state.isOpen}
          autoHideDuration={5000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          message={this.state.message}
          action={[
            <IconButton key="close" color="inherit" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </React.Fragment>
    );
  }
}

export default SnackbarService;
