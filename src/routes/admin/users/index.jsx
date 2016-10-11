'use strict';
import React from 'react';
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'
import { getData, postData, deleteData } from 'utilities/api-interaction'
import store from 'store'
import { find, findIndex, forEach} from 'lodash'
import NewUserForm from 'components/forms/new-user';

class AdminUsers extends React.Component {
  constructor(){
    super()
    this.toggleUserSelection = this.toggleUserSelection.bind(this)
    this.deleteUsers = this.deleteUsers.bind(this)
    this.newUser = this.newUser.bind(this)
  }
  componentDidMount(){
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
  newUser(){
    //this should trigger opening the form
  }
  deleteUsers(){
    let selectedUsers = this.props.selectedUsers;
    let userIds = selectedUsers.map( (user) => (user.id) )
    let loggedInUserId = store.getState().user.id
    let loggedInUserIndex = findIndex(userIds, (id) => ( id === loggedInUserId) )

    if(loggedInUserIndex !== -1){
      alert("Can't delete yourself")
      userIds.splice(loggedInUserIndex, 1)
    }

    store.dispatch({type:'DELETE_ORG_USERS', userIds:userIds})
    store.dispatch({type:'DESELECT_ALL_ORG_USERS'})
    forEach( userIds, (id) => {
        deleteData( { endPoint:'user', id : id})
    })
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
    console.log(this.props.users);
    return (
      <div>
        <button onClick={this.newUser}>Add User</button>
        <button onClick={this.deleteUsers}>Deactivate Users</button>
        <NewUserForm organisationId={store.getState().user.organisationId}/>
        <div className={styles['card-container']}>
          { this.props.users.map( 
              (user) => {
                let selected = find(this.props.selectedUsers, (u) => (u.id === user.id) ) ? true : false
                let userCard = user.active ? <UserCard key={user.id} selected={selected} user={user} clickFunction={this.toggleUserSelection}/> : ''
                return(userCard)
              } 
            ) }
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return({users:state.orginisation.users, selectedUsers:state.orginisation.selectedUsers})
}

export default connect(mapStateToProps)(AdminUsers);
