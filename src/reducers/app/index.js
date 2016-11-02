export default function app(state={title:'Merlin Plan',availableActions:[]},action){
  switch (action.type) {
    case "SET_TITLE":
      return Object.assign({},state, {title:action.title})
    case "SET_ACTIONS":
      return Object.assign({},state, {availableActions:action.actions})  
    default:
      return state
  }
}