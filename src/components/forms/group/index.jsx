import React, {Component, PropTypes} from 'react';
import { Form, Control, Errors, actions } from 'react-redux-form'
import { getData, postData } from 'utilities/api-interaction'
import { required } from 'components/forms/validators'
import { connect } from 'react-redux';

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount(){
    let { organisationId, dispatch } = this.props
    getData(`organisation/${organisationId}/user`)
      .then( users => {
        dispatch({type:'SET_ORG_USERS', users})
      })
  }
  handleSubmit(groupInfo){
    let { organisationId, dispatch } = this.props
    let newGroupPayload = {}
    Object.assign(newGroupPayload, {name: groupInfo.name, description: groupInfo.description})
    newGroupPayload.organisationId = organisationId
    console.log('groupInfo',groupInfo,'newGroupPayload',newGroupPayload);
    postData('group',newGroupPayload)
      .then( newGroup => {
        this.addUsersToGroup(groupInfo.members, newGroup.id)
        dispatch({type:'SET_ORG_GROUPS',groups:[newGroup]})
        dispatch({type:"HIDE_MODAL"})
      })
  }
  addUsersToGroup(users,groupId){
    postData(`group/${groupId}/user`, {users})
  }
  render() {
    let users = this.props.users || []
    return (
      <Form model={'forms.group'} onSubmit={this.handleSubmit}>
        <label>Name</label>
        <Errors model={'.name'} show="touched" messages={{required:"Please enter a name for your group"}}/>
        <Control.text model={'.name'} validators={{required}}/>
        <label>Description</label>
        <Errors model={'.description'} show="touched" messages={{required:"Please enter a description for your group"}}/>
        <Control.text model={'.description'} validators={{required}}/>
        <Control.select model={'.members'} multiple={true}>
          {
            users.map( user => (<option key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</option>))
          }
        </Control.select>
        <button type="submit">Add Group</button>
      </Form>
    );
  }
}

GroupForm.propTypes = {

};

function stateToProps(state, props) {
  console.log(state);
    return({
      users : state.organisation.users
    })
}

export default connect(stateToProps)(GroupForm);