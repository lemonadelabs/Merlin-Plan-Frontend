import React, {Component} from 'react'
import { connect } from 'react-redux';
import { getData } from 'utilities/api-interaction';
import { map, union } from 'lodash'
import NewResourceScenario from 'components/forms/new-resource-scenario';
// import PartitionVisualisation from 'components/partition-visualisation';

class Budget extends Component {
  constructor(...args){
    super(...args)
    this.state = {
      partitions : [{name:'Baby Partition', value:100},{name:'Mummy Partition', value:1500},{name:'Daddy Partition', value:2500}]
    }
    this.addPartition = this.addPartition.bind(this)
  }
  componentDidMount(){
    let {userId,dispatch} = this.props
    dispatch({ type:"SET_VISABILITY_FILTER", filter: "ALL" })
    dispatch({ type:"SET_ACTIONS", actions:[{title:"New Scenario",name:'showNewModal'}] })
    getData(`resourcescenario/useraccess/${userId}`)
    .then( scenarios => {
      dispatch({ type:"SET_ACCESSABLE_SCENARIOS", scenarios })
      // console.log( union( ...map(result, scenarios => (scenarios) ) ) );
    })
  }
  addPartition(){
    let partitions = this.state.partitions
    let random = Math.random()
    this.setState({partitions:[...partitions,{name:`Random Partition - ${random}`,value:random*2000}]})
  }

  render(){
    let {scenarios} = this.props
    let scenariosFiltered = filterScenarios(scenarios,"ALL")
    return(
      <div>
        <NewResourceScenario/>
        <h1>Budget</h1>
        {
          scenariosFiltered.map(
            scenario => {
              return ( <p>{scenario.name}</p> )
            }
          )
        }
      </div>
    )
  }
}

function filterScenarios(allScenarios, filterState){
  let scenariosToReturn
  switch (filterState) {
    case 'ALL': {
      let scenariosFlattened = map(allScenarios, scenarios => (scenarios))
      scenariosToReturn = union( ...scenariosFlattened )
      break
    }
    default:
      scenariosToReturn = []
      break;
  }
  return scenariosToReturn
}

function stateToProps(state){
  return { userId: state.user.id, scenarios:state.resources.accessableScenarios}
}

export default connect(stateToProps)(Budget)
