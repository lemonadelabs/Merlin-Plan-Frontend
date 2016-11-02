import React, {Component, PropTypes} from 'react';
import hashbow from 'hashbow'
import color from 'color'
import styles from './index.css'

class ProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width:'auto',
      padding:'15px'
    }
  }
  componentDidMount() {
    this.calculatePaddingForInitials() 
  }
  calculatePaddingForInitials() {
    const circle = this.refs.profileCircle
    const circleHeight = circle.getBoundingClientRect().height
    const width = circleHeight
    let padding = circle.clientHeight * 0.5
    if (circle.children.length){
      let initalsHeight = circle.firstChild.clientHeight
      padding -= initalsHeight / 2
    }
    this.setState({width,padding:`${padding}px`});
  }
  render() {
    let {profilePic, firstName, lastName, id} = this.props
    let {width, padding} = this.state
    let initials = firstName && lastName ? firstName[0] + lastName[0] : "??"
    let userColor = hashbow(firstName+lastName+id,70)
    let textColor = color(userColor).luminosity() < 0.1 ? color(userColor).lighten(0.3).rgbString() : userColor
    let backgroundColor = color(userColor).darken(0.9).alpha(0.5).rgbString()
    let borderColor = profilePic ? 'white' : userColor

    return (
      <div
        ref={"profileCircle"}
        className={styles.container} 
        style={
          {
            paddingTop:padding,
            paddingBottom:padding,
            width:width,
            borderColor,
            backgroundImage:`url(${profilePic})`,
            backgroundColor,
            color:textColor
          }
        }>
        {profilePic ? '' : <p>{initials}</p>}
      </div>
    )
  }
}

ProfilePic.propTypes = {
  profilePic : PropTypes.string,
  firstName : PropTypes.string,
  lastName : PropTypes.string,
  id : PropTypes.string
}


export default ProfilePic;
