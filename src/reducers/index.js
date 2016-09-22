const initialState = {
  user:{}
}
function merlinApp(state = initialState, action){
  switch(action.type){
    case 'SET_USER' :
      return Object.assign({}, state, {user: action.userData})
      break
    default:
      return state
  }
}

export default merlinApp
