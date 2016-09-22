'use strict';
import React from 'react';
import UserFixture from 'fixtures/users'
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'

class AdminUsers extends React.Component {
  constructor(){
    super()
    this.state = {
      users: UserFixture.Users
    }
    console.log(UserFixture);
    console.log(this);
  }
  render() {
    return (
      <div className={styles['card-container']}>
        {
          this.state.users.map(
            (user) => {
              return (
                <UserCard user={user}/>
              )
            }
          )
        }
      </div>
    );
  }

}

export default connect()(AdminUsers);
