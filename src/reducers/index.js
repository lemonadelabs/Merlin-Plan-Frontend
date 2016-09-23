const initialState = {
  user:{},
  orgUsers:[]
}
function merlinApp(state = initialState, action){
  switch(action.type){
    case 'SET_USER' :
      return Object.assign({}, state, {user: action.userData})
      break
    case 'SET_ORG_USERS' :
      console.log(action);
      return Object.assign({}, state, {orgUsers: action.users})
      break
    default:
      return state
  }
}

export default merlinApp
