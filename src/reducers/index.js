import {findIndex,forEach, cloneDeep} from 'lodash';

const initialState = {
  user:{},
  orgUsers:[],
  selectedOrgUsers:[]
}
function merlinApp(state = initialState, action){
  switch(action.type){
    case 'SET_USER' :
      return Object.assign({}, state, {user: action.userData})
    case 'SET_ORG_USERS' :
      return Object.assign({}, state, {orgUsers: action.users})
    case 'NEW_ORG_USER' :
      return Object.assign({}, state, {orgUsers: [...state.orgUsers, action.user]})
    case 'SELECT_ORG_USER' :
      let selectedOrgUsersWithNewSelection = [...state.selectedOrgUsers,action.user]
      return Object.assign({}, state, {selectedOrgUsers: selectedOrgUsersWithNewSelection})
    case 'DESELECT_ORG_USER' :
      let userIndex = findIndex(state.selectedOrgUsers, (user) => (user.id === action.user.id))
      let selectedOrgUsersWithoutDeselectUser = [...state.selectedOrgUsers.slice(0,userIndex),
                                                 ...state.selectedOrgUsers.slice(userIndex+1)]

      return Object.assign({}, state, {selectedOrgUsers: selectedOrgUsersWithoutDeselectUser})
    case 'DELETE_ORG_USERS' :
      let orgUsers = cloneDeep(state.orgUsers)
      let orgUsersWithoutDeletedUsers = orgUsers
      forEach(action.userIds,
        (id) => {
          let userIndex = findIndex(orgUsersWithoutDeletedUsers, (orgUser) => (orgUser.id === id))
          orgUsersWithoutDeletedUsers = [...orgUsersWithoutDeletedUsers.slice(0,userIndex),
                                         ...orgUsersWithoutDeletedUsers.slice(userIndex+1)]
        }
      )
      return Object.assign({}, state, {orgUsers: orgUsersWithoutDeletedUsers})
    case 'DESELECT_ALL_ORG_USERS' :
      return Object.assign({}, state, {selectedOrgUsers:[]})
    default:
      return state
  }
}

export default merlinApp
