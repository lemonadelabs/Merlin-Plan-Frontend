'use strict';
import React from 'react';
import UserFixture from 'fixtures/users'
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect, compose } from 'react-redux'
import { getData } from 'utilities/api-interaction'
import store from 'store'

class AdminUsers extends React.Component {
  constructor(){
    super()
  }
  componentDidMount(){
    console.log(store.getState());
    let organisationId = store.getState().user.organisationId
    if(organisationId){
      this.getAndDespatchUsersData(organisationId)
    }else{
      this.waitForUserData()
    }
  }
  waitForUserData(){
    let unsubscribeFromStore = store.subscribe(
      () => {
        let organisationId = store.getState().user.organisationId
        if(organisationId){
          this.getAndDespatchUsersData(organisationId)
          unsubscribeFromStore()
        }
      }
    )
  }
  getAndDespatchUsersData(organisationId){
    getData(`organisation/${organisationId}/user`)
    .then( (orgUsers) => {
      store.dispatch({type:'SET_ORG_USERS', users:orgUsers})
    })
  }
  render() {
    return (
      <div className={styles['card-container']}>
        { this.props.users.map( (user) => (<UserCard user={user}/>) ) }
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return({users:state.orgUsers,organisationId:state.user.organisationId})
}

export default connect(mapStateToProps)(AdminUsers);
