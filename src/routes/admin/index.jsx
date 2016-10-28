import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import { connect } from 'react-redux';
class Admin extends Component {
  componentDidMount(){
    this.props.dispatch({type:'SET_TITLE',title:'Admin'})
  }
  render(){
    return(
      <div>
        <h1>Admin</h1>
        <Link to={'/admin/users'}>Users</Link>
        <Link to={'/admin/groups'}>Groups</Link>
      </div>
    )
  }
}

Admin.propTypes = {
  dispatch:PropTypes.func
}

export default connect()(Admin)
