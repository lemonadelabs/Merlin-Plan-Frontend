export default function resources(state = { accessableScenarios:[]}, action) {
  switch (action.type) {
    case 'SET_ACCESSABLE_SCENARIOS':
      return Object.assign({},state,{accessableScenarios:action.scenarios})
    default:
      return state;
  }
}