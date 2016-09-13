import React from 'react'
import MenuButton from './menu-button'
import { logout } from '../utilities/auth'
import { withRouter } from 'react-router'

function NavigationBar(props){
  return(
    <header>
      <MenuButton menuItems={props.menuItems}/>
      <a onClick={ () => handleLogout(props.router) }>Logout</a>
    </header>
  )
}
function handleLogout(router){
  logout()
  router.replace('login')
}

export default withRouter(NavigationBar)
