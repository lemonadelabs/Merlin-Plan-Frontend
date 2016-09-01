import React from 'react'
import {Layer, Label, Text, Rect, Stage, Group} from 'react-konva';
import _ from 'lodash'
import {Motion, spring} from 'react-motion';
import {calculateYearWidthModePadding, yearsBetween, dateToQuarter, calculateIndicatorWidth, indicatorWidthFromMode} from './timeline-helpers'

class TimelineObject extends React.Component {
  constructor(...args) {
    super(...args);

    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragmove = this.handleDragmove.bind(this)
    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleDragBound = this.handleDragBound.bind(this)

    let startDate = new Date(this.props.startDate)
    let endDate = new Date(this.props.endDate)
    let {stageWidth, numberOfYears, timelineStartYear} = this.props
    let {x,width} = this.calculateWidthAndX(startDate, endDate, stageWidth, numberOfYears, timelineStartYear)

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
  calculateWidthAndX(startDate, endDate, stageWidth, numberOfYears, timelineStartYear){
    let x = this.findStartPositionFromDate(startDate, stageWidth, numberOfYears, timelineStartYear)
    let width = this.findWidthFromEndDate(startDate, endDate, stageWidth, numberOfYears, timelineStartYear)
    return {x, width}
  }
  findStartPositionFromDate(startDate,stageWidth,numberOfYears,timelineStartYear){
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
  findDateFromPosition(x,stageWidth,numberOfYears,timelineStartYear){
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
  unitsBetween(startDate,endDate,mode){
    let years = yearsBetween(startDate,endDate)
    let startOffset
    let totalTimeUnits
    switch (mode) {
      case "Months":
        startOffset = startDate.getMonth()
        totalTimeUnits = (years * 12) - startOffset
        totalTimeUnits += endDate.getMonth() + 1
        break;
      case "Quarters":
        startOffset = dateToQuarter(startDate) - 1
        totalTimeUnits = (years * 4) - startOffset
        totalTimeUnits += dateToQuarter(endDate)
        break;
      default:
        console.error(`Incorrect mode: ${mode} not defined`)
    }
    return totalTimeUnits
  }
  numberOfMonthsChanged(date1,date2){
    let month1 = date1.getMonth()
    let month2 = date2.getMonth()
    return month1 - month2
  }
  numberOfYearsChanged(date1,date2){
    let year1 = date1.getFullYear()
    let year2 = date2.getFullYear()
    return year1 - year2
  }
  findWidthFromEndDate(startDate, endDate, stageWidth, numberOfYears, timelineStartYear){
    let {yearWidth, mode, padding} = calculateYearWidthModePadding(stageWidth, numberOfYears)
    let timeUnits = this.unitsBetween(startDate, endDate, mode)
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
    let rect = this.refs.rect;
    let scaleDirection = this.scaleDirection
    let newPos = {
      x: scaleDirection === "right" ? this.state.x : pos.x,
      y: this.state.y
    }
    return newPos
  }
  handleDragmove(e){
    let newDisplayState = this.calculateNewWidthAndX(e.evt, this.state)
    let width = newDisplayState.width || this.state.width
    let x =  this.state.scaleDirection === "right" ? this.state.x : e.target.attrs.x;
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
        endDate = this.findDateFromPosition(x + width, this.props.stageWidth, this.props.numberOfYears, this.props.timelineStartYear)
        break;
      case 'left':
        startDate = this.findDateFromPosition(x, this.props.stageWidth, this.props.numberOfYears, this.props.timelineStartYear)
        break;
      default:
        startDate = this.findDateFromPosition(x, this.props.stageWidth, this.props.numberOfYears, this.props.timelineStartYear)
        let monthChange = this.numberOfMonthsChanged(startDate,oldState.startDate)
        let yearChange = this.numberOfYearsChanged(startDate,oldState.startDate)
        let oldEndMonth = endDate.getMonth()
        let oldEndYear = endDate.getFullYear()
        endDate = new Date(oldEndYear+yearChange,oldEndMonth+monthChange)
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
    switch (oldState.scaleDirection) {
      case 'right':
        newState.width = evt.x - oldState.x
        break;
      case 'left':
        let relPos = this.relativePosition({x: evt.x, y: evt.y}, {x:oldState.x, y:oldState.y})
        newState.width = oldState.width + (relPos.x * -1)
        //draggable doesn't seem update position when we change width, poos :(
        newState.x = oldState.x + relPos.x
        break;
      default:
        newState.x = this.refs.SliderMotion.refs.rect.attrs.x
    }
    return newState
  }
  updateWidthAndX(props) {
    let {stageWidth, numberOfYears, timelineStartYear} = props
    let {x, width} = this.calculateWidthAndX(this.state.startDate, this.state.endDate, stageWidth, numberOfYears, timelineStartYear)

    this.setState({width: width, x: x})
  }
  componentWillReceiveProps(nextProps){
    this.updateWidthAndX(nextProps)
  }
  render() {
    let SliderMotionSettings = {stiffness: 90, damping: 12}
      return (
        <Motion ref="SliderMotion" style={{x: spring(this.state.x, SliderMotionSettings),width: spring(this.state.width, SliderMotionSettings)}}>
          {interpolatingStyles =>
            <Group
              ref="rect"
              x={interpolatingStyles.x}
              y={this.state.y}
              onMousedown={this.handleMousedown}
              draggable={this.state.draggable}
              dragBoundFunc={this.handleDragBound}
              onDragEnd={this.handleDragEnd}
              onDragmove={this.handleDragmove}>

              <Rect
                width={interpolatingStyles.width} height={23}
                fill={'green'}
                cornerRadius={3}
                shadowBlur={4}
              />
              <TruncatingText text={this.props.name} width={interpolatingStyles.width}/>
            </Group>
          }
        </Motion>
      );
  }
}

class TruncatingText extends React.Component {
  constructor(...args) {
    super(...args);
  }
  render() {
    // if(this.refs.text){
    //   console.log(this.refs.text);
    // }
    return (
      <Label x={10} y={6}>
        <Text
          ref="text"
          fontSize={12}
          weight={'bold'}
          fill={'white'}
          fontFamily={'Roboto Condensed'}
          wrap={'none'}
          width={this.props.width - 20}
          text={this.props.text}/>
      </Label>
    )
    // <Text text={'...'} x={this.props.width - 20} />
  }
}

export {TimelineObject}
