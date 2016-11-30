import React, {Component} from 'react';
import { connect } from 'react-redux';
import { actions, Control } from 'react-redux-form';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/en-nz';


function DatePickerControl ({model, dispatch}) {
  return (
    <Control
      model = {model}
      component={Picker}
      controlProps={{
        dispatch
      }}
      mapProps={{
        modelValue: props => (props.modelValue),
        model: props => (props.model)
      }}
    />
  );
}

class Picker extends Component{
  constructor(){
    super()
    moment.locale('en-nz')
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(date){
    let {model, dispatch} = this.props
    dispatch(actions.change(model, date))
  }
  render(){
    return (
      <div>
        <DatePicker
        selected={this.props.selectedValue || moment()}
        onChange={this.handleChange}
        locale={"en-nz"}/>
      </div>
    );
  }
}

export default connect()(DatePickerControl);