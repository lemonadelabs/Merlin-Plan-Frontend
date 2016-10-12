import {findIndex, forEach, cloneDeep} from 'lodash';
import { combineReducers } from 'redux'
import { combineForms } from 'react-redux-form';

const initialUserState = {
  "userName": "",
  "email": "",
  "employeeId": "",
  "firstName": "",
  "lastName": "",
  "nickName": "",
  "roles": [],
  "groups": []
}

function organisation(state = { users:[], selectedUsers:[], groups:[] }, action){
  switch (action.type) {
    case 'SET_ORG_USERS' :
      return Object.assign({}, state, {users: action.users})
    case 'NEW_ORG_USER' :
      return Object.assign({}, state, {users: [...state.users, action.user]})
    case 'SET_ORG_GROUPS' :
      return Object.assign({}, state, {groups: [...state.groups, ...action.groups]})
    case 'SELECT_ORG_USER' :
      let selectedUsersWithNewSelection = [...state.selectedUsers,action.user]
      return Object.assign({}, state, {selectedUsers: selectedUsersWithNewSelection})
    case 'DESELECT_ORG_USER' :
      let userIndex = findIndex(state.selectedUsers, (user) => (user.id === action.user.id))
      let selectedUsers = [...state.selectedUsers.slice(0,userIndex), ...state.selectedUsers.slice(userIndex+1)]

      return Object.assign({}, state, {selectedUsers: selectedUsers})
    case 'DELETE_ORG_USERS' :
      let users = cloneDeep(state.users)
      forEach(action.userIds,
        (id) => {
          let userIndex = findIndex(users, (orgUser) => (orgUser.id === id))
          users = [...users.slice(0,userIndex),...users.slice(userIndex+1)]
        }
      )
      return Object.assign({}, state, {users: users})
    case 'DESELECT_ALL_ORG_USERS' :
      return Object.assign({}, state, {selectedUsers:[]})
    default:
      return state
  }
}

function user(state = {}, action){
  switch(action.type){
    case 'SET_USER' :
      return Object.assign({}, state, action.userData)
    default:
      return state
  }
}

function modal(state = { visability : false }, action){
  switch (action.type) {
    case 'SHOW_MODAL':
      return Object.assign({}, state, { visability : true })
    case 'HIDE_MODAL':
      return Object.assign({}, state, { visability : false })
    default:
      return state
  }
}

const merlinApp = combineReducers(
  {
    user,
    organisation,
    modal,
    forms: combineForms(
      {
        user: initialUserState
      },'forms')
  }
)


export default merlinApp
