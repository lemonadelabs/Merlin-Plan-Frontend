import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getData } from 'utilities/api-interaction';
import Modal from 'components/modal'
import GroupForm from 'components/forms/group';

class AdminGroups extends Component {
  constructor(props) {
    super(props);
    this.showNewGroupModal = this.showNewGroupModal.bind(this)
  } 
  componentDidMount(){
    let organisationId = this.props.organisationId || 1 //this needs to be fixed later!!!
    let { dispatch } = this.props
    getData(`organisation/${organisationId}/group`)
      .then( groups => {
        dispatch({type:'SET_ORG_GROUPS', groups})
      })
  }
  showNewGroupModal(){
    this.props.dispatch({type:"SHOW_MODAL"})
  }
  render() {
    let groups = this.props.groups || []
    return (
      <div>
        <p>Admin Groups</p>
        <button onClick={this.showNewGroupModal}>New Group</button>
        {
          groups.map( group => {
            return (
              <div>
                <p>{group.name}</p>
                <p>{group.description}</p>
              </div>)
          })
        }
        <Modal>
          <GroupForm organisationId={this.props.organisationId || 1}/>          
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return({organisationId:state.user.organisationId,groups:state.organisation.groups})
}
export default connect(mapStateToProps)(AdminGroups);