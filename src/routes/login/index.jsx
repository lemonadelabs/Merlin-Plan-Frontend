import React, {Component, PropTypes} from 'react';

class LoginRoot extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

LoginRoot.propTypes = {
  children: PropTypes.element.isRequired
}

export default LoginRoot;