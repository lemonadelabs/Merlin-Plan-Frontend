import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { isEqual, times, debounce } from 'lodash';
import { putData } from 'utilities/api-interaction';
import { processFinancialScenarioChartData } from 'actions/resource-chart-data';
import Timeline from 'components/timeline'
import NewFinancialResourceForm from 'components/forms/new-financial-resource';
import { TimelineObject } from 'components/timeline-object'

class FinancialScenarioView extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleResourceDragEnd = this.handleResourceDragEnd.bind(this)
    this.state = {
      startYear:2016,
      endYear:2018,
      zoomLevel:1
    }
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
  generateYearDropDown(startingYear, amountOfYearOptions = 10){
    let yearOptions = []
    times( 
      amountOfYearOptions,
      i => {
        let currentYear = startingYear + i
        yearOptions.push(<option value={currentYear}>{currentYear}</option>)
      }
    )
    return yearOptions
  }
  handleZoomChange(e){
    let zoomLevel = parseFloat( e.target.value )
    this.setState({zoomLevel}) 
  }
  render() {
    let financialResourceTimelineObjects = this.timelineObjectsForFinancialResources(this.props.financialResources)
    let yearOptions = this.generateYearDropDown(2016)
    const scenarioId = this.props.scenarioId
    return (
      <div>
        {/*<NewFinancialResourceForm scenarioId={scenarioId}/>*/}
        <div>
          <label>Starting year</label>
          <select 
            value={this.state.startYear} 
            onChange={
              e => {
               let year = parseInt( e.target.value, 10 )
               let newState = year >= this.state.endYear ? {startYear:year, endYear:year, zoomLevel:1} : {startYear:year}
               this.setState(newState)
              }
            }>
            {yearOptions}
          </select>
          <label>Ending year</label>
          <select 
            value={this.state.endYear} 
            onChange={
              e => {
               let year = parseInt( e.target.value, 10 )
               let newState = {endYear:year}
               if (year === this.state.startYear){
                newState.zoomLevel = 1
               }
               this.setState(newState)
              }
            }>
            {this.generateYearDropDown(this.state.startYear)}
          </select>
        </div>
        <div>
          <input 
            type="range" 
            min="1" 
            max={(this.state.endYear - this.state.startYear) + 1} 
            step="0.1" 
            value={this.state.zoomLevel} 
            onChange={
              e => {
                this.handleZoomChange(e)
              }
            }
          />
        </div>
        <Timeline timelineStartYear={this.state.startYear} numberOfYears={(this.state.endYear - this.state.startYear) + 1} zoomLevel={this.state.zoomLevel}>
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