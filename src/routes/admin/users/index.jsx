'use strict';
import React from 'react';
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'
import { getData, postData, deleteData } from 'utilities/api-interaction'
import store from 'store'
import { find, findIndex, forEach} from 'lodash'
import NewUserForm from 'components/forms/new-user';
import UpdateUserForm from 'components/forms/update-user';
import Modal from 'components/modal'

class AdminUsers extends React.Component {
  constructor(){
    super()
    this.toggleUserSelection = this.toggleUserSelection.bind(this)
    this.deactivateUsers = this.deactivateUsers.bind(this)
    this.newUser = this.newUser.bind(this)
    this.editUsers = this.editUsers.bind(this)
    this.updateOrgUser = this.updateOrgUser.bind(this)
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
    this.props.dispatch({type:'SET_MODAL_MODE', mode:'NEW'})
    this.props.dispatch({type:"SHOW_MODAL"})
  }
  editUsers(){
    this.props.dispatch({type:'SET_MODAL_MODE', mode:'EDIT'})
    this.props.dispatch({type:"SHOW_MODAL"})
  }
  deactivateUsers(){
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
  updateOrgUser(user){
    this.props.dispatch({type:'UPDATE_ORG_USER', user:user})
  }
  getModalContents({modalMode, organisationId, modelToLoad}){
    let modalContents
    switch (modalMode) {
      case 'NEW':
        modalContents = <NewUserForm organisationId={organisationId}/>
        break;
      case 'EDIT':
        modalContents = <UpdateUserForm 
          modelToLoad={modelToLoad} 
          organisationId={organisationId} 
          handleDataUpdate={this.updateOrgUser}/>
        break;
      default:
        modalContents = ''
    }
    return modalContents
  }
  render() {
    let {selectedUsers, modalMode, showModal, users} = this.props
    let organisationId = store.getState().user.organisationId
    let modalContents = this.getModalContents({modalMode,organisationId,modelToLoad:selectedUsers[0]})
    return (
      <div>
        <button onClick={this.newUser}>Add User</button>
        <button onClick={this.editUsers}>Edit Users</button>
        <button onClick={this.deactivateUsers}>Deactivate Users</button>
        <div className={styles['card-container']}>
          {
            users.map( 
              (user) => {
                let selected = find(selectedUsers, (u) => (u.id === user.id) ) ? true : false
                let userCard = user.active ? <UserCard key={user.id} selected={selected} user={user} clickFunction={this.toggleUserSelection}/> : ''
                return(userCard)
              }
            )
          }
        </div>
        <Modal show={showModal}>
          {modalContents}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return({
    users:state.organisation.users, 
    selectedUsers:state.organisation.selectedUsers,
    showModal:state.modal.visability,
    modalMode:state.adminUsers.modalMode
  })
}

export default connect(mapStateToProps)(AdminUsers);
