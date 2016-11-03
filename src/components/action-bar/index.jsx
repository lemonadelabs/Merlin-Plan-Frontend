import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { forEach } from 'lodash';
import { actionMap } from 'actions'
import styles from './styles.css'

class ActionBar extends Component {
  runActionCreators(actionsToCreatorsToRun){
    let dispatch = this.props.dispatch
    forEach(actionsToCreatorsToRun, actionCreatorToRun => { dispatch(actionMap[actionCreatorToRun.name](actionCreatorToRun.props)) } )
      
  }
  render() {
    let {actions, dispatch} = this.props
    return (
      <div className={styles.actionBar}>
        <div className={styles.actionContainer}>
          {
            actions.map( action => ( <p className={styles.action} onClick={ () => { this.runActionCreators(action.actionsToCreatorsToRun) } } > {action.title} </p> ) )
          }
        </div>
      </div>
    );
  }
}

ActionBar.propTypes = {
  actions: PropTypes.array
}

function stateToProps(state){
  return {actions:state.app.availableActions}
}

export default connect(stateToProps)(ActionBar);