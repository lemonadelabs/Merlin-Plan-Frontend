import React, {PropTypes} from 'react'
import { withRouter } from 'react-router'
import { logout } from 'utilities/auth'
import MenuButton from 'components/menu-button'
import ProfilePic from 'components/profile-pic'
import ActionBar from 'components/action-bar'
import styles from './index.css'

function NavigationBar({menuItems, applicationTitle, router, user}){
  return(
    <div>
      <header className={styles.navigationBar}>
        <MenuButton menuItems={menuItems}/>
        <p>{applicationTitle}</p>
        <div className={styles.userInfo}>
          <ProfilePic
            firstName={user.firstName}
            lastName={user.lastName}
            profilePic={user.profilePic}
            id={user.id}/>
        <div className={styles.nameAndLogoutContainer}>
          <p className={styles.userFullName}>{`${user.firstName} ${user.lastName}`}</p>
          <a href="#" className={styles.logoutLink} onClick={ e => { e.preventDefault(); handleLogout(router) } }>Logout</a>
        </div>
        </div>
      </header>
      <ActionBar/>
    </div>
  )
}
NavigationBar.propTypes = {
  menuItems:PropTypes.array.isRequired,
  applicationTitle:PropTypes.string.isRequired,
  router:PropTypes.any,
  user:PropTypes.object
}
function handleLogout(router){
  logout()
  router.replace('/login')
}

export default withRouter(NavigationBar)
