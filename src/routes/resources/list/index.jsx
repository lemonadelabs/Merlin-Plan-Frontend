import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { filter } from 'lodash'
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
      dispatch({ type:"SET_RESOURCE_SCENARIOS", scenarios:scenarios.documents })
    })
  }
  render() {
    let {scenarios,userId} = this.props
    let scenariosFiltered = filterScenarios(scenarios, "ALL", userId)
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
function filterScenarios(scenarios, filterState, userId){
  let scenariosToReturn
  switch (filterState) {
    case 'ALL': {
      scenariosToReturn = scenarios
      break
    }
    case 'MINE': {
      scenariosToReturn = filter(scenarios, scenario => (scenario.creator === userId))
      break
    }
    case 'GROUP': {
      scenariosToReturn = filter(scenarios, 'sharing.groupShared')
      break
          }
    case 'ORG': {
      scenariosToReturn = filter(scenarios, 'sharing.organisationShared')
      break
        }
    case 'USER': {
      scenariosToReturn = filter(scenarios, scenario => (scenario.sharing.userShare.length))
      break
    }
    default:
      scenariosToReturn = []
      break;
  }
  return scenariosToReturn
}

function stateToProps(state){
  return { userId: state.user.id, scenarios:state.resources.scenarios}
}

export default connect(stateToProps)(ResourcesList);