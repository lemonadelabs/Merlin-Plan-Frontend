import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getResourceScenarioData } from 'actions/resource-scenario';
import FinancialScenarioView from 'components/financial-scenario-view';

class ResourcesView extends Component {
  componentDidMount() {
    let {scenarioId} = this.props.params
    let {dispatch} = this.props
    dispatch( getResourceScenarioData(scenarioId) )
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

export default connect()(ResourcesView);