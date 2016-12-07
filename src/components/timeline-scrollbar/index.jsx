import React, {Component} from 'react';
import { Rect } from 'react-konva';
import { isEqual } from 'lodash';

class TimelineScrollbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.dragConstraintFunc = this.dragConstraintFunc.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.handleHorizonalScroll = this.handleHorizonalScroll.bind(this)
    this.updateScrollBar = this.updateScrollBar.bind(this)
    this.state = {
      width:props.windowWidth / props.zoomLevel,
      x:0,
      percentageIntoTimeline:0
    }
  }
  componentDidMount() {
    window.addEventListener('wheel',this.handleHorizonalScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('wheel',this.handleHorizonalScroll)
  }
  componentWillReceiveProps(nextProps){
    if(isEqual(nextProps, this.props)){
      return
    }
    let zoomLevelChanged = nextProps.zoomLevel !== this.props.zoomLevel
    let width = nextProps.windowWidth / nextProps.zoomLevel
    let x = zoomLevelChanged ? this.state.x : this.calculateNewX(width, nextProps.windowWidth, this.state.percentageIntoTimeline)
    this.setState({width,x})
    if(zoomLevelChanged){
      this.triggerScrollOffsetUpdate(nextProps.zoomLevel, nextProps.windowWidth, this.state.percentageIntoTimeline)
    }
  }
  handleHorizonalScroll(e){
    if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
      //Shouldn't block the verical scroll if it's dominant
      return
    }
    if(this.state.x + this.state.width >= this.props.windowWidth && e.deltaX > 0){
      //Checks to see the end of the scroll track has been hit
      return
    }
    if (this.state.x !== 0) {
      e.preventDefault();
    } 
    let xWithDeltaX = this.state.x + e.deltaX,
        maxX = this.props.windowWidth - this.state.width
    this.updateScrollBar(xWithDeltaX + this.state.width < this.props.windowWidth ? xWithDeltaX : maxX)
  }
  calculateNewX(width, windowWidth, percentageIntoTimeline){
    let scrollBarEndX = windowWidth * percentageIntoTimeline
    let newX = scrollBarEndX - width
    return (newX >= 0 ? newX : 0)
  }
  dragConstraintFunc(pos){
    let width = this.rect.attrs.width
    if(pos.x + width >= this.props.windowWidth){
      return {
        x:this.props.windowWidth - width,
        y:0
      }
    }
    return {
      x:pos.x < 0 ? 0 : pos.x,
      y:0
    }
  }
  handleDragMove(){
    let x = this.rect.attrs.x
    this.updateScrollBar(x)
  }
  updateScrollBar(x){
   let width = this.state.width
    let percentageIntoTimeline = (x + width) / this.props.windowWidth
    this.setState({x,percentageIntoTimeline})
    this.triggerScrollOffsetUpdate(this.props.zoomLevel,this.props.windowWidth,percentageIntoTimeline)    
  }
  triggerScrollOffsetUpdate(zoomLevel, windowWidth, percentageIntoTimeline = 0){
    let zoomedTimelineLength = windowWidth * zoomLevel,
        desiredEndOfTimeline = zoomedTimelineLength * percentageIntoTimeline,
        endOfTimelineMovedToEndOfScreen = desiredEndOfTimeline - windowWidth,
        offset = endOfTimelineMovedToEndOfScreen * -1
    this.props.updateOffset(offset<0?offset:0)
  }
  render() {
    return (
      <Rect
        ref={ el => { this.rect = el } }
        x={this.state.x}
        height={5}
        width={this.state.width}
        fill={"white"}
        draggable={true}
        onDragmove = {this.handleDragMove}
        dragBoundFunc={this.dragConstraintFunc}
      />
    );
  }
}

export default TimelineScrollbar;