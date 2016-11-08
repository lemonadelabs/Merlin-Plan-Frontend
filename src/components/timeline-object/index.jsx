import React, {Component, PropTypes} from 'react'
import { Label, Text, Rect, Group} from 'react-konva';
import {calculateYearWidthModePadding, unitsBetween, dateToQuarter, calculateIndicatorWidth, indicatorWidthFromMode, numberOfMonthsChanged, numberOfYearsChanged} from 'utilities/timeline-utilities'

class TimelineObject extends Component {
  constructor(...args) {
    super(...args);
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragmove = this.handleDragmove.bind(this)
    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleDragBound = this.handleDragBound.bind(this)

    let startDate = new Date(this.props.startDate)
    let endDate = new Date(this.props.endDate)
    let {x,width} = this.calculateWidthAndX(startDate, endDate)

    this.state = {
      x: x,
      y: 50,
      width: width,
      draggable:true,
      scaleDirection: '',
      startDate:startDate,
      endDate:endDate
    }
  }
  componentWillReceiveProps(nextProps){
    this.updateWidthAndX(nextProps)
  }
  updateWidthAndX(props) {
    let {stageWidth, numberOfYears, timelineStartYear} = props
    let {x, width} = this.calculateWidthAndX(this.state.startDate, this.state.endDate, stageWidth, numberOfYears, timelineStartYear)

    this.setState({width: width, x: x})
  }
  calculateWidthAndX(startDate, endDate){
    let x = this.findStartPositionFromDate(startDate)
    let width = this.calculateWidth(startDate, endDate)
    return {x, width}
  }
  findStartPositionFromDate(startDate){
    let {stageWidth, numberOfYears, timelineStartYear} = this.props
    let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
    let yearsFromStartYear = this.amountOfYearsFromTimelineStartYear(startDate, timelineStartYear)
    let yearOffset = (yearWidth * yearsFromStartYear) + (padding * yearsFromStartYear)
    let indicatorWidth
    let time

    switch (mode) {
      case "Months":
        time = startDate.getMonth()
        indicatorWidth = calculateIndicatorWidth(12, padding, yearWidth)
        break;
      case "Quarters":
        time = dateToQuarter(startDate) - 1
        indicatorWidth = calculateIndicatorWidth(4, padding, yearWidth)
        break;
      default:
        console.error(`Incorrect mode: ${mode} not defined`)
    }

    let indicatorOffset = (indicatorWidth * time) + (padding * time)
    let x = yearOffset + indicatorOffset
    return x;
  }
  findDateFromPosition(x, timelineStartYear){
    let {stageWidth, numberOfYears} = this.props
    let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
    let numberOfYearsFromStart = Math.floor(x / yearWidth)
    let yearOffset = (yearWidth + padding) * numberOfYearsFromStart
    let indicatorWidth = indicatorWidthFromMode(mode,padding,yearWidth)
    let monthPosition = x - yearOffset


    let year = timelineStartYear + numberOfYearsFromStart
    let month = Math.floor(monthPosition / (indicatorWidth + padding))
    let date = new Date(year, month)

    return(date);
  }
  calculateWidth(startDate, endDate){
    let {stageWidth, numberOfYears} = this.props
    let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
    let timeUnits = unitsBetween(startDate, endDate, mode)
    let indicatorWidth = indicatorWidthFromMode(mode,padding,yearWidth)
    let monthPadding = padding * timeUnits - padding
    let width = (indicatorWidth * timeUnits) + (monthPadding)
    return width
  }
  amountOfYearsFromTimelineStartYear(date, timelineStartYear){
    let year = date.getFullYear()
    return(year - timelineStartYear)
  }
  relativePosition(pos, myPos){
    return {x: pos.x - myPos.x, y: pos.y - myPos.y}
  }
  handleMousedown(e) {
    let myPos = {x:this.state.x, y:this.state.y}
    let clickPos = {x: e.evt.x, y: e.evt.y}
    let relPos = this.relativePosition(clickPos, myPos)
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

    switch (scaleDirection) {
      case 'right':
        endDate = this.findDateFromPosition(x + width, this.props.timelineStartYear)
        break;
      case 'left':
        startDate = this.findDateFromPosition(x, this.props.timelineStartYear)
        break;
      default:{
        startDate = this.findDateFromPosition(x, this.props.timelineStartYear)
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
        newState.x = oldState.x + relPos.x
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
        ref="text"
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
