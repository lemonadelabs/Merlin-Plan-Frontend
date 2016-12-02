import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getData } from 'utilities/api-interaction'
import FinancialScenarioView from 'components/financial-scenario-view';

class ResourcesView extends Component {
  componentDidMount() {
    let {scenarioId} = this.props.params
    let {dispatch} = this.props
    getData(`resourcescenario/${scenarioId}/resources`)
    .then( resourcesData => {
      dispatch({type:'ADD_SCENARIO_DATA', id:scenarioId, data:resourcesData})
      let financialPartitionPromises = this.getFinancialResourcePartitions(resourcesData.financialResources)
      Promise.all(financialPartitionPromises)
      .then( financialPartitions => { 
        dispatch({type:'SET_FINANCIAL_PARTITIONS',scenarioId, financialPartitions}) 
      } )
    } )
  }
  getFinancialResourcePartitions(financialResources){
    let partitionPromises = financialResources.map(
      financialResource => {
        return getData(`financialresource/${financialResource.id}/partition`)
      }
    )
    return partitionPromises
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