import React, {Component, PropTypes} from 'react'
import { Label, Text, Rect, Group} from 'react-konva';
import {findDateFromPosition, calculateWidthAndX, numberOfMonthsChanged, numberOfYearsChanged} from 'utilities/timeline-utilities'

class TimelineObject extends Component {
  constructor(...args) {
    super(...args);
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragmove = this.handleDragmove.bind(this)
    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleDragBound = this.handleDragBound.bind(this)

    let startDate = new Date(this.props.startDate)
    let endDate = new Date(this.props.endDate)
    let {stageWidth, numberOfYears, timelineStartYear} = this.props
    let {x,width} = calculateWidthAndX({startDate, endDate, stageWidth, numberOfYears, timelineStartYear})

    this.state = {
      x: x,
      y: 50,
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
    let {x, width} = calculateWidthAndX({startDate, endDate, stageWidth, numberOfYears, timelineStartYear})
    this.setState({width: width, x: x})
  }
  relativePosition(pos, myPos){
    return {x: pos.x - myPos.x, y: pos.y - myPos.y}
  }
  handleMousedown(e) {
    let myPos = {x:this.state.x, y:this.state.y}
    let clickPos = {x: e.evt.x, y: e.evt.y}
    let relPos = this.relativePosition(clickPos, myPos)
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
    let newDisplayState = this.calculateNewWidthAndX(e.evt, this.state)
    let width = newDisplayState.width || this.state.width
    let x =  this.state.scaleDirection === "right" ? this.state.x : e.target.parent.attrs.x;
    let newDateState = this.getNewDateState(width, x, this.state)
    let newState = Object.assign({}, newDisplayState, newDateState)
    this.setState(newState)
  }
  getNewDateState(width, x, oldState){
    let newState = {}
    let scaleDirection =  oldState.scaleDirection
    let endDate = oldState.endDate
    let startDate = oldState.startDate
    let {timelineStartYear, stageWidth, numberOfYears} = this.props
    switch (scaleDirection) {
      case 'right':
        endDate = findDateFromPosition({x: x + width, timelineStartYear, endDate, stageWidth, numberOfYears})
        break; 
      case 'left':
        startDate = findDateFromPosition({x, timelineStartYear, startDate, stageWidth, numberOfYears})
        break;
      default:{
        startDate = findDateFromPosition({x, timelineStartYear, startDate, stageWidth, numberOfYears})
        let monthChange = numberOfMonthsChanged(startDate, oldState.startDate)
        let yearChange = numberOfYearsChanged(startDate, oldState.startDate)
        let oldEndMonth = endDate.getMonth()
        let oldEndYear = endDate.getFullYear()
        endDate = new Date(oldEndYear+yearChange,oldEndMonth+monthChange)
      }
    }
    if(startDate !== oldState.startDate){
      newState.startDate = startDate
    }

    if(endDate !== oldState.endDate){
      newState.endDate = endDate
    }
    return newState
  }
  calculateNewWidthAndX(evt,oldState){
    const minWidth = 30
    let newState = {}
    let relPos = this.relativePosition({x: evt.x, y: evt.y}, {x:oldState.x, y:oldState.y})
    switch (oldState.scaleDirection) {
      case 'right':
        newState.width = evt.x - oldState.x
        break;
      case 'left':{
        newState.width = oldState.width + (relPos.x * -1)
        //draggable doesn't seem update position when we change width, poos :(
        newState.x = oldState.x + relPos.x
        break;
      }
      default:{
        let offset = evt.x - this.state.offsetX - oldState.x
        newState.x = oldState.x + offset
      }
    }
    return newState
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
