import React from 'react'
import MenuDropDown from './menu-drop-down'
class MenuButton extends React.Component{
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      showMenu:false
    }
  }
  handleClick(){
    let showMenu = !this.state.showMenu
    this.setState({showMenu:showMenu})
  }
  render(){
    let menuDropDown
    if(this.state.showMenu){
      menuDropDown = <MenuDropDown menuItems={this.props.menuItems}/>
    }
    return(<div><div onClick={this.handleClick}>Menu</div>{menuDropDown}</div>)
  }
}

export default MenuButton
