import React, {Component} from 'react';

class Confirm extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default Confirm;