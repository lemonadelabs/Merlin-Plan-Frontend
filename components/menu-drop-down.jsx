import React from 'react'
import {Link} from 'react-router'
function MenuDropDown({menuItems}){
  let menuLinks = menuItems.map( item => {
    return <Link key={item.route} to={item.route}>{item.label}</Link>
  })
  
  return(<nav>{menuLinks}</nav>)
}

export default MenuDropDown
