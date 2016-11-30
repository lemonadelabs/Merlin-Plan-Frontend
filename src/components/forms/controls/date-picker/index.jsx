import React from 'react';
import { actions, Control } from 'react-redux-form';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment/locale/en-nz';


function DatePickerControl ({model}) {
  moment.locale('en-nz')
  return (
    <Control
      model = {model}
      component={DatePicker}
      controlProps={{
        locale:'en-nz'
      }}
      mapProps={{
        selected: props => (props.modelValue || moment() ),
        onChange: props => ( date => { props.dispatch(actions.change(props.model, date)) } )
      }}
    />
  );
}

export default DatePickerControl;