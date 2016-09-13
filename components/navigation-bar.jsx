import React from 'react'
import MenuButton from './menu-button'
function NavigationBar(props){
  return(<header><MenuButton menuItems={props.menuItems}/></header>)
}

export default NavigationBar
