import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getResourceScenarioData } from 'actions/resource-scenario';
import FinancialScenarioView from 'components/financial-scenario-view';

class ResourcesView extends Component {
  componentDidMount() {
    let {scenarioId} = this.props.params
    let {dispatch} = this.props
    dispatch( getResourceScenarioData(scenarioId) )
    dispatch({ 
      type:"SET_ACTIONS", 
      actions:[
        {title:"Share Scenario To Group ", 'actionsToCreatorsToRun':[{name:'shareToGroup', props:{"endPoint":"resourcescenario","id":1}}]},
        {title:"Share Scenario To Organisation", 'actionsToCreatorsToRun':[{name:'shareToOrganisation', props:{"endPoint":"resourcescenario","id":1}}]},
        {title:"Share Scenario To User",  'actionsToCreatorsToRun':[{name:'shareToUsers', props:{"endPoint":"resourcescenario","id":1,"users":["caleb.sawtell@lemonadelabs.io"]}}]}
        ]})

  }
  render() {
    const scenarioId = this.props.params.scenarioId
    return(
      <div>
        <FinancialScenarioView scenarioId={scenarioId} />
      </div>
    )
  }
}
// function mapStateToProps(state) {
//   return()
// }
export default connect()(ResourcesView);