import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fill,times } from 'lodash';
import { getData,putData } from 'utilities/api-interaction'
import {TimelineObject} from 'components/timeline-object'
import Timeline from 'components/timeline'
import {unitsBetween, yearsBetween, dateMonthToString} from 'utilities/timeline-utilities'
import {Bar} from 'react-chartjs-2';

class ResourcesView extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleResourceDragEnd = this.handleResourceDragEnd.bind(this)
  }
  componentDidMount() {
    let {scenarioId} = this.props.params
    let {dispatch} = this.props
    getData(`resourcescenario/${scenarioId}/resources`)
    .then( resourcesData => {
      dispatch({type:'ADD_SCENARIO_DATA', id:scenarioId, data:resourcesData})
      let financialPartitionPromises = this.getFinancialResourcePartitions(resourcesData.financialResources)
      Promise.all(financialPartitionPromises)
      .then( financialPartitions => { 
       let chartData = this.processFinancialScenarioChartData(resourcesData.financialResources,financialPartitions);
       dispatch({type:'SET_FINANCIAL_SCENARIO_CHART_DATA', id:scenarioId, data:chartData})
      } )
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
  processFinancialScenarioChartData(financialResources,financialPartitions){
    let scenarioStartDate = new Date('2016-1-1')
    let scenarioEndDate = new Date('2019-12-31')
    let labels = this.generateTimelineLabels(scenarioStartDate,scenarioEndDate)
    let datasets = []
    let scenarioLength = unitsBetween(scenarioStartDate,scenarioEndDate,'Months')
    let resourceInfo = this.calculateResourceInfo(financialResources, scenarioStartDate)
    financialPartitions.forEach( partition => {
      partition.forEach(
        paritionInfo => {
          let data = this.createDataArray(scenarioLength, paritionInfo.value, resourceInfo[paritionInfo.financialResourceId])
          let dataset = {data,label:''}
          paritionInfo.categories.forEach( (category,i) => { dataset.label += `${i >= 1 ? ' & ' : ''}${category}` })
          datasets.push(dataset)
        }
      )
    })
    return ({datasets,labels})
  }
  generateTimelineLabels(startDate,endDate, mode="Months"){
    let labels = []
    times(yearsBetween(startDate,endDate,mode)+1, yearOffset => {
      let year = startDate.getFullYear() + yearOffset
      times(12, monthOffset =>{
        labels.push(`${dateMonthToString(monthOffset)} - ${year}`)
      })
    })
    return labels;
  }
  createDataArray(scenarioLength, value, resourceInfo){
    let data = fill( Array(scenarioLength), null )
    let unitAmount = value / resourceInfo.resourceUnitLength
    fill(data, unitAmount, resourceInfo.resourceOffsetFromScenarioStart, resourceInfo.resourceUnitLength + resourceInfo.resourceOffsetFromScenarioStart)
    return data
  }
  calculateResourceInfo(financialResources,scenarioStartDate){
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
    let financialResourceTimelineObjects = this.timelineObjectsForFinancialResources(this.props.financialResources)
    return(
      <div>
        <Timeline timelineStartYear={2016} numberOfYears={4}>
          {financialResourceTimelineObjects}
        </Timeline>
        <Bar 
          data={this.props.chartData} 
          options={
            {
              scales:{
                xAxes:[
                  {
                    stacked:true
                  }
                ],
                yAxes:[
                  {
                    stacked:true
                  }
                ]
              }
            }
          } 
        redraw={true}/>
      </div>
    )
  }
}
function mapStateToProps(state,props){
  let scenarioId = props.params.scenarioId
  let scenarioData = state.resources.scenarioData[scenarioId] || {financialResources:[]}
  let chartData = state.resources.chartData[scenarioId] || {labels:[],datasets:[]}
  return({
    financialResources: scenarioData.financialResources,
    chartData
  })
}
export default connect(mapStateToProps)(ResourcesView);