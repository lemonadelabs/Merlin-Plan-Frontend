import {replace} from 'utilities/array'

export default function resources(state = { scenarios:[], financialPartitions:{}, scenarioData:{}, chartData:{} }, action) {
  switch (action.type) {
    case 'SET_RESOURCE_SCENARIOS':
      return {...state, ...{scenarios:action.scenarios}}
    case 'ADD_RESOURCE_SCENARIO':{
      let updatedScenarios = [...state.scenarios, action.scenarioMetaData]
      return ( { ...state, ...{ scenarios: updatedScenarios} } )
    }
    case 'UPDATE_RESOURCE_SCENARIO':{
      let updatedScenarios = replace(state.scenarios, action.scenario)
      return ( { ...state, ...{ scenarios: updatedScenarios} } )
    }
    case 'ADD_SCENARIO_DATA': {
      let newDataObject = {
        scenarioData:{
          [action.id]: {...action.data}
        }
      }
      return {...state, ...newDataObject}
    }
    case 'SET_FINANCIAL_SCENARIO_CHART_DATA': {
      let newDataChartObject = {
        chartData:{
          [action.id]: {...action.data}
        }
      }
      return {...state, ...newDataChartObject}
    }
    case 'UPDATE_FINANCIAL_RESOURCE': {
      let financialResources = state.scenarioData[action.resourceScenarioId].financialResources
      let updatedFinancialResources = replace(financialResources, action.updatedFinancialResource)
      let updatedScenarioData = {
        [action.resourceScenarioId] : {...state.scenarioData[action.resourceScenarioId], ...{financialResources:updatedFinancialResources}}
      }
      let updatedScenarioDataList = {...state.scenarioData, ...updatedScenarioData}
      return {...state, ...{scenarioData:updatedScenarioDataList}}
    }
    case 'ADD_FINANCIAL_RESOURCE': {
      let financialResources = state.scenarioData[action.resourceScenarioId].financialResources
      let updatedFinancialResources = [...financialResources, action.newFinancialResource]
      let updatedScenarioData = {
        [action.resourceScenarioId] : {...state.scenarioData[action.resourceScenarioId], ...{financialResources:updatedFinancialResources}}
      }
      let updatedScenarioDataList = {...state.scenarioData, ...updatedScenarioData}
      return {...state, ...{scenarioData:updatedScenarioDataList}}
    }
    case 'SET_FINANCIAL_PARTITIONS': {
    let newPartionsObject = {
        financialPartitions:{
          [action.scenarioId] : action.financialPartitions
        }
      }
      return {...state, ...newPartionsObject}
    }
    case 'ADD_FINANCIAL_PARTITION': {
    let newPartionsObject = {
        financialPartitions:{
          [action.resourceScenarioId]: [...state.financialPartitions[action.resourceScenarioId], action.newFinancialPartitions] 
        }
      }
      return {...state, ...newPartionsObject}
    }
    default:
      return state;
  }
}