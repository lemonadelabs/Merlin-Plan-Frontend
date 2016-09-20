'use strict';
import React from 'react';
import hashbow from 'hashbow'
import Color from 'color'
import styles from './index.css'

class ProfilePic extends React.Component {

  render() {
    let {profilePic, firstName, lastName, id}= this.props
    let initials = firstName[0] + lastName[0]
    let userColor = hashbow(firstName+lastName+id,60)
    let userColorLight = Color(userColor).light()

    return (
      <div className={styles.container} style={{backgroundImage:`url(${profilePic})`,backgroundColor:userColor,color:userColorLight?'#333':'white'}}>
        {profilePic?'':<p>{initials}</p>}
      </div>
    );
  }

}

export default ProfilePic;
