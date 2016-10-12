export default function modal(state = { visability : false }, action){
  switch (action.type) {
    case 'SHOW_MODAL':
      return Object.assign({}, state, { visability : true })
    case 'HIDE_MODAL':
      return Object.assign({}, state, { visability : false })
    default:
      return state
  }
}