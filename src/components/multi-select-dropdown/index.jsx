import React, {Component} from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { findIndex, find } from 'lodash';
import styles from './styles.css'

class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleOptionClick = this.handleOptionClick.bind(this)
    this.toggleOptions = this.toggleOptions.bind(this)
    this.state = {
      menuVisable:false
    }
  }
  toggleOptions(){
    this.setState({menuVisable:!this.state.menuVisable})
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
        <div className={styles.selectedOptionContainer} onClick={()=>{this.toggleOptions()}}>
          {
            this.props.value.length > 0 ? 
            this.props.value.map(
              value => {
                let selected = find(this.props.options, option => ( option.id === value))
                return(<p className={styles.selectedOption}>{labelTemplate(selected)}</p>)
              }
            )
            : 
            <p>No Selection</p>
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
                  onClick={()=>{this.handleOptionClick(option)}}
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