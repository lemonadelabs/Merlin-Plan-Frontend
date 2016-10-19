'use strict';
import React, {Component, PropTypes} from 'react';
import hashbow from 'hashbow'
import Color from 'color'
import styles from './index.css'

class ProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width:'auto',
      padding:'15px'
    }
  }
  
  componentWillMount() {
    console.log('this.refs',this.refs);
  }
  
  componentDidMount() {
    let circle = this.refs.profileCircle
    let width = circle.clientHeight
    let padding = circle.clientHeight * 0.5
    if (circle.children.length){
      let initalsHeight = circle.firstChild.clientHeight
      padding -= initalsHeight / 2
    }
    this.setState({width,padding:`${padding}px`});
  }
  render() {
    let {profilePic, firstName = '', lastName = '', id} = this.props
    let {width, padding} = this.state
    if(firstName === undefined){
      firstName = ''
    }
    if(lastName === undefined){
      lastName = ''
    }
    let initials = firstName[0] + lastName[0]
    let userColor = hashbow(firstName+lastName+id,60)
    let userColorLight = Color(userColor).light()

    return (
      <div
        ref={"profileCircle"}
        className={styles.container} 
        style={
          {
            paddingTop:padding,
            paddingBottom:padding,
            width:width,
            backgroundImage:`url(${profilePic})`,
            backgroundColor:userColor,
            color:userColorLight?'#333':'white'
          }
        }>
        {profilePic ? '' : <p>{initials}</p>}
      </div>
    )
  }
}


export default ProfilePic;
