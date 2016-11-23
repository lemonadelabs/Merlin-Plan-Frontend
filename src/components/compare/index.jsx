import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip'

 const Compare = ComposedComponent => class extends Component {
  formatData(value){
    if(typeof this.props.formatter === 'function'){
      return this.props.formatter(value)
    }
    else{
      return value
    }
  }
  showToolTip(data) {
    let tooltip = <ReactTooltip id="compare" place="top" type="light" effect="float">
                    <span>{this.formatData(data[0])}</span> <span>{this.formatData(data[1])}</span>
                  </ReactTooltip>
    return data.length === 2 ? tooltip : ''
  }
  render(){
    let {data} = this.props
    return (
      <div>
        {this.showToolTip(data)}
        <a data-tip data-for="compare">
          {showComparisonStatus(data)}<ComposedComponent {...this.props} value={handleData(data)}/>
        </a>
      </div>
    )
  }
}

function showComparisonStatus(data){
  if(data.length===1){
    return ''
  }
  if(data[0]>data[1]){
    return <span>down</span>
  }
  if(data[0]<data[1]){
    return <span>up</span>
  }
  return ''
}

function handleData(data){
  let value
  if(data.length===1){
    value = data[0]
  }
  if (data.length===2){
    value = data[0] - data[1]
  }
  if (value < 0){
    value = value * -1
  }
  return value
}
export default Compare