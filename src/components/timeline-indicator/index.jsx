import React from 'react'
import {Layer, Label, Text, Rect, Stage, Group} from 'react-konva'
import {TransitionMotion, spring} from 'react-motion';

function TimelineIndicator ({label, width, padding, iterate, startYear, y}){
  return(
    <Group x={(width * iterate) + (padding * iterate)} y={y}>
      <Text
        text={width < 60 ? label.substr(0, 3) : label}
        align={'center'}
        width={width - padding}
        fontSize={11.5}
        weight={'bold'}
        fill={'white'}
        fontFamily={'Roboto Condensed'}/>
      <Rect y={18} width={width} height={100} fill={"white"} opacity={0.05}/>
    </Group>
  )
}

export {TimelineIndicator}
