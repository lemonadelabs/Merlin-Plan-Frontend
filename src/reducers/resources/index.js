import {findIndex, forEach, cloneDeep} from 'lodash';

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
    case 'UPDATE_FINANCIAL_RESOURCE': {
      let financialResources = cloneDeep(state.scenarioData[action.resourceScenarioId].financialResources)//not positive that this needs to be cloned, but safety first.
      let resourceToUpdateIndex = findIndex( financialResources, financialResource => (financialResource.id === action.id) )
      let updatedFinancialResources = [...financialResources.splice(0,resourceToUpdateIndex), action.updatedFinancialResource,...financialResources.splice(resourceToUpdateIndex+1)]
      let updatedScenarioData = {}
      updatedScenarioData[action.resourceScenarioId] = Object.assign({}, state.scenarioData[action.resourceScenarioId], {financialResources:updatedFinancialResources})
      let updatedScenarioDataList = Object.assign({}, state.scenarioData, updatedScenarioData)
      return Object.assign({},state,{scenarioData:updatedScenarioDataList})
    }
    default:
      return state;
  }
}