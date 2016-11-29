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
      showDatePicker:false,
      pickingDate:false
    }
  }
  render(){
    let {model, dispatch, viewValue, selectedValue} = this.props
    let DatePickerComponent = <DayPicker 
                                onDayClick={ (e, day) => { dispatch( actions.change(model, day) ); this.setState({showDatePicker:false}) } } 
                                selectedDays= { day => DateUtils.isSameDay(day, new Date(selectedValue) ) }
                                onMouseEnter={ () => { this.setState({pickingDate:true}) } }
                                onMouseLeave={ () => { this.setState({pickingDate:false}) } }/>
    return (
      <div>
        <div>
          <input type="text" 
            value = {viewValue ? new Date(viewValue).toLocaleDateString(): ''}
            onFocus={ 
              () => {
                dispatch( actions.focus(model) )
                this.setState({showDatePicker:true}) 
              }
            } 
            onBlur={
              () => {
                if(this.state.pickingDate) { return }
                dispatch( actions.blur(model) )
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