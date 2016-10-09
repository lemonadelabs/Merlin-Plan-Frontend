import React from 'react'
import {Link} from 'react-router'

class Admin extends React.Component {
  constructor(...args){
    super(...args)
  }
  render(){
    return(
      <div>
        <h1>Admin</h1>
        <Link to={'/admin/users'}>Users</Link>
      </div>
    )
  }
}

export default Admin
