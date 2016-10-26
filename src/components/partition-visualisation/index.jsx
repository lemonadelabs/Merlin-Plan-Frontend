import React, {Component} from 'react';
import { Stage, Layer, Rect, Group} from 'react-konva';
import { clone } from 'lodash';
import hashbow from 'hashbow';

class PartitionVisualisation extends Component {
  render() {
    let {width, height, available, partitions} = this.props
    let totalPixelsUsed = 0
    return (
      <div>
        <Stage width={width} height={height}>
          <Layer>
            {
              partitions.map(
                (partition) => {
                  let x = clone(totalPixelsUsed)
                  let partitionWidth = width * (partition.value / available)
                  totalPixelsUsed += partitionWidth; 
                  return (
                    <Group x={x}>
                      <Rect x={0} height={height} width={partitionWidth} fill={hashbow(partition.name)}/> 
                      <Rect x={partitionWidth-1} height={height} width={1} fill={'rgba(0,0,0,0.15)'}/>
                    </Group>
                    ) }
              )
            }
            {
              renderUnusedPartition(totalPixelsUsed, width, height)
            }
          </Layer>
        </Stage>
        <div>
          {
            partitions.map(
              (partition) => (<p>`{partition.name}`</p>)
            )
          }
        </div>
      </div>
      
      
    );
  }
}

function renderUnusedPartition(totalPixelsUsed,containerWidth,height){
  let width = containerWidth - totalPixelsUsed
  return (<Rect x={totalPixelsUsed} height={height} width={width} fill={'#555'}/>)
}

export default PartitionVisualisation;