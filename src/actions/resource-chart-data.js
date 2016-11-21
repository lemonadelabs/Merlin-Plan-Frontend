import { fill } from 'lodash';
import {unitsBetween} from 'utilities/timeline-utilities'
import {generateTimeseriesLabels,createBaseDataset} from 'utilities/charts'

export function processFinancialScenarioChartData(scenarioId, financialResources, financialPartitions) {
  let scenarioStartDate = new Date('2016-1-1')
  let scenarioEndDate = new Date('2019-12-31')
  let labels = generateTimeseriesLabels(scenarioStartDate,scenarioEndDate)
  let scenarioLength = unitsBetween(scenarioStartDate,scenarioEndDate,'Months')
  let resourceInfo = calculateResourceInfo(financialResources, scenarioStartDate)
  let datasets = datasetsFromPartitions(financialPartitions, scenarioLength, resourceInfo)

  return ({type:'SET_FINANCIAL_SCENARIO_CHART_DATA', id:scenarioId, data:{datasets,labels}})
}

function calculateResourceInfo(financialResources,scenarioStartDate){
  let resourceInfo = {}
  financialResources.forEach( resource => {
    const ArrayIndexOffset = 1
    let resourceStartDate = new Date(resource.startDate)
    let resourceEndDate = new Date(resource.endDate)
    let resourceUnitLength = unitsBetween(resourceStartDate,resourceEndDate,'Months')
    let resourceOffsetFromScenarioStart = unitsBetween(scenarioStartDate, resourceStartDate, 'Months') - ArrayIndexOffset
    resourceInfo[resource.id] = {resourceUnitLength, resourceOffsetFromScenarioStart}
  })
  return resourceInfo
}

function datasetsFromPartitions(financialPartitions, scenarioLength, resourceInfo){
  let datasets = []
  financialPartitions.forEach( partition => {
    partition.forEach(
      paritionInfo => {
        let data = createResourceDataArray(scenarioLength, paritionInfo.value, resourceInfo[paritionInfo.financialResourceId])
        let dataset = {data,label:''}
        paritionInfo.categories.forEach( (category,i) => { dataset.label += `${i >= 1 ? ' & ' : ''}${category}` })
        datasets.push(dataset)
      }
    )
  })
  return datasets
}

function createResourceDataArray(scenarioLength, value, resourceInfo){
  let data = createBaseDataset(scenarioLength)
  let unitAmount = value / resourceInfo.resourceUnitLength
  fill(data, unitAmount, resourceInfo.resourceOffsetFromScenarioStart, resourceInfo.resourceUnitLength + resourceInfo.resourceOffsetFromScenarioStart)
  return data
}