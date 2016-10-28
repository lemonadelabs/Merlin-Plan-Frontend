import React from 'react'
import {Line} from 'react-chartjs-2';
import _ from 'lodash'

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

class Track extends React.Component {
  constructor(...args){
    super(...args)
    let dummyLineData = _.times(10,() => Math.random() * 100)
    this.state={
      dummyLineData:dummyLineData
    }
  }
  render(){
    return(
      <div>
        <h1>Track</h1>
        <Line data={data}/>
      </div>
    )
  }
}

export default Track
