import React, {Component} from 'react'
import { Form, Control } from 'react-redux-form'
import { addNewFinancialResource } from 'actions'
import { connect } from 'react-redux'
import Name from 'components/forms/fields/name'
import DatePicker from 'components/forms/controls/date-picker'



class NewFinancialResourceForm extends Component {
  render() {
    console.log(this.props);
    return(
      <Form model={"forms.financialResource"} onSubmit={formData => { 
        this.props.dispatch(addNewFinancialResource(1,formData)) 
      }}>
        <Name/>
        <label>Start Date</label>
        <DatePicker model={"forms.financialResource.startDate"}/>
        <label>End Date</label>
        <DatePicker model={"forms.financialResource.endDate"}/>
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