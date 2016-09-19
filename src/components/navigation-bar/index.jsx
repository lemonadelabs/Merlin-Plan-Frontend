import React from 'react'
import MenuButton from 'components/menu-button'
import { logout } from 'utilities/auth'
import { withRouter } from 'react-router'
import styles from './index.css'

function NavigationBar({menuItems,applicationTitle, router}){
  return(
    <header className={styles.navigationBar}>
      <MenuButton menuItems={menuItems}/>
      <p>{applicationTitle}</p>
      <a onClick={ () => handleLogout(router) }>Logout</a>
    </header>
  )
}

function handleLogout(router){
  logout()
  router.replace('login')
}

export default withRouter(NavigationBar)
