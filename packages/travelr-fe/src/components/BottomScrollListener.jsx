// @flow
import { Component } from 'react';

type Props = {
  onBottom: void => void,
  offset: number,
};

class BottomScrollListener extends Component<Props> {
  constructor(props) {
    super(props);

    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleOnScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll() {
    const { offset, onBottom } = this.props;
    const scrollNode = document.scrollingElement || document.documentElement;

    if (
      scrollNode.scrollHeight - offset <=
      scrollNode.scrollTop + window.innerHeight
    ) {
      onBottom();
    }
  }

  render() {
    return null;
  }
}

export default BottomScrollListener;
