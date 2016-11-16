import React, {Component} from 'react';
import { getData,putData } from 'utilities/api-interaction'
import {TimelineObject} from 'components/timeline-object'
import Timeline from 'components/timeline'

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
    .then( resourcesData => { this.setState({financialResources:resourcesData.financialResources}) } )
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