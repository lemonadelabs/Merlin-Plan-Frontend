import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getData } from 'utilities/api-interaction';
import Modal from 'components/modal'
import GroupForm from 'components/forms/group';

class AdminGroups extends Component {
  componentDidMount(){
    let organisationId = this.props.organisationId || 1 //this needs to be fixed later!!!
    let { dispatch } = this.props
    getData(`organisation/${organisationId}/group`)
      .then( groups => {
        dispatch({type:'SET_ORG_GROUPS', groups})
      })
  }
  render() {
    let groups = this.props.groups || []
    return (
      <div>
        <p>Admin Groups</p>
        <GroupForm organisationId={1}/>
        {
          groups.map( group => {
            return (
              <div>
                <p>{group.name}</p>
                <p>{group.description}</p>
              </div>)
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  console.log(state);
  return({organisationId:state.user.organisationId,groups:state.organisation.groups})
}
export default connect(mapStateToProps)(AdminGroups);