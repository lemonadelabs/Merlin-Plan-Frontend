import React, {Component, PropTypes} from 'react';
import { Form, Control, Errors, actions } from 'react-redux-form'
import { getData, postData, putData } from 'utilities/api-interaction'
import { required } from 'components/forms/validators'
import { connect } from 'react-redux';
import MultiSelectDropdown from 'components/multi-select-dropdown';
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
        dispatch({type:'ADD_ORG_GROUP',groups:[newGroup]})
        dispatch({type:"HIDE_MODAL"})
      })
  }
  addUsersToGroup(users,groupId){
    putData(`group/${groupId}/adduser`, {users})
  }
  render() {
    let users = this.props.users || []
    return (
      <Form style={{width:'300px'}} model={'forms.group'} onSubmit={this.handleSubmit}>
        <label>Name</label>
        <Errors model={'.name'} show="touched" messages={{required:"Please enter a name for your group"}}/>
        <Control.text model={'.name'} validators={{required}}/>
        <label>Description</label>
        <Errors model={'.description'} show="touched" messages={{required:"Please enter a description for your group"}}/>
        <Control.text model={'.description'} validators={{required}}/>
        <Control.select component={MultiSelectDropdown} controlProps={{options:users, labelTemplate: user => (`${user.firstName} ${user.lastName}`) }} model={'.members'}/>
        <button type="submit">Add Group</button>
      </Form>
    );
  }
}

GroupForm.propTypes = {

};

function stateToProps(state, props) {
    return({
      users : state.organisation.users
    })
}

export default connect(stateToProps)(GroupForm);