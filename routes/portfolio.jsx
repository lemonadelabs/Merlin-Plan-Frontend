import React from 'react'
import {Layer, Label, Text, Rect, Stage, Group} from 'react-konva'
import {TimelineObject} from '../components/timeline-object'
import {Timeline} from '../components/timeline'
import _ from 'lodash'

class Portfolio extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerWidth,
      numberOfYears: 3,
      timelineStartYear: 2016
    }
    this.handleResize = _.debounce(this.handleResize.bind(this),50)
    this.handleRangeChange = this.handleRangeChange.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  handleResize(e) {
    this.setState({windowWidth: window.innerWidth,
                   windowHeight: window.innerHeight})
  }
  handleRangeChange(e){
    let newYearAmount = e.target.value
    this.setState({'numberOfYears':newYearAmount})
  }
  render(){
    return(
      <div>
        <input type='range' onChange={this.handleRangeChange} min={1} max={10} value={this.state.numberOfYears}/>
        <Stage width={this.state.windowWidth} height={this.state.windowHeight} >
          <Layer>
            <Timeline
              width={this.state.windowWidth}
              height={this.state.windowHeight}
              startYear={this.state.timelineStartYear}
              numberOfYears={this.state.numberOfYears}/>
            </Layer>
            <Layer>
            <TimelineObject
              name={"Demo demo demo"}
              startDate={"12/1/2016"}
              endDate={"1/1/2018"}
              stageWidth={this.state.windowWidth}
              stageHeight={this.state.windowHeight}
              timelineStartYear={this.state.timelineStartYear}
              numberOfYears={this.state.numberOfYears}/>
            </Layer>
        </Stage>
      </div>
    )
  }
}
export default Portfolio
