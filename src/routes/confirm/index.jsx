import React, {Component, PropTypes} from 'react';

class Confirm extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

Confirm.propTypes = {
  children:PropTypes.element.isRequired
}

export default Confirm;