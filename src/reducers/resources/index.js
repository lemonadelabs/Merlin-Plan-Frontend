export default function resources(state = { accessableScenarios:[],scenarioData:{},chartData:{}}, action) {
  switch (action.type) {
    case 'SET_ACCESSABLE_SCENARIOS':
      return Object.assign({},state,{accessableScenarios:action.scenarios})
    case 'ADD_SCENARIO_DATA': {
      let newDataObject = {
        scenarioData:{
        }
      }
      newDataObject.scenarioData[action.id] = action.data
      return Object.assign({},state,newDataObject)
    }
    case 'SET_FINANCIAL_SCENARIO_CHART_DATA': {
      let newDataChartObject = {
        chartData:{
        }
      }
      newDataChartObject.chartData[action.id] = action.data
      return Object.assign({},state,newDataChartObject)
    }
    default:
      return state;
  }
}