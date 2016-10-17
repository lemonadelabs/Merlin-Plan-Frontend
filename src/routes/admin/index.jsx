import React from 'react'
import {Link} from 'react-router'
import { connect } from 'react-redux';
class Admin extends React.Component {
  constructor(...args){
    super(...args)
  }
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

export default connect()(Admin)
