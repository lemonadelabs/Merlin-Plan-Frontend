import React from 'react'
import PartitionVisualisation from 'components/partition-visualisation';
class Budget extends React.Component {
  constructor(...args){
    super(...args)
  }
  render(){
    let partitions = [{value:100},{value:4320},{value:6040}]
    return(
      <div>
        <h1>Budget</h1>
        <PartitionVisualisation width={500} height={40} available={10000} partitions={partitions} />
      </div>
    )
  }
}

export default Budget
