import React, {Component} from 'react';
import { Stage, Layer } from 'react-konva';
import throttle from 'lodash/throttle'
import TimelineTimespan from 'components/timeline-timespan';
import { castArray } from 'lodash';

class Timeline extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleResize = throttle(this.handleResize.bind(this),100)
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerWidth
    }
  }
  handleResize() {
    this.setState({windowWidth: window.innerWidth,
                   windowHeight: window.innerHeight})
  } 
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  addRenderPropsToChildren(children){
    let childrenToProcess = Array.isArray(children) ? children : castArray(children)
    let childrenWithProps = childrenToProcess.map( 
      child => ( 
        React.cloneElement(
          child,
          {
            stageWidth : this.state.windowWidth,
            stageHeight : this.state.windowHeight,
            timelineStartYear : this.props.timelineStartYear,
            numberOfYears : this.props.numberOfYears
          }
        ) 
      ) 
    )
    return childrenWithProps
  }
  render() {
   const childrenWithProps = this.props.children ? this.addRenderPropsToChildren(this.props.children) : ''
    return (
      <Stage width={this.state.windowWidth} height={this.state.windowHeight} >
        <Layer>
          <TimelineTimespan
            width={this.state.windowWidth}
            height={this.state.windowHeight}
            startYear={this.props.timelineStartYear}
            numberOfYears={this.props.numberOfYears}/>
        </Layer>
        <Layer>
          {childrenWithProps}
        </Layer>
      </Stage>
    );
  }
}

export default Timeline;