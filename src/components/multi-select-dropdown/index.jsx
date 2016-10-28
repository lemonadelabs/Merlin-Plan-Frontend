import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { findIndex, find, toArray } from 'lodash';
import styles from './styles.css'
import hashbow from 'hashbow';

class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleOptionClick = this.handleOptionClick.bind(this)
    this.handleDropDownClick = this.handleDropDownClick.bind(this)
    this.hideOptionsIfVisable = this.hideOptionsIfVisable.bind(this)
    this.state = {
      menuVisable:false
    }
  }
  hideOptionsIfVisable(e){
    if(e.target.parentElement.className === styles.optionsContainer || e.target.className === styles.optionsContainer){
      return;
    }
    if(this.state.menuVisable){
      this.toggleOptions()
      document.removeEventListener('click',this.hideOptionsIfVisable)
      e.stopPropagation()
    }
  }
  handleDropDownClick(){
    let menuToggled = this.toggleOptions()
    if(menuToggled){
      document.addEventListener('click', this.hideOptionsIfVisable, true)
    }
  }
  toggleOptions(){
    this.setState({menuVisable:!this.state.menuVisable})
    return !this.state.menuVisable
  }
  handleOptionClick(selection){
    let {value, selectionFind} = this.props
    let selectionIndex = findIndex(value, option => ( selectionFind ? selectionFind({option, value:selection}) : option === selection))
    if( selectionIndex === -1){
      this.addToSelection(selection)
    }
    else{
      this.removeFromSelection(selectionIndex)
    }
  }
  removeFromSelection(index){
    let newSelection = [...this.props.value.slice(0,index), ...this.props.value.slice(index+1)]
    this.props.dispatch(actions.change(this.props.name, newSelection))
  }
  addToSelection(selection){
    let newSelection = [...this.props.value, selection]
    this.props.dispatch(actions.change(this.props.name, newSelection))
  }
  showSelections(value){
    let {labelTemplate, valueMapping, selectionFind,  options} = this.props
    if(!options.length){
      return
    }
    return value.map(
      value => {
        let selected = find(options, option => ( selectionFind ? selectionFind({option, value}) : valueMapping( option ) === value ) )
        let label = labelTemplate(selected)
        return <p style={{backgroundColor:hashbow(label)}} className={styles.selectedOption}>{label}</p>
      }
    )
  }
  render() {
    let {labelTemplate, valueMapping, selectionFind, value, options} = this.props
    if(!Array.isArray(options)){
      options = toArray(options)
    }
    let {menuVisable} = this.state
    return (
      <div className={styles.multiSelectDropDown}>
        <div className={styles.selectedOptionContainer} onClick={ e => { e.stopPropagation(); this.handleDropDownClick() }}>
          {
            value.length > 0 ? this.showSelections(value) : ''
          }
        </div>
        <div style={{display: menuVisable ? 'block' : 'none'}} className={styles.optionsContainer}>
        {
          options.map( 
            option => {
              let key = option.id || valueMapping(option)
              let optionValue = valueMapping(option)
              let classNames = styles.dropDownOption
              let selectionIndex = findIndex(value, o => (selectionFind ? selectionFind({option : o, value: optionValue}) : o === optionValue))
              if(selectionIndex !== -1){
                classNames += ` ${styles.dropDownOptionSelected}`
              }
              return (
                <p 
                  className = {classNames} 
                  key = {key} 
                  onClick = { e => { e.stopPropagation(); this.handleOptionClick(optionValue) }}
                >
                  {labelTemplate(option)}
                </p>
              )
            }
          )
        }
        </div>
      </div>
    );
  }
}

MultiSelectDropdown.propTypes = {
  value:PropTypes.array.isRequired,
  selectionFind:PropTypes.func,
  labelTemplate:PropTypes.func.isRequired,
  valueMapping:PropTypes.func.isRequired,
  options:PropTypes.array.isRequired,
  name:PropTypes.string,
  dispatch:PropTypes.func
}

export default connect()(MultiSelectDropdown);