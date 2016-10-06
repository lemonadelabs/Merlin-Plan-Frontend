import React, {Component} from 'react';

class LoginRoot extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default LoginRoot;