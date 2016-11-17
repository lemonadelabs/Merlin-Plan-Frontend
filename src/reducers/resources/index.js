export default function resources(state = { accessableScenarios:[],scenarioData:{}}, action) {
  switch (action.type) {
    case 'SET_ACCESSABLE_SCENARIOS':
      return Object.assign({},state,{accessableScenarios:action.scenarios})
    case 'ADD_SCENARIO_DATA': {
      let newDataObject = {
        'scenarioData':{
        }
      }
      newDataObject.scenarioData[action.id] = action.data
      return Object.assign({},state,newDataObject)
    }
    default:
      return state;
  }
}