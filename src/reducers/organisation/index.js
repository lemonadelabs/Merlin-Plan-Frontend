import {findIndex, forEach, cloneDeep} from 'lodash';
import { replace, drop, findAndDrop } from 'utilities/array';

export default function organisation(state = { users:[], selectedUsers:[], groups:[] }, action){
  switch (action.type) {
    case 'SET_ORG_USERS' :
      return {...state, ...{users: action.users}}
    case 'NEW_ORG_USER' :
      return Object.assign({}, state, {users: [...state.users, action.user]})
    case 'UPDATE_ORG_USER' :{
      let updatedUsers = replace(state.users, action.user)
      return Object.assign({}, state, {users:updatedUsers})
    }
    case 'SET_ORG_GROUPS' :
      return Object.assign({}, state, {groups: action.groups})
    case 'ADD_ORG_GROUP' :
      return Object.assign({}, state, {groups: [...state.groups, ...action.groups]})
    case 'SELECT_ORG_USER' :{
      let selectedUsersWithNewSelection = [...state.selectedUsers, action.user]
      return Object.assign({}, state, {selectedUsers: selectedUsersWithNewSelection})
    }
    case 'DESELECT_ORG_USER' :{
      let selectedUsers = findAndDrop(state.selectedUsers, action.user)
      return Object.assign({}, state, {selectedUsers: selectedUsers})
    }
    case 'DELETE_ORG_USERS' :{
      let users = cloneDeep(state.users)
      forEach(action.userIds,
        id => {
          let userIndex = findIndex(users, orgUser => (orgUser.id === id))
          users = drop(state.users, userIndex)
        }
      )
      return Object.assign({}, state, {users: users})
    }
    case 'DESELECT_ALL_ORG_USERS' :
      return Object.assign({}, state, {selectedUsers:[]})
    default:
      return state
  }
}

