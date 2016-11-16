import React, {Component, PropTypes} from 'react'
import { Label, Text, Rect, Group} from 'react-konva';
import {getNewDateState, calculateNewDisplayState, relativePosition, calculateTimelineObjectWidthAndX} from 'utilities/timeline-utilities'

class TimelineObject extends Component {
  constructor(...args) {
    super(...args);
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragmove = this.handleDragmove.bind(this)
    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleDragBound = this.handleDragBound.bind(this)

    let startDate = new Date(this.props.startDate)
    let endDate = new Date(this.props.endDate)
    let {stageWidth, numberOfYears, timelineStartYear, verticalPosition} = this.props
    let {x,width} = calculateTimelineObjectWidthAndX({startDate, endDate, stageWidth, numberOfYears, timelineStartYear})
    let y = 50 + (30 * verticalPosition)
    this.state = {
      x: x,
      y: y,
      offsetX: 0,
      width: width,
      draggable:true,
      scaleDirection: '',
      startDate:startDate,
      endDate:endDate
    }
  }
  componentWillReceiveProps(nextProps){
    let oldStageWidth = this.props.stageWidth
    let newStageWidth = nextProps.stageWidth
    let oldNumberOfYears = this.props.numberOfYears
    let newNumberOfYears = nextProps.numberOfYears
    if(oldStageWidth !== newStageWidth || oldNumberOfYears !== newNumberOfYears){
      this.updateWidthAndX(nextProps)
    }
  }
  updateWidthAndX({stageWidth, numberOfYears, timelineStartYear}) {
    let {startDate, endDate} = this.state
    let {x, width} = calculateTimelineObjectWidthAndX({startDate, endDate, stageWidth, numberOfYears, timelineStartYear})
    this.setState({width: width, x: x})
  }
  handleMousedown(e) {
    let myPos = {x:this.state.x, y:this.state.y}
    let clickPos = {x: e.evt.x, y: e.evt.y}
    let relPos = relativePosition(clickPos, myPos)
    this.setState({offsetX:relPos.x})
    if(relPos.x > this.state.width-20){
      this.setState({
        scaleDirection : 'right'
      })
    }
    else if(relPos.x < 20){
      this.setState({
        scaleDirection: 'left'
      })
    }
    else{
      this.setState({
        scaleDirection: ''
      })
    }
  }
  handleDragEnd() {
    this.updateWidthAndX(this.props)
    if (this.props.dragEndFunction){
      this.props.dragEndFunction(this.props,this.state)
    }
  }
  handleDragBound(pos){
    let scaleDirection = this.scaleDirection
    let newPos = {
      x: scaleDirection === "right" ? pos.x : this.state.x,
      y: this.state.y
    }
    return newPos
  }
  handleDragmove(e){
    let {timelineStartYear, stageWidth, numberOfYears} = this.props
    let newDisplayState = calculateNewDisplayState(e.evt, this.state)
    let width = newDisplayState.width || this.state.width
    let x =  this.state.scaleDirection === "right" ? this.state.x : e.target.parent.attrs.x;
    let newDateState = getNewDateState({width, x, oldState: this.state, timelineStartYear, stageWidth, numberOfYears})
    let newState = Object.assign({}, newDisplayState, newDateState)
    this.setState(newState)
  }
  render() {
    let {x,y, width, draggable} = this.state
      return (
        <Group x={x} y={y}>
          <Rect
            ref="rect"
            width={width} height={23}
            fill={'green'}
            onMousedown={this.handleMousedown}
            dragBoundFunc={this.handleDragBound}
            onDragmove={this.handleDragmove}
            onDragEnd={this.handleDragEnd}
            draggable={draggable}            
            cornerRadius={3}
            shadowBlur={4}
          />
          <TimelineLabel  text={this.props.name} width={width}/>
        </Group>
      );
  }
}

TimelineObject.propTypes = {
  name:PropTypes.string,
  startDate:PropTypes.string,
  endDate:PropTypes.string,
  stageWidth:PropTypes.number,
  numberOfYears:PropTypes.number,
  timelineStartYear:PropTypes.number
}

function TimelineLabel({text,width}){
  return (
    <Label listening={false} x={10} y={6}>
      <Text
        listening={false}
        fontSize={12}
        weight={'bold'}
        fill={'white'}
        fontFamily={'Roboto Condensed'}
        wrap={'none'}
        width={width - 20}
        text={text}/>
    </Label>
  )
}

TimelineLabel.propTypes = {
  text: PropTypes.string,
  width: PropTypes.number
}

export {TimelineObject}