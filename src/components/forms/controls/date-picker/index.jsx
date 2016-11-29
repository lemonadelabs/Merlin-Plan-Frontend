import React, {Component} from 'react';
import { connect } from 'react-redux';
import { actions, Control } from 'react-redux-form';
import DayPicker, { DateUtils } from "react-day-picker";
import 'react-day-picker/lib/style.css';

function DatePicker ({model, dispatch}) {
  return (
    <Control
      model = {model}
      component={Picker}
      controlProps={{
        dispatch
      }}
      mapProps={{
        selectedValue: props => (props.modelValue),
        viewValue: props => (props.viewValue),
        model: props => (props.model)
      }}
    />
  );
}

class Picker extends Component{
  constructor(){
    super()
    this.state = {
      showDatePicker:false
    }
  }
  render(){
    let {model, dispatch, viewValue, selectedValue} = this.props
    let DatePickerComponent = <DayPicker 
                                onDayClick={ (e,day) => dispatch( actions.change(model, day) ) } 
                                selectedDays= { day => DateUtils.isSameDay(day, new Date(selectedValue) ) }/>
    return (
      <div>
        <div>
          <p onClick={e => { this.setState({showDatePicker:!this.state.showDatePicker}) } }>
            {viewValue ? new Date(viewValue).toLocaleDateString(): 'No Date' }
          </p>
        </div>
        {
          this.state.showDatePicker ? DatePickerComponent : ''
        }
      </div>
    );
  }
}

export default connect()(DatePicker);