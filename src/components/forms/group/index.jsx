import React, {Component, PropTypes} from 'react';
import { Form, Control, Errors, actions } from 'react-redux-form'
import { postData } from 'utilities/api-interaction'
import { required } from 'components/forms/validators'

class GroupForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(groupInfo){
    let { organisationId } = this.props
    console.log(this.props);
    let newGroupPayload = {}
    Object.assign(newGroupPayload,groupInfo)
    newGroupPayload.organisationId = organisationId
    console.log(newGroupPayload);
    postData('group',newGroupPayload)
  }
  render() {
    return (
      <Form model={'forms.group'} onSubmit={this.handleSubmit}>
        <label>Name</label>
        <Errors model={'.name'} show="touched" messages={{required:"Please enter a name for your group"}}/>
        <Control.text model={'.name'} validators={{required}}/>
        <label>Description</label>
        <Errors model={'.description'} show="touched" messages={{required:"Please enter a description for your group"}}/>
        <Control.text model={'.description'} validators={{required}}/>   
        <button type="submit">Add Group</button>
      </Form>
    );
  }
}

GroupForm.propTypes = {

};

export default GroupForm;