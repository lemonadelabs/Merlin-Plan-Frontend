import React, {Component} from 'react';
import { connect } from 'react-redux';
import { find,isEqual } from 'lodash'
import  * as actions from 'actions/resource-scenario';
import FinancialScenarioView from 'components/financial-scenario-view';

class ResourcesView extends Component {
  componentDidMount() {
    let {scenarioId} = this.props.params
    let {dispatch,scenarioMetadata} = this.props
    let sharingSettings = scenarioMetadata ? scenarioMetadata.sharing : {groupShared:false,organisationShared:false,userShare:[]}
    if(!scenarioMetadata){
      dispatch( actions.getResourceScenarioMetadata(scenarioId) )
    }
    dispatch( actions.getResourceScenarioData(scenarioId) )
    dispatch({ 
      type:"SET_ACTIONS", 
      actions:[
        ...this.createSharingActions(sharingSettings)
      ]
    })

  }
  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps);
    if(!isEqual(nextProps.scenarioMetadata,this.props.scenarioMetadata) ){
      console.log('Updated metaData, ');
      this.props.dispatch({ 
      type:"SET_ACTIONS", 
      actions:[
        ...this.createSharingActions(nextProps.scenarioMetadata.sharing)
      ]
    })
    }
  }
  createSharingActions(sharingSettings){
    let sharingAction = [
      {
        title:sharingSettings.groupShared ? "Unshare Scenario With Group" : "Share Scenario With Group",
        'actionsToCreatorsToRun':[
          {
            name: sharingSettings.groupShared ? 'unshareToGroup' : 'shareToGroup',
            props: {
              "endPoint":"resourcescenario",
              "id":1
            }
          }
        ]
      },
      {
        title:sharingSettings.organisationShared ? "Unshare Scenario With Organisation" :"Share Scenario With Organisation",
        'actionsToCreatorsToRun':[
          {
            name: sharingSettings.organisationShared ? 'unshareToOrganisation' : 'shareToOrganisation',
            props:{
              "endPoint":
              "resourcescenario",
              "id":1
            }
          }
        ]
      },
      {title:"Share Scenario To User",  'actionsToCreatorsToRun':[{name:'shareToUsers', props:{"endPoint":"resourcescenario","id":1,"users":["caleb.sawtell@lemonadelabs.io"]}}]}
    ]
    return sharingAction
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
function mapStateToProps(state, props) {
  let scenarioMetadata = find(state.resources.scenarios, scenario => ( scenario.id === Number(props.params.scenarioId) ) )
  return ({
    scenarioMetadata,
    ...props
  })
}
export default connect(mapStateToProps)(ResourcesView);