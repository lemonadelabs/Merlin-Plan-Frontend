import React from 'react'
import DataPoint from 'components/data-point';

class Track extends React.Component {
  render(){
    return(
      <div>
        <h1>Track</h1>
        <DataPoint formatter={commaSeperate} data={[1200000,6000]}/>
      </div>
    )
  }
}

function commaSeperate(value) {
  if (value === undefined) {
    return
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default Track
