import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import { AppStore } from '../config/types';

type Props = {
  app: AppStore;
  reduceSnackbarQueue: () => void;
};

type State = {
  message: string;
  isOpen: boolean;
};

export class SnackbarService extends React.Component<Props, State> {
  // this variable is required since 'this.state' is asynchronous
  // and not suitable for judging the current processing state
  isProcessing: boolean = false;

  state = {
    message: '',
    isOpen: false,
  };

  // @ts-ignore
  componentDidUpdate = () => {
    const {
      app: { snackbarQueue },
    } = this.props;

    if (snackbarQueue.length) this.processQueue();
  };

  processQueue = () => {
    const {
      app: { snackbarQueue },
      reduceSnackbarQueue,
    } = this.props;

    // we do not need to do anything if snackbar is currently open.
    // because remaining queues will be prosessed
    // on the snackbars 'onExited' callback.
    // (in other words, this function will be called again automatically later)
    if (this.isProcessing) return;

    if (snackbarQueue.length) {
      this.isProcessing = true;

      this.setState({
        message: snackbarQueue[0],
        isOpen: true,
      });
      reduceSnackbarQueue();
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
    const { isOpen, message } = this.state;
    return (
      <React.Fragment>
        <Snackbar
          open={isOpen}
          autoHideDuration={5000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          // @ts-ignore
          message={message}
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
