import React, {Component} from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { findIndex, find } from 'lodash';

class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(option){
    console.log(find(this.props.value, o => ( o === option.id)));
    let selectionIndex = findIndex(this.props.value, (o) => ( o === option.id))
    if( selectionIndex === -1){
      this.addToSelection(option.id)
    }else{
      this.removeFromSelection(selectionIndex)
    }
  }
  removeFromSelection(index){
    let newSelection = [...this.props.value.slice(0,index), ...this.props.value.slice(index+1)]
    console.log('newSelection',newSelection);
    this.props.dispatch(actions.change(this.props.name, newSelection))
  }
  addToSelection(selection){
    let newSelection = [...this.props.value, selection]
    this.props.dispatch(actions.change(this.props.name, newSelection))
  }
  render() {
    console.log(this.props);
    let labelTemplate = this.props.labelTemplate
    return (
      <div>
        <p>Selection</p>
        {
          this.props.value.length > 0 ? 
          this.props.value.map(
            value => {
              let selected = find(this.props.options, option => ( option.id === value))
              return(<p>{labelTemplate(selected)}</p>)
            }
          )
          : 
          <p>No Selection</p>
        }
        <p>Options</p>
        {
          this.props.options.map( 
            user => (
              <option key={user.id} onClick={()=>{this.handleClick(user);}} value={user.id}>
                {labelTemplate(user)}
              </option>
            )
          )
        }
      </div>
    );
  }
}

export default connect()(MultiSelectDropdown);