import React, {Component} from 'react';
import { Rect } from 'react-konva';
import { isEqual } from 'lodash';

class TimelineScrollbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.dragConstraintFunc = this.dragConstraintFunc.bind(this)
    this.handleDragMove = this.handleDragMove.bind(this)
    this.state = {
      width:props.windowWidth / props.zoomLevel,
      x:0,
      percentageIntoTimeline:0
    }
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
      this.triggerScrollOffsetUpdate(x,nextProps.zoomLevel)
    }
  }
  calculateNewX(width, windowWidth, percentageIntoTimeline){
    let scrollBarEndX = windowWidth * percentageIntoTimeline
    let newX = scrollBarEndX - width
    return (newX >= 0 ? newX : 0)
  }
  dragConstraintFunc(pos){
    let width = this.rect.attrs.width
    let x = this.rect.attrs.x
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
    let width = this.rect.attrs.width
    let percentageIntoTimeline = (x + width) / this.props.windowWidth
    this.setState({x,percentageIntoTimeline})
    this.triggerScrollOffsetUpdate(this.state.x, this.props.zoomLevel)
  }
  triggerScrollOffsetUpdate(x, zoomLevel){
    let updatedOffset = (x * zoomLevel) * -1
    this.props.updateOffset(updatedOffset)
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