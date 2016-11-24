import React, {Component} from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { getData, putData, postData } from 'utilities/api-interaction'
import {TimelineObject} from 'components/timeline-object'
import Timeline from 'components/timeline'
import {Bar} from 'react-chartjs-2';
import { processFinancialScenarioChartData } from 'actions/resource-chart-data';
import { addNewFinancialResource } from 'actions';

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
        dispatch({type:'SET_FINANCIAL_PARTITIONS',scenarioId, financialPartitions}) 
      } )
    } )
  }
  componentWillReceiveProps(nextProps) {
    if(!isEqual(this.props.financialPartitions, nextProps.financialPartitions) || !isEqual(this.props.financialResources, nextProps.financialResources)){
      this.props.dispatch(processFinancialScenarioChartData(this.props.params.scenarioId, nextProps.financialResources, nextProps.financialPartitions))
    }
  }
  getFinancialResourcePartitions(financialResources){
    let partitionPromises = financialResources.map(
      financialResource => {
        return getData(`financialresource/${financialResource.id}/partition`)
      }
    )
    return partitionPromises
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
    this.props.dispatch({type:'UPDATE_FINANCIAL_RESOURCE',resourceScenarioId,id,updatedFinancialResource:updateFinancialResourcePayload})
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
  addNewFinancialResource(){
    const scenarioId = this.props.params.scenarioId
    const dummyFinancialData = {
      "name" : "New Financial Resource",
      "startDate" : "2016-01-01",
      "endDate" : "2020-01-01"
    }
    this.props.dispatch(addNewFinancialResource(scenarioId, dummyFinancialData))
  }
  render() {
    let financialResourceTimelineObjects = this.timelineObjectsForFinancialResources(this.props.financialResources)
    return(
      <div>
        <button onClick={() => { this.addNewFinancialResource() }}>Add Financial Resource</button>
        <Timeline timelineStartYear={2016} numberOfYears={4}>
          {financialResourceTimelineObjects}
        </Timeline>
        <div style={{position:'fixed',bottom:0,width:'100%',height:'250px'}}>
          <Bar
            style={{height:'100%'}}
            data={this.props.chartData} 
            options={
              {
                maintainAspectRatio:false,
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
      </div>
    )
  }
}
function mapStateToProps(state,props){
  let scenarioId = props.params.scenarioId
  let scenarioData = state.resources.scenarioData[scenarioId] || {financialResources:[]}
  let financialPartitions = state.resources.financialPartitions[scenarioId] || []
  let chartData = state.resources.chartData[scenarioId] || {labels:[],datasets:[]}
  return({
    financialResources: scenarioData.financialResources,
    financialPartitions,
    chartData
  })
}
export default connect(mapStateToProps)(ResourcesView);