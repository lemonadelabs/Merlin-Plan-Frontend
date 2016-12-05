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
    let width = nextProps.windowWidth / nextProps.zoomLevel
    let x = this.state.x
    let changeInWidth = this.state.width - width
    let spaceAvailable = nextProps.windowWidth - width
    if(nextProps.zoomLevel !== this.props.zoomLevel){
      let newX = spaceAvailable * this.state.percentageIntoTimeline //this.state.x + changeInWidth * (this.state.percentageIntoTimeline)
      x = newX >= 0 ? newX : this.state.x
    }
    this.setState({width,x})
    if(nextProps.zoomLevel !== this.props.zoomLevel){
      this.triggerScrollOffsetUpdate(x,nextProps.zoomLevel)
    }
  }
  dragConstraintFunc(pos){
    let width = this.rect.attrs.width
    let x = this.rect.attrs.x
    if(pos.x + width >= this.props.windowWidth){
      console.log('end of the line');
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
    let percentageIntoTimeline = (x) / this.props.windowWidth
    this.setState({x,percentageIntoTimeline})
    this.triggerScrollOffsetUpdate(this.state.x, this.props.zoomLevel)
  }
  triggerScrollOffsetUpdate(x,zoomLevel){
    let updatedOffset = (x * zoomLevel) * -1
    console.log(x,zoomLevel,updatedOffset);
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