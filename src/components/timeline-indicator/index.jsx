import React, {PropTypes} from 'react'
import { Text, Rect, Group} from 'react-konva'

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

TimelineIndicator.propTypes = {
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  iterate: PropTypes.number.isRequired,
  startYear: PropTypes.number.isRequired,
  y:PropTypes.number.isRequired
}


export {TimelineIndicator}
