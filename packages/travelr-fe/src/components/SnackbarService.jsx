import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  app: PropTypes.object.isRequired,
  reduceSnackbarQueue: PropTypes.func.isRequired,
};

export class SnackbarService extends React.Component {
  constructor(props) {
    super(props);

    // this variable is required since 'this.state' is asynchronous
    // and not suitable for judging the current processing state
    this.isProcessing = false;

    this.state = {
      message: '',
      isOpen: false,
    };
  }

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
      this.isProcessing = true;

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

SnackbarService.propTypes = propTypes;

export default SnackbarService;
