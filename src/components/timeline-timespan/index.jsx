import React, { PropTypes } from 'react'
import {Group} from 'react-konva'
import {times} from 'lodash'
import {TimelineYear} from 'components/timeline-year'
import {calculateYearWidthModePadding} from 'utilities/timeline-utilities'

export default function TimelineTimespan ({numberOfYears, startYear, width, scrollOffset}){
  let years = buildTimeline(numberOfYears, startYear, width)
  return(
    <Group x={scrollOffset}>
      {years}
    </Group>
  )
}

TimelineTimespan.propTypes = {
  numberOfYears: PropTypes.number.isRequired,
  startYear: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  scrollOffset: PropTypes.number
}

function buildTimeline(numberOfYears, startYear, width){
  let timelineYears = []
  let {yearWidth, mode, padding} = calculateYearWidthModePadding(width, numberOfYears)
  times(numberOfYears, index => {
    timelineYears.push(<TimelineYear key={index} mode={mode} x={yearWidth * index} iterate={index} startYear={startYear} padding={padding} width={yearWidth}/>)
  })
  return timelineYears
}

