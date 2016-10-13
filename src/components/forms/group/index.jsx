import React, {Component, PropTypes} from 'react';
import { Form, Control, Error } from 'react-redux-form'
import { postData } from 'utilities/api-interaction'

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
        <Control.text model={'.name'}/>
        <label>Description</label>
        <Control.text model={'.description'}/>   
        <button type="submit">Add Group</button>
      </Form>
    );
  }
}

GroupForm.propTypes = {

};

export default GroupForm;