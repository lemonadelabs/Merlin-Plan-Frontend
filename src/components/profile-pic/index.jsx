'use strict';
import React, {Component, PropTypes} from 'react';
import hashbow from 'hashbow'
import Color from 'color'
import styles from './index.css'

class ProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width:'auto'
    }
  }
  
  componentDidMount() {
   this.setState({width:this.refs.profileCircle.clientHeight});
  }
  render() {
    let {profilePic, firstName = '', lastName = '', id} = this.props
    let {width} = this.state
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
