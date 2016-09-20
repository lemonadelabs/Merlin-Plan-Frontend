'use strict';
import React from 'react';
import style from './index.css'

const Rule = ({width,thickness}) => {
  let classNames = `${style.rule} {style[width]} ${style[thickness]}`
  return (
    <hr className={classNames}/>
  )
};

export default Rule;
