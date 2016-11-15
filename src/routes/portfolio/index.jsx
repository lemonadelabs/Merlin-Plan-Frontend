import React from 'react'
import {TimelineObject} from 'components/timeline-object'
import Timeline from 'components/timeline'

class Portfolio extends React.Component {
  constructor(...args) {
    super(...args)
    this.state={
      numberOfYears: 3,
      timelineStartYear: 2016
    }
    this.handleRangeChange = this.handleRangeChange.bind(this)
  }
  handleRangeChange(e){
    let newYearAmount = e.target.value
    this.setState({'numberOfYears':newYearAmount})
  }
  render(){

    return(
      <div>
        <input type="range" onChange={this.handleRangeChange} min={1} max={10} value={this.state.numberOfYears}/>
        <Timeline timelineStartYear={this.state.timelineStartYear} numberOfYears={this.state.numberOfYears}>
          <TimelineObject
          name={"Demo demo demo"}
          startDate={"11/1/2016"}
          endDate={"1/1/2018"}/>
          <TimelineObject
          name={"Demo demo demo"}
          startDate={"11/1/2016"}
          endDate={"1/1/2018"}/>
          <TimelineObject
          name={"Demo demo demo"}
          startDate={"11/1/2016"}
          endDate={"1/1/2018"}/>
        </Timeline>
      </div>
    )
  }
}
export default Portfolio
