import React from 'react'

class App extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default App
