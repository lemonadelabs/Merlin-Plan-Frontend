import React, {Component, PropTypes} from 'react'
import MenuDropDown from 'components/menu-drop-down'
import styles from './styles.css'
class MenuButton extends Component{
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.hideMenuIfOpen = this.hideMenuIfOpen.bind(this)
    this.addWindowEventListener = this.addWindowEventListener.bind(this)
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
      //this feels a bit hacky :| We need to add a bit of delay so that it doesn't hide the menu immediately after opening it
      setTimeout(this.addWindowEventListener, 1)
    }
    else{
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
    return(
      <div>
        <div className={styles.menuButton} onClick={this.handleClick}>
          <p className={styles.menuText}>Menu</p>
        </div>
        {menuDropDown}
      </div>
    )
  }
}

MenuButton.propTypes = {
  menuItems: PropTypes.array.isRequired
}

export default MenuButton
