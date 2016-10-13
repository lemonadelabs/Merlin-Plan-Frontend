import React, {Component} from 'react';
import { connect } from 'react-redux';
class AdminGroups extends Component {
  render() {
    return (
      <div>
        <p>Admin Groups</p>
      </div>
    );
  }
}

export default connect()(AdminGroups);