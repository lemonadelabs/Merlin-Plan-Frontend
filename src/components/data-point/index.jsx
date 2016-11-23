import React, {Component} from 'react';
import compare from 'components/compare';

class DataPoint extends Component {
  render() {
    let {formatter, value } = this.props
    return (
      <div>
        {typeof formatter === 'function' ? formatter(value) : value}
      </div>
    );
  }
}

export default compare(DataPoint);