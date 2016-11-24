import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Form, Control } from 'react-redux-form'
import {postData} from 'utilities/api-interaction';
import Name from 'components/forms/fields/name'

class NewResourceScenarioForm extends Component {
  render() {
    let {userGroups, userEmail} = this.props
    let selectGroup = userGroups.length > 1

    return (
      <Form model={"forms.resourceScenario"} onSubmit={formData => { handleFormSubmit(formData,userGroups,userEmail) }}>
        <Name newItemName={"Resource Scenario"}/>
        {selectGroup ? addGroupDropDown(userGroups) : ''}
        <button type="submit">Add Scenario</button>
      </Form>
    );
  }
}

function handleFormSubmit(formData,userGroups, userEmail){
  let payload = Object.assign({},formData,{group:userGroups[0].id, creator:userEmail})
  postData('resourcescenario',payload)
  .then( newResourceScenario =>{
    console.log(newResourceScenario);
  } )
}

function addGroupDropDown(groups){
  return(
    <div>
      <label>Which group  do you want this Scenario to be added to:</label>
      <Control.select model={".group"}>
        {
          groups.map( group => (<option value={group.id} >{group.name}</option>))
        }
      </Control.select>
    </div>
  )
}

function stateToProps(state) {
  return({
    userEmail: state.user.email,
    userGroups: state.user.groups
  })
}
export default connect(stateToProps)(NewResourceScenarioForm);