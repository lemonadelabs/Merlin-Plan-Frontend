import { findIndex, forEach } from 'lodash';
import { putData, getData, postData } from 'utilities/api-interaction';
import * as api from 'utilities/api-interaction'

function showNewUserModal(){
  return dispatch => {
    dispatch({type:'SET_MODAL_MODE', mode:'NEW'})
    dispatch({type:"SHOW_MODAL"})
  }
}

function showNewModal(){
  return dispatch => {
    dispatch({type:'SET_MODAL_MODE', mode:'NEW'})
    dispatch({type:"SHOW_MODAL"})
  }
}

function showEditUserModal(){
  return dispatch => {
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

function addNewFinancialResource(scenarioId, finanacialResourcePayload){
  return dispatch => {
    postData(`resourcescenario/${scenarioId}/financialresource`, finanacialResourcePayload)
    .then( newFinancialResource => {
      const financialResourceId = newFinancialResource.id
      getData(`financialresource/${financialResourceId}/partition`)
      .then( newFinancialPartitions => {
        dispatch({type:'ADD_FINANCIAL_RESOURCE',resourceScenarioId:scenarioId, newFinancialResource})
        dispatch({type:'ADD_FINANCIAL_PARTITION',resourceScenarioId:scenarioId, newFinancialPartitions})
      })

    })
  }
}

function shareToGroup({endPoint,id}) {
  return dispatch => {
    putData(`${endPoint}/${id}/group/share`)
  }
}

function shareToOrganisation({endPoint,id}) {
  return dispatch => {
    putData(`${endPoint}/${id}/share`)
  }
}

function shareToUsers({endPoint,id,users}) {
  return dispatch => {
    putData(`${endPoint}/${id}/share`,{users})
  }
}

export {
  deactivateUsers,
  showNewUserModal,
  showNewModal,
  showEditUserModal,
  addNewFinancialResource,
  shareToGroup,
  shareToOrganisation,
  shareToUsers
}