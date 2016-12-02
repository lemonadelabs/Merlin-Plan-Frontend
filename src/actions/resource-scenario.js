import { getData } from 'utilities/api-interaction'

export function getResourceScenarioData(scenarioId) {
  return dispatch => {
    getData(`resourcescenario/${scenarioId}/resources`)
    .then( resourcesData => {
      dispatch({type:'ADD_SCENARIO_DATA', id:scenarioId, data:resourcesData})
      let financialPartitionPromises = getFinancialResourcePartitions(resourcesData.financialResources)
      Promise.all(financialPartitionPromises)
      .then( financialPartitions => { 
        dispatch({type:'SET_FINANCIAL_PARTITIONS',scenarioId, financialPartitions}) 
      } )
    } )
  }
}

function getFinancialResourcePartitions(financialResources){
  let partitionPromises = financialResources.map(
    financialResource => {
      return getData(`financialresource/${financialResource.id}/partition`)
    }
  )
  return partitionPromises
}