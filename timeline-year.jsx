import React from 'react'
import {TimelineIndicator} from './timeline-indicator'
import {Layer, Label, Text, Rect, Stage, Group} from 'react-konva'
import {calculateYearWidthModePadding, calculateIndicatorWidth} from './timeline-helpers'
import {TransitionMotion, spring} from 'react-motion';

function TimelineYear ({width, iterate, padding, startYear, endYear, mode}){
  let timeUnits = buildTimeline(width, mode, padding)
  let year = startYear + iterate
  return(
    <Group x={(width * iterate) + (padding * iterate) }>
      <Rect width={width} height={400} />
      <Text text={year} fill={"white"} weight={'bold'} fontFamily={'Roboto Condensed'}/>
      <Rect height={3} y={15} width={width} fill={"white"}/>
      {timeUnits}
    </Group>
  )
}

function buildTimeline(width, mode, padding){
  let yearWidth = width
  switch (mode) {
    case "Quarters":
      return buildQuarters(yearWidth, padding)
      break;
    case "Months":
      return buildMonths(yearWidth, padding)
      break;
    default:
      return buildMonths(yearWidth, padding)
  }
}

function buildQuarters(yearWidth, padding){
  return buildIndicatorArray(padding, yearWidth, "Quarters")
}

function buildMonths(yearWidth, padding){
  return buildIndicatorArray(padding, yearWidth, "Months")
}

function buildIndicatorArray(indicatorPadding, yearWidth, mode){
  let timelineIndicators = []
  let months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December']
  let iterations

  switch (mode) {
    case "Months":
      iterations = 12
      break;
    case "Quarters":
      iterations = 4
      break;
    default:
      console.error(`${mode}: not a valid mode`)
  }

  let indicatorWidth = calculateIndicatorWidth(iterations, indicatorPadding, yearWidth)
  _.times(iterations, (i) => {
    let label = mode === "Months" ? months[i] : `Q${i+1}`
    timelineIndicators.push (
      <TimelineIndicator
        key={i}
        label={label}
        iterate={i}
        padding={indicatorPadding}
        width={indicatorWidth}
        y={32}
      />)
  })
  return timelineIndicators
}

export { TimelineYear }
