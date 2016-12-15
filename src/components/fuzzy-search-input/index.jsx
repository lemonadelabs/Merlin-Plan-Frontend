import React, { Component } from 'react';
import { isEqual } from 'lodash';
import Fuse from 'fuse.js';

class FuzzySearchInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      results:[],
      selectedEntry:0,
      selectingEntry:false,      
      options: {
        threshold:0.4,
        distance:10,
        keys: props.keys
      }
    }
    this.fuse = new Fuse(props.list, this.state.options)
  }
  componentWillUpdate(nextProps) {
    if(!isEqual(nextProps.list,this.props.list)){
      this.fuse = new Fuse(nextProps.list, this.state.options)
    }
  }
  handleChange(e){
    let searchTerm = e.target.value
    let results = this.fuse.search(searchTerm)
    this.setState({results,searchTerm})
  }
  handleKeyUp(e){
    if(e.key === "ArrowDown" || e.key === "ArrowUp"){
      e.preventDefault()
      let selectedEntry = this.state.selectedEntry
      switch (e.key) {
        case "ArrowDown":
          if(selectedEntry < this.state.results.length - 1 && this.state.selectingEntry){
            selectedEntry++
          }
          break;
        case "ArrowUp":
          if(selectedEntry>0 && this.state.selectingEntry){
            selectedEntry--
          }
          else{
            selectedEntry=this.state.results.length - 1
          }
          break;
        default:
          break;
      }
      this.setState({selectedEntry,selectingEntry:true})
    }
    else{
      this.setState({selectedEntry:0,selectingEntry:false})
    }
  }
  handleSubmit(e){
    e.preventDefault()
    let result = this.state.results[this.state.selectedEntry]
    this.props.handleSelection(result)
    this.setState({searchTerm:'',results:[]})
  }
  renderDropdown(){
    return (
      <div style={{border:'solid 1px white'}}>
        {
          this.state.results.map(
            (result, index) => {
              return (
                <p 
                  style={{backgroundColor:this.state.selectedEntry===index&&this.state.selectingEntry?'blue':'transparent'}}
                  onClick={
                    () => {
                      this.props.handleSelection(result);
                      this.setState({searchTerm:'',results:[]});
                    }
                  }
                >
                  {this.props.resultTemplate(result)}
                </p>
              )
            }
          )
        }
      </div>
    )
  }
  render() {
    return (
      <div>
        <form onSubmit={ this.handleSubmit }>
          <input value={ this.state.searchTerm } placeholder={this.props.placeholder} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
          {this.state.results.length ? this.renderDropdown() : ''}
        </form>
      </div>
    );
  }
}

export default FuzzySearchInput;