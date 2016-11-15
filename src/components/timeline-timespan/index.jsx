import React, { PropTypes } from 'react'
import {Group} from 'react-konva'
import {times} from 'lodash'
import {TimelineYear} from 'components/timeline-year'
import {calculateYearWidthModePadding} from 'utilities/timeline-utilities'

export default function TimelineTimespan ({numberOfYears, startYear, width}){
  let years = buildTimeline(numberOfYears, startYear, width)
  return(
    <Group>
      {years}
    </Group>
  )
}

TimelineTimespan.propTypes = {
  numberOfYears: PropTypes.number.isRequired,
  startYear: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

function buildTimeline(numberOfYears, startYear, width){
  let timelineYears = []
  let {yearWidth, mode, padding} = calculateYearWidthModePadding(width, numberOfYears)
  times(numberOfYears, index => {
    timelineYears.push(<TimelineYear key={index} mode={mode} x={yearWidth * index} iterate={index} startYear={startYear} padding={padding} width={yearWidth}/>)
  })
  return timelineYears
}

