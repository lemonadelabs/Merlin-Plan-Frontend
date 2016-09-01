import React from 'react'
import ReactDOM from 'react-dom';
import {Layer, Label, Text, Rect, Stage, Group} from 'react-konva';
import {TimelineObject} from './timeline-object';
import {Timeline} from './timeline';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerWidth,
      numberOfYears: 3,
      timelineStartYear: 2016
    }
    this.handleResize = _.debounce(this.handleResize.bind(this),50)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    this.login = this.login.bind(this)
  }
  handleResize(e) {
    this.setState({windowWidth: window.innerWidth,
                   windowHeight: window.innerHeight})
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  handleRangeChange(e){
    let newYearAmount = e.target.value
    this.setState({'numberOfYears':newYearAmount})
  }
  login(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let request = new Request('api/auth/token',{method:'POST', headers: headers, body:'username=caleb&password=fooBar69!&grant_type=password&resource=http%3A%2F%2Flocalhost%3A5000%2F&scope=offline_access%2C+roles'})
    fetch(request)
      .then((response) => {
        if(response.status == 200) return response.json();
        else throw new Error('Something went wrong on api server!');
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function(error) {
        console.error(error);
      });

  }
  render() {
    return (
      <div>
        {/* <input type='button' onClick={this.login} value="login" /> */}
        <input type='range' onChange={this.handleRangeChange} min={1} max={10} value={this.state.numberOfYears}/>
        <Stage width={this.state.windowWidth} height={this.state.windowHeight} >
          <Layer>
            <Timeline
              width={this.state.windowWidth}
              height={this.state.windowHeight}
              startYear={this.state.timelineStartYear}
              numberOfYears={this.state.numberOfYears}/>
          </Layer>
          <Layer>
            <TimelineObject
              name={"Demo demo demo"}
              startDate={"12/1/2016"}
              endDate={"1/1/2018"}
              stageWidth={this.state.windowWidth}
              stageHeight={this.state.windowHeight}
              timelineStartYear={this.state.timelineStartYear}
              numberOfYears={this.state.numberOfYears}/>
          </Layer>
        </Stage>
      </div>
    )
  }
}

export default App
