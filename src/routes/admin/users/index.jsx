import React, {Component, PropTypes} from 'react';
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'
import { getData } from 'utilities/api-interaction'
import store from 'store'
import { find, findIndex, forEach} from 'lodash'
import NewUserForm from 'components/forms/new-user';
import UpdateUserForm from 'components/forms/update-user';
import Modal from 'components/modal'

class AdminUsers extends Component {
  constructor(){
    super()
    this.toggleUserSelection = this.toggleUserSelection.bind(this)
    // this.deactivateUsers = this.deactivateUsers.bind(this)
    this.updateOrgUser = this.updateOrgUser.bind(this)
  }
  componentDidMount(){
    this.props.dispatch({type:'SET_TITLE',title:'Admin: Users'})
    this.props.dispatch({
      type:'SET_ACTIONS',
      actions:[
        {
          title:'Add User',
         'actionsToCreatorsToRun':[ {name:'showNewUserModal'}]
        },
        {
          title:'Edit User',
         'actionsToCreatorsToRun':[ {name:'showEditUserModal'}]
        },
        {
          title:'Deactivate Users',
         'actionsToCreatorsToRun':[ {name:'deactivateUsers'} ]
        }
      ]
    })
    let organisationId = store.getState().user.organisationId
    if(organisationId){
      this.getAndDespatchUsersData(organisationId)
    }
    else{
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
    .then( orgUsers => {
      store.dispatch({type:'SET_ORG_USERS', users:orgUsers})
    })
  }
  toggleUserSelection(user){
    let {selectedUsers} = this.props
    let userSelected = find(selectedUsers,u => (u.id === user.id) )
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
        modalContents = <div></div>
    }
    return modalContents
  }
  render() {
    let {selectedUsers, modalMode, users} = this.props
    let organisationId = store.getState().user.organisationId
    let modalContents = this.getModalContents({modalMode,organisationId,modelToLoad:selectedUsers[0]})
    return (
      <div>
        <div className={styles['card-container']}>
          {
            users.map( 
              user => {
                let selected = find(selectedUsers, u => (u.id === user.id) ) ? true : false
                let userCard = user.active ? <UserCard key={user.id} selected={selected} user={user} clickFunction={this.toggleUserSelection}/> : ''
                return(userCard)
              }
            )
          }
        </div>
        <Modal>
          {modalContents}
        </Modal>
      </div>
    );
  }
}

AdminUsers.propTypes = {
  users: PropTypes.array,
  selectedUsers: PropTypes.array,
  modalMode: PropTypes.string,
  dispatch: PropTypes.func
}

const mapStateToProps = state => {
  return({
    users:state.organisation.users, 
    selectedUsers:state.organisation.selectedUsers,
    modalMode:state.adminUsers.modalMode
  })
}

export default connect(mapStateToProps)(AdminUsers);
