import React, {Component} from 'react';
import { connect } from 'react-redux';
import { actions, Control } from 'react-redux-form';
import DayPicker, { DateUtils } from "react-day-picker";
import moment from 'moment';
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
        model: props => (props.model),
        focused: props => {return(props.fieldValue.focus);}
      }}
    />
  );
}

class Picker extends Component{
  constructor(){
    super()
    this.state = {
      showDatePicker:false,
      pickingDate:false
    }
  }
  render(){
    let {model, dispatch, viewValue, selectedValue} = this.props
    let momentDate = typeof selectedValue === 'object' ? moment(selectedValue): moment(selectedValue, "DD/MM/YYYY",true)
    let displayValue = momentDate.isValid() ? momentDate.format('DD/MM/YYYY') : viewValue
    let DatePickerComponent = <DayPicker 
                                onDayClick={ (e, day) => { dispatch( actions.change(model, day) ); this.setState({showDatePicker:false}) } } 
                                selectedDays= { day => DateUtils.isSameDay(day, new Date(selectedValue) ) }
                                onMouseEnter={ () => { this.setState({pickingDate:true}) } }
                                onMouseLeave={ () => { this.setState({pickingDate:false}) } }
                              />
    return (
      <div>
        <div>
          <input type="text" 
            value = {displayValue}
            onFocus = { 
              () => {
                dispatch( actions.focus(model) )
                this.setState({showDatePicker:true}) 
              }
            }
            onChange = {
              e => {
                let stringParsedToMoment = moment(e.target.value, "DD/MM/YYYY",true)
                let valueToDispatch = stringParsedToMoment.isValid() ? stringParsedToMoment.toDate() : e.target.value
                dispatch( actions.change(model, valueToDispatch) )
              }
            }
            onBlur = {
              () => {
                dispatch( actions.blur(model) )
                if(this.state.pickingDate) { return }
                this.setState( { showDatePicker:false } ) 
              } 
            } />
        </div>
        {
          this.state.showDatePicker ? DatePickerComponent : ''
        }
      </div>
    );
  }
}

export default connect()(DatePicker);