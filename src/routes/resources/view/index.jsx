import React, {Component} from 'react';
import { getData,putData } from 'utilities/api-interaction'
import {TimelineObject} from 'components/timeline-object'
import Timeline from 'components/timeline'
import {unitsBetween} from 'utilities/timeline-utilities'
import { times,fill } from 'lodash';

class ResourcesView extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleResourceDragEnd = this.handleResourceDragEnd.bind(this)
    this.state = {
      financialResources:[]
    }
  }
  componentDidMount() {
    let {scenarioId} = this.props.params
    getData(`resourcescenario/${scenarioId}/resources`)
    .then( resourcesData => { 
      this.setState({financialResources:resourcesData.financialResources}) 
      let financialPartitionPromises = this.getFinancialResourcePartitions(resourcesData.financialResources)
      Promise.all(financialPartitionPromises)
      .then( financialPartitions => { this.processFinancialPartitions(resourcesData.financialResources,financialPartitions); } )
    } )
  }
  getFinancialResourcePartitions(financialResources){
    let partitionPromises = financialResources.map(
      financialResource => {
        return getData(`financialresource/${financialResource.id}/partition`)
      }
    )
    return partitionPromises
  }
  processFinancialPartitions(financialResources,financialPartitions){
    let scenarioStartDate = new Date('2016-1-1')
    let scenarioEndDate = new Date('2019-12-31')
    let resourceInfo = {}
    let datasets = []
    let scenarioLength = unitsBetween(scenarioStartDate,scenarioEndDate,'Months')
    // console.log(arrayLength);
    financialResources.forEach( resource => {
      const ArrayIndexOffset = 1
      let resourceStartDate = new Date(resource.startDate)
      let resourceEndDate = new Date(resource.endDate)
      let resourceUnitLength = unitsBetween(resourceStartDate,resourceEndDate,'Months')
      let resourceOffsetFromScenarioStart = unitsBetween(scenarioStartDate, resourceStartDate, 'Months') - ArrayIndexOffset
      resourceInfo[resource.id] = {resourceUnitLength, resourceOffsetFromScenarioStart}
    })
    financialPartitions.forEach( partition => {
      partition.forEach(
        paritionInfo => {
          let dataset = {data:fill(Array(scenarioLength), null),name:''}
          let unitLength = resourceInfo[paritionInfo.financialResourceId].resourceUnitLength
          let unitAmount = paritionInfo.value / unitLength
          let offset = resourceInfo[paritionInfo.financialResourceId].resourceOffsetFromScenarioStart      
          fill(dataset.data, unitAmount, offset, unitLength)
          paritionInfo.categories.forEach( (category,i) => { dataset.name += `${i >= 1 ? ' & ' : ''}${category}` })
          datasets.push(dataset)
        }
      )
    })
  }
  handleResourceDragEnd(props,state){
    let {name,id,resourceScenarioId,recurring} = props
    let {startDate,endDate} = state
    let updateFinancialResourcePayload = {
      id,
      resourceScenarioId,
      name,
      startDate,
      endDate,
      recurring
    }
    putData('financialresource',updateFinancialResourcePayload)
  }
  timelineObjectsForFinancialResources(financialResources){
    let timelineObjects = []
    timelineObjects = financialResources.map( 
      financialResource => (
        <TimelineObject
          name={financialResource.name}
          startDate={financialResource.startDate}
          endDate={financialResource.endDate}
          id={financialResource.id}
          resourceScenarioId={financialResource.resourceScenarioId}
          recurring={financialResource.recurring}
          dragEndFunction={this.handleResourceDragEnd}
          />
      )
    )
    timelineObjects.push(

    )
    return timelineObjects
  }
  render() {
    let financialResourceTimelineObjects = this.timelineObjectsForFinancialResources(this.state.financialResources)
    return(
      <div>
        <Timeline timelineStartYear={2016} numberOfYears={4}>
          {financialResourceTimelineObjects}
        </Timeline>
      </div>
    )
  }
}

export default ResourcesView;