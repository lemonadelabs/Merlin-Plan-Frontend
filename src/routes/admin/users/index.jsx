'use strict';
import React from 'react';
import UserFixture from 'fixtures/users'
import styles from './index.css'

class AdminUsers extends React.Component {
  constructor(){
    super()
    this.state = {
      users: UserFixture.Users
    }
    console.log(UserFixture);
  }
  render() {
    return (
      <div className={styles['card-container']}>
        {
          this.state.users.map(
            (user) => {
              return (
                //TODO: Replace shortid with user.id when available
                <div key={user.EmployeeId} className={styles.userCard}>
                  <h3>{`${user.FirstName} ${user.LastName}`}</h3>
                  <p>Email: {user.Email}</p>
                  <p>{`Id: ${user.EmployeeId}`}</p>
                  {/* <p>
                    Roles:
                    {user.Roles.map((role) => {
                      return(<span>{role}</span>)
                    })
                    }
                  </p>
                  <p>
                    Groups:
                    {user.Groups.map((group) => {
                      return(<span>{group}</span>)
                    })
                    }
                  </p> */}
                </div>
              )
            }
          )
        }
      </div>
    );
  }

}

export default AdminUsers;
