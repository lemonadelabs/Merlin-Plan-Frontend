import React, {Component} from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { findIndex, find } from 'lodash';
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
  handleOptionClick(option){
    let selectionIndex = findIndex(this.props.value, (o) => ( o === option.id))
    if( selectionIndex === -1){
      this.addToSelection(option.id)
    }else{
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
  render() {
    let labelTemplate = this.props.labelTemplate
    let {menuVisable} = this.state
    return (
      <div className={styles.multiSelectDropDown}>
        <div className={styles.selectedOptionContainer} onClick={(e)=>{e.stopPropagation();this.handleDropDownClick()}}>
          {
            this.props.value.length > 0 ? 
            this.props.value.map(
              value => {
                let selected = find(this.props.options, option => ( option.id === value))
                let label = labelTemplate(selected)
                return(<p style={{backgroundColor:hashbow(label)}} className={styles.selectedOption}>{label}</p>)
              }
            )
            : 
            ''
          }
        </div>
        <div style={{display: menuVisable ? 'block' : 'none'}} className={styles.optionsContainer}>
        {
          this.props.options.map( 
            option => {
              let classNames = styles.dropDownOption
              let selectionIndex = findIndex(this.props.value, (o) => ( o === option.id))
              if(selectionIndex !== -1){
                classNames += ` ${styles.dropDownOptionSelected}`
              }
              return (
                <p 
                  className={classNames} 
                  key={option.id} 
                  onClick={(e)=>{ e.stopPropagation(); this.handleOptionClick(option)}}
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

export default connect()(MultiSelectDropdown);