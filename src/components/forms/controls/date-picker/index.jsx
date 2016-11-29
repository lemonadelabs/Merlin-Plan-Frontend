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

function Picker ( {model, dispatch, viewValue, selectedValue} ) {
  return (
    <div>
      <div>
        <p>{new Date(viewValue).toLocaleDateString()}</p>
      </div>
      <DayPicker 
        onDayClick={ (e,day) => dispatch( actions.change(model, day) ) } 
        selectedDays= { day => DateUtils.isSameDay(day, new Date(selectedValue) ) }/>
    </div>
  );
}

export default connect()(DatePicker);