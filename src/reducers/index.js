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
    case 'SELECT_ORG_USER' :
      let selectedOrgUsers = [...state.selectedOrgUsers,action.user]
      return Object.assign({}, state, {selectedOrgUsers: selectedOrgUsers})
    default:
      return state
  }
}

export default merlinApp
