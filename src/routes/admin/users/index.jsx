import React, {Component, PropTypes} from 'react';
import UserCard from 'components/user-card'
import styles from './index.css'
import { connect } from 'react-redux'
import { getData } from 'utilities/api-interaction'
import { find } from 'lodash'
import NewUserForm from 'components/forms/new-user';
import UpdateUserForm from 'components/forms/update-user';
import Modal from 'components/modal'
import { getOrgUsers } from 'actions';

class AdminUsers extends Component {
  constructor(){
    super()
    this.toggleUserSelection = this.toggleUserSelection.bind(this)
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
    getOrgUsers(this.props.organisationId)
  }
  componentWillUnmount(){
    this.props.dispatch({type:"SET_ACTIONS",actions:[]})
  }
  toggleUserSelection(user){
    let {selectedUsers} = this.props
    let userSelected = find(selectedUsers,u => (u.id === user.id) )
    if(userSelected){
      this.props.dispatch({type:'DESELECT_ORG_USER', user:user})
    }
    else{
      this.props.dispatch({type:'SELECT_ORG_USER', user:user})
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
    let {selectedUsers, modalMode, users,organisationId} = this.props
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
  organisationId: PropTypes.number.isRequired,
  selectedUsers: PropTypes.array,
  modalMode: PropTypes.string,
  dispatch: PropTypes.func
}

const mapStateToProps = state => {
  return({
    users:state.organisation.users, 
    selectedUsers:state.organisation.selectedUsers,
    organisationId:state.user.organisationId,
    modalMode:state.adminUsers.modalMode
  })
}

export default connect(mapStateToProps)(AdminUsers);
