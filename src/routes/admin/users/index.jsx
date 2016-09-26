'use strict';
import React from 'react';
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'
import { getData, postData, deleteData } from 'utilities/api-interaction'
import store from 'store'
import find from 'lodash/find'

const dummyNewUser = {
  "userDetails": {
      "userName": "newuser",
      "organisationId": 1,
      "email": "newuser@don.govt.nz",
      "employeeId": "2345",
      "firstName": "New",
      "lastName": "User",
      "nickName": "newbie",
      "roles": [
        "Staff"
      ]
  },
  "password": "newgoddampassword1"
}

class AdminUsers extends React.Component {
  constructor(){
    super()
    this.toggleUserSelection = this.toggleUserSelection.bind(this)
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
    //TODO: Try and find out if this is the best way to be doing this.
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
  persistNewUser(){
    postData('user', dummyNewUser)
  }
  deleteUsers(userIds){
    deleteData('user', {users:userIds})
  }
  toggleUserSelection(user){
    let {selectedUsers} = this.props
    let userSelected = find(selectedUsers,(u) => (u.id === user.id) )
    if(userSelected){
      store.dispatch({type:'DESELECT_ORG_USER', user:user})
    }
    else{
      store.dispatch({type:'SELECT_ORG_USER', user:user})
    }
  }
  render() {
    return (
      <div>
        <button onClick={this.persistNewUser}>Add User</button>
        <div className={styles['card-container']}>
          { this.props.users.map( 
              (user) => {
                let selected = find(this.props.selectedUsers,(u) => (u.id === user.id) ) ? true : false
                return(<UserCard selected={selected} user={user} clickFunction={this.toggleUserSelection}/>)
              } 
            ) }
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return({users:state.orgUsers,selectedUsers:state.selectedOrgUsers})
}

export default connect(mapStateToProps)(AdminUsers);
