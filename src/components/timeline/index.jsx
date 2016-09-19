import React from 'react'
import {TimelineYear} from 'components/timeline-year'
import {Layer, Label, Text, Rect, Stage, Group} from 'react-konva'
import {calculateYearWidthModePadding} from 'utilities/timeline-utilities'
import _ from 'lodash'

function Timeline ({numberOfYears, startYear, width}){
  let years = buildTimeline(numberOfYears, startYear, width)
  return(
    <Group>
      {years}
    </Group>
  )
}

function buildTimeline(numberOfYears, startYear, width){
  let timelineYears = []
  let {yearWidth, mode, padding} = calculateYearWidthModePadding(width, numberOfYears)
  _.times(numberOfYears,(index) => {
    timelineYears.push(<TimelineYear key={index} mode={mode} x={yearWidth * index} iterate={index} startYear={startYear} padding={padding} width={yearWidth}/>)
  })
  return timelineYears
}
export {Timeline}
