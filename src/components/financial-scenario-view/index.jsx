import React, {Component} from 'react';
import { TimelineObject } from 'components/timeline-object'
import Timeline from 'components/timeline'
import { connect } from 'react-redux';
import NewFinancialResourceForm from 'components/forms/new-financial-resource';
import { Bar } from 'react-chartjs-2';
import { putData } from 'utilities/api-interaction';
import { isEqual } from 'lodash';
import { processFinancialScenarioChartData } from 'actions/resource-chart-data';

class FinancialScenarioView extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleResourceDragEnd = this.handleResourceDragEnd.bind(this)
  }
  handleResourceDragEnd(props,state){
    const {name,id,resourceScenarioId,recurring} = props
    const {startDate,endDate} = state
    const updateFinancialResourcePayload = {
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
  componentWillReceiveProps(nextProps) {
    if(!isEqual(this.props.financialPartitions, nextProps.financialPartitions) || !isEqual(this.props.financialResources, nextProps.financialResources)){
      this.props.dispatch(processFinancialScenarioChartData(this.props.scenarioId, nextProps.financialResources, nextProps.financialPartitions))
    }
  }
  render() {
    let financialResourceTimelineObjects = this.timelineObjectsForFinancialResources(this.props.financialResources)
    const scenarioId = this.props.scenarioId
    return (
      <div>
        <NewFinancialResourceForm scenarioId={scenarioId}/>
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
    );
  }
}

function mapStateToProps(state,props){
  let scenarioId = props.scenarioId
  let scenarioData = state.resources.scenarioData[scenarioId] || {financialResources:[]}
  let financialPartitions = state.resources.financialPartitions[scenarioId] || []
  let chartData = state.resources.chartData[scenarioId] || {labels:[],datasets:[]}
  return({
    financialResources: scenarioData.financialResources,
    financialPartitions,
    chartData
  })
}

export default connect(mapStateToProps)(FinancialScenarioView);