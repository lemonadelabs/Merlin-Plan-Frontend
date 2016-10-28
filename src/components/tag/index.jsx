import React, { PropTypes } from 'react';
import hashbow from 'hashbow'
import color from 'color'
import styles from './index.css'

const Tag = ({name}) => {
  let tagColor = hashbow(name)
  let colorLight = color(tagColor).light()

  return(
    <p className={styles.tag} style={{backgroundColor:tagColor,color:colorLight?'black':'white'}}>{name}</p>
  )
};

Tag.propTypes = {
  name:PropTypes.string.isRequired
}

export default Tag;
