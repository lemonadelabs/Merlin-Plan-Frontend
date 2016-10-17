export default function app(state={title:'Merlin Plan'},action){
  switch (action.type) {
    case "SET_TITLE":
      return Object.assign({},state, {title:action.title})  
    default:
      return state
  }
}