import React, {PropTypes} from 'react'
import {TimelineIndicator} from 'components/timeline-indicator'
import {Text, Rect, Group} from 'react-konva'
import {calculateIndicatorWidth} from 'utilities/timeline-utilities'
import { times } from 'lodash';

function TimelineYear ({width, iterate, padding, startYear, mode}){
  let timeUnits = buildIndicatorArray(padding, width, mode)
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

TimelineYear.propTypes = {
  width: PropTypes.number.isRequired,
  iterate: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  startYear: PropTypes.number.isRequired,
  endYear: PropTypes.number.isRequired,
  mode:PropTypes.string.isRequired
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
  times(iterations, i => {
    let label = mode === "Months" ? months[i] : `Q${i+1}`
    timelineIndicators.push(
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
