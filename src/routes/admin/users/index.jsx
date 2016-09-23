'use strict';
import React from 'react';
import UserFixture from 'fixtures/users'
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'
import { getData } from 'utilities/api-interaction'

class AdminUsers extends React.Component {
  constructor(){
    super()
    this.state = {
      users: UserFixture.Users
    }
    console.log(UserFixture);
    console.log(this);
  }
  componentDidUpdate(prevProps){
    let {organisationId, dispatch} = this.props
    if(prevProps.organisationId !== organisationId){//Feels a little hacky
      this.getAndDespatchUsersData(organisationId,dispatch)
    }
  }
  getAndDespatchUsersData(organisationId,dispatch){
    getData(`organisation/${organisationId}/user`)
    .then((orgUsers)=>{
      dispatch({type:'SET_ORG_USERS', users:orgUsers})
    })
  }
  render() {
    return (
      <div className={styles['card-container']}>
        {
          this.props.users.map(
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

const mapStateToProps = (state, ownProps) => {
  console.log(state); // state
  console.log(ownProps); // ownProps
  return(state)
  return({users:state.orgUsers,organisationId:state.user.organisationId})
}

export default connect(mapStateToProps)(AdminUsers);
