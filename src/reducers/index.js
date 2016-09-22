const initialState = {
  orginisationID:0,
  user:{}
}
function merlinApp(state = initialState, action){
  switch(action.type){
    case 'SET_ORG_ID' :
      return Object.assign({}, state, {orginisationID: action.id})
      break
    case 'SET_USER' :
      return Object.assign({}, state, {user: action.userData})
      break
    default:
      return state
  }
}

export default merlinApp
