import React, {Component} from 'react'
import { Form, Control } from 'react-redux-form'
import { addNewFinancialResource } from 'actions'
import { connect } from 'react-redux'
import Name from 'components/forms/fields/name'



class NewFinancialResourceForm extends Component {
  render() {
    console.log(this.props);
    return(
      <Form model={"forms.financialResource"} onSubmit={formData => { 
        this.props.dispatch(addNewFinancialResource(1,formData)) 
      }}>
        <Name/>
        <label>Start Date</label>
        <Control.text model={".startDate"}/>
        <label>End Date</label>
        <Control.text model={".endDate"}/>
        <label>Recurring Scenario</label>
        <Control.checkbox model={".recurring"}/>
        <label>Total Budget</label>
        <Control.text model={".defaultPartitionValue"}/>
         <button type="submit">Add Financial Resource</button>
      </Form>
    )
  }
}

export default connect()(NewFinancialResourceForm)