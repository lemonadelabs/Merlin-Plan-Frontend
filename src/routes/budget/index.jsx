import React from 'react'
import PartitionVisualisation from 'components/partition-visualisation';
class Budget extends React.Component {
  constructor(...args){
    super(...args)
    this.state = {
      partitions : [{name:'Baby Partition', value:100},{name:'Mummy Partition', value:1500},{name:'Daddy Partition', value:2500}]
    }
    this.addPartition = this.addPartition.bind(this)
  }
  addPartition(){
    let partitions = this.state.partitions
    let random = Math.random()
    this.setState({partitions:[...partitions,{name:`Random Partition - ${random}`,value:random*2000}]})
  }
  render(){
    let {partitions} = this.state
    return(
      <div>
        <h1>Budget</h1>
        <PartitionVisualisation width={1000} height={40} available={10000} partitions={partitions} />
        <button onClick={this.addPartition}>addPartition</button>
      </div>
    )
  }
}

export default Budget
