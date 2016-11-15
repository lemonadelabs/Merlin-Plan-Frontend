import React, {Component} from 'react';
import { getData } from 'utilities/api-interaction'
import {TimelineObject} from 'components/timeline-object'
import Timeline from 'components/timeline'

class ResourcesView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      financialResources:[]
    }
  }
  
  componentDidMount() {
    let {scenarioId} = this.props.params
    getData(`resourcescenario/${scenarioId}/resources`)
    .then( resourcesData => {this.setState({financialResources:resourcesData.financialResources})} )
  }
  timelineObjectsForFinancialResources(financialResources){
    let timelineObjects = []
    console.log(financialResources);
    timelineObjects = financialResources.map( 
      financialResource => (
        <TimelineObject
          name={financialResource.name}
          startDate={financialResource.startDate}
          endDate={financialResource.endDate}/>
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
        <Timeline timelineStartYear={2016} numberOfYears={10}>
          {financialResourceTimelineObjects}
        </Timeline>
      </div>
    )
  }
}

export default ResourcesView;