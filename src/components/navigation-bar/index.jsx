import React from 'react'
import MenuButton from 'components/menu-button'
import { logout } from 'utilities/auth'
import { withRouter } from 'react-router'
import styles from './index.css'
import ProfilePic from 'components/profile-pic'

function NavigationBar({menuItems, applicationTitle, router, user}){
  return(
    <header className={styles.navigationBar}>
      <MenuButton menuItems={menuItems}/>
      <p>{applicationTitle}</p>
      <div className={styles.userInfo}>
        <ProfilePic
          firstName={user.firstName}
          lastName={user.lastName}
          profilePic={user.profilePic}
          id={user.id}/>
        <div className={styles.nameAndLogout}>
          <p className={styles.userFullName}>{`${user.firstName} ${user.lastName}`}</p>
          <a onClick={ () => handleLogout(router) }>Logout</a>
        </div>
      </div>
    </header>
  )
}

function handleLogout(router){
  logout()
  router.replace('/login')
}

export default withRouter(NavigationBar)
