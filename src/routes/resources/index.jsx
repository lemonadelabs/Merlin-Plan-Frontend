import React, {Component} from 'react'
import { connect } from 'react-redux';
import NewResourceScenario from 'components/forms/new-resource-scenario';

// import PartitionVisualisation from 'components/partition-visualisation';

class ResourcesRoot extends Component {
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
    return(
      <div>
        <NewResourceScenario/>
        <h1>Resources</h1>
        {this.props.children}
      </div>
    )
  }
}


function stateToProps(state){
  return { userId: state.user.id, scenarios:state.resources.accessableScenarios}
}

export default connect(stateToProps)(ResourcesRoot)
