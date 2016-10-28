import React, {Component} from 'react';
import styles from './index.css'

class UserDetails extends Component {
  render() {
    let user = this.props
    return (
      <div className={styles.container}>
        <h3>{`${user.firstName} ${user.lastName}`}</h3>
        <a href={`mailto:${user.email}`}>{user.email}</a>
        <p>{`${user.id}`}</p>
      </div>
    );
  }

}

export default UserDetails;
