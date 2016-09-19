import React from 'react'
import MenuDropDown from '../menu-drop-down/menu-drop-down'

class MenuButton extends React.Component{
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.hideMenuIfOpen = this.hideMenuIfOpen.bind(this)
    this.state = {
      showMenu:false
    }
  }
  componentWillUnmount(){
    this.removeWindowEventListener()
  }
  addWindowEventListener(){
    window.addEventListener('click', this.hideMenuIfOpen)
  }
  removeWindowEventListener(){
    window.removeEventListener('click', this.hideMenuIfOpen)
  }
  handleClick(){
    let showMenu = !this.state.showMenu
    this.setState({showMenu:showMenu})
    if(showMenu){
      //this feels a bit hacky :|
      setTimeout(this.addWindowEventListener.bind(this), 1)
    }else{
      this.removeWindowEventListener()
    }
  }
  hideMenuIfOpen(){
    if(this.state.showMenu){
      this.setState({'showMenu':false})
      this.removeWindowEventListener()
    }
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
