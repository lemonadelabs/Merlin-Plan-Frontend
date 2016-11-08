import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { map, union } from 'lodash'
import moment from 'moment'
import Card from 'components/card';
import { getData } from 'utilities/api-interaction';

class ResourcesList extends Component {
  componentDidMount(){
    let {userId,dispatch} = this.props
    dispatch({ type:"SET_VISABILITY_FILTER", filter: "ALL" })
    dispatch({ type:"SET_ACTIONS", actions:[{title:"New Scenario", name:'showNewModal'}]})
    getData(`resourcescenario/useraccess/${userId}`)
    .then( scenarios => {
      dispatch({ type:"SET_ACCESSABLE_SCENARIOS", scenarios })
    })
  }
  render() {
    let {scenarios} = this.props
    let scenariosFiltered = filterScenarios(scenarios, "ALL")
    return (
      <div>
        {
          scenariosFiltered.map(
            scenario => {
              return ( 
                <Card>
                  <p>{scenario.name}</p>
                  <p>Created by: {`${scenario.creatorDetails.firstName} ${scenario.creatorDetails.lastName}`}</p>
                  <p>Created: {moment(scenario.created).calendar()}</p>
                  <p>Modified: {moment(scenario.modified).calendar()}</p>
                  <Link to={`resources/view/${scenario.id}`}>View</Link>
                </Card>
              )
            }
          )
        }
      </div>
    );
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

export default connect(stateToProps)(ResourcesList);