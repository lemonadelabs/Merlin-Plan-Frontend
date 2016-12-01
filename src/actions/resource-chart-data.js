import { fill, forEach, findIndex, isNil } from 'lodash';
import {unitsBetween} from 'utilities/timeline-utilities'
import {generateTimeseriesLabels,createBaseDataset} from 'utilities/charts'

export function processFinancialScenarioChartData(scenarioId, financialResources, financialPartitions) {
  let scenarioStartDate = new Date('2016-1-1')
  let scenarioEndDate = new Date('2019-12-31')
  let labels = generateTimeseriesLabels(scenarioStartDate,scenarioEndDate)
  let scenarioLength = unitsBetween(scenarioStartDate,scenarioEndDate,'Months')
  let resourceInfo = calculateResourceInfo(financialResources, scenarioStartDate)
  let datasets = datasetsFromPartitions(financialPartitions, scenarioLength, resourceInfo)
  let mergedDatasets = mergeDuplicateDatasets(datasets)
  return ({type:'SET_FINANCIAL_SCENARIO_CHART_DATA', id:scenarioId, data:{datasets:mergedDatasets,labels}})
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
        if(dataset.label === ''){
          dataset.label = 'Unallocated'
        }
        datasets.push(dataset)
      }
    )
  })
  return datasets
}

function mergeDuplicateDatasets(datasets){
  let mergedDatasets = []
  forEach(datasets,  dataset => { 
    let mergedDatasetIndex = findIndex(mergedDatasets, mergedDataset => ( mergedDataset.label === dataset.label ))
    if(mergedDatasetIndex>=0){
      forEach(mergedDatasets[mergedDatasetIndex].data, ( dataToMerge, i ) => {
        if( !isNil(dataset.data[i]) && !isNil(dataToMerge) ){
          mergedDatasets[mergedDatasetIndex].data[i] += dataset.data[i]
        }
        else if( !isNil(dataset.data[i]) && isNil(dataToMerge)){
          mergedDatasets[mergedDatasetIndex].data[i] = dataset.data[i]
        }
      })
    }
    else{
      mergedDatasets.push(dataset)
    }
  })
  return mergedDatasets
}

function createResourceDataArray(scenarioLength, value, resourceInfo){
  let data = createBaseDataset(scenarioLength)
  let unitAmount = value / resourceInfo.resourceUnitLength
  fill(data, unitAmount, resourceInfo.resourceOffsetFromScenarioStart, resourceInfo.resourceUnitLength + resourceInfo.resourceOffsetFromScenarioStart)
  return data
}