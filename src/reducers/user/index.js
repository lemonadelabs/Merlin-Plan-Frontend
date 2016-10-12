export default function user(state = {}, action){
  switch(action.type){
    case 'SET_USER' :
      return Object.assign({}, state, action.userData)
    default:
      return state
  }
}