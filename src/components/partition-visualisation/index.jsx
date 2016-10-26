import React, {Component} from 'react';
import { Stage, Layer, Rect} from 'react-konva';
import { clone } from 'lodash';
class PartitionVisualisation extends Component {
  render() {
    let {width, height, available, partitions} = this.props
    let totalPixelsUsed = 0
    return (
      <Stage width={width} height={height}>
        <Layer>
          {
            partitions.map(
              (partition) => {
                let x = clone(totalPixelsUsed)
                let partitionWidth = width * (partition.value / available)
                totalPixelsUsed += partitionWidth; 
                return ( <Rect x={x} height={height} width={partitionWidth} fill={Konva.Util.getRandomColor()}/> )}
            )
          }
          {renderUnusedPartition(totalPixelsUsed, width, height)}
        </Layer>
      </Stage>
    );
  }
}

function renderUnusedPartition(totalPixelsUsed,containerWidth,height){
  let width = containerWidth - totalPixelsUsed
  return (<Rect x={totalPixelsUsed} height={height} width={width} fill={'#555'}/>)
}

export default PartitionVisualisation;