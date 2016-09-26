const initialState = {
  user:{},
  orgUsers:[],
  selectedOrgUsers:[]
}
function merlinApp(state = initialState, action){
  switch(action.type){
    case 'SET_USER' :
      return Object.assign({}, state, {user: action.userData})
      break
    case 'SET_ORG_USERS' :
      return Object.assign({}, state, {orgUsers: action.users})
      break
    case 'SELECT_ORG_USER' :
      let selectedOrgUsers = [...state.selectedOrgUsers,action.user]
      return Object.assign({}, state, {selectedOrgUsers: selectedOrgUsers})
      break
    default:
      return state
  }
}

export default merlinApp
