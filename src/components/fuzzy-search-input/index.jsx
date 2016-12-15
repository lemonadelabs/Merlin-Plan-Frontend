import React, {Component} from 'react';
import { isEqual } from 'lodash';
import Fuse from 'fuse.js';

class FuzzySearchInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      results:[],
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
    this.setState({results})
  }
  render() {
    return (
      <div>
        <input onChange={this.handleChange}/>
        <div style={{border:'solid 1px white'}}>
          {
            this.state.results.map(
              result => {
                return ( <p>{`${result.firstName} ${result.lastName}`}</p>)
              }
            )
          }
        </div>
      </div>
    );
  }
}

export default FuzzySearchInput;