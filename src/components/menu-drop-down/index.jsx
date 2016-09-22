import React from 'react'
import {Link} from 'react-router'
import styles from './index.css'

function MenuDropDown({menuItems}){
  let menuLinks = menuItems.map( item => {
    return (<Link className={styles['menu-item']} key={item.route} to={item.route}>{item.label}</Link>)
  })

  return(<nav className={styles['menu-drop-down']} >{menuLinks}</nav>)
}

export default MenuDropDown
