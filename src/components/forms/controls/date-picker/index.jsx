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
        locale:'en-nz',
        showYearDropdown:true,
        startDate:moment()
      }}
      mapProps={{
        selected: props => (props.modelValue),
        onChange: props => ( date => { props.dispatch(actions.change(props.model, date)) } ),
        onBlur: props => ( () => { props.dispatch(actions.blur(props.model)) } ),
        onFocus: props => ( () => { props.dispatch(actions.focus(props.model)) } )
      }}
    />
  );
}

export default DatePickerControl;