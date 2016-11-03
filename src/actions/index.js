import { findIndex, forEach } from 'lodash';
import * as api from 'utilities/api-interaction'

function showNewUserModal(){
  return dispatch =>{
    dispatch({type:'SET_MODAL_MODE', mode:'NEW'})
    dispatch({type:"SHOW_MODAL"})
  }
}

function showEditUserModal(){
  return dispatch =>{
    dispatch({type:'SET_MODAL_MODE', mode:'EDIT'})
    dispatch({type:"SHOW_MODAL"})
  }
}

function deactivateUsers(){
  return (dispatch, getState) => {
    const state = getState()
    const selectedUsers = state.organisation.selectedUsers
    const loggedInUserId = state.user.id
    const userIds = selectedUsers.map( user => (user.id) ).filter( userId => (userId !== loggedInUserId) )
    let deactivateUserPromises = []
    forEach( userIds, id => {
        deactivateUserPromises.push(api.deleteData( { endPoint:'user', id : id } ))
    })
    if(!userIds.length){
      dispatch({type:'DESELECT_ALL_ORG_USERS'})
    }
    Promise.all(deactivateUserPromises).then(()=>{
      dispatch({type:'DELETE_ORG_USERS', userIds:userIds})
      dispatch({type:'DESELECT_ALL_ORG_USERS'})
    })
  }
}

const actionMap = {
  deactivateUsers,
  showNewUserModal,
  showEditUserModal
}
export {actionMap}