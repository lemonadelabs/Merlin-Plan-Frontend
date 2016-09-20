'use strict';
import React from 'react';
import hashbow from 'hashbow'
import Color from 'color'
import styles from './index.css'

const Tag = ({name}) => {
  let color = hashbow(name)
  let colorLight = Color(color).light()

  return(
    <p className={styles.tag} style={{backgroundColor:color,color:colorLight?'black':'white'}}>{name}</p>
  )
};

export default Tag;
