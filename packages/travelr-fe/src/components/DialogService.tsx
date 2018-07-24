import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AppStore } from '../config/types';

type Props = {
  app: AppStore;
  closeDialog: any;
};

class DialogService extends React.Component<Props> {
  handleClose = () => {
    this.props.closeDialog();
  };

  handleOnSuccess = () => {
    this.props.app.dialogSuccessCallback();
    this.handleClose();
  };

  render() {
    const {
      dialogIsOpen,
      dialogTitle,
      dialogContent,
      dialogNegativeSelector,
      dialogPositiveSelector,
    } = this.props.app;

    return (
      <Dialog open={dialogIsOpen} onClose={this.handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color="primary"
            autoFocus
            // @ts-ignore
            dataenzyme="negative-button"
          >
            {dialogNegativeSelector}
          </Button>
          <Button
            onClick={this.handleOnSuccess}
            color="primary"
            // @ts-ignore
            dataenzyme="positive-button"
          >
            {dialogPositiveSelector}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DialogService;
