import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip'

 const compare = ComposedComponent => function _compare(props){
   let data = props.data
   let formatter = props.formatter ? props.formatter : value => (value)
    return (
      <div>
        {showToolTip( data, formatter) }
        <a data-tip data-for="compare">
          {showComparisonStatus(data)}<ComposedComponent {...props} value={handleData(data)}/>
        </a>
      </div>
    )
}

function showToolTip(data,formatter) {
  let tooltip = <ReactTooltip id="compare" place="top" type="light" effect="float">
                  <span>{formatter(data[0])}</span> <span>{formatter(data[1])}</span>
                </ReactTooltip>
  return data.length === 2 ? tooltip : ''
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
    value *= -1
  }
  return value
}
export default compare