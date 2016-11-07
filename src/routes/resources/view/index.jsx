import React, {Component} from 'react';
import { getData } from 'utilities/api-interaction'

class ResourcesView extends Component {
  componentDidMount() {
    let {scenarioId} = this.props.params
    getData(`resourcescenario/${scenarioId}/resources`)
    .then( resourcesData => { console.log(resourcesData) } )
  }
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default ResourcesView;