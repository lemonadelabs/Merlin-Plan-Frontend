import React, {Component} from 'react';
import styles from './index.css'

class UserDetails extends Component {
  render() {
    let user = this.props
    return (
      <div className={styles.container}>
        <h3>{`${user.firstName} ${user.lastName}`}</h3>
        <p>{user.email}</p>
        <p>{`${user.id}`}</p>
      </div>
    );
  }

}

export default UserDetails;
