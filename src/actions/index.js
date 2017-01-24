import { findIndex, forEach, find } from 'lodash';
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
    api.postData(`resourcescenario/${scenarioId}/financialresource`, finanacialResourcePayload)
    .then( newFinancialResource => {
      const financialResourceId = newFinancialResource.id
      api.getData(`financialresource/${financialResourceId}/partition`)
      .then( newFinancialPartitions => {
        dispatch({type:'ADD_FINANCIAL_RESOURCE',resourceScenarioId:scenarioId, newFinancialResource})
        dispatch({type:'ADD_FINANCIAL_PARTITION',resourceScenarioId:scenarioId, newFinancialPartitions})
      })

    })
  }
}

function shareToGroup({endPoint,id}) {
  return (dispatch, getState) => {
    api.putData(`${endPoint}/${id}/group/share`)
    .then( () => {
      let state = getState()
      updateSharing(endPoint, id, {groupShared:true},state,dispatch)
    })
  }
}

function unshareToGroup({endPoint,id}) {
  return (dispatch, getState) => {
    api.putData(`${endPoint}/${id}/group/unshare`)
    .then( () => {
      let state = getState()
      updateSharing(endPoint, id, {groupShared:false},state,dispatch)
    })
  }
}

function shareToOrganisation({endPoint,id}) {
  return (dispatch, getState) => {
    api.putData(`${endPoint}/${id}/share`)
    .then(
      () => {
        let state = getState()
        updateSharing(endPoint, id, {organisationShared:true},state,dispatch)
      }
    )
  }
}

function unshareToOrganisation({endPoint,id}) {
  return (dispatch, getState) => {
    api.putData(`${endPoint}/${id}/unshare`)
    .then(
      () => {
        let state = getState()
        updateSharing(endPoint, id, {organisationShared:false},state,dispatch)
      }
    )
  }
}

function shareToUsers({endPoint,id,users}) {
  return (dispatch, getState) => {
    api.putData(`${endPoint}/${id}/user/share`,{users})
  }
}

function unshareToUsers({endPoint,id,users}) {
  return (dispatch, getState) => {
    api.putData(`${endPoint}/${id}/user/unshare`,{users})
  }
}

function updateSharing(endPoint, id, sharingChange, state, dispatch){
  let dataToUpdate
  switch (endPoint) {
    case 'resourcescenario':{
      let resourceScenarioMetadata = find(state.resources.scenarios, scenario => (scenario.id === id) )
      dataToUpdate = {...resourceScenarioMetadata}
      break;
    }
    default:
      break;
  }
  dataToUpdate.sharing = {...dataToUpdate.sharing,...sharingChange}

  switch (endPoint) {
    case 'resourcescenario':
      dispatch({type:"UPDATE_RESOURCE_SCENARIO",scenario:dataToUpdate})
      break;
    default:
      break;
  }
}

function getOrgUsers(organisationId){
  return dispatch => {
    api.getData(`organisation/${organisationId}/user`)
    .then( orgUsers => {
      dispatch({type:'SET_ORG_USERS', users:orgUsers})
    })
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
  shareToUsers,
  unshareToGroup,
  unshareToOrganisation,
  unshareToUsers,
  getOrgUsers
}